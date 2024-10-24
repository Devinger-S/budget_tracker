import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Session, User } from "@auth/core/types";
import { CreateTransactionDialog } from "./_components/CreateTransactionDialog";
import Overview from "./_components/Overview";
import prisma from "@/lib/prisma";
import History from "./_components/History";

export default async function DashboardPage() {
  const session: Session | null = await auth();

  const user: User | undefined = session?.user;

  if (!user) {
    return;
  }
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: user?.id },
  });

  return (
    <section id="dashboardPage" className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8 pl-4">
          <p className="text-3xl font-bold text-card-foreground">
            Hello,{"  "}
            <span className=" bg-gradient-to-r from-amber-400 mb-0 to-orange-500 bg-clip-text text-2xl sm:text-3xl font-bold leading-tight tracking-tighter text-transparent">
              {user?.name ? user.name : "Stranger"}
            </span>{" "}
            👋
          </p>
          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              type="income"
              trigger={
                <Button
                  variant={"outline"}
                  className="border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-950 hover:text-white"
                >
                  New income 💰
                </Button>
              }
            />
            <CreateTransactionDialog
              type="expense"
              trigger={
                <Button
                  variant={"outline"}
                  className="border-rose-500 bg-rose-500 text-white hover:bg-rose-950 hover:text-white"
                >
                  New expense 😤
                </Button>
              }
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </section>
  );
}
