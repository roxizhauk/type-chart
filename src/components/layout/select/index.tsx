import "./style.css";
import { useEffect, useReducer, useRef, useState, memo } from "react";

const XMarkIcon = ({ className, onClick }: React.SVGProps<SVGSVGElement>) => {
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

const ChevronDownIcon = ({ className, onClick }: React.SVGProps<SVGSVGElement>) => {
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

type SelectOption<T> = {
  value: string;
  label: string;
  color?: string;
} & T;

interface SelectProps<Option> {
  className?: string;
  placeholder?: string;
  themeColor?: string;
  isMulti?: boolean;
  options: Option[];
  defaultValue: Option[];
  onChange: (x: Option[]) => void;
}

type Action<Option> =
  | { type: "SELECT"; option: Option; isMulti: boolean | undefined }
  | { type: "DESELECT"; option: Option }
  | { type: "CLEAR" };

function Select<T>({
  className,
  placeholder,
  themeColor,
  isMulti,
  options,
  defaultValue,
  onChange,
}: SelectProps<SelectOption<T>>) {
  const [showMenu, setShowMenu] = useState(false);
  const insideRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = insideRef.current;
    if (!el) return; // 対象の要素がなければ何もしない
    const handleClickOutside = (e: MouseEvent) => {
      if (!showMenu || el?.contains(e.target as Node)) return;
      setShowMenu(false); // 外側をクリックしたときの処理
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [insideRef, showMenu]);

  const reducer = (
    state: SelectOption<T>[],
    action: Action<SelectOption<T>>
  ): SelectOption<T>[] => {
    switch (action.type) {
      case "SELECT":
        return action.isMulti ? [...state, action.option] : [action.option];
      case "DESELECT":
        return [...state].filter(({ value }) => value !== action.option.value);
      case "CLEAR":
        return [];
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, defaultValue);
  useEffect(() => onChange(state), [onChange, state]);

  return (
    <div className="overflow-hidden">
      <div className={(className ?? "") + " select-body"} onClick={() => setShowMenu(true)}>
        <div className="overflow-x-scroll">
          {state.length > 0 ? (
            isMulti ? (
              <div className="flex gap-x-1.5">
                {state.map((option) => (
                  <div
                    key={option.value}
                    className={(option.color ?? themeColor) + " select-item-multi"}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: "DESELECT", option });
                    }}
                  >
                    <div>{option.label}</div>
                    <XMarkIcon className="my-auto w-3 stroke-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                key={state[0].value}
                className={(state[0].color ?? themeColor) + " select-item-unique"}
              >
                {state[0].label}
              </div>
            )
          ) : (
            <div className="whitespace-nowrap">{placeholder ?? "Select..."}</div>
          )}
        </div>
        <div className="my-auto flex gap-x-2 divide-x divide-white place-self-end">
          {defaultValue.length > 0 && isMulti && (
            <XMarkIcon
              className="w-4 duration-300 ease-in hover:scale-125 [&>path]:stroke-[2.5]"
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "CLEAR" });
              }}
            />
          )}
          <ChevronDownIcon className="h-6 w-6 pl-2 [&>path]:stroke-[3]" />
        </div>
      </div>
      {showMenu && ( // css => showMenu ? "" : "hidden" にすると常時 useEffect が作動する
        <div ref={insideRef} className="select-menu-body">
          {options
            .map((option) => {
              if (state.find((x) => x.value == option.value && x.label == option.label)) return;
              return (
                <div
                  key={option.value}
                  className={"select-menu-item"}
                  onClick={() => dispatch({ type: "SELECT", option, isMulti })}
                >
                  {option.label}
                </div>
              );
            })
            .filter((x): x is Exclude<typeof x, undefined> => x !== undefined)}
        </div>
      )}
    </div>
  );
}

export default memo(Select) as typeof Select;
