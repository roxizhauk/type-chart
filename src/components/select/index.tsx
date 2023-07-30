import "./style.css";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  SelectProps,
  SelectOption,
  OnChangeValue,
  Action,
  validate,
  isArray,
  XMarkIcon,
  ChevronDownIcon,
} from "./utils";

export default function Select<T, IsMulti extends boolean = false>({
  isMulti,
  options,
  className,
  placeholder = isMulti ? "Select Items" : "Select Item",
  themeColor = "bg-slate-400",
  defaultValue,
  elementId = "select-root",
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
    const element = insideRef.current;
    if (!element) return; // 対象の要素がなければ何もしない
    const handleClickOutside = (e: MouseEvent) => {
      if (!showMenu || element?.contains(e.target as Node)) return;
      setShowMenu(false); // 外側をクリックしたときの処理
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [insideRef, showMenu]);

  // const reducer: React.Reducer<
  //   OnChangeValue<SelectOption<T>, IsMulti>,
  //   Action<SelectOption<T>>
  // > = (state, { type, option }) => {
  //   let newState = undefined;
  //   if (isMulti) {
  //     newState = Array.isArray(state) ? [...state] : [];
  //     switch (type) {
  //       case "SELECT":
  //         newState = [...newState, option!];
  //         break;
  //       case "DESELECT":
  //         newState = newState.filter(({ value }) => value !== option!.value);
  //         break;
  //       case "CLEAR":
  //         newState = [];
  //         break;
  //       default:
  //         newState = [];
  //         break;
  //     }
  //   } else {
  //     switch (type) {
  //       case "SELECT":
  //         newState = option!;
  //         break;
  //     }
  //   }
  //   onChange(newState as OnChangeValue<SelectOption<T>, IsMulti>);
  //   return newState as OnChangeValue<SelectOption<T>, IsMulti>;
  // };
  // const [state, dispatch] = useReducer(reducer, defaultState);

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
    (option: SelectOption<T>) => {
      return (
        <div
          key={option.value}
          className={"select-menu-item"}
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "SELECT", option });
          }}
        >
          {option.label}
        </div>
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (onChange) onChange(state);
  }, [state, onChange]);

  return (
    <div className={className}>
      <div className="select-body" onClick={() => setShowMenu(true)}>
        <div className="select-content peer">
          {validate<T>(state) ? (
            isArray<T>(state) ? (
              <div className="flex gap-x-1.5">
                {state.map((option) => (
                  <div
                    key={option.value}
                    className={"select-item-multi " + (option.color ?? themeColor)}
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
                className={"select-item-unique " + (state.color ?? themeColor)}
              >
                {state.label}
              </div>
            )
          ) : (
            <div className="whitespace-nowrap">{placeholder}</div>
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
      {showMenu && ( // css => showMenu ? "" : "hidden" にすると常時 useEffect が作動する
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

// import { memo } from "react";
// export default memo(Select) as typeof Select;
