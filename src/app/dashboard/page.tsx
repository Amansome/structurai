// "use client";
import { Button } from "@/components/ui/button";
import { SignOut } from "../actions/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { auth } from "@/server/auth";
import { Card } from "@/components/ui/card";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }
  session?.user.id;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className=" rounded-lg p-6 shadow-lg">
      <h1 className="text-2xl font-bold">
        Welcome:{" "}
        <span className="text-blue-600">
          {session.user.name || "User name"}!
        </span>
      </h1>
      <p className="text-gray-700">
        Your email is: {" "}
        <span className="text-blue-600">
        {session.user.email || "No email"}
        </span>
      </p>
      <p className="my-4 text-gray-600">Please explore your dashboard.</p>
      <SignOutButton />
    </Card>
    </div>
  );
}
