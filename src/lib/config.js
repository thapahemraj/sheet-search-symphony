
// Configuration for Google Sheets integration
// Stores API key, sheet ID and selected columns

// Default configuration values
const defaultConfig = {
  googleApiKey: 'YOUR_GOOGLE_API_KEY', // Replace with your actual API key
  sheetId: 'YOUR_SHEET_ID', // Replace with your actual Sheet ID
  selectedColumns: {
    firstColumn: '',
    secondColumn: ''
  }
};

// Get configuration from localStorage or use defaults
export const getConfig = () => {
  try {
    const storedConfig = localStorage.getItem('googleSheetsConfig');
    return storedConfig ? JSON.parse(storedConfig) : defaultConfig;
  } catch (error) {
    console.error('Failed to retrieve config:', error);
    return defaultConfig;
  }
};

// Save configuration to localStorage
export const saveConfig = (config) => {
  try {
    const newConfig = { ...getConfig(), ...config };
    localStorage.setItem('googleSheetsConfig', JSON.stringify(newConfig));
    return newConfig;
  } catch (error) {
    console.error('Failed to save config:', error);
    return getConfig();
  }
};

// Set the selected columns for searching
export const setSelectedColumns = (firstColumn, secondColumn) => {
  const config = getConfig();
  config.selectedColumns = {
    firstColumn,
    secondColumn
  };
  return saveConfig(config);
};

// Get the currently selected columns
export const getSelectedColumns = () => {
  const config = getConfig();
  return config.selectedColumns || { firstColumn: '', secondColumn: '' };
};

// Update the Google API key
export const setGoogleApiKey = (apiKey) => {
  const config = getConfig();
  config.googleApiKey = apiKey;
  return saveConfig(config);
};

// Update the Sheet ID
export const setSheetId = (sheetId) => {
  const config = getConfig();
  config.sheetId = sheetId;
  return saveConfig(config);
};
