import { auth } from "@/auth";
import { ComboBoxResponsive } from "@/components/CurrencyCombobox";
import { Session } from "@auth/core/types";

export default async function DashboardPage() {
  const session: Session | null = await auth();
  const user = session?.user;

  return (
    <section id="dashboardPage">
      {user && <ComboBoxResponsive />}
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
    </section>
  );
}
