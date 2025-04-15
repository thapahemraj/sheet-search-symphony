
export interface SheetConfiguration {
  googleApiKey: string;
  sheetId: string;
  selectedColumns: string[];
}

// Initial configuration with empty values
export const defaultConfig: SheetConfiguration = {
  googleApiKey: '',
  sheetId: '',
  selectedColumns: [],
};

// Store the configuration in localStorage
export const saveConfig = (config: Partial<SheetConfiguration>) => {
  const currentConfig = getConfig();
  const newConfig = { ...currentConfig, ...config };
  localStorage.setItem('sheetConfig', JSON.stringify(newConfig));
  return newConfig;
};

// Get the stored configuration
export const getConfig = (): SheetConfiguration => {
  const stored = localStorage.getItem('sheetConfig');
  if (!stored) {
    return defaultConfig;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultConfig;
  }
};

// Clear the configuration
export const clearConfig = () => {
  localStorage.removeItem('sheetConfig');
};
