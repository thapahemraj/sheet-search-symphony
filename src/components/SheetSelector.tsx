
import { useState, useEffect } from "react";
import { getAvailableSheets } from "@/lib/googleSheetsApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SheetSelectorProps {
  onSheetSelect: (sheetId: string) => void;
}

const SheetSelector = ({ onSheetSelect }: SheetSelectorProps) => {
  const [sheets, setSheets] = useState<Array<{id: string, name: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSheets();
  }, []);

  const fetchSheets = async () => {
    try {
      setLoading(true);
      setError(null);
      const availableSheets = await getAvailableSheets();
      setSheets(availableSheets);
    } catch (err: any) {
      console.error("Failed to fetch sheets:", err);
      setError("Failed to load available sheets: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-10 w-[250px]" />;
  }

  if (error) {
    return (
      <div className="space-y-3">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchSheets} variant="outline" size="sm" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry Loading Sheets
        </Button>
      </div>
    );
  }

  if (sheets.length === 0) {
    return (
      <div className="space-y-3">
        <Alert>
          <AlertDescription>
            No sheets found in the spreadsheet. Please check if the spreadsheet exists and contains data.
          </AlertDescription>
        </Alert>
        <Button onClick={fetchSheets} variant="outline" size="sm" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-full max-w-xs">
        <Select onValueChange={onSheetSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a sheet" />
          </SelectTrigger>
          <SelectContent>
            {sheets.map((sheet) => (
              <SelectItem key={sheet.id} value={sheet.id}>
                {sheet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button 
        onClick={fetchSheets} 
        variant="outline" 
        size="icon" 
        title="Refresh sheet list"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SheetSelector;
