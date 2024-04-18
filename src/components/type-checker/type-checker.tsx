"use client";

import "./style.css";
import "./colors.css";
import { useState, useEffect, useCallback } from "react";
import { Select } from "@/components/select";
import { options, Option, RaidTypes, TableHead, AllTableRows, SelectedRows } from "./elements";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function TypeChecker() {
  const [moveTypes, setMoveTypes] = useState<Option[]>([]);
  const [raidData, setRaidData] = useState<JSX.Element | null>(null);
  const [tableRows, setTableRows] = useState<JSX.Element | null>(<AllTableRows />);
  const [isAll, setIsAll] = useState(true);
  const [colorMode, setColorMode] = useLocalStorage("colorMode");

  const handleRaidType = useCallback((option: Option) => {
    if (option) setRaidData(<RaidTypes raidType={option.label} />);
  }, []);

  const handleMoveTypes = useCallback((options: readonly Option[]) => {
    if (options) setMoveTypes([...options]);
  }, []);

  const handleColorMode = () => {
    if (moveTypes.length > 1) setColorMode(colorMode == "true" ? "false" : "true");
  };

  const handleShowAll = useCallback(() => {
    setTableRows(<AllTableRows />);
    setIsAll(true);
  }, []);

  const handleShowChart = useCallback(() => {
    setTableRows(<SelectedRows moveTypes={moveTypes} colorMode={colorMode == "true"} />);
    setIsAll(false);
  }, [moveTypes, colorMode]);

  useEffect(() => {
    if (moveTypes.length > 0) {
      setTableRows(<SelectedRows moveTypes={moveTypes} colorMode={colorMode == "true"} />);
      setIsAll(false);
    } else {
      setTableRows(<AllTableRows />);
    }
  }, [colorMode, moveTypes]);

  return (
    <>
      <div className="z-20 col-span-2 md:col-span-1">
        <Select
          placeholder="Select Raid Type"
          options={options}
          onChange={handleRaidType}
          className="drop-shadow"
          elementId="select1"
        />
      </div>
      <div className="col-span-3 md:col-span-2">
        <div className="ml-1 flex flex-col overflow-x-auto whitespace-nowrap text-sm font-medium leading-tight">
          {raidData}
        </div>
      </div>
      <div>
        <button
          className={moveTypes.length < 2 || isAll ? "btn-disabled" : "btn-light"}
          onClick={handleColorMode}
        >
          Color Mode
        </button>
      </div>
      <div className="z-10 col-span-4 md:col-span-2">
        <Select
          isMulti
          placeholder="Select Move Types"
          options={options}
          onChange={handleMoveTypes}
          className="drop-shadow"
          elementId="select2"
        />
      </div>
      <div>
        <button
          className={moveTypes.length > 0 && isAll ? "btn-blue" : "btn-disabled"}
          onClick={handleShowChart}
        >
          Show Chart
        </button>
      </div>
      <div>
        <button
          className={moveTypes.length == 0 || isAll ? "btn-disabled" : "btn-blue"}
          onClick={handleShowAll}
        >
          Show All
        </button>
      </div>
      <div className="col-span-4">
        <div className="w-full overflow-x-auto">
          <div className="grid-table grid grid-cols-19">
            <div>
              <div>
                <span className="text-transparent">😃</span>
              </div>
            </div>
            <TableHead />
            {tableRows}
          </div>
        </div>
      </div>
    </>
  );
}
