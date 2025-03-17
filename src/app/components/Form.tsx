"use client";
import { useColors } from "@/context/colorsContext";
import GradientText from "@/TextAnimations/GradientText/GradientText";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Form() {
  const { request } = useColors();
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const sendRequest = async (e: FormEvent) => {
    if (prompt.trim() === "")
      throw new Error("Need to have something written on the prompt");
    router.push("/palette");
    e.preventDefault();
    await request(prompt);
    setPrompt("");
  };

  return (
    <form
      onSubmit={sendRequest}
      className="absolute inset-0 flex justify-center items-center"
    >
      <div
        className="w-[90%] max-w-lg p-6 rounded-lg shadow-lg flex flex-col gap-4 
    bg-white/10 backdrop-blur-xs border border-white/40"
      >
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-[180px] bg-white/30 p-3 rounded-md border text-slate-500 border-slate-300 
        focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none 
        placeholder:text-slate-500"
          placeholder="Faça uma descrição detalhada da sua ideia de negócio e preferência de cores e deixe a IA gerar uma paleta de cores para você. ✨"
        />

        <button
          type="submit"
          className="relative w-full flex justify-center items-center bg-blue rounded-md"
        >
          <GradientText
            colors={["#FF6EC7", "#A26BFA", "#58E6FF", "#32FFD2", "#FFD93D"]}
            animationSpeed={3}
            showBorder={true}
            className="px-20 py-3 text-lg font-semibold"
          >
            Enviar
          </GradientText>
        </button>
      </div>
    </form>
  );
}
