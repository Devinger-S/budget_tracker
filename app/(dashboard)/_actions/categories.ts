"use server"

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreateCategorySchema, CreateCategorySchemaType } from "@/schema/categories";
import { Session, User } from "next-auth";
import { redirect } from "next/navigation";


export async function CreateCategory(form:CreateCategorySchemaType) {
    const parsedBody = CreateCategorySchema.safeParse(form);
    if(!parsedBody.success) {throw new Error('bad request')}

    const session: Session | null = await auth();
    const user: User | undefined = session?.user;

    if (!user) {redirect("/sign-in")}

    const {name,icon,type} = parsedBody.data

    return await prisma.category.create({
        data: {
            userId:user.id as string,
            name,
            icon,
            type,
        }
    })

}
