// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function BrainDumperPage() {
  const [userInput, setUserInput] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [outputPlan, setOutputPlan] = React.useState("");
  const [selectedTemplate, setSelectedTemplate] = React.useState("default");
  const [processingStatus, setProcessingStatus] = React.useState("");
  const { toast } = useToast();

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
      const response = await fetch("/api/brain-dumper/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: userInput,
          template: selectedTemplate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process idea");
      }

      setProcessingStatus("Processing your idea...");
      const data = await response.json();
      
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
        markdownLink.download = "brain-dumper-plan.md";
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
          jsonLink.download = "brain-dumper-plan.json";
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
        textLink.download = "brain-dumper-plan.txt";
        textLink.click();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Brain Dumper</h1>
      <p className="text-center mb-8 text-muted-foreground">
        Transform your unstructured ideas into structured app development plans
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Idea</CardTitle>
            <CardDescription>
              Dump your unstructured ideas here. The more details, the better the output.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full h-64 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={processIdea}
              disabled={isProcessing || !userInput.trim()}
            >
              {isProcessing ? processingStatus || "Processing..." : "Process My Idea"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Powered by DeepSeek R1 Distill Llama 70B
            </p>
          </CardFooter>
        </Card>

        {/* Output Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Structured Plan</CardTitle>
            <CardDescription>
              Your idea transformed into a structured development plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 p-4 border rounded-md overflow-auto bg-gray-50 dark:bg-gray-900">
              {isProcessing ? (
                <div className="text-center h-full flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mb-4"></div>
                    <p>{processingStatus || "Processing your idea..."}</p>
                  </div>
                </div>
              ) : outputPlan ? (
                <div className="whitespace-pre-wrap">{outputPlan}</div>
              ) : (
                <div className="text-muted-foreground text-center h-full flex items-center justify-center">
                  Your structured plan will appear here after processing
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-4">
              <p className="text-sm font-medium">Export Options:</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport("markdown")}
                  disabled={!outputPlan || isProcessing}
                >
                  Export as Markdown
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport("json")}
                  disabled={!outputPlan || isProcessing}
                >
                  Export as JSON
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport("text")}
                  disabled={!outputPlan || isProcessing}
                >
                  Export as Text
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Example Prompts Section */}
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Example Prompts</CardTitle>
          <CardDescription>
            Not sure where to start? Try one of these example prompts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="p-4 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => !isProcessing && setUserInput("I want to build a task management app with features like task creation, due dates, priority levels, and team collaboration.")}
            >
              <h3 className="font-medium mb-2">Task Management App</h3>
              <p className="text-sm text-muted-foreground">
                I want to build a task management app with features like task creation, due dates, priority levels, and team collaboration.
              </p>
            </div>
            <div 
              className="p-4 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => !isProcessing && setUserInput("I need a recipe app that lets users save recipes, create shopping lists, plan meals for the week, and discover new recipes based on ingredients they have.")}
            >
              <h3 className="font-medium mb-2">Recipe App</h3>
              <p className="text-sm text-muted-foreground">
                I need a recipe app that lets users save recipes, create shopping lists, plan meals for the week, and discover new recipes based on ingredients they have.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 