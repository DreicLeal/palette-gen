"use client";
import { useColors } from "@/context/colorsContext";
import ColorCard from "./ColorCard";
import GradientText from "@/TextAnimations/GradientText/GradientText";
import Reasoning from "../Reasoning";
import { IPaletteSchema } from "@/app/api/colorGen/route";
import { useRouter } from "next/navigation";

export default function Colors() {
  const { palette, regenColorsRequest, setPalette } = useColors();

  const colorOrder: (keyof typeof colors)[] = [
    "primary",
    "background",
    "secondary",
    "accent",
    "text",
  ];
  const colors = (palette?.colors ?? {}) as {
    primary: string;
    background: string;
    secondary: string;
    accent: string;
    text: string;
  };
  const router = useRouter();
  const reset = () => {
    router.push("/");
    setPalette({} as IPaletteSchema);
  };

  return (
    <div className="inset-0 absolute flex flex-col justify-center items-center">
      <button className="bg-white/30 rounded-md p-1 font-semibold text-slate-500 hover:bg-white/60" onClick={reset}>Resetar</button>
      <div
        className="w-full mt-2 max-w-3xl h-[90vh] overflow-auto p-2 rounded-lg shadow-lg flex flex-col gap-4 
        bg-white/10 backdrop-blur-xs border border-white/40"
      >
        <div className="grid grid-cols-7 grid-rows-8 gap-1 min-h-[90%] w-full">
          {colorOrder
            .filter((role) => role in colors)
            .map((role) => (
              <ColorCard
                key={role}
                hex={colors[role]}
                role={role as keyof typeof colors}
              />
            ))}
        </div>

        <div className=" flex justify-center ">
          <button
            onClick={regenColorsRequest}
            className="w-full flex justify-center items-center bg-blue rounded-md"
          >
            <GradientText
              colors={[
                colors["primary"],
                colors["background"],
                colors["secondary"],
                colors["accent"],
                colors["text"],
              ]}
              animationSpeed={3}
              showBorder={true}
              className="px-20 py-3 text-lg font-semibold"
            >
              Gerar novamente
            </GradientText>
          </button>
        </div>
        <div className="bg-white/30 p-1 text-slate-600 rounded-md">
          <Reasoning />
        </div>
      </div>
    </div>
  );
}
