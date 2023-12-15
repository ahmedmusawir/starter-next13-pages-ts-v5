import { Language, Message } from "@/global-interfaces";
import React from "react";
import TranslateRadioBlock from "./TranslateRadioBlock";

interface Props {
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  languages: Language[];
  setOutputLang: React.Dispatch<React.SetStateAction<string>>;
  // selectedLanguage: string;
}

const TranslateSidebar = ({
  setChatMessages,
  languages,
  setOutputLang,
}: Props) => {
  // Function to handle clear messages
  const handleClearMessage = () => {
    setChatMessages([]);
  };
  return (
    <>
      <div className="hidden sm:block w-64 bg-gray-300 p-4">
        <button className="btn" onClick={handleClearMessage}>
          Clear Messages
        </button>
        <section className="mt-10">
          <TranslateRadioBlock
            languages={languages}
            setOutputLang={setOutputLang}
          />
        </section>
      </div>
    </>
  );
};

export default TranslateSidebar;
