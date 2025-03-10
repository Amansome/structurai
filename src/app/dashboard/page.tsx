import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect ("/signin")
  }

  const { name, email, image } = session.user;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-lg shadow-lg">
        <CardHeader className="flex justify-between items-center flex-row mb-2 bg-secondary p-2">
          Loggged user details
          <SignOutButton />
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="flex flex-col items-center mt-2">
            {image ? (
              <div className="mb-2 overflow-hidden rounded-full">
                <Image
                  src={image}
                  alt={`${name || "User"}'s profile picture`}
                  width={96}
                  height={96}
                  className="h-24 w-24 object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="mb-2 overflow-hidden rounded-full h-24 w-24 relative bg-secondary flex items-center justify-center">
                <Image
                  src="/placeholder-image.svg"
                  alt="Placeholder profile picture"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <h1 className="text-2xl font-bold">{name || "User"}</h1>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Email:{" "}
            <span className="font-medium text-foreground">
              {email || "No email"}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
