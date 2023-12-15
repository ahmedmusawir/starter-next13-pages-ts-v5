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

interface Message {
  user_input: string;
}

// A record where each key is a session ID and the value is an array of messages
interface Conversations {
  [sessionId: string]: Message[];
}

const conversations: Conversations = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt, sessionId } = req.body;

  // Initialize conversation history for the session if not present
  if (!conversations[sessionId]) {
    conversations[sessionId] = [];
  }

  // Add new user input to the existing conversation history
  conversations[sessionId].push({ user_input: prompt });

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

  // Instantiate BufferMemory without setting the memory initially
  const bufferMemory = new BufferMemory({
    returnMessages: true,
    memoryKey: "chat_history",
  });

  // Save the conversation history in BufferMemory
  if (conversations[sessionId]) {
    const chatHistory = conversations[sessionId].map((message) => ({
      content: message.user_input,
      role: "user",
    }));

    // Debugging: Log the chatHistory to inspect its content
    console.log("Chat History:", chatHistory);

    // Ensure chatHistory does not contain null or undefined values
    // Filter out any invalid messages
    const validChatHistory = conversations[sessionId]
      .filter(
        (message) =>
          message.user_input != null && typeof message.user_input === "string"
      )
      .map((message) => ({
        content: message.user_input,
        role: "user",
      }));

    // Now use validChatHistory for further processing

    // bufferMemory.saveContext({ messages: validChatHistory }, {});
    bufferMemory.saveContext(
      { messages: validChatHistory },
      { dummyOutputKey: "" }
    );
  }

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
    memory: bufferMemory,
  });

  await chain.call({
    user_input: prompt,
  });

  res.end();
}
