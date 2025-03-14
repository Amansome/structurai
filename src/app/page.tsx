// @ts-nocheck
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <h1 
          className={`text-5xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          Welcome to StructurAI
        </h1>
        <p 
          className={`text-xl text-center max-w-2xl text-gray-600 dark:text-gray-300 mb-8 transition-all duration-1000 delay-300 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          Transform your unstructured ideas into structured app development plans
        </p>
        <div 
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Link 
            href="/structurai" 
            className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg font-medium"
          >
            Try StructurAI
          </Link>
        </div>
        
        {/* Feature description */}
        <div 
          className={`mt-16 w-full max-w-4xl transition-all duration-1000 delay-700 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">What is StructurAI?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              StructurAI is an AI-powered tool that helps you transform your ideas into structured app development plans. 
              Simply describe your idea, and StructurAI will generate a comprehensive plan including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Project structure and architecture</li>
              <li>Component breakdown</li>
              <li>Implementation steps</li>
              <li>Technology recommendations</li>
              <li>Potential challenges and solutions</li>
            </ul>
            <Link 
              href="/structurai" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Get Started Now
            </Link>
          </div>
        </div>
        
        <div 
          className={`mt-16 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent transition-all duration-1000 delay-900 ${
            isLoaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
        />
        
        <p 
          className={`mt-8 text-sm text-gray-500 dark:text-gray-400 transition-all duration-1000 delay-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          Powered by DeepSeek R1 Distill Llama 70B
        </p>
      </div>
      
      {/* Background elements */}
      <div 
        className={`absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-500 opacity-10 blur-3xl transition-all duration-2000 ${
          isLoaded ? "opacity-10" : "opacity-0"
        }`}
      />
      <div 
        className={`absolute bottom-20 right-20 w-80 h-80 rounded-full bg-indigo-500 opacity-10 blur-3xl transition-all duration-2000 delay-300 ${
          isLoaded ? "opacity-10" : "opacity-0"
        }`}
      />
    </main>
  );
}
