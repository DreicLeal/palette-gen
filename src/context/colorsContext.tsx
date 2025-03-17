"use client";
import { IPaletteSchema } from "@/app/api/colorGen/route";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ColorsContextInterface {
  request: (prompt: string) => Promise<void>;
  palette: IPaletteSchema | undefined;
  setPalette: Dispatch<SetStateAction<IPaletteSchema | undefined>>;
  loading: boolean;
  setLockedHexes: Dispatch<SetStateAction<string[]>>;
  regenColorsRequest: () => Promise<void>;
  isRegenerating: boolean;
  lockedHexes: string[];
}

const ColorsContext = createContext<ColorsContextInterface>(
  {} as ColorsContextInterface
);

export default function ColorsProvider({ children }: { children: ReactNode }) {
  const [palette, setPalette] = useState<IPaletteSchema>();
  const [loading, setLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [lockedHexes, setLockedHexes] = useState<string[]>([]);

  const request = async (prompt: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/colorGen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });
      if (!response) throw new Error("Failed to generate the colors");
      const data = await response.json();
      setPalette(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const regenColorsRequest = async () => {
    if (!palette?.colors) return;
  
    const unlockedColors = Object.entries(palette.colors)
      .filter(([, hex]) => !lockedHexes.includes(hex)) // Only regenerate unlocked colors
      .map(([role]) => role); // Get the roles to regenerate
  
    if (unlockedColors.length === 0) return; // Nothing to regenerate
  
    const requestData = {
      currentColors: palette.colors, // Send the current palette colors
      rolesToRegen: unlockedColors,  // Send only the roles that need new colors
    };
  
    try {
      setIsRegenerating(true);
  
      const response = await fetch("/api/regenColors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData), // ✅ Send correctly structured data
      });
  
      if (!response.ok) throw new Error("Failed to regenerate the colors");
  
      const data = await response.json();
  
      // ✅ Merge new colors while keeping locked ones unchanged
      setPalette((prev) => ({
        ...prev,
        reasoning: prev?.reasoning ?? "",
        colors: {
          ...prev?.colors,
          ...data.colors, // Update only regenerated colors
        },
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <ColorsContext.Provider
      value={{
        request,
        palette,
        loading,
        regenColorsRequest,
        setLockedHexes,
        setPalette,
        isRegenerating,
        lockedHexes
      }}
    >
      {children}
    </ColorsContext.Provider>
  );
}

export const useColors = () => {
  const context = useContext(ColorsContext);
  return context;
};
