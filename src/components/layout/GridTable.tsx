"use client";

import { memo, ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

function GridTable({ className, children }: Props) {
  return <div className={`${className} grid-table grid grid-cols-19`}>{children}</div>;
}

export default memo(GridTable);
