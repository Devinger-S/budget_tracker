import { IconPigMoney } from "@tabler/icons-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex justify-center items-center gap-2">
      <IconPigMoney className="hidden md:block" size={36} stroke={1.5} />
      <p className=" bg-gradient-to-r from-amber-400 mb-0 to-orange-500 bg-clip-text text-2xl sm:text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Budget Tracker
      </p>
    </Link>
  );
}
