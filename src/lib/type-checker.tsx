import {
  NormalIcon,
  FireIcon,
  WaterIcon,
  ElectricIcon,
  GrassIcon,
  IceIcon,
  FightingIcon,
  PoisonIcon,
  GroundIcon,
  FlyingIcon,
  PsychicIcon,
  BugIcon,
  RockIcon,
  GhostIcon,
  DragonIcon,
  DarkIcon,
  SteelIcon,
  FairyIcon,
} from "./type-icons";
import typeChart from "@/data/type-chart.json";
import { Fragment } from "react";

export const TYPE_ICONS = [
  <NormalIcon key={"normal"} className={"h-4 w-4"} />,
  <FireIcon key={"fire"} className={"h-4 w-4"} />,
  <WaterIcon key={"water"} className={"h-4 w-4"} />,
  <ElectricIcon key={"electric"} className={"h-4 w-4"} />,
  <GrassIcon key={"grass"} className={"h-4 w-4"} />,
  <IceIcon key={"ice"} className={"h-4 w-4"} />,
  <FightingIcon key={"fighting"} className={"h-4 w-4"} />,
  <PoisonIcon key={"poison"} className={"h-4 w-4"} />,
  <GroundIcon key={"ground"} className={"h-4 w-4"} />,
  <FlyingIcon key={"flying"} className={"h-4 w-4"} />,
  <PsychicIcon key={"psychic"} className={"h-4 w-4"} />,
  <BugIcon key={"bug"} className={"h-4 w-4"} />,
  <RockIcon key={"rock"} className={"h-4 w-4"} />,
  <GhostIcon key={"ghost"} className={"h-4 w-4"} />,
  <DragonIcon key={"dragon"} className={"h-4 w-4"} />,
  <DarkIcon key={"dark"} className={"h-4 w-4"} />,
  <SteelIcon key={"steel"} className={"h-4 w-4"} />,
  <FairyIcon key={"fairy"} className={"h-4 w-4"} />,
];

export const genIcon = (value: number) => {
  switch (value) {
    case 2:
      return "🥺";
    case 1:
      return "";
    case 0.5:
      return "😆";
    case 0:
      return "😎";
    default:
      return "";
  }
};

export const genColor = (value: number) => {
  switch (value) {
    case 2:
      return "bg-bad";
    case 1:
      return "";
    case 0.5:
      return "bg-good";
    case 0:
      return "bg-immune";
    default:
      return "";
  }
};

export const filterTypes = (raidTypeName: string) => {
  // typeDamage
  //   .map((v, i) => (v > 1 ? typeChart[i].typeName : undefined))
  //   .filter((x) => x)
  //   .join(", ");
  const { typeDamage } = typeChart.find(({ typeName }) => typeName == raidTypeName)!;
  const result = { pros: [], cons: [] } as { pros: string[]; cons: string[] };
  typeDamage.map((v, i) => {
    if (v > 1) result.pros.push(typeChart[i].typeName);
    if (v < 1) result.cons.push(typeChart[i].typeName);
    return;
  });
  return (
    <>
      <span className="text-good">{result.pros.join(" ")}</span>
      <span className="text-bad">{result.cons.join(" ")}</span>
    </>
  );
};

export const tableHead = typeChart.map(({ typeName }, index) => (
  <div key={`th-${index + 1}`} className={typeChart.length == index + 1 ? "tr" : ""}>
    <div className={`bg-${typeName.toLowerCase()}`}>{TYPE_ICONS[index]}</div>
  </div>
));

export const allTableRows = typeChart.map(({ typeName, typeEffect }, index) => (
  <Fragment key={`row-${index}`}>
    <div className={typeChart.length == index + 1 ? "bl" : ""}>
      <div className={`bg-${typeName.toLowerCase()}`}>{TYPE_ICONS[index]}</div>
    </div>
    {typeEffect.map((value, i) => (
      <div key={`td-${typeName}-${i + 1}`}>
        <div className={genColor(value)}>
          <span>{genIcon(value)}</span>
        </div>
      </div>
    ))}
  </Fragment>
));

export const SELECT_OPTIONS = typeChart.map(({ typeName: label }, id) => {
  const value = label.toLowerCase();
  return { id, value, label, color: `bg-${value}` };
});

export const TYPE_CHART = typeChart.map((item) => ({
  ...item,
  typeEffect: item.typeEffect.map((value) => ({
    value,
    emote: genIcon(value),
    color: genColor(value),
  })),
}));
