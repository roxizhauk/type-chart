import { Select } from "@/components/array-state-select";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useCallback, useEffect, useState } from "react";
import "./colors.css";
import "./style.css";

import { AllTableRows, RaidTypes, SelectedRows, TableHead } from "./elements";
import { Option, options } from "./lib";

export function TypeChecker() {
  const [moveTypes, setMoveTypes] = useState<Option[]>([]);
  const [raidType, setRaidType] = useState<Option>();

  const [isAll, setIsAll] = useState(true);
  const [colorMode, setColorMode] = useLocalStorage("colorMode");

  const handleRaidType = useCallback((option: Option) => {
    if (option) setRaidType(option);
  }, []);

  const handleMoveTypes = useCallback((options: readonly Option[]) => {
    if (options) setMoveTypes([...options]);
  }, []);

  const handleColorMode = useCallback(() => {
    if (moveTypes.length > 1) setColorMode(String(!(colorMode == "true")));
  }, [moveTypes, setColorMode, colorMode]);

  const handleShowChart = useCallback(() => {
    if (moveTypes.length > 0) setIsAll(false);
  }, [moveTypes]);

  useEffect(() => {
    setIsAll(!(moveTypes.length > 0));
  }, [moveTypes]);

  return (
    <>
      <div className="z-20 col-span-2 md:col-span-1">
        <Select
          placeholder="Select Raid Type"
          options={options}
          onChange={handleRaidType}
          className="h-9 drop-shadow"
          elementId="select1"
        />
      </div>
      <div className="col-span-3 md:col-span-2">
        <div className="ml-1 flex flex-col overflow-x-auto whitespace-nowrap font-medium leading-tight">
          {raidType && <RaidTypes raidType={raidType} />}
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
          className="h-9 drop-shadow"
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
          onClick={() => setIsAll(true)}
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
            {isAll ? (
              <AllTableRows />
            ) : (
              <SelectedRows moveTypes={moveTypes} colorMode={colorMode == "true"} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
