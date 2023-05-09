"use client";

import { memo } from "react";

type TableProps = {
  className?: string;
  head: React.ReactNode;
  body: React.ReactNode;
};

function Table({ className, head, body }: TableProps) {
  return (
    <div className={className}>
      <table>
        <thead>{head}</thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
}

export default memo(Table);
