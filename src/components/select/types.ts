export type Action<Option> = {
  type: "SELECT" | "DESELECT" | "CLEAR";
  option?: Option;
};

export type OnChangeValue<Option, IsMulti extends boolean> = IsMulti extends true
  ? readonly Option[]
  : Option;

export interface SelectProps<Option, IsMulti extends boolean> {
  options: readonly Option[];
  isMulti?: IsMulti;
  className?: string;
  placeholder?: string;
  themeColor?: string;
  defaultValue?: OnChangeValue<Option, IsMulti>;
  elementId?: string;
  onChange?: (onChangeValue: OnChangeValue<Option, IsMulti>) => void;
}

export type SelectOption<AdditionalOption> = {
  value: string;
  label: string;
  color?: string;
} & AdditionalOption;
