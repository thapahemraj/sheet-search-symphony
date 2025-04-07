
import { useState, useEffect } from "react";
import { getAvailableSheets } from "@/lib/googleSheetsApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SheetSelectorProps {
  onSheetSelect: (sheetId: string) => void;
}

const SheetSelector = ({ onSheetSelect }: SheetSelectorProps) => {
  const [sheets, setSheets] = useState<Array<{id: string, name: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        setLoading(true);
        const availableSheets = await getAvailableSheets();
        setSheets(availableSheets);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch sheets:", err);
        setError("Failed to load available sheets: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  if (loading) {
    return <Skeleton className="h-10 w-[250px]" />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (sheets.length === 0) {
    return (
      <Alert className="mb-4">
        <AlertDescription>
          No sheets found in the spreadsheet. Please check if the spreadsheet exists and contains data.
        </AlertDescription>
      </Alert>
    );
  }

  return (
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
  );
};

export default SheetSelector;
