"use server"

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Session, User } from "next-auth";
import { redirect } from "next/navigation";

export async function deleteTransaction(id:string) {
  
    const session: Session | null = await auth();

  const user: User | undefined = session?.user;

  if (!user) {
    redirect ("/sign-in")
  }
  const transaction = await prisma.transaction.findUnique({
    where: {
      userId:user.id,
      id,
    }, 
  })
  if (!transaction) {
    throw new Error("bad request")
  }
 
  console.log(`this transaction from deleteTrasaction : ${transaction}`);
  
  await prisma.$transaction([
    //Delete transaction
    prisma.transaction.delete({
      where:{
        id,
        userId:user.id,
      }
    }),
    //Update month history
    prisma.monthHistory.update({
      where:{
        day_month_year_userId: {
          userId:user.id as string,
          day:transaction.date.getUTCDate(),
          month:transaction.date.getUTCMonth(),
          year:transaction.date.getUTCFullYear(),
        }
      },
      data:{
        ...(transaction.type === "expense" && {
          expense: {
            decrement:transaction.amount
          }
        }),
         ...(transaction.type === "income" && {
          income: {
            increment:transaction.amount
          }
        }),
      },
    }),
    prisma.yearHistory.update({
      where:{
        month_year_userId: {
          userId:user.id as string,
          month:transaction.date.getUTCMonth(),
          year:transaction.date.getUTCFullYear(),
        }
      },
      data:{
        ...(transaction.type === "expense" && {
          expense: {
            decrement:transaction.amount
          }
        }),
         ...(transaction.type === "income" && {
          income: {
            increment:transaction.amount
          }
        }),
      },
    })
  ])

    
}
