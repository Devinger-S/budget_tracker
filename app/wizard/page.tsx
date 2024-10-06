// import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconProgress } from "@tabler/icons-react";
import Logo from "@/components/Logo";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default async function WizardPage() {
  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-4">
      <div className="">
        <h1 className="text-center text-3xl">
          {" "}
          {/* Welcome, <span className="font-bold ml-2">{user?.firstName}</span> */}
        </h1>
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          Let apos;s get started by setting up your currency
        </h2>
        <h3 className="mt-2 text-center text-sm text-muted-foreground">
          You can change these settings at any time
        </h3>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter>
          <IconProgress size={25} aria-label="25% increase" />
        </CardFooter>
      </Card>
      <Separator />
      <Button className="w-full" asChild>
        <Link href="/">I &apos m done!Take me to the dashboard</Link>
      </Button>
      <div className="mt-8">
        {" "}
        <Logo />
      </div>
    </div>
  );
}
