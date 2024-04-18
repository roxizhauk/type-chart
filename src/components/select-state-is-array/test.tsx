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
    <>
      <div>
        <Select options={options} onChange={handleSelectOption} />
      </div>
      {selectedOption && (
        <div className="col-span-4 flex items-center justify-center">
          <div className="h-full w-full rounded-lg border-4 border-lime-200 bg-lime-100 p-2 text-sm">
            Selected option is {JSON.stringify(selectedOption)}
          </div>
        </div>
      )}
      <div className="col-span-3">
        <Select isMulti options={options} onChange={handleSelectOptions} />
      </div>
      {selectedOptions && selectedOptions.length > 0 && (
        <div className="col-span-4">
          <div className="h-full w-full rounded-lg border-2 border-sky-200 bg-sky-100 p-2 text-sm">
            Selected option is {JSON.stringify(selectedOptions)}
          </div>
        </div>
      )}
    </>
  );
}
