"use client";

import "./style.css";
import { useState, useRef, useEffect, useCallback } from "react";
import type { SelectProps, SelectOption, OnChangeValue, Action } from "./utils";
import { validate, isArray } from "./utils";
import { XMarkIcon, ChevronDownIcon } from "./icons";

export function Select<T, IsMulti extends boolean = false>({
  isMulti,
  options,
  className,
  placeholder = isMulti ? "Select Items" : "Select Item",
  themeColor = "bg-slate-400",
  defaultValue,
  onChange,
}: SelectProps<SelectOption<T>, IsMulti>) {
  const defaultState = (defaultValue ?? isMulti ? [] : null) as OnChangeValue<
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

  const genMenuItem = useCallback(
    (option: SelectOption<T>) => (
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
    ),
    [dispatch],
  );

  useEffect(() => {
    if (onChange) onChange(state);
  }, [state, onChange]);

  return (
    <div className={"h-full w-full " + className}>
      <div className="select-body" onClick={() => setShowMenu(true)}>
        <div className="select-content peer">
          {validate<T>(state) ? (
            isArray<T>(state) ? (
              <div className="flex gap-x-1.5">
                {state.map((option) => (
                  <div
                    key={option.value}
                    className={"select-item is-multi " + (option.color ?? themeColor)}
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
                key={state.value}
                className={"select-item is-unique " + (state.color ?? themeColor)}
              >
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
          {validate<T>(state)
            ? isArray<T>(state)
              ? options
                  .map((option) => {
                    const { value, label } = option;
                    if (state.find(({ value: v, label: l }) => v === value && l === label))
                      return;
                    return genMenuItem(option);
                  })
                  .filter((x): x is Exclude<typeof x, undefined> => x !== undefined)
              : options
                  .map((option) => {
                    const { value, label } = option;
                    const { value: v, label: l } = state;
                    if (v === value && l === label) return;
                    return genMenuItem(option);
                  })
                  .filter((x): x is Exclude<typeof x, undefined> => x !== undefined)
            : options.map(genMenuItem)}
        </div>
      )}
    </div>
  );
}
