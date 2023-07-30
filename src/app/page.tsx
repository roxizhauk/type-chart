import EggTimer from "@/components/egg-timer";
import TypeChecker from "@/components/type-checker";

export default function Home() {
  return (
    <div className="bento">
      <EggTimer />
      <TypeChecker />
    </div>
  );
}
