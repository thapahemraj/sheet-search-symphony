
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, sheetId, sheetName, range } = await req.json();
    
    if (!GOOGLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Google API key is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "getAvailableSheets") {
      // Fetch spreadsheet metadata to get available sheets
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${GOOGLE_API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch sheets: ${errorText}`);
      }
      
      const data = await response.json();
      const sheets = data.sheets.map((sheet: any) => ({
        id: sheet.properties.sheetId.toString(),
        name: sheet.properties.title,
      }));
      
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
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch sheet data: ${errorText}`);
      }
      
      const data = await response.json();
      const values = data.values || [];
      
      if (values.length === 0) {
        return new Response(JSON.stringify({ headers: [], rows: [] }), {
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
      
      return new Response(
        JSON.stringify({ 
          sheetName, 
          headers, 
          rows 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
