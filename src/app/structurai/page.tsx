// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function StructurAIPage() {
  const [userInput, setUserInput] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [outputPlan, setOutputPlan] = React.useState("");
  const [selectedTemplate, setSelectedTemplate] = React.useState("default");
  const [processingStatus, setProcessingStatus] = React.useState("");
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [viewMode, setViewMode] = React.useState("plain");
  const { toast } = useToast();

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Reset expanded state when new output is received
  React.useEffect(() => {
    if (outputPlan) {
      setIsExpanded(false);
    }
  }, [outputPlan]);

  const templates = [
    { id: "default", name: "Default" },
    { id: "cursor", name: "Cursor" },
    { id: "windsurf", name: "Windsurf" },
    { id: "lovable", name: "Lovable" },
    { id: "tempo", name: "Tempo" },
  ];

  const processIdea = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter your idea before processing.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingStatus("Sending request to DeepSeek AI...");
    setOutputPlan("");
    
    try {
      const response = await fetch("/api/structurai/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: userInput,
          template: selectedTemplate,
        }),
      });

      setProcessingStatus("Processing your idea...");
      
      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`);
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status} ${response.statusText}`);
      }
      
      if (!data.output) {
        throw new Error("No output received from API");
      }
      
      setOutputPlan(data.output);
      toast({
        title: "Success!",
        description: "Your idea has been processed successfully.",
      });
    } catch (error) {
      console.error("Error processing idea:", error);
      toast({
        title: "Processing Error",
        description: error.message || "There was an error processing your idea. Please try again.",
        variant: "destructive",
      });
      setOutputPlan("Error: " + (error.message || "Failed to process your idea. Please try again."));
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handleExport = (format: string) => {
    if (!outputPlan) {
      toast({
        title: "No Content",
        description: "Please generate a plan before exporting.",
        variant: "destructive",
      });
      return;
    }

    // Handle different export formats
    switch (format) {
      case "markdown":
        // Create and download markdown file
        const markdownBlob = new Blob([outputPlan], { type: "text/markdown" });
        const markdownUrl = URL.createObjectURL(markdownBlob);
        const markdownLink = document.createElement("a");
        markdownLink.href = markdownUrl;
        markdownLink.download = "structurai-plan.md";
        markdownLink.click();
        break;
      case "json":
        // Create and download JSON file
        try {
          // Attempt to parse the output as JSON
          const jsonData = { plan: outputPlan };
          const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
          const jsonUrl = URL.createObjectURL(jsonBlob);
          const jsonLink = document.createElement("a");
          jsonLink.href = jsonUrl;
          jsonLink.download = "structurai-plan.json";
          jsonLink.click();
        } catch (error) {
          toast({
            title: "Export Error",
            description: "Could not export as JSON. Please try another format.",
            variant: "destructive",
          });
        }
        break;
      default:
        // Default to plain text
        const textBlob = new Blob([outputPlan], { type: "text/plain" });
        const textUrl = URL.createObjectURL(textBlob);
        const textLink = document.createElement("a");
        textLink.href = textUrl;
        textLink.download = "structurai-plan.txt";
        textLink.click();
    }
  };

  const copyToClipboard = () => {
    if (!outputPlan) {
      toast({
        title: "No Content",
        description: "Please generate a plan before copying.",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard.writeText(outputPlan)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Plan copied to clipboard successfully.",
        });
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        toast({
          title: "Copy Failed",
          description: "Failed to copy to clipboard. Please try again.",
          variant: "destructive",
        });
      });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "plain" ? "formatted" : "plain");
  };

  // Function to format the text with basic styling
  const formatText = (text) => {
    if (!text) return "";
    
    // Format headings (lines that are all uppercase or end with a colon)
    let formatted = text.split('\n').map(line => {
      // Check if line is a heading (all caps or ends with colon)
      if (/^[A-Z0-9\s]+$/.test(line.trim()) || /:\s*$/.test(line.trim())) {
        return `<h3 class="text-blue-600 dark:text-blue-400 font-bold mt-3 mb-1">${line}</h3>`;
      }
      
      // Format numbered lists
      if (/^\d+\.\s/.test(line)) {
        return `<div class="ml-4 my-1">${line}</div>`;
      }
      
      // Format bullet points
      if (/^[\*\-•]\s/.test(line)) {
        return `<div class="ml-4 my-1">${line}</div>`;
      }
      
      return `<div>${line}</div>`;
    }).join('');
    
    return formatted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container mx-auto py-8 px-4 relative">
        <h1 
          className={`text-4xl md:text-5xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          StructurAI
        </h1>
        <p 
          className={`text-center mb-8 text-gray-600 dark:text-gray-300 transition-all duration-1000 delay-200 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          Transform your unstructured ideas into structured app development plans
        </p>

        <div 
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-1000 delay-400 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Input Section */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">Your Idea</CardTitle>
              <CardDescription>
                Share your unstructured ideas here. The more details, the better the output.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                placeholder="Enter your app idea, feature list, or any unstructured thoughts..."
                value={userInput}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserInput(e.target.value)}
                disabled={isProcessing}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full">
                <p className="mb-2 text-sm font-medium">Select Template:</p>
                <div className="flex flex-wrap gap-2">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTemplate(template.id)}
                      disabled={isProcessing}
                      className={`transition-all duration-300 ${
                        selectedTemplate === template.id 
                          ? "bg-blue-600 hover:bg-blue-700 transform hover:scale-105" 
                          : "hover:bg-blue-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg rounded-full py-6"
                onClick={processIdea}
                disabled={isProcessing || !userInput.trim()}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {processingStatus || "Processing..."}
                  </div>
                ) : "Process My Idea"}
              </Button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Powered by DeepSeek R1 Distill Llama 70B
              </p>
            </CardFooter>
          </Card>

          {/* Output Section */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">Structured Plan</CardTitle>
              <CardDescription>
                Your idea transformed into a structured development plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`w-full ${isExpanded ? 'h-auto min-h-[400px]' : 'h-64'} p-4 border rounded-lg overflow-auto bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300`}>
                {isProcessing ? (
                  <div className="text-center h-full flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-blue-600 dark:text-blue-400">{processingStatus || "Processing your idea..."}</p>
                    </div>
                  </div>
                ) : outputPlan ? (
                  viewMode === "plain" ? (
                    <div className="whitespace-pre-wrap animate-fade-in font-mono text-sm">{outputPlan}</div>
                  ) : (
                    <div 
                      className="animate-fade-in text-sm" 
                      dangerouslySetInnerHTML={{ __html: formatText(outputPlan) }}
                    />
                  )
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-center h-full flex items-center justify-center">
                    Your structured plan will appear here after processing
                  </div>
                )}
              </div>
              {outputPlan && (
                <div className="flex justify-between items-center mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleExpand}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {isExpanded ? "Collapse" : "Expand"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleViewMode}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {viewMode === "plain" ? "Formatted View" : "Plain Text"}
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Export Options:</p>
                  {outputPlan && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={copyToClipboard}
                      className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Copy to Clipboard
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport("markdown")}
                    disabled={!outputPlan || isProcessing}
                    className="transition-all duration-300 hover:bg-blue-100 dark:hover:bg-gray-700 transform hover:scale-105"
                  >
                    Export as Markdown
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport("json")}
                    disabled={!outputPlan || isProcessing}
                    className="transition-all duration-300 hover:bg-blue-100 dark:hover:bg-gray-700 transform hover:scale-105"
                  >
                    Export as JSON
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport("text")}
                    disabled={!outputPlan || isProcessing}
                    className="transition-all duration-300 hover:bg-blue-100 dark:hover:bg-gray-700 transform hover:scale-105"
                  >
                    Export as Text
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Example Prompts Section */}
        <Card 
          className={`mt-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-1000 delay-600 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CardHeader>
            <CardTitle className="text-blue-600 dark:text-blue-400">Example Prompts</CardTitle>
            <CardDescription>
              Not sure where to start? Try one of these example prompts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className="p-4 border rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
                onClick={() => !isProcessing && setUserInput("I want to build a task management app with features like task creation, due dates, priority levels, and team collaboration.")}
              >
                <h3 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Task Management App</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  I want to build a task management app with features like task creation, due dates, priority levels, and team collaboration.
                </p>
              </div>
              <div 
                className="p-4 border rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
                onClick={() => !isProcessing && setUserInput("I need a recipe app that lets users save recipes, create shopping lists, plan meals for the week, and discover new recipes based on ingredients they have.")}
              >
                <h3 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Recipe App</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  I need a recipe app that lets users save recipes, create shopping lists, plan meals for the week, and discover new recipes based on ingredients they have.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Background elements */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-500 opacity-5 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-indigo-500 opacity-5 blur-3xl animate-pulse-slow animation-delay-2000" />
      </div>
      
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.05;
            transform: scale(1);
          }
          50% {
            opacity: 0.1;
            transform: scale(1.05);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
} 