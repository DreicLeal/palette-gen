"use client";
import { useColors } from "@/context/colorsContext";
import { FormEvent, useState } from "react";

export default function Form() {
  const { request, loading} = useColors();
  const [prompt, setPrompt] = useState("");

  const sendRequest = async (e: FormEvent) => {
    e.preventDefault();
    await request(prompt);

    setPrompt("");
  };
  
  return (
    <form
      onSubmit={sendRequest}
      className="bg-white p-2 w-full mx-auto rounded-md flex items-center justify-between gap-2"
    >
      <label htmlFor="prompt" className="text-slate-600 font-bold w-full">
        Descreva o seu negócio ou a sua ideia:
        <textarea
          className="outline-0 min-w-[100%] h-[200px] bg-slate-200 font-medium p-2 rounded-md"
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </label>
      <button
        type="submit"
        className="text-slate-600 bg-slate-200 p-2 rounded-md font-bold"
      >
        {loading ? "Analisando" : "Enviar"}
      </button>
    </form>
  );
}
