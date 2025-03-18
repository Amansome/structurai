import { NextRequest, NextResponse } from "next/server";

// Template prompts for different output formats
const templates = {
  default: `You are an expert app development planner. Convert the following unstructured idea into a well-structured app development plan. Include:
1. Project Overview
2. Core Features (with detailed descriptions)
3. Technical Requirements
4. Development Roadmap
5. Potential Challenges

Format the output in a clean, readable way with proper headings and bullet points.`,

  cursor: `You are an expert app development planner for Cursor IDE. Convert the following unstructured idea into a well-structured app development plan specifically for Cursor. Include:
1. Project Overview
2. Core Features (with detailed descriptions)
3. Technical Stack (focus on technologies that work well with Cursor)
4. Development Roadmap
5. Cursor-specific Implementation Tips

Format the output in a clean, readable way with proper headings and bullet points.`,

  windsurf: `You are an expert app development planner for Windsurf. Convert the following unstructured idea into a well-structured app development plan specifically for Windsurf. Include:
1. Project Overview
2. Core Features (with detailed descriptions)
3. Technical Stack (focus on technologies that work well with Windsurf)
4. Development Roadmap
5. Windsurf-specific Implementation Tips

Format the output in a clean, readable way with proper headings and bullet points.`,

  lovable: `You are an expert app development planner focused on creating lovable products. Convert the following unstructured idea into a well-structured app development plan that prioritizes user delight. Include:
1. Project Overview
2. Core Features (with detailed descriptions of how they create user delight)
3. User Experience Considerations
4. Development Roadmap (prioritizing features that create immediate value)
5. Metrics for Measuring User Love

Format the output in a clean, readable way with proper headings and bullet points.`,

  tempo: `You are an expert app development planner focused on rapid development. Convert the following unstructured idea into a well-structured app development plan optimized for speed and efficiency. Include:
1. Project Overview
2. MVP Features (only the essential ones)
3. Technical Stack (focus on technologies that enable rapid development)
4. Accelerated Development Roadmap
5. Shortcuts and Time-saving Strategies

Format the output in a clean, readable way with proper headings and bullet points.`,
};

// Get API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;

// Set a longer timeout for the fetch request (2 minutes)
const FETCH_TIMEOUT = 120000; // 2 minutes in milliseconds

// Custom fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

export async function POST(request: NextRequest) {
  try {
    const { input, template = "default" } = await request.json();

    if (!input) {
      return NextResponse.json(
        { error: "Input is required" },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    console.log("API Key available (first 10 chars):", API_KEY.substring(0, 10) + "...");

    // Select the appropriate template
    const templatePrompt = templates[template as keyof typeof templates] || templates.default;
    
    // Construct the prompt
    const systemPrompt = "You are an expert app development planner that helps users structure their ideas into comprehensive development plans.";
    const userPrompt = `${templatePrompt}\n\nHere's the idea:\n${input}`;

    // Call the Gemini API
    let response;
    try {
      // Gemini API endpoint
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;
      
      // Prepare request body
      const requestBody = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\n${userPrompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
          topP: 0.9,
        },
      };
      
      console.log("Sending request to Gemini API...");
      
      // Use the custom fetch with timeout
      response = await fetchWithTimeout(
        geminiEndpoint, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
        FETCH_TIMEOUT
      );
      
      console.log("Gemini API response status:", response.status);
    } catch (fetchError: any) {
      console.error("Fetch error:", fetchError);
      
      // Check if the error is a timeout
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: "Request to Gemini API timed out. Please try again with a shorter input or try later." },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to connect to Gemini API: " + (fetchError instanceof Error ? fetchError.message : "Network error") },
        { status: 500 }
      );
    }

    // Handle non-JSON responses from Gemini
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Gemini non-JSON response:", textResponse);
      return NextResponse.json(
        { error: "Gemini API returned non-JSON response: " + textResponse.substring(0, 100) },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      return NextResponse.json(
        { error: "Failed to parse Gemini API response" },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error("Gemini API error:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Failed to process with Gemini API: " + (data.error?.message || data.message || "Unknown error") },
        { status: 500 }
      );
    }

    // Validate the response structure and extract the content
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
      console.error("Invalid Gemini API response structure:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Invalid response structure from Gemini API" },
        { status: 500 }
      );
    }
    
    // Process the response to ensure clean formatting
    let formattedOutput = data.candidates[0].content.parts[0].text;
    
    // Remove any potential markdown code block markers that might be included
    formattedOutput = formattedOutput.replace(/```[a-z]*\n/g, '').replace(/```/g, '');
    
    // Ensure consistent line breaks
    formattedOutput = formattedOutput.replace(/\r\n/g, '\n');
    
    return NextResponse.json({
      output: formattedOutput,
    });
  } catch (error) {
    console.error("Error processing idea:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
} 