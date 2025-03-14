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
    const setRegeneratedData = {
      currentHexes: palette,
      quantityToRegen: lockedHexes.length > 0 ? 5 - lockedHexes.length : 5,
    };
    try {
    setIsRegenerating(true)
      const response = await fetch("/api/regenColors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ setRegeneratedData }),
      });
      if (!response) throw new Error("Failed to regenerate the colors");
      const data = await response.json();
      setPalette(prev => ({...prev, reasoning: prev?.reasoning ?? "", hexes: [...lockedHexes, ...data.hexes]}));
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegenerating(false)
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
