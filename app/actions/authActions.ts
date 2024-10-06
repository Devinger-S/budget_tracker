'use server'
import { signIn, signOut } from "@/auth"

export async function LogOut() {
  await signOut()
}
export async function SignIn() {
  await signIn()
}