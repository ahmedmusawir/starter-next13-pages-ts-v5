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
    modelName: "gpt-3.5-turbo-16k",
    // modelName: "gpt-4-1106-preview",
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          res.write(token);
        },
      },
    ],
  });

  await model.call([
    new SystemMessage(
      "Your are an assistant and your name is Rico. You are ready to answer any question or produce any kind of content when asked."
    ),

    new HumanMessage(prompt),
  ]);

  res.end();
}
