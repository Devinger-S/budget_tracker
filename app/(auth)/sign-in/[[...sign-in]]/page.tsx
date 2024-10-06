import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function Page() {
  const session = auth();

  return (
    <>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignIn />
    </>
    // {user &&
    //   <p className="">user is signed in</p>
    // }
    // {!user && session.status !== "loading" && <SignInButton/>}
  );
}
// function SignInButton() {
//   return <Button onClick={() => signIn()}>Sign in</Button>;
// }
function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
    >
      <Button type="submit">Sign in</Button>
    </form>
  );
}
