
export interface SheetData {
  headers: string[];
  rows: Record<string, string>[];
  sheetName: string;
}

// Use the configuration value for the Sheet ID
let currentSheetId = import.meta.env.VITE_SHEET_ID || '';

// Get available sheets in the spreadsheet
export const getAvailableSheets = async (sheetId?: string): Promise<{id: string, name: string}[]> => {
  const targetSheetId = sheetId || currentSheetId;
  
  try {
    console.log(`Fetching available sheets for Sheet ID: ${targetSheetId}...`);
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${targetSheetId}?key=${import.meta.env.VITE_GOOGLE_API_KEY}`);
    
    if (!response.ok) {
      console.error("Error fetching sheets:", await response.text());
      return [];
    }

    const data = await response.json();
    const sheets = data.sheets.map((sheet: any) => ({
      id: sheet.properties.sheetId.toString(),
      name: sheet.properties.title,
    }));

    // Update the current sheet ID if successful and a new one was provided
    if (sheetId) {
      currentSheetId = sheetId;
    }

    console.log("Sheets fetched successfully:", sheets);
    return sheets;
  } catch (err) {
    console.error("Failed to fetch sheets:", err);
    return [];
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
    const encodedSheetName = encodeURIComponent(sheet.name);
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${currentSheetId}/values/${encodedSheetName}?key=${import.meta.env.VITE_GOOGLE_API_KEY}`
    );

    if (!response.ok) {
      console.error("Error fetching sheet data:", await response.text());
      return {
        headers: [],
        rows: [],
        sheetName: sheet.name
      };
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      console.log("No data returned from API");
      return {
        headers: [],
        rows: [],
        sheetName: sheet.name
      };
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
      headers: headers,
      rows: rows,
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
