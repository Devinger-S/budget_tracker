import { ReactNode } from "react";

export default async function WizardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center">
      {children}
    </section>
  );
}
