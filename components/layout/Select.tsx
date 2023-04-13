"use client";

import { useEffect, useReducer, useRef, useState, memo } from "react";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const THEME_COLOR = "bg-slate-500";

type SelectOption<T> = {
  value: string;
  label: string;
  color?: string;
} & T;

interface SelectProps<Option> {
  className?: string;
  placeholder?: string;
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
  isMulti,
  options,
  defaultValue,
  onChange,
}: SelectProps<SelectOption<T>>) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onChange(state), [state]);

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
  }, [showMenu, insideRef]);

  return (
    <div className="overflow-hidden">
      <div
        className={
          (className ?? "") +
          " relative flex cursor-pointer items-center justify-between gap-x-2 rounded-md border border-white bg-slate-50 px-2 py-1.5 hover:bg-slate-100"
        }
        onClick={() => setShowMenu(true)}
      >
        <div className="overflow-x-scroll">
          {state.length > 0 ? (
            isMulti ? (
              <div className="flex gap-x-1.5">
                {state.map((option) => (
                  <div
                    key={option.value}
                    className={
                      "inline-flex justify-between gap-x-1 rounded-sm py-0.5 pl-1.5 pr-1 text-white" +
                      " " +
                      (option.color ?? THEME_COLOR)
                    }
                    onClick={() => dispatch({ type: "DESELECT", option })}
                  >
                    <div>{option.label}</div>
                    <XMarkIcon className="my-auto w-3 stroke-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                key={state[0].value}
                className={"rounded-sm px-1 text-white" + " " + (state[0].color ?? THEME_COLOR)}
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
              className="w-4 [&>path]:stroke-[3]"
              onClick={() => dispatch({ type: "CLEAR" })}
            />
          )}
          <ChevronDownIcon className="h-6 w-6 pl-2 [&>path]:stroke-[3]" />
        </div>
      </div>
      {showMenu && ( // css => showMenu ? "" : "hidden" にすると常時 useEffect が作動する
        <div
          ref={insideRef}
          className="absolute mt-2 flex max-h-screen cursor-pointer flex-col overflow-visible overflow-y-auto rounded-md border border-white bg-slate-100 p-1 drop-shadow"
        >
          {options
            .map((option) => {
              if (state.find((x) => x.value == option.value && x.label == option.label)) return;
              return (
                <div
                  className={
                    "py-1 pl-2 pr-5 hover:rounded-md hover:bg-blue-500/90 hover:text-white"
                  }
                  key={option.value}
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
