import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import fs from "fs";
import { CommandType } from "~/utils/commandInterpreter";

class Interpreter {
  private readonly ai: any;
  private readonly interpreter: any;
  private readonly safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  constructor(apiKey: string, _model: string) {
    if (!apiKey || apiKey.length === 0) {
      throw new Error("AI_KEY is missing");
    }
    this.ai = new GoogleGenerativeAI(apiKey);
    this.interpreter = this.ai.getGenerativeModel({ model: _model });
  }

  private fileToGenerativePart(path: string, mimeType: string) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
  }

  interprets = async (
    prompt: string,
    history: any[] = [],
    temperature = 0
  ) => {
    try {
      const generationConfig = {
        temperature: temperature,
        topK: 0,
        topP: 0.5,
        maxOutputTokens: 600,
      };

      console.log(`Prompt: [${JSON.stringify(prompt)}]`);
      //console.log(`History Final: [${JSON.stringify(history)}]`);
      const chat = this.interpreter.startChat({
        generationConfig,
        safetySettings: this.safetySettings,
        history: history,
      });

      const result = await chat.sendMessage(prompt);
      const response = result.response;
      console.log(JSON.stringify(response));
      console.log(response.text());
      return {
        type: CommandType.SUCCESS,
        payload: response.text(),
      };
    } catch (error) {
      console.error(error);
      return {
        type: CommandType.ERROR,
        message:
          "❌ Problemas entendiendo lo que me comentas ¿Podrías repetirlo? \n *Ingresa @bot rm*",
        error: error.message,
      };
    }
  };

  interpretsMultimedia = async (
    pathMultimedia: string,
    mimeType: string,
    prompt: string,
    temperature = 0
  ) => {
    try {
      const audioPart = this.fileToGenerativePart(pathMultimedia, mimeType);

      console.log("==== PROMPT");
      console.log(prompt);

      const result = await this.interpreter.generateContent([
        prompt,
        audioPart,
      ]);
      const response = result.response;
      console.log(JSON.stringify(response));
      console.log(response.text());
      const finalResponse = response.text().replace("json", "").replace("`", "");

      return {
        type: CommandType.SUCCESS,
        payload: finalResponse,
      };
    } catch (error) {
      console.error(error);
      return {
        type: CommandType.ERROR,
        message: "No pude entenderlo, intenta nuevamente por favor",
        error: error.message,
      };
    }
  };
}

export default Interpreter;
