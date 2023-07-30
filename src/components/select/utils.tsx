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

export function isArray<T>(state: any): state is SelectOption<T>[] {
  return Array.isArray(state);
}

export function validate<T>(state: any): state is SelectOption<T> | SelectOption<T>[] {
  return Array.isArray(state) ? state.length > 0 : !!state;
}

export const XMarkIcon = ({ className, onClick }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      onClick={onClick}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
};

export const ChevronDownIcon = ({ className, onClick }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      onClick={onClick}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
};
