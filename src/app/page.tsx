import Colors from "./components/colorsContainer/Colors";
import FormReasoning from "./components/FormReasoning";

export default function Home() {
  return (
    <div className="p-2 flex flex-col gap-2 lg:w-[850px] mx-auto">
      <Colors />
      <FormReasoning />
    </div>
  );
}
