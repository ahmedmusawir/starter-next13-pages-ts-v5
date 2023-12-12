import Head from "next/head";
import React, { useState } from "react";
import { Page } from "../globals";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import UserInputBottom from "../ui-ux/chat-gpt/UserInputBottom";
import ChatMessage from "../ui-ux/chat-gpt/ChatMessage";

interface Messages {
  isUser: boolean;
  text?: string;
}

const ChatGPTContent = () => {
  // Mock data for the chat messages
  const [chatMessages, setChatMessages] = useState<Messages[]>([
    { isUser: true, text: "What's the weather like today?" },
    { isUser: false, text: "The weather is sunny with a high of 25 degrees." },
  ]);

  return (
    <>
      <Head>
        <title>Next Page ChatGPTContent</title>
        <meta name="description" content="This is the demo page" />
      </Head>
      <Page className={""} FULL={true} customYMargin="my-0">
        <div className="flex">
          {/* Left Sidebar Column */}
          <div className="hidden sm:block w-64 bg-gray-300 p-4">
            <h1>Sidebar content</h1>
          </div>
          {/* Left Sidebar Column ENDS*/}

          {/* Right Content Column */}
          <div className="flex-1 bg-gray-200 p-4">
            {/* Main Right Content Block */}
            <section className="flex flex-col h-[80vh]">
              {/* Top Chat Block */}
              <div className="flex items-center h-14">
                <ArrowLeftIcon className="mr-2 h-6 w-6 text-gray-600" />
                <h1 className="text-xl font-bold">Chat Interface</h1>
              </div>

              {/* Main Chat Display Block */}
              <div className="overflow-y-auto flex-1  bg-gray-100 py-5 flex justify-center">
                {/* User & AI Output */}
                <article className="p-5  w-[100%]">
                  {/* Map through the chat messages and render them */}
                  {chatMessages.map((msg, index) => (
                    <ChatMessage
                      key={index}
                      isUser={msg.isUser}
                      message={msg.text}
                    />
                  ))}
                </article>
              </div>

              {/* User input Block */}
              <div className=" bg-gray-200 h-21 flex justify-center items-center">
                <UserInputBottom setChatMessages={setChatMessages} />
              </div>
            </section>
          </div>
          {/* Right Content Column ENDS*/}
        </div>
      </Page>
    </>
  );
};

export default ChatGPTContent;
