import type { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = req.body;
  // Create a new instance of the OpenAI model
  const model = new ChatOpenAI({
    temperature: 0.5,
    modelName: "gpt-3.5-turbo",
    // modelName: "gpt-4-1106-preview" [GPT4],
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          res.write(token);
        },
      },
    ],
  });

  const chatPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "The following is a friendly conversation between a human and AI. The AI is talkative and provides lots of specific details from it's context. If the AI doesn't know the answer to a question, it truthfully says it doesn't know."
    ),
    new MessagesPlaceholder("chat_history"),
    HumanMessagePromptTemplate.fromTemplate("{user_input}"),
  ]);

  const chain = new ConversationChain({
    llm: model,
    prompt: chatPrompt,
    memory: new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
    }),
  });

  await chain.call({
    user_input: prompt,
  });

  await chain.call({
    user_input: "What is my name?",
  });

  res.end();
}
