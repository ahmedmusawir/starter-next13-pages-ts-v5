import type { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = req.body;
  // Create a new instance of the OpenAI model
  const model = new ChatOpenAI({
    temperature: 0.5,
    modelName: "gpt-3.5-turbo",
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

  //   await model.call([new HumanMessage("Write 4 line poem about Kuala Lumpur")]);
  await model.call([new HumanMessage(prompt)]);
  res.end();

  //   res.status(200).json({ name: "John Doe" });
}
