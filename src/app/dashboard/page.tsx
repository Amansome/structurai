"use client";
import { Button } from "@/components/ui/button";
import { SignOut } from "../actions/auth";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1>Dashboard</h1>
      <p>Please log in to see your dashboard.</p>
      <Button onClick={() => SignOut()}>Signout</Button>
    </div>
  );
}
