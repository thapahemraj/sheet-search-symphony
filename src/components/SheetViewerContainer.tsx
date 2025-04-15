
import { useState, useEffect } from "react";
import { getSheetData, findRowsByMultipleCriteria, SheetData, getAvailableSheets } from "@/lib/googleSheetsApi";
import SheetSelector from "./SheetSelector";
import SearchBar from "./SearchBar";
import ResultsDisplay from "./ResultsDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Database } from "lucide-react";

const SheetViewerContainer = () => {
  const [selectedSheetId, setSelectedSheetId] = useState<string>("");
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [searchResult, setSearchResult] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [availableSheets, setAvailableSheets] = useState<{id: string, name: string}[]>([]);
  const { toast } = useToast();

  const loadAvailableSheets = async () => {
    try {
      setLoading(true);
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
        title: "Error",
        description: "Failed to load sheets. Please check the configuration.",
        variant: "destructive",
      });
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
    
    try {
      setLoading(true);
      const data = await getSheetData(sheetId);
      setSheetData(data);
      
      toast({
        title: "Sheet loaded",
        description: `Successfully loaded ${data?.sheetName || sheetId}`,
      });
    } catch (err) {
      console.error("Failed to load sheet data:", err);
      setSheetData(null);
      toast({
        title: "Error",
        description: "Failed to load sheet data",
        variant: "destructive",
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
        title: "Search Error",
        description: "Couldn't find matching records",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl">
      <Card className="overflow-hidden border-b-4 border-red-500 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-blue-50">
          <div className="z-10">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent">
              Sheet Data Viewer
            </CardTitle>
            <CardDescription className="text-blue-700">
              Select a sheet and search by columns to view the data
            </CardDescription>
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
    </div>
  );
};

export default SheetViewerContainer;
