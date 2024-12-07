// "use client";
import { Button } from "@/components/ui/button";
import { SignOut } from "../actions/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { auth } from "@/server/auth";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }
  session?.user.id;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1>Welcome {session.user.name} </h1>
      <h1>{session.user.email} Dashboard</h1>
      <p>Please to see your dashboard.</p>
      <SignOutButton />
    </div>
  );
}
