import "./style.css";
import { useState, useRef, useEffect, useCallback } from "react";
import type { SelectProps, SelectOption, Action, OnChangeValue } from "./types";

function init<T>(
  defaultValue: SelectOption<T>[] | SelectOption<T> | undefined,
): SelectOption<T>[] {
  if (!defaultValue) return [];
  return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
}

export function Select<T, IsMulti extends boolean = false>({
  isMulti,
  options,
  className,
  placeholder = isMulti ? "Select Items" : "Select Item",
  themeColor = "bg-slate-400",
  defaultValue,
  onChange,
}: SelectProps<SelectOption<T>, IsMulti>) {
  const [state, setState] = useState(init(defaultValue));
  const [showMenu, setShowMenu] = useState(false);

  const insideRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!showMenu || insideRef.current?.contains(e.target as Node)) return;
      setShowMenu(false); // close menu when clicked outside
    }
    document.addEventListener("click", handleClickOutside, { capture: true });
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenu]);

  const dispatch = useCallback(
    ({ type, option }: Action<SelectOption<T>>) =>
      setState((prevState) => {
        switch (type) {
          case "SELECT":
            return isMulti ? [...prevState, option!] : [option!];
          case "DESELECT":
            return prevState.filter(({ value }) => value !== option!.value);
          case "CLEAR":
            return [];
        }
      }),
    [isMulti],
  );

  useEffect(() => {
    if (onChange) {
      const val = (isMulti ? state : state[0]) as OnChangeValue<SelectOption<T>, IsMulti>;
      onChange(val);
    }
  }, [isMulti, state, onChange]);

  function SelectedItems() {
    return (
      <div className="flex gap-x-1.5">
        {state.map((item) => (
          <div
            key={item.value}
            className={"select-item is-multi " + (item.color ?? themeColor)}
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "DESELECT", option: item });
            }}
          >
            <div>{item.label}</div>
            <XMarkIcon className="my-auto w-3 stroke-2" />
          </div>
        ))}
      </div>
    );
  }

  function MenuItems() {
    return (
      <div ref={insideRef} className="select-menu-body">
        {options.map((option) => {
          if (state.find((item) => item.value == option.value && item.label == option.label)) {
            return;
          }
          return (
            <div
              key={option.value}
              className={"select-menu-item"}
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "SELECT", option });
                setShowMenu(false);
              }}
            >
              {option.label}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={"h-full w-full " + className}>
      <div className="select-body" onClick={() => setShowMenu(true)}>
        <div className="select-content peer">
          {state.length > 0 ? (
            <SelectedItems />
          ) : (
            <div className="whitespace-nowrap text-sm">{placeholder}</div>
          )}
        </div>
        {isMulti && state.length > 0 && (
          <XMarkIcon
            className="clear-all-icon"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "CLEAR" });
            }}
          />
        )}
        <ChevronDownIcon className="show-menu-icon" />
      </div>
      {showMenu && <MenuItems />}
    </div>
  );
}

function XMarkIcon({ className, onClick }: React.SVGProps<SVGSVGElement>) {
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
}

function ChevronDownIcon({ className, onClick }: React.SVGProps<SVGSVGElement>) {
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
}
