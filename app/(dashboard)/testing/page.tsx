"use client";

import { DateToUTCDate } from "@/lib/helpers";
import { startOfMonth } from "date-fns";

export default function Testing() {
  const now = new Date();
  // const formatted = new Date(
  //   Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  // );

  const formatedDate = DateToUTCDate(now);
  return (
    <>
      <pre>{JSON.stringify(now, null, 2)}</pre>
      <pre>{JSON.stringify(formatedDate, null, 2)}</pre>
    </>
  );
}
