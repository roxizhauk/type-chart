export type Action<Option> = {
  type: "SELECT" | "DESELECT" | "CLEAR";
  option?: Option;
};

export type OnChangeValue<Option, IsMulti extends boolean> = IsMulti extends true ? Option[] : Option;

export interface SelectProps<Option, IsMulti extends boolean> {
  options: readonly Option[];
  isMulti?: IsMulti;
  className?: string;
  placeholder?: string;
  themeColor?: string;
  defaultValue?: Option[] | Option;
  elementId?: string;
  onChange?: (onChangeValue: IsMulti extends true ? Option[] : Option) => void;
}

export type SelectOption<AdditionalOption> = {
  value: string;
  label: string;
  color?: string;
} & AdditionalOption;
