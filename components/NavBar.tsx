/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button, buttonVariants } from "@/components/ui/button";

import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeSwitcherBtn } from "./ThemeSwitchBtn";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { IconMenu } from "@tabler/icons-react";
import { Session } from "@auth/core/types";
import { Avatar } from "./Avatar";
import { ButtonServerAction } from "./ButtonServerAction";
import { SignIn } from "@/app/actions/authActions";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <>
      <DesktopNavbar user={session?.user} />
      <MobileNavbar user={session?.user} />
    </>
  );
}
const items = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
];
function DesktopNavbar({ user }: { user: Session["user"] }) {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className=" flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {items.map((item) => (
              <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          {user ? (
            <Avatar user={user} />
          ) : (
            <ButtonServerAction onClick={SignIn}>Sign In</ButtonServerAction>
          )}
        </div>
      </nav>
    </div>
  );
}
function MobileNavbar({ user }: { user: Session["user"] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <IconMenu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className=" p-12 sm:w-[540px]">
            {items.map((item) => (
              <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
                onClick={() => setIsOpen((prev) => !prev)}
              />
            ))}
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          {user ? (
            <Avatar user={user} />
          ) : (
            <ButtonServerAction onClick={SignIn}>Sign In</ButtonServerAction>
          )}
        </div>
      </nav>
    </div>
  );
}
function NavbarItem({
  link,
  label,
  onClick,
}: {
  link: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;
  return (
    <div className="relative flex items-center">
      <Link
        onClick={() => {
          if (onClick) onClick();
        }}
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg  text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block"></div>
      )}
    </div>
  );
}

// function SignIn() {
//   return (
//     <form
//       action={async () => {
//         "use server";
//         await signIn("google", { redirectTo: "/" });
//       }}
//     >
//       <Button type="submit">Sign in</Button>
//     </form>
//   );
// }
