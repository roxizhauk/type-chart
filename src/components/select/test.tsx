"use client";

import { useState, useCallback } from "react";
import { Select } from "./select";

const options = [
  { id: 1, value: "chocolate", label: "Chocolate" },
  { id: 2, value: "strawberry", label: "Strawberry" },
  { id: 3, value: "vanilla", label: "Vanilla" },
  { id: 4, value: "mint", label: "Mint" },
];

type ElementType<T> = T extends (infer U)[] ? U : never;
type Option = ElementType<typeof options>;

export function TestSelect() {
  const [selectedOption, setSelectedOption] = useState<Option | null>();
  const [selectedOptions, setSelectedOptions] = useState<Option[]>();

  const handleSelectOption = useCallback((option: Option | null) => {
    setSelectedOption(option);
  }, []);

  const handleSelectOptions = useCallback((options: readonly Option[]) => {
    setSelectedOptions([...options]);
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="rounded-lg bg-blue-100 p-2">
        <Select options={options} onChange={handleSelectOption} />
        {selectedOption && (
          <div className="mt-2 rounded-lg border-2 border-lime-200 bg-lime-100 p-4">
            Selected option is {JSON.stringify(selectedOption)}
          </div>
        )}
      </div>
      <div className="rounded-lg bg-blue-100 p-2">
        <Select isMulti options={options} onChange={handleSelectOptions} />
        {selectedOptions && selectedOptions.length > 0 && (
          <div className="mt-2 rounded-lg border-2 border-lime-200 bg-lime-100 p-4">
            Selected option is {JSON.stringify(selectedOptions)}
          </div>
        )}
      </div>
    </div>
  );
}
