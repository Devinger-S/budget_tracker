import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Session } from "@auth/core/types";
import { revalidatePath } from "next/cache";


export async function GET(_request:Request) {
  const session:Session | null = await auth();
  const userId  = session?.user?.id

 
  
  let userSettings = await prisma.userSettings.findUnique({
    where: {
        userId,
    }
  });

  if(!userSettings && userId  ) {
    userSettings = await prisma.userSettings.create({
        data: {
            userId,
            currency: "RON"
        }
    })
  }
revalidatePath("/")
  return Response.json(userSettings)
}