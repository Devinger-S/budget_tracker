
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export async function GET() {
    const session : Session | null = await auth()
    const userId = session?.user?.id
    if(!userId ) {
        redirect("/sign-in")
        
    }
    const periods = await getHistoryPeriods(userId)
    return Response.json(periods)
}

export type GetHistoryPeriodsResponseType = Awaited<ReturnType<typeof getHistoryPeriods>>

async function getHistoryPeriods (
    userId:string,
) {
    const result = await prisma.monthHistory.findMany({
        where: {userId},
        select: {
            year:true,
        },
        distinct: ["year"],
        orderBy: [
            {
                year:"asc"
            }
        ]
    })
    const years = result.map(el => el.year)
    if (years.length === 0) {
        return [new Date().getFullYear()]
    }
    return years
}



    
    