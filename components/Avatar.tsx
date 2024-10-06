"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";
import {
  AvatarFallback,
  AvatarImage,
  Avatar as RootAvatar,
} from "@/components/ui/avatar";
import { ButtonServerAction } from "./ButtonServerAction";
import { signOut } from "next-auth/react";

export const Avatar = ({ user }: { user: Session["user"] }) => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <RootAvatar>
        {user?.image && (
          <AvatarImage src={user.image} referrerPolicy="no-referrer" />
        )}
        {!user?.image && <AvatarFallback>{user?.name}</AvatarFallback>}
        {!user && <AvatarFallback>??</AvatarFallback>}
      </RootAvatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
      <ButtonServerAction onClick={async () => await signOut()}>
        Log Out
      </ButtonServerAction>
    </DropdownMenuContent>
  </DropdownMenu>
);
