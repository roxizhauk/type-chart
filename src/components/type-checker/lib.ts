import data from "./type-chart.json";

export type TypeRatio = 0 | 0.5 | 1 | 2;

type ElementType<T> = T extends (infer U)[] ? U : never;
type TypeChart = Omit<ElementType<typeof data>, "effect" | "damage"> & {
  effect: TypeRatio[];
  damage: TypeRatio[];
};

export const typeChart = data as TypeChart[];

export type Option = ElementType<typeof options>;
export const options = typeChart.map(({ name }, id) => {
  const value = name.toLowerCase();
  return { id, value, label: name, color: `bg-${value}` };
});
