import "./style.css";
import { useState, useRef, useEffect, useCallback } from "react";
import type { SelectProps, SelectOption, OnChangeValue, Action } from "./types";

function validate<T>(state: unknown): state is SelectOption<T> | SelectOption<T>[] {
  return Array.isArray(state) ? state.length > 0 : !!state;
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
  const defaultState = (isMulti ? defaultValue ?? [] : defaultValue) as OnChangeValue<
    SelectOption<T>,
    IsMulti
  >;

  const [state, setState] = useState(defaultState);
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
        let newState = undefined;
        if (isMulti) {
          newState = Array.isArray(prevState) ? [...prevState] : [];
          switch (type) {
            case "SELECT":
              newState = [...newState, option!];
              break;

            case "DESELECT":
              newState = newState.filter(({ value }) => value !== option!.value);
              break;

            case "CLEAR":
              newState = [];
              break;
          }
        } else {
          switch (type) {
            case "SELECT":
              newState = option!;
              break;
          }
        }
        return newState as OnChangeValue<SelectOption<T>, IsMulti>;
      }),
    [isMulti],
  );

  useEffect(() => {
    if (onChange) onChange(state);
  }, [state, onChange]);

  const MenuItems = () => {
    function genMenuItem(option: SelectOption<T>) {
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
    }

    if (!validate<T>(state)) return options.map(genMenuItem);
    if (Array.isArray(state)) {
      return options.map((option) => {
        if (state.find((item) => item.value == option.value && item.label == option.label)) {
          return;
        }
        return genMenuItem(option);
      });
    } else {
      return options.map((option) => {
        if (state.value === option.value && state.label === option.label) {
          return;
        }
        return genMenuItem(option);
      });
    }
  };

  return (
    <div className={"h-full w-full " + className}>
      <div className="select-body" onClick={() => setShowMenu(true)}>
        <div className="select-content peer">
          {validate<T>(state) ? (
            Array.isArray(state) ? (
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
            ) : (
              <div className={"select-item is-unique " + (state.color ?? themeColor)}>
                {state.label}
              </div>
            )
          ) : (
            <div className="whitespace-nowrap text-sm">{placeholder}</div>
          )}
        </div>
        {isMulti && validate<T>(state) && (
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
      {showMenu && (
        <div ref={insideRef} className="select-menu-body">
          <MenuItems />
        </div>
      )}
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
