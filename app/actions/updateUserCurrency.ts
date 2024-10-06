"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { UpdateUserCurrencySchema } from "@/schema/userSettings"
import { redirect } from "next/navigation"

export async function UpdateUserCurrency(currency:string) {
    const parsedBody = UpdateUserCurrencySchema.safeParse({
        currency
    })
    if (!parsedBody.success) {throw parsedBody.error};
    const session = await auth()
    if (!session) { redirect("/")}
    const userSettings = await prisma.userSettings.update({
        where: {userId:session?.user?.id},
        data: {currency}
    })
    return userSettings
    }

