import type { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { UpstashRedisChatMessageHistory } from "langchain/stores/message/upstash_redis";
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from "langchain/prompts";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt, inputLang, outputLang } = req.body;
  // Create a new instance of the OpenAI model
  const model = new ChatOpenAI({
    temperature: 0.5,
    modelName: "gpt-3.5-turbo",
    // modelName: "gpt-4-1106-preview", //[GPT4 Turbo],
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          res.write(token);
        },
      },
    ],
  });

  const memory = new BufferMemory({
    chatHistory: new UpstashRedisChatMessageHistory({
      sessionId: "123",
      config: {
        url: "https://flexible-reindeer-48765.upstash.io",
        token: process.env.UPSTASH_API_KEY!,
      },
    }),
  });

  const translationPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "Your name is Vincent Mal-wani. You are a helpful assistant that translates {input_lang} to {output_lang}. And answer only with {output_lang} pronunciations in {input_lang} so that non {output_lang} speakers can read, no need for the actual language letters and syntanx at this time. For example (English to Hindi): 'I am Vincent' should be only 'Mera nam Vincent hay'"
    ),
    HumanMessagePromptTemplate.fromTemplate("{user_text}"),
  ]);

  // const formattedPrompt = await translationPrompt.formatPromptValue({
  //   input_lang: inputLang,
  //   output_lang: outputLang,
  //   user_text: prompt,
  // });

  const formattedPrompt = await translationPrompt.formatPromptValue({
    input_lang: "English",
    output_lang: "Hindi",
    user_text: prompt,
  });

  const chain = new ConversationChain({
    llm: model,
    memory: memory,
  });

  await chain.call({
    input: formattedPrompt,
  });

  res.end();
}
