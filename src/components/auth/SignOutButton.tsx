import { signOut } from "@/server/auth";
import { Button } from "../ui/button";
import { ActionButton } from "../global/ActionButton";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <ActionButton 
       label="Sign out"
       loadingText="Please wait"
       variant="default"
       className="w-full"
      />
      <Button type="submit">Signout</Button>
    </form>
  );
}
