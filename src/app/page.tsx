import TypeChecker from "@/components/utils/TypeChecker";
import EggTimer from "@/components/utils/EggTimer";

export default function Home() {
  return (
    <div className="bento">
      <EggTimer />
      <TypeChecker />
    </div>
  );
}
