import PixelCard from "@/app/components/PixelCard";
import { LuLoader } from "react-icons/lu";
export default function LoadComponent() {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <div
        className="w-full max-w-3xl h-[90vh] p-2 rounded-lg shadow-lg flex flex-col gap-4 
                bg-white/10 backdrop-blur-xs border border-white/40"
      >
        <PixelCard
          variant="default"
          gap={4}
          speed={1.5}
          noFocus={true}
          className="w-full h-full border-none text-white font-bold text-center"
        >
          <LuLoader className="animate-spin text-4xl text-slate-600 absolute" />
        </PixelCard>
      </div>
    </div>
  );
}
