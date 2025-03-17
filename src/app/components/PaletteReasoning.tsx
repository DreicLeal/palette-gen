"use client";
import { useColors } from "@/context/colorsContext";
import Colors from "./colorsContainer/Colors";
import LoadComponent from "./LoadComponent";
import Iridescence from "@/Backgrounds/Iridescence/Iridescence";

export default function PaletteReasoning() {
  const { loading } = useColors();
  return (
    <div className="absolute inset-0 flex justify-center mx-auto items-center">
      <Iridescence
        color={[1, 1, 1]}
        mouseReact={false}
        amplitude={0.1}
        speed={0.4}
      />
      {loading ? (
        <LoadComponent />
      ) : (
        <div>
          <Colors />
        </div>
      )}
    </div>
  );
}
