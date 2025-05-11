
// Configuration for Google Sheets integration
// Stores API key, sheet ID and selected columns

// Default configuration values
const defaultConfig = {
  googleApiKey: 'YOUR_GOOGLE_API_KEY', // Replace with your actual API key
  sheetId: '1VvBc-6z-5ViSZfCxNYjV9MWvLtJ62kDG_S5tzJi26l0', // New Sheet ID provided by user
  selectedColumns: {
    firstColumn: 'Name', // Default first column to search by
    secondColumn: 'Email' // Default second column to search by
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

// Get the currently selected columns
export const getSelectedColumns = () => {
  const config = getConfig();
  return config.selectedColumns || { firstColumn: 'Name', secondColumn: 'Email' };
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
