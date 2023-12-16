import type { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from "langchain/prompts";
import { ConversationChain, LLMChain } from "langchain/chains";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt, inputLang, outputLang } = req.body;
  // Create a new instance of the OpenAI model
  const model = new ChatOpenAI({
    temperature: 0.5,
    modelName: "gpt-3.5-turbo-16k",
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

  const translationPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "Your name is Vincent Mal-wani. You are a helpful assistant that translates {input_lang} to {output_lang}. And answer with {output_lang} pronunciations in {input_lang} so that non {output_lang} speakers can read, also please include the actual language letters and syntanx at each answer and the pronounciation in parenthesis. For example (English to Hindi): 'I am Vincent' should be only 'Mera nam Vincent hay'"
    ),
    // new MessagesPlaceholder("chat_history"),
    HumanMessagePromptTemplate.fromTemplate("{user_text}"),
  ]);

  // THE FOLLOWING WITH WORK WITH THE translationPrompt
  const chain = new LLMChain({
    prompt: translationPrompt,
    llm: model,
  });

  await chain.call({
    input_lang: inputLang,
    output_lang: outputLang,
    user_text: prompt,
  });

  // await chain.call({
  //   input_lang: "English",
  //   output_lang: "Bengali",
  //   user_text: prompt,
  // });
  res.end();
}
