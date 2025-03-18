import { NextRequest, NextResponse } from "next/server";

// Template prompts for different output formats
const templates = {
  default: `You are an expert AI app development planner. Convert the following unstructured idea into a well-structured AI app development plan that can be directly fed into coding tools. Include:
1. Project Overview (brief, technical)
2. Core AI Features (with implementation details and code structure)
3. Technical Architecture (with specific file structure, components, and code organization)
4. Implementation Approach (focusing on coding patterns and implementation details)
5. Code Samples (include key snippets, APIs, or functions that would be central to implementation)

IMPORTANT: 
- Do NOT include any timeline estimates, phases with weeks/days, or calendars.
- Focus on technical details and code patterns that can be used directly in development.
- Structure your response as if it's a technical spec for a developer to immediately start coding.
- Keep your output clean and structured for direct copy-paste into coding tools.

Format the output in a clean, readable way with proper headings and bullet points.`,

  cursor: `You are an expert AI app development planner for Cursor IDE. Convert the following unstructured idea into a well-structured AI app development plan that can be directly used in Cursor. Include:
1. Project Structure (file organization and directory setup)
2. Core Components (with implementation details for AI features)
3. Technical Stack (focus on specific AI/ML technologies with code examples)
4. Implementation Guide (step-by-step coding approach with specific functions and API details)
5. Cursor-specific Features (code snippets that take advantage of Cursor's capabilities)

IMPORTANT: 
- Do NOT include any timeline estimates, phases with weeks/days, or calendars.
- Focus on technical details that Cursor can help implement, including specific code patterns.
- Structure your response to be immediately usable as a coding guide in Cursor.
- Include specific code organization that works well with Cursor's AI assistance.

Format the output in a clean, readable way with proper headings and bullet points.`,

  windsurf: `You are an expert AI app development planner for Windsurf. Convert the following unstructured idea into a well-structured AI app development plan that can be directly implemented in Windsurf. Include:
1. Project Structure (file organization and directory setup)
2. Core Components (with implementation details for AI features)
3. Technical Stack (focus on specific AI/ML technologies with code examples)
4. Implementation Guide (step-by-step coding approach with specific functions and API details)
5. Windsurf-specific Patterns (code snippets that take advantage of Windsurf's capabilities)

IMPORTANT: 
- Do NOT include any timeline estimates, phases with weeks/days, or calendars.
- Focus on technical details that Windsurf can help implement, including specific code patterns.
- Structure your response to be immediately usable as a coding guide in Windsurf.
- Include specific code organization that works well with Windsurf's AI assistance.

Format the output in a clean, readable way with proper headings and bullet points.`,

  lovable: `You are an expert AI app development planner focused on creating lovable AI products. Convert the following unstructured idea into a well-structured AI app development plan that prioritizes user delight and can be implemented directly. Include:
1. Project Structure (file organization focusing on user experience)
2. Core AI Components (with implementation details and user-facing features)
3. User Experience Architecture (frontend components, UI patterns, interaction flows)
4. Implementation Guide (with focus on code that delivers delightful experiences)
5. Testing Approach (code structure for evaluating user satisfaction and AI effectiveness)

IMPORTANT: 
- Do NOT include any timeline estimates, phases with weeks/days, or calendars.
- Focus on technical details that deliver user delight, including specific code patterns.
- Structure your response to be immediately usable as a coding guide.
- Include specific code examples for the most important user-facing features.

Format the output in a clean, readable way with proper headings and bullet points.`,

  tempo: `You are an expert AI app development planner focused on rapid AI development. Convert the following unstructured idea into a well-structured app development plan optimized for speed and efficiency that can be implemented immediately. Include:
1. MVP Project Structure (minimal viable file organization)
2. Essential Components (with implementation details only for critical AI features)
3. Technical Stack (focus on rapid development tools with code examples)
4. Fast Implementation Guide (streamlined coding approach with specific functions)
5. Technical Shortcuts (code patterns and reusable components to accelerate development)

IMPORTANT: 
- Do NOT include any timeline estimates, phases with weeks/days, or calendars.
- Focus on technical implementation that can be built quickly, including specific code patterns.
- Structure your response to be immediately usable as a coding guide.
- Include specific code examples for the most critical features only.

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
    const systemPrompt = "You are an expert AI app development planner that helps users structure their ideas into comprehensive technical plans for AI applications. Your output should be formatted for direct use in coding tools like Cursor, Windsurf, or Tempo. IMPORTANT: Never include timeline estimates, phases with week/day durations, or scheduling information. Focus entirely on technical implementation approaches, code organization, file structure, and specific code patterns.";
    const userPrompt = `${templatePrompt}\n\nHere's the idea:\n${input}\n\nIMPORTANT: Format your response to be immediately usable by AI coding tools. Include code examples where appropriate. NEVER include any timeline estimates or numbered phases with durations. The response should be IMMEDIATELY USABLE by AI coding tools without further editing.`;

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