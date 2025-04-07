
import { supabase } from "@/integrations/supabase/client";

export interface SheetData {
  headers: string[];
  rows: Record<string, string>[];
  sheetName: string;
}

// Set your Google Sheet ID here
const SHEET_ID = "1olSuKVcD6e-I9AI7qWR41d-gaHYKtn2PU_9B-uKYcl0";

// Get available sheets in the spreadsheet
export const getAvailableSheets = async (): Promise<{id: string, name: string}[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-sheets', {
      body: {
        action: "getAvailableSheets",
        sheetId: SHEET_ID,
      }
    });

    if (error) {
      console.error("Error fetching available sheets:", error);
      throw new Error(error.message);
    }

    return data.sheets || [];
  } catch (err) {
    console.error("Failed to fetch sheets:", err);
    // Fallback to mock data for development if API fails
    return [
      { id: "0", name: "Sheet1" },
      { id: "1234567890", name: "Sheet2" },
      { id: "987654321", name: "Sheet3" }
    ];
  }
};

// Get data from a specific sheet
export const getSheetData = async (sheetId: string): Promise<SheetData | null> => {
  try {
    // First, get the available sheets to find the sheet name
    const sheets = await getAvailableSheets();
    const sheet = sheets.find(s => s.id === sheetId);
    
    if (!sheet) {
      throw new Error(`Sheet with ID ${sheetId} not found`);
    }

    const { data, error } = await supabase.functions.invoke('google-sheets', {
      body: {
        action: "getSheetData",
        sheetId: SHEET_ID,
        sheetName: sheet.name,
      }
    });

    if (error) {
      console.error("Error fetching sheet data:", error);
      throw new Error(error.message);
    }

    return {
      headers: data.headers || [],
      rows: data.rows || [],
      sheetName: data.sheetName,
    };
  } catch (err) {
    console.error("Failed to fetch sheet data:", err);
    // Return null on error, let the component handle this
    return null;
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
