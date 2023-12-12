import { BarsArrowUpIcon, UsersIcon } from "@heroicons/react/20/solid";
import { FormEvent, useState } from "react";

interface Messages {
  isUser: boolean;
  text?: string;
}

interface Props {
  setChatMessages: React.Dispatch<React.SetStateAction<Messages[]>>;
}
const UserInputBottom = ({ setChatMessages }: Props) => {
  const [streamData, setStreamData] = useState("");

  // Form submit function
  const handleChatSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userPrompt = formData.get("prompt")?.toString();
    // console.log("User Input", formData.get("prompt"));

    // Updating User's Prompt
    setChatMessages((prevMsg) => [
      ...prevMsg,
      { isUser: true, text: userPrompt },
    ]);

    const response = await fetch("api/chat", {
      method: "POST",
      body: JSON.stringify({ prompt: userPrompt }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const reader = response?.body?.getReader();

    while (true) {
      const { done, value } = await reader!.read();

      if (done) {
        break;
      }

      const streamedText = new TextDecoder().decode(value);
      // setStreamData((prevData) => prevData + text);
      // Updating User's Prompt
      setChatMessages((prevMsg) => [
        ...prevMsg,
        { isUser: false, text: streamedText },
      ]);
    }
  };
  return (
    <div className="w-[80%]">
      <form onSubmit={(e) => handleChatSubmit(e)}>
        <div className="mt-2 flex rounded-md shadow-sm">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <UsersIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="prompt"
              id="prompt"
              className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="John Smith"
            />
          </div>
          <button
            type="submit"
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <BarsArrowUpIcon
              className="-ml-0.5 h-8 w-8 text-gray-800 border-2 border-gray-500"
              aria-hidden="true"
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInputBottom;
