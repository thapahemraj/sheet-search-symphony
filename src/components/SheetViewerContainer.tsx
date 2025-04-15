import { useState, useEffect } from "react";
import { getSheetData, findRowsByMultipleCriteria, SheetData, getAvailableSheets } from "@/lib/googleSheetsApi";
import SheetSelector from "./SheetSelector";
import SearchBar from "./SearchBar";
import ResultsDisplay from "./ResultsDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ConfigurationDialog from "./ConfigurationDialog";
import { Button } from "@/components/ui/button";
import { Settings, Database } from "lucide-react";
import { getConfig } from "@/lib/customization";

const SheetViewerContainer = () => {
  const [selectedSheetId, setSelectedSheetId] = useState<string>("");
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [searchResult, setSearchResult] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [availableSheets, setAvailableSheets] = useState<{id: string, name: string}[]>([]);
  const { toast } = useToast();

  const loadAvailableSheets = async () => {
    try {
      setLoading(true);
      const config = getConfig();
      if (!config.googleApiKey || !config.sheetId) {
        setIsDialogOpen(true);
        return;
      }
      
      const sheets = await getAvailableSheets();
      setAvailableSheets(sheets);
      
      if (sheets.length > 0) {
        toast({
          title: "Sheets Loaded",
          description: `Found ${sheets.length} sheets in the spreadsheet`,
        });
      }
    } catch (error) {
      console.error("Failed to load available sheets:", error);
      setAvailableSheets([]);
      toast({
        title: "Configuration Required",
        description: "Please configure your Google Sheets settings",
        variant: "destructive",
      });
      setIsDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailableSheets();
  }, []);

  const handleSheetSelect = async (sheetId: string) => {
    setSelectedSheetId(sheetId);
    setSearchResult(null);
    setSearchPerformed(false);
    setError(null);
    
    try {
      setLoading(true);
      console.log("Fetching data for selected sheet:", sheetId);
      const data = await getSheetData(sheetId);
      console.log("Sheet data received:", data);
      setSheetData(data);
      
      if (data && data.headers && data.headers.length > 0) {
        const possibleNameFields = ["name", "fullname", "full name", "full_name"];
        const possibleDobFields = ["dob", "dateofbirth", "date of birth", "birth date", "birthdate", "date_of_birth"];
        
        const detectedNameField = data.headers.find(h => 
          possibleNameFields.some(nf => h.toLowerCase().includes(nf.toLowerCase()))
        ) || data.headers[0];
        
        const detectedDobField = data.headers.find(h => 
          possibleDobFields.some(df => h.toLowerCase().includes(df.toLowerCase()))
        ) || data.headers[1] || data.headers[0];
        
        setNameField(detectedNameField);
        setDobField(detectedDobField);
      }
      
      toast({
        title: "Sheet loaded",
        description: `Successfully loaded ${data?.sheetName || sheetId}`,
      });
    } catch (err) {
      console.error("Failed to load sheet data:", err);
      setSheetData(null);
      toast({
        title: "Info",
        description: "Please select a valid sheet to continue",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (criteria: { field: string, value: string }[]) => {
    if (!sheetData) {
      toast({
        title: "Info",
        description: "Please select a sheet first",
        variant: "default",
      });
      return;
    }

    setSearchPerformed(true);
    setLoading(true);
    setError(null);

    try {
      setTimeout(() => {
        const result = findRowsByMultipleCriteria(sheetData, criteria);
        setSearchResult(result);
        setLoading(false);

        if (!result) {
          toast({
            title: "No results found",
            description: "No record matching all criteria was found",
          });
        }
      }, 800);
    } catch (err) {
      console.error("Search error:", err);
      setLoading(false);
      toast({
        title: "Search Info",
        description: "Couldn't find matching records",
        variant: "default",
      });
    }
  };

  const handleConfigSaved = () => {
    loadAvailableSheets();
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl">
      <Card className="overflow-hidden border-b-4 border-red-500 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200 to-transparent opacity-30 rounded-bl-full"></div>
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-blue-50">
          <div className="z-10">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent">
              Google Sheet Data Viewer
            </CardTitle>
            <CardDescription className="text-blue-700">
              Select a sheet and search by columns to view the data
            </CardDescription>
          </div>
          <div className="flex gap-2 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsDialogOpen(true)}
              title="Configure Google Sheet"
              className="border-green-300 bg-green-50 hover:bg-green-100 text-green-700"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-green-100">
            <h3 className="text-lg font-medium mb-2 text-green-700 flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              1. Select a Sheet
            </h3>
            <SheetSelector 
              onSheetSelect={handleSheetSelect} 
              availableSheets={availableSheets}
              loading={loading}
            />
          </div>
          
          <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-green-100">
            <h3 className="text-lg font-medium mb-2 text-green-700">2. Search Records</h3>
            <SearchBar 
              onSearch={handleSearch} 
              disabled={!selectedSheetId || loading}
              headers={sheetData?.headers || []}
            />
          </div>
        </CardContent>
      </Card>

      <ResultsDisplay
        result={searchResult}
        headers={sheetData?.headers || []}
        loading={loading}
        error={null}
        searchPerformed={searchPerformed}
      />

      <ConfigurationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfigSaved={handleConfigSaved}
      />
    </div>
  );
};

export default SheetViewerContainer;
