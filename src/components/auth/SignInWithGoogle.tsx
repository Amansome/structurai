import {signIn} from "next-auth/react";
import { ActionButton } from '../global/ActionButton';
import { Frame } from "lucide-react";

export function SignInWithGoogle() {
    const handleSignIn = async () => {
        await signIn("google");
      };

  return (
    <>
        <ActionButton 
        onClick={handleSignIn}
        icon={Frame} 
        label="Sign in with Google"
        loadingText="Please wait"
        variant="default"
        className="w-full"
        />
    </>
  );
}