"use server"

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionShemaType } from "@/schema/transaction";
import { Session, User } from "next-auth";
import { redirect } from "next/navigation";


export async function CreateTransaction(form:CreateTransactionShemaType) {
    const parsedBody = CreateTransactionSchema.safeParse(form)
    console.log("parsedBody",parsedBody)

    if (!parsedBody.success) {throw new Error(parsedBody.error.message)}

  const session: Session | null = await auth();
    const user: User | undefined = session?.user;

    if (!user) {redirect("/sign-in")}

    const {amount,category,date,description,type} = parsedBody.data

    const categoryRow = await prisma.category.findFirst({
        where: {
            userId:user.id,
            name:category,
        }
    })

    if (!categoryRow) {throw new Error("Category not found")}

    await prisma.$transaction([
        prisma.transaction.create({
            data: {
                userId:user.id as string,
                amount,
                date,
                description: description || '',
                type,
                category:categoryRow.name,
                categoryIcon:categoryRow.icon,
            }
        }),

        // Update month aggregate 

        prisma.monthHistory.upsert({
            where: {
                day_month_year_userId: {
                    userId:user.id as string,
                    day:date.getDate(),
                    month:date.getMonth(),
                    year:date.getFullYear(),
                },
            },
            create: {
                userId:user.id  as string,
                day: date.getDate(),
                 month:date.getMonth(),
                    year:date.getFullYear(),
                    expense: type === "expense" ? amount : 0 ,
                    income: type === "income" ? amount : 0,
            },
            update: {
                expense: {
                    increment: type === "expense" ? amount : 0
                },
                income: {
                    increment: type === "income" ? amount : 0
                }
            }
        }),

        //Update year aggregate 

        prisma.yearHistory.upsert({
            where: {
                
                month_year_userId: {
                    userId:user.id as string,
                    month:date.getUTCMonth(),
                    year:date.getUTCFullYear(),
                },
            },
            create: {
                userId:user.id  as string,
                 month:date.getUTCMonth(),
                    year:date.getUTCFullYear(),
                    expense: type === "expense" ? amount : 0 ,
                    income: type === "income" ? amount : 0,
            },
            update: {
                expense: {
                    increment: type === "expense" ? amount : 0
                },
                income: {
                    increment: type === "income" ? amount : 0
                }
            }
        }),
    ])

}