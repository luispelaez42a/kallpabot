import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { processCommand, parseStudentData, CommandType, shouldParse } from './utils/commandInterpreter'
import { saveStudent, getStudents } from "src/services/Students";

const PORT = process.env.PORT ?? 3008

const registerAskFlow = addKeyword<Provider, Database>(utils.setEvent('REGISTER_ASK_FLOW'))
.addAnswer(`Ingrese el nombre del alumno`, { capture: true }, async (ctx, { state }) => {
    await state.update({ name: ctx.body })
})
.addAnswer(`Ingrese el telf del alumno`, { capture: true }, async (ctx, { state }) => {
    await state.update({ phone: ctx.body })
})
.addAnswer(`Ingrese el curso del alumno`, { capture: true }, async (ctx, { state }) => {
    await state.update({ course: ctx.body })
})
.addAnswer(`Ingrese el turno del alumno`, { capture: true }, async (ctx, { state }) => {
    await state.update({ schedule: ctx.body })
})
.addAnswer(`Ingrese el duración matrícula del alumno(En meses)`, { capture: true }, async (ctx, { state }) => {
    await state.update({ duration: ctx.body })
})
.addAnswer(`Ingrese el inicio matrícula del alumno\n(Usar Formato -> 01/01/2025)`, { capture: true }, async (ctx, { state }) => {
    await state.update({ startDay: ctx.body })
})
.addAnswer(`Ingrese evidencia del pago`, { capture: true }, async (ctx, { state, provider }) => {
    console.log("Entrooo")
    console.log(JSON.stringify(ctx?.body))
    const localPath = await provider.saveFile(ctx, {path:'./media'});
    console.log(localPath)

    var isPayed = true
    if(ctx?.body?.trim() == '-')
        isPayed = false;

    await state.update({ isPayed: isPayed , photoEvidence: localPath })
})
.addAction(async (_, { flowDynamic, state }) => {
    console.log(JSON.stringify(state.getMyState()))
    await saveStudent(state.getMyState())
    await flowDynamic(`${JSON.stringify(state.getMyState().payload)} la información se ingresó con éxito!`)
});

const registerFlow = addKeyword<Provider, Database>(utils.setEvent('REGISTER_FLOW'))
    .addAnswer(`Ingrese la información del alumno`, { capture: true }, async (ctx, { state, fallBack, gotoFlow }) => {
        if(!shouldParse(ctx.body))
            return gotoFlow(registerAskFlow)
        const { student, error } = parseStudentData(ctx.body);
        if (error) {
            return fallBack(error);
        }

        await state.update({ payload: student })
    })
    .addAnswer(`Ingrese evidencia del pago`, { capture: true }, async (ctx, { state, provider }) => {
        console.log("Entrooo")
        console.log(JSON.stringify(ctx?.body))
        var isPayed = true
        if(ctx?.body?.trim() == '-'){
            await state.update({ isPayed: false , photoEvidence: null })
            return;
        }

        console.log(JSON.stringify(ctx?.body))
        const localPath = await provider.saveFile(ctx, {path:'./media'});
        await state.update({ isPayed: isPayed , photoEvidence: localPath })
    })    
    .addAction(async (_, { flowDynamic, state }) => {
        console.log(state.get('payload'))
        await flowDynamic(`${state.get('payload')}, thanks for your information!`)
        console.log("RAAAA")
        console.log(state.getMyState())
        await saveStudent(state.getMyState())
        await flowDynamic(`${JSON.stringify(state.getMyState().payload)} thanks for your information!`)  
    })


const getStudentsFlow = addKeyword<Provider, Database>(utils.setEvent('GET_STUDENTS_FLOW'))
.addAction(async (_, { flowDynamic, state }) => {
    console.log('ENTROOO')
    const students = await getStudents()
    for (const student of students) { // Usa for...of para iterar
        await flowDynamic(`${JSON.stringify(student)}`); // Espera que cada mensaje sea enviado
    }
})

const welcomeFlow = addKeyword<Provider, Database>(EVENTS.WELCOME)
    .addAnswer('Hola 🤖!! leyendo tu mensaje...')
    .addAction(
        async (ctx, { flowDynamic, fallBack, gotoFlow }) => {
            console.log(ctx.name)
            console.log('PROCESS COMMAND')

                const responseCommand = await processCommand(ctx.body) 
                console.log('LISTANDO COMMAND 1')
                console.log(JSON.stringify(responseCommand))

                if(responseCommand.type == CommandType.IGNORE)
                    return;

                if(responseCommand.type == CommandType.ERROR)
                    return fallBack(responseCommand.message)

                console.log('LISTANDO COMMAND')

                if(responseCommand.command == 'listarAlumnos')
                    return gotoFlow(getStudentsFlow)

                console.log('DONDE COMMAND')

                console.log(responseCommand)  
                //await flowDynamic(`${responseCommand.message}`)

            return gotoFlow(registerFlow)
        }
    )

const fullSamplesFlow = addKeyword<Provider, Database>(['samples', utils.setEvent('SAMPLES')])
    .addAnswer(`💪 I'll send you a lot files...`)
    .addAnswer(`Send image from Local`, { media: join(process.cwd(), 'assets', 'sample.png') })
    .addAnswer(`Send video from URL`, {
        media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJ0ZGdjd2syeXAwMjQ4aWdkcW04OWlqcXI3Ynh1ODkwZ25zZWZ1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LCohAb657pSdHv0Q5h/giphy.mp4',
    })
    .addAnswer(`Send audio from URL`, { media: 'https://cdn.freesound.org/previews/728/728142_11861866-lq.mp3' })
    .addAnswer(`Send file from URL`, {
        media: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    })

const main = async () => {
    const adapterFlow = createFlow([welcomeFlow, registerFlow, getStudentsFlow])
    
    const adapterProvider = createProvider(Provider ,{
        writeMyself: 'host'
    })
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
