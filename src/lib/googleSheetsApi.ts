
import { getConfig } from './config';

export interface SheetData {
  headers: string[];
  rows: Record<string, string>[];
  sheetName: string;
}

// Get available sheets in the spreadsheet
export const getAvailableSheets = async (sheetIdParam?: string): Promise<{id: string, name: string}[]> => {
  const config = getConfig();
  // Use the provided sheetId parameter or fall back to the one in config
  const sheetId = sheetIdParam || config.sheetId;
  const { googleApiKey } = config;
  
  if (!googleApiKey || !sheetId) {
    console.error('Missing API key or Sheet ID in configuration');
    return [];
  }
  
  try {
    console.log(`Fetching available sheets for Sheet ID: ${sheetId}...`);
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${googleApiKey}`
    );
    
    if (!response.ok) {
      console.error("Error fetching sheets:", await response.text());
      return [];
    }

    const data = await response.json();
    const sheets = data.sheets.map((sheet: any) => ({
      id: sheet.properties.sheetId.toString(),
      name: sheet.properties.title,
    }));

    console.log("Sheets fetched successfully:", sheets);
    return sheets;
  } catch (err) {
    console.error("Failed to fetch sheets:", err);
    return [];
  }
};

// Get data from a specific sheet
export const getSheetData = async (sheetId: string): Promise<SheetData> => {
  const config = getConfig();
  const { googleApiKey } = config;
  
  try {
    console.log(`Fetching data for sheet ID: ${sheetId}`);
    const sheets = await getAvailableSheets();
    const sheet = sheets.find(s => s.id === sheetId);
    
    if (!sheet) {
      return { headers: [], rows: [], sheetName: "Unknown Sheet" };
    }

    console.log(`Found sheet: ${sheet.name}, fetching data...`);
    const encodedSheetName = encodeURIComponent(sheet.name);
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${encodedSheetName}?key=${config.googleApiKey}`
    );

    if (!response.ok) {
      console.error("Error fetching sheet data:", await response.text());
      return { headers: [], rows: [], sheetName: sheet.name };
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      console.log("No data returned from API");
      return { headers: [], rows: [], sheetName: sheet.name };
    }

    const headers = data.values[0];
    const rows = data.values.slice(1).map((row: any[]) => {
      const rowObj: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        rowObj[header] = row[index] || '';
      });
      return rowObj;
    });

    console.log("Sheet data fetched successfully");
    
    return {
      headers,
      rows,
      sheetName: sheet.name,
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
