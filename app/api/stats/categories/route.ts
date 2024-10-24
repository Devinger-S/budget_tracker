import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export async function GET(request:Request) {
    const session : Session | null = await auth()
    const userId = session?.user?.id
    if(!userId ) {
        redirect("/sign-in")
        
    }
    const {searchParams} = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const queryParams = OverviewQuerySchema.safeParse({from,to})
    if (!queryParams.success) {
        throw new Error(queryParams.error.message)
    }

    const stats = await getCategoriesStats(
        userId,
        queryParams.data.from,
        queryParams.data.to,
    )  

    return Response.json(stats)
}
export type getCategoriesStatsResponseType = Awaited<ReturnType<typeof getCategoriesStats>>
async function getCategoriesStats (
    userId:string,from:Date,to:Date
) {
    const stats = await prisma.transaction.groupBy({
        by: [

            "type","category","categoryIcon",
        ],
        where: {
            userId,
            date: {
                gte:from,
                lte:to
            },
        },
        _sum: {
            amount:true,
        },
        orderBy: {
            _sum: {
                amount:"desc",
            }
        }
    })
    return stats;
}