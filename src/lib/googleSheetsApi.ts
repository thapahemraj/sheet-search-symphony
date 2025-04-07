
// This file handles interactions with the Google Sheets API

export interface SheetData {
  headers: string[];
  rows: Record<string, string>[];
  sheetName: string;
}

// Mock data for development - replace with actual API calls when connecting to real Google Sheets
const MOCK_SHEETS = [
  {
    id: "sheet1",
    name: "Customer Data"
  },
  {
    id: "sheet2",
    name: "Product Inventory"
  },
  {
    id: "sheet3",
    name: "Sales Records"
  }
];

const MOCK_SHEET_DATA: Record<string, SheetData> = {
  sheet1: {
    sheetName: "Customer Data",
    headers: ["ID", "Name", "Email", "Phone", "Subscription Plan", "Signup Date"],
    rows: [
      { ID: "CUST001", Name: "John Smith", Email: "john@example.com", Phone: "555-123-4567", "Subscription Plan": "Premium", "Signup Date": "2023-01-15" },
      { ID: "CUST002", Name: "Sarah Johnson", Email: "sarah@example.com", Phone: "555-234-5678", "Subscription Plan": "Basic", "Signup Date": "2023-02-21" },
      { ID: "CUST003", Name: "Miguel Rodriguez", Email: "miguel@example.com", Phone: "555-345-6789", "Subscription Plan": "Premium", "Signup Date": "2023-03-08" },
      { ID: "CUST004", Name: "Lisa Chen", Email: "lisa@example.com", Phone: "555-456-7890", "Subscription Plan": "Enterprise", "Signup Date": "2023-01-30" },
      { ID: "CUST005", Name: "David Kim", Email: "david@example.com", Phone: "555-567-8901", "Subscription Plan": "Basic", "Signup Date": "2023-04-12" },
    ]
  },
  sheet2: {
    sheetName: "Product Inventory",
    headers: ["SKU", "Product Name", "Category", "Price", "Stock Quantity", "Last Restocked"],
    rows: [
      { SKU: "PROD100", "Product Name": "Wireless Earbuds", Category: "Electronics", Price: "79.99", "Stock Quantity": "45", "Last Restocked": "2023-05-05" },
      { SKU: "PROD101", "Product Name": "Fitness Tracker", Category: "Wearables", Price: "129.99", "Stock Quantity": "32", "Last Restocked": "2023-05-10" },
      { SKU: "PROD102", "Product Name": "Smart Water Bottle", Category: "Accessories", Price: "39.99", "Stock Quantity": "78", "Last Restocked": "2023-05-08" },
      { SKU: "PROD103", "Product Name": "Portable Charger", Category: "Electronics", Price: "49.99", "Stock Quantity": "53", "Last Restocked": "2023-05-12" },
      { SKU: "PROD104", "Product Name": "Bluetooth Speaker", Category: "Electronics", Price: "89.99", "Stock Quantity": "21", "Last Restocked": "2023-05-02" },
    ]
  },
  sheet3: {
    sheetName: "Sales Records",
    headers: ["Order ID", "Customer ID", "Products", "Total Amount", "Date", "Status"],
    rows: [
      { "Order ID": "ORD5001", "Customer ID": "CUST002", Products: "PROD101, PROD103", "Total Amount": "179.98", Date: "2023-05-15", Status: "Shipped" },
      { "Order ID": "ORD5002", "Customer ID": "CUST005", Products: "PROD100", "Total Amount": "79.99", Date: "2023-05-16", Status: "Processing" },
      { "Order ID": "ORD5003", "Customer ID": "CUST001", Products: "PROD102, PROD104", "Total Amount": "129.98", Date: "2023-05-14", Status: "Delivered" },
      { "Order ID": "ORD5004", "Customer ID": "CUST003", Products: "PROD101", "Total Amount": "129.99", Date: "2023-05-17", Status: "Processing" },
      { "Order ID": "ORD5005", "Customer ID": "CUST004", Products: "PROD100, PROD102, PROD103", "Total Amount": "169.97", Date: "2023-05-13", Status: "Shipped" },
    ]
  }
};

// Get available sheets
export const getAvailableSheets = async (): Promise<{id: string, name: string}[]> => {
  // In a real implementation, this would call the Google Sheets API
  // For now, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SHEETS);
    }, 800); // Simulate network delay
  });
};

// Get data from a specific sheet
export const getSheetData = async (sheetId: string): Promise<SheetData | null> => {
  // In a real implementation, this would call the Google Sheets API with the sheetId
  // For now, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SHEET_DATA[sheetId] || null);
    }, 1000); // Simulate network delay
  });
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
