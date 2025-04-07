
import { supabase } from "@/integrations/supabase/client";

export interface SheetData {
  headers: string[];
  rows: Record<string, string>[];
  sheetName: string;
}

// Default Sheet ID - can be overridden when calling functions
let currentSheetId = "1olSuKVcD6e-I9AI7qWR41d-gaHYKtn2PU_9B-uKYcl0";

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
      throw new Error(error.message);
    }

    // Update the current sheet ID if successful and a new one was provided
    if (sheetId) {
      currentSheetId = sheetId;
    }

    console.log("Sheets fetched successfully:", data.sheets);
    return data.sheets || [];
  } catch (err) {
    console.error("Failed to fetch sheets:", err);
    throw new Error(`Failed to fetch sheets: ${err.message || "Unknown error"}`);
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
      throw new Error(`Sheet with ID ${sheetId} not found`);
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
      throw new Error(error.message);
    }

    console.log("Sheet data fetched successfully");
    if (!data || !data.headers || !data.rows) {
      throw new Error("Invalid data format returned from API");
    }

    return {
      headers: data.headers || [],
      rows: data.rows || [],
      sheetName: data.sheetName || sheet.name,
    };
  } catch (err) {
    console.error("Failed to fetch sheet data:", err);
    throw new Error(`Failed to fetch sheet data: ${err.message || "Unknown error"}`);
  }
};

// Find a specific row by ID in the sheet data
export const findRowById = (
  sheetData: SheetData, 
  idColumnName: string, 
  searchId: string
): Record<string, string> | null => {
  if (!sheetData || !sheetData.rows || !searchId) return null;
  
  return sheetData.rows.find(row => 
    row[idColumnName] && row[idColumnName].toLowerCase() === searchId.toLowerCase()
  ) || null;
};
