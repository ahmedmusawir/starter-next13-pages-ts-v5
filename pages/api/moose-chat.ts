import type { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = req.body;
  // Create a new instance of the OpenAI model
  const model = new ChatOpenAI({
    temperature: 0.5,
    modelName: "gpt-3.5-turbo",
    // modelName: "gpt-4-1106-preview", //[GPT4]
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          //   process.stdout.write(token);
          res.write(token);
        },
      },
    ],
  });

  await model.call([
    new SystemMessage(
      "Your are an assistant and your name is Rico. If you don't know something, respond politely that you don't know it, otherwise, try to answer questions as honestly and accurately as possible."
    ),

    new HumanMessage(prompt),
  ]);

  res.end();
}
