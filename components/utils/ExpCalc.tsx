"use client";

import { useState, useCallback } from "react";

type Key = "p1" | "p2" | "p3";
type RowProps = { poke: Poke; onChange: Function; onChangeName: Function };

class Poke {
  p1: number;
  p2: number;
  p3: number;
  init: number;
  name: string;

  constructor(initPoke: Poke | undefined = undefined) {
    this.p1 = initPoke ? initPoke.p1 : 0;
    this.p2 = initPoke ? initPoke.p2 : 0;
    this.p3 = initPoke ? initPoke.p3 : 0;
    this.init = initPoke ? initPoke.init : 0;
    this.name = initPoke ? initPoke.name : "";
  }

  get subtotal() {
    return this.p1 + this.p2 * 2 + this.p3 * 3;
  }

  get total() {
    return this.init + this.subtotal + (this.p1 + this.p2 + this.p3) * 8;
  }
}

const ExpCalc = () => {
  const [initNum, setInitNum] = useState(6);
  const [pokes, setPokes] = useState<Poke[]>([...Array(initNum)].map(() => new Poke()));

  const setInit = () =>
    setPokes((prevs) =>
      prevs.map((poke, i) => {
        poke.init = (prevs[i - 1]?.subtotal ?? 0) + (prevs[i - 1]?.init ?? 0) - (prevs[i - initNum]?.subtotal ?? 0);
        return poke;
      })
    );

  const addPoke = () => {
    setPokes([...pokes, new Poke()]);
    setInit();
  };

  const handleChange = useCallback(
    (index: number, key: Key, num: number) => {
      setPokes(
        pokes.map((poke, i) => {
          if (i === index) {
            const newPoke = new Poke(poke);
            newPoke[key] = num;
            return newPoke;
          } else {
            return poke;
          }
        })
      );
      setInit();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [pokes]
  );

  const handleChangeName = useCallback(
    (index: number, name: string) => {
      setPokes(
        pokes.map((poke, i) => {
          if (i === index) {
            const newPoke = new Poke(poke);
            newPoke.name = name;
            return newPoke;
          } else {
            return poke;
          }
        })
      );
    },
    [pokes]
  );

  return (
    <>
      <div>
        <input
          type="number"
          value={initNum}
          onChange={(e) => {
            const num = e.target.valueAsNumber;
            if (num > 0) setInitNum(num);
          }}
        ></input>
        <button
          onClick={() => {
            setPokes([...Array(initNum)].map(() => new Poke()));
          }}
        >
          Init
        </button>
        <button
          onClick={() => {
            setInitNum(1);
            setPokes([new Poke()]);
          }}
        >
          Reset
        </button>
      </div>
      <table className="w-full table-auto">
        <thead className="text-center">
          <tr>
            <th>Name</th>
            <th>+1</th>
            <th>+2</th>
            <th>+3</th>
            <th>Init.</th>
            <th>Subt.</th>
            <th>Total</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {pokes.map((poke, i) => (
            <TableRow
              key={"poke-" + i}
              poke={poke}
              onChange={(key: Key, num: number) => handleChange(i, key, num)}
              onChangeName={(name: string) => handleChangeName(i, name)}
            />
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addPoke}>
        Add
      </button>
    </>
  );
};

const TableRow = ({ poke, onChange, onChangeName }: RowProps) => {
  const handleChange = useCallback((key: Key, num: number) => onChange(key, num), [onChange]);

  const handleChangeName = useCallback((name: string) => onChangeName(name), [onChangeName]);

  return (
    <tr>
      <td>
        <input type="text" value={poke.name} className="w-full" onChange={(e) => handleChangeName(e.target.value)} />
      </td>
      {["p1", "p2", "p3"].map((key) => (
        <td key={key}>
          <input
            type="number"
            value={poke[key as Key]}
            className="w-full"
            onChange={(e) => {
              const num = e.target.valueAsNumber;
              if (num >= 0) handleChange(key as Key, e.target.valueAsNumber);
            }}
          />
        </td>
      ))}
      <td>{poke.init}</td>
      <td>{poke.subtotal}</td>
      <td className={poke.total >= 252 ? "bg-yellow-300" : ""}>{poke.total}</td>
      <td className={poke.total >= 252 ? "bg-yellow-300" : ""}>{poke.total >= 252 ? "OK!" : ""}</td>
    </tr>
  );
};

export default ExpCalc;
