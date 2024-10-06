import { auth } from "@/auth";
import Navbar from "@/components/NavBar";
import { ReactNode } from "react";

export default async function DashBoardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  return (
    <section className="relative flex h-screen w-full flex-col ">
      <Navbar session={session} />
      <div className="w-full">{children}</div>
    </section>
  );
}
