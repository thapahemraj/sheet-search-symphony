
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Get the Google API key from environment variables
const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log that we're starting the request and check if API key exists
    console.log("Starting Google Sheets function");
    
    if (!GOOGLE_API_KEY) {
      console.error("Missing Google API key");
      return new Response(
        JSON.stringify({ error: "Google API key is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    const { action, sheetId, sheetName, range } = await req.json();
    console.log(`Processing ${action} request for sheet: ${sheetId}, ${sheetName || ""}`);
    
    if (action === "getAvailableSheets") {
      // Fetch spreadsheet metadata to get available sheets
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${GOOGLE_API_KEY}`;
      console.log(`Fetching sheets from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}): ${errorText}`);
        throw new Error(`Failed to fetch sheets: ${errorText}`);
      }
      
      const data = await response.json();
      const sheets = data.sheets.map((sheet: any) => ({
        id: sheet.properties.sheetId.toString(),
        name: sheet.properties.title,
      }));
      
      console.log(`Found ${sheets.length} sheets`);
      return new Response(JSON.stringify({ sheets }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } 
    else if (action === "getSheetData") {
      // Fetch data from specific sheet
      let apiRange = sheetName;
      if (range) {
        apiRange += `!${range}`;
      }
      
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${apiRange}?key=${GOOGLE_API_KEY}`;
      console.log(`Fetching sheet data from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}): ${errorText}`);
        throw new Error(`Failed to fetch sheet data: ${errorText}`);
      }
      
      const data = await response.json();
      const values = data.values || [];
      
      if (values.length === 0) {
        console.log("No data found in sheet");
        return new Response(JSON.stringify({ headers: [], rows: [], sheetName }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // First row as headers
      const headers = values[0];
      
      // Convert remaining rows to objects
      const rows = values.slice(1).map((row: any[]) => {
        const rowObj: Record<string, string> = {};
        headers.forEach((header: string, index: number) => {
          rowObj[header] = row[index] || '';
        });
        return rowObj;
      });
      
      console.log(`Successfully processed ${rows.length} rows with ${headers.length} columns`);
      return new Response(
        JSON.stringify({ 
          sheetName, 
          headers, 
          rows 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.error(`Invalid action: ${action}`);
    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
