import { auth } from "@/server/auth"

export default async function Page () {
    const session = await auth();

    if (session?.user) {
        console.log(session.user)
    }

    return (
        <div>
            <h1>Hello World</h1>
            <p>This is a paragraph</p>
            <p>This is another paragraph</p>
            <p>This is a third paragraph</p>
        </div>
    )
}