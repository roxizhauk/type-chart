import { Fragment, memo } from "react";
import { typeIcons } from "./type-icons";
import { typeChart, Option, TypeRatio } from "./lib";

export const RaidTypes = memo(function RaidTypes({ raidType }: { raidType: Option }) {
  const result: { pros: string[]; cons: string[] } = { pros: [], cons: [] };
  const { damage } = typeChart.find(({ name }) => name == raidType.label)!;
  damage.map((v, i) => {
    if (v == 1) return;
    if (v > 1) result.pros.push(typeChart[i].name);
    if (v < 1) result.cons.push(typeChart[i].name);
  });
  return (
    <>
      <span className="text-good">{result.pros.join(" ")}</span>
      <span className="text-bad">{result.cons.join(" ")}</span>
    </>
  );
});

export const TableHead = memo(function TableHead() {
  return (
    <>
      {typeChart.map(({ name }, index) => (
        <div key={`th-${index + 1}`} className={typeChart.length == index + 1 ? "tr" : ""}>
          <div className={`bg-${name.toLowerCase()}`}>{typeIcons[index]}</div>
        </div>
      ))}
    </>
  );
});

export const AllTableRows = memo(function AllTableRows() {
  function genIcon(ratio: TypeRatio) {
    switch (ratio) {
      case 2:
        return { icon: "😆", color: "bg-good" };
      case 1:
        return { icon: "", color: "" };
      case 0.5:
        return { icon: "🥺", color: "bg-bad" };
      case 0:
        return { icon: "😭", color: "bg-immune2" };
    }
  }
  return (
    <>
      {typeChart.map(({ name, effect }, index) => (
        <Fragment key={`row-${index}`}>
          <div className={typeChart.length == index + 1 ? "bl" : ""}>
            <div className={`bg-${name.toLowerCase()}`}>{typeIcons[index]}</div>
          </div>
          {(effect as TypeRatio[]).map((value, i) => {
            const { icon, color } = genIcon(value);
            return (
              <div key={`td-${name}-${i + 1}`}>
                <div className={color}>
                  <span>{icon}</span>
                </div>
              </div>
            );
          })}
        </Fragment>
      ))}
    </>
  );
});

export const SelectedRows = memo(function SelectedRows({
  moveTypes,
  colorMode,
}: {
  moveTypes: Option[];
  colorMode: boolean;
}) {
  function genIcon(ratio: TypeRatio) {
    switch (ratio) {
      case 2:
        return { icon: "🥺", color: "bg-bad" };
      case 1:
        return { icon: "", color: "" };
      case 0.5:
        return { icon: "😆", color: "bg-good" };
      case 0:
        return { icon: "😎", color: "bg-immune" };
    }
  }

  if (moveTypes.length == 0) return null;
  let result: TypeRatio[] = Array.from({ length: 18 }, () => 0);
  if (colorMode) {
    for (const { id } of moveTypes) {
      result = result.map((prevRatio, i) => {
        const currRatio = typeChart[id].effect[i];
        return Math.max(prevRatio, currRatio) as TypeRatio;
      });
    }
  }
  return (
    <>
      {moveTypes.map(({ id, value: type, color: typeColor }, index) => (
        <Fragment key={`row-${type}`}>
          <div key={`td-${type}-0`} className={moveTypes.length == index + 1 ? "bl" : ""}>
            <div className={`text-white ${typeColor}`}>{typeIcons[id]}</div>
          </div>
          {typeChart[id].effect.map((v, i) => {
            const { icon, color } = genIcon(v);
            return (
              <div key={`td-${type}-${i + 1}`}>
                <div className={colorMode ? genIcon(result[i]).color : color}>
                  <span>{icon}</span>
                </div>
              </div>
            );
          })}
        </Fragment>
      ))}
    </>
  );
});
