import { auth } from "@/auth"
import { GetFormatterForCurrency } from "@/lib/helpers"
import prisma from "@/lib/prisma"
import { OverviewQuerySchema } from "@/schema/overview"
import { Session } from "next-auth"
import { redirect } from "next/navigation"


export async function GET(request: Request) {
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

console.log(`queryParams`,queryParams.data.from,queryParams.data.to);

  const transactions = await getTransactionHistory(
    userId,queryParams.data.from, queryParams.data.to
  ) 
  return Response.json(transactions)
}
export type getTransactionHistoryResponseType = Awaited<ReturnType<typeof getTransactionHistory>>
async function getTransactionHistory(userId:string,from:Date,to:Date) {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId
    },
  })
  if (!userSettings) {
    throw new Error("user settings not found")
  }
  const formatter = GetFormatterForCurrency(userSettings.currency)
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte:from,
        lte:to,
      },
    },
    orderBy: {
      date:"desc"
    },
  })
  return transactions.map((transaction) => ({
    ...transaction,
    //lets format the amount whit the user currency
    formattedAmount:formatter.format(transaction.amount)
  }))
}


