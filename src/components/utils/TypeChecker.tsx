"use client";

import {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import Select from "@/components/layout/select";
import GridTable from "@/components/layout/GridTable";
import {
  filterTypes,
  genColor,
  tableHead,
  allTableRows,
  SELECT_OPTIONS as options,
  TYPE_CHART as typeChart,
  TYPE_ICONS as typeIcons,
} from "@/lib/type-checker";

type Option = typeof options extends (infer U)[] ? U : never;

function TypeChecker() {
  // const [raidType, setRaidType] = useState<Option>();
  const [moveTypes, setMoveTypes] = useState<Option[]>([]);
  const [raidData, setRaidData] = useState(<></>);
  const [tableRows, setTableRows] = useState(allTableRows);
  const [colorMode, setColorMode] = useState(false);
  const [isAll, setIsAll] = useState(true);

  const genChart = useMemo(() => {
    if (moveTypes.length == 0) return [];
    let result = [...Array(18)].map(() => 0);
    if (colorMode) {
      for (const { id } of moveTypes) {
        result = result.map((v, i) =>
          Math.max(v, typeChart[id].typeEffect[i].value)
        );
      }
    }

    return moveTypes.map(({ id, value: type, color: typeColor }, index) => (
      <Fragment key={`row-${type}`}>
        <div
          key={`td-${type}-0`}
          className={moveTypes.length == index + 1 ? "bl" : ""}
        >
          <div className={`text-white ${typeColor}`}>{typeIcons[id]}</div>
        </div>
        {typeChart[id].typeEffect.map(({ emote, color: bgColor }, i) => (
          <div key={`td-${type}-${i + 1}`}>
            <div className={colorMode ? genColor(result[i]) : bgColor}>
              <span>{emote}</span>
            </div>
          </div>
        ))}
      </Fragment>
    ));
  }, [colorMode, moveTypes]);

  const handleRaidType = useCallback((option: Option) => {
    if (option) setRaidData(<>{filterTypes(option.label)}</>);
  }, []);

  const handleMoveTypes = useCallback((options: readonly Option[]) => {
    if (options) setMoveTypes([...options]);
  }, []);

  const handleColorMode = useCallback(() => {
    if (moveTypes.length > 0) setColorMode((b) => !b);
  }, [moveTypes]);

  const handleShowAll = useCallback(() => {
    setTableRows(allTableRows);
    setIsAll(true);
  }, []);

  const handleShowChart = useCallback(() => {
    setTableRows(genChart);
    setIsAll(false);
  }, [genChart]);

  useEffect(() => {
    if (moveTypes.length > 0) {
      setTableRows(genChart);
      setIsAll(false);
    } else {
      setTableRows(allTableRows);
    }
  }, [colorMode, moveTypes, genChart]);

  return (
    <>
      <div className="z-20 col-span-2 md:col-span-1">
        <div className="w-full drop-shadow">
          <Select
            placeholder="Select Raid Type"
            options={options}
            onChange={handleRaidType}
          />
        </div>
      </div>
      <div className="col-span-3 md:col-span-2">
        <div className="ml-1 flex flex-col overflow-x-auto whitespace-nowrap text-sm font-medium leading-tight">
          {raidData}
        </div>
      </div>
      <div className="">
        <button
          className={
            "btn " +
            (moveTypes.length < 2 || isAll ? "btn-disabled" : "btn-light")
          }
          onClick={handleColorMode}
        >
          Color Mode
        </button>
      </div>
      <div className="z-10 col-span-4 md:col-span-2">
        <div className="w-full drop-shadow">
          <Select
            isMulti
            placeholder="Select Move Types"
            options={options}
            onChange={handleMoveTypes}
          />
        </div>
      </div>
      <div className="">
        <button
          className={
            "btn " +
            (moveTypes.length > 0 && isAll ? "btn-blue" : "btn-disabled")
          }
          onClick={handleShowChart}
        >
          Show Chart
        </button>
      </div>
      <div className="">
        <button
          className={
            "btn " +
            (moveTypes.length == 0 || isAll ? "btn-disabled" : "btn-blue")
          }
          onClick={handleShowAll}
        >
          Show All
        </button>
      </div>
      <div className="col-span-4">
        <div className="w-full overflow-x-auto">
          <GridTable>
            <div>
              <div>
                <span className="text-transparent">😃</span>
              </div>
            </div>
            {tableHead}
            {tableRows}
          </GridTable>
        </div>
      </div>
    </>
  );
}

export default memo(TypeChecker);
