import Iridescence from "@/Backgrounds/Iridescence/Iridescence";
import Form from "./components/Form";

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <Form />
      <Iridescence
            color={[1, 1, 1]}
            mouseReact={false}
            amplitude={0.1}
            speed={0.4}
          />
    </div>
  );
}
