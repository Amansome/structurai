// @ts-nocheck
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-xl text-center max-w-2xl text-muted-foreground mb-8">
          This is a placeholder dashboard for the StructurAI application
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
            <p className="text-muted-foreground">No projects yet. Create one using StructurAI.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link 
                href="/structurai" 
                className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
              >
                Create New Project
              </Link>
              <button 
                className="block w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                disabled
              >
                Import Project (Coming Soon)
              </button>
            </div>
          </div>
        </div>
        
        <Link 
          href="/" 
          className="mt-8 text-blue-600 hover:underline"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
