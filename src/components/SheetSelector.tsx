
import { useState, useEffect } from "react";
import { getAvailableSheets } from "@/lib/googleSheetsApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

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
      } catch (err) {
        console.error("Failed to fetch sheets:", err);
        setError("Failed to load available sheets. Please try again.");
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
    return <div className="text-destructive">{error}</div>;
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
