import { Noise } from "@/components/Noise";
import { TypeChecker } from "@/components/type-checker";

export default function App() {
  return (
    <>
      <Noise />
      <main>
        <div className="bento">
          <TypeChecker />
        </div>
      </main>
    </>
  );
}
