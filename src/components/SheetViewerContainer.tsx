
import { useState, useEffect } from "react";
import { getSheetData, findRowById, SheetData, getAvailableSheets } from "@/lib/googleSheetsApi";
import SheetSelector from "./SheetSelector";
import SearchBar from "./SearchBar";
import ResultsDisplay from "./ResultsDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import GoogleSheetsDialog from "./GoogleSheetsDialog";
import { Button } from "@/components/ui/button";
import { Settings, Database } from "lucide-react";

const SheetViewerContainer = () => {
  const [selectedSheetId, setSelectedSheetId] = useState<string>("");
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [searchResult, setSearchResult] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [idColumnName, setIdColumnName] = useState("ID");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSheetId, setCurrentSheetId] = useState<string>("1olSuKVcD6e-I9AI7qWR41d-gaHYKtn2PU_9B-uKYcl0");
  const [availableSheets, setAvailableSheets] = useState<{id: string, name: string}[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadAvailableSheets();
  }, [currentSheetId]);

  const loadAvailableSheets = async () => {
    try {
      setLoading(true);
      const sheets = await getAvailableSheets(currentSheetId);
      setAvailableSheets(sheets);
    } catch (error) {
      console.error("Failed to load available sheets:", error);
      toast({
        title: "Error",
        description: "Could not load sheets. Please check the Sheet ID.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSheetSelect = async (sheetId: string) => {
    setSelectedSheetId(sheetId);
    setSearchResult(null);
    setSearchPerformed(false);
    setError(null);
    
    try {
      setLoading(true);
      const data = await getSheetData(sheetId);
      setSheetData(data);
      
      // Set the ID column name (assuming first column is the ID)
      if (data && data.headers.length > 0) {
        setIdColumnName(data.headers[0]);
      }
      
      toast({
        title: "Sheet loaded",
        description: `Successfully loaded ${data?.sheetName || sheetId}`,
      });
    } catch (err) {
      console.error("Failed to load sheet data:", err);
      setError("Failed to load sheet data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load sheet data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchId: string) => {
    if (!sheetData) {
      setError("Please select a sheet first");
      return;
    }

    setSearchPerformed(true);
    setLoading(true);
    setError(null);

    try {
      // Simulate network delay
      setTimeout(() => {
        const result = findRowById(sheetData, idColumnName, searchId);
        setSearchResult(result);
        setLoading(false);

        if (!result) {
          toast({
            title: "No results found",
            description: `No record matching '${searchId}' was found`,
          });
        }
      }, 800);
    } catch (err) {
      console.error("Search error:", err);
      setError("An error occurred during search. Please try again.");
      setLoading(false);
      toast({
        title: "Search Error",
        description: "Failed to perform search",
        variant: "destructive",
      });
    }
  };

  const handleSheetIdChange = async (newSheetId: string) => {
    try {
      setCurrentSheetId(newSheetId);
      setSelectedSheetId("");
      setSheetData(null);
      setSearchResult(null);
      setSearchPerformed(false);
      
      toast({
        title: "Connecting to Sheet",
        description: "Trying to connect to the specified Google Sheet...",
      });
      
      // Reload available sheets with the new sheet ID will happen via useEffect
    } catch (err) {
      console.error("Failed to connect to sheet:", err);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Google Sheet. Please check the ID and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl">
      <Card className="overflow-hidden border-b-4 border-green-500 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200 to-transparent opacity-30 rounded-bl-full"></div>
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-blue-50">
          <div className="z-10">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent">
              Google Sheet Data Viewer
            </CardTitle>
            <CardDescription className="text-blue-700">
              Select a sheet and search by ID to view the data
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsDialogOpen(true)}
            title="Configure Google Sheet"
            className="border-green-300 bg-green-50 hover:bg-green-100 text-green-700 z-10"
          >
            <Settings className="h-4 w-4" />
          </Button>
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
            <h3 className="text-lg font-medium mb-2 text-green-700">2. Search by {idColumnName}</h3>
            <SearchBar 
              onSearch={handleSearch} 
              disabled={!selectedSheetId || loading} 
              idColumnName={idColumnName}
            />
          </div>
        </CardContent>
      </Card>

      <ResultsDisplay
        result={searchResult}
        headers={sheetData?.headers || []}
        loading={loading}
        error={error}
        searchPerformed={searchPerformed}
      />

      <GoogleSheetsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSheetIdSubmit={handleSheetIdChange}
        defaultSheetId={currentSheetId}
      />
    </div>
  );
};

export default SheetViewerContainer;
