import { signOut } from "@/server/auth";
import { Button } from "../ui/button";
import { ActionButton } from "../global/ActionButton";
import { redirect } from "next/navigation";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
        redirect("/signin")
      }}
    >
      <ActionButton
        label="Sign out"
        loadingText="Please wait"
        variant="destructive"
        className="w-full"
      />
    </form>
  );
}
