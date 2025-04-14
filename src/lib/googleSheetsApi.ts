
import { supabase } from "@/integrations/supabase/client";
import { SHEET_CONFIG } from "@/config/sheetConfig";

export interface SheetData {
  headers: string[];
  rows: Record<string, string>[];
  sheetName: string;
}

// Use the configuration value for the Sheet ID
let currentSheetId = SHEET_CONFIG.defaultSheetId;

// Get available sheets in the spreadsheet
export const getAvailableSheets = async (sheetId?: string): Promise<{id: string, name: string}[]> => {
  const targetSheetId = sheetId || currentSheetId;
  
  try {
    console.log(`Fetching available sheets for Sheet ID: ${targetSheetId}...`);
    const { data, error } = await supabase.functions.invoke('google-sheets', {
      body: {
        action: "getAvailableSheets",
        sheetId: targetSheetId,
      }
    });

    if (error) {
      console.error("Error fetching available sheets:", error);
      return []; // Return empty array instead of throwing
    }

    // Update the current sheet ID if successful and a new one was provided
    if (sheetId) {
      currentSheetId = sheetId;
    }

    console.log("Sheets fetched successfully:", data?.sheets || []);
    return data?.sheets || [];
  } catch (err) {
    console.error("Failed to fetch sheets:", err);
    return []; // Return empty array instead of throwing
  }
};

// Get data from a specific sheet
export const getSheetData = async (sheetId: string): Promise<SheetData> => {
  try {
    console.log(`Fetching data for sheet ID: ${sheetId}`);
    // First, get the available sheets to find the sheet name
    const sheets = await getAvailableSheets();
    const sheet = sheets.find(s => s.id === sheetId);
    
    if (!sheet) {
      return {
        headers: [],
        rows: [],
        sheetName: "Unknown Sheet"
      };
    }

    console.log(`Found sheet: ${sheet.name}, fetching data...`);
    const { data, error } = await supabase.functions.invoke('google-sheets', {
      body: {
        action: "getSheetData",
        sheetId: currentSheetId,
        sheetName: sheet.name,
      }
    });

    if (error) {
      console.error("Error fetching sheet data:", error);
      return {
        headers: [],
        rows: [],
        sheetName: sheet.name
      };
    }

    if (!data) {
      console.log("No data returned from API");
      return {
        headers: [],
        rows: [],
        sheetName: sheet.name
      };
    }

    console.log("Sheet data fetched successfully:", data);
    
    return {
      headers: data.headers || [],
      rows: data.rows || [],
      sheetName: data.sheetName || sheet.name,
    };
  } catch (err) {
    console.error("Failed to fetch sheet data:", err);
    return {
      headers: [],
      rows: [],
      sheetName: "Error Sheet"
    };
  }
};

// Find rows by multiple criteria (e.g. name AND DOB)
export const findRowsByMultipleCriteria = (
  sheetData: SheetData,
  criteria: { field: string, value: string }[]
): Record<string, string> | null => {
  if (!sheetData || !sheetData.rows || criteria.length === 0) return null;
  
  return sheetData.rows.find(row => 
    criteria.every(criterion => 
      row[criterion.field] && 
      row[criterion.field].toLowerCase() === criterion.value.toLowerCase()
    )
  ) || null;
};
