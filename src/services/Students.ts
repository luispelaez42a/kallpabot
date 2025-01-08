/**
 * get students
 * @returns 
 */
const getStudents = async (): Promise<any> => {
    const studentsApi = await fetch('https://kallpa-admin-api.vercel.app/api/students')
    const json: any[] = await studentsApi.json()

    return json
}

/**
 * add to Student
 * @param text 
 * @returns 
 */
const saveStudent = async (state: any) => {
    try {
        console.log("entro save")

        //const payload = JSON.parse(text)
        console.log(state.payload)
        console.log(JSON.stringify(state.payload))
       
        const dataApi = await fetch('https://kallpa-admin-api.vercel.app/api/students', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(state.payload)
        })
        return dataApi
    } catch (err) {
        console.log(`error: `, err)
    }
}

export { getStudents, saveStudent }