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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-blue-600">Welcome {session.user.name || "User name"}!</h1>
      <p className=" text-gray-700">Your email is: {session.user.email || "No email"}</p>
      <p className="my-4 text-gray-600">Please explore your dashboard.</p>
      <SignOutButton/>
    </div>
  );
}
