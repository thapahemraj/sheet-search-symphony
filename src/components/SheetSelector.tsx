
import { RefreshCw, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SheetSelectorProps {
  onSheetSelect: (sheetId: string) => void;
  availableSheets: Array<{id: string, name: string}>;
  loading: boolean;
}

const SheetSelector = ({ onSheetSelect, availableSheets, loading }: SheetSelectorProps) => {
  if (loading) {
    return <Skeleton className="h-10 w-[250px]" />;
  }

  if (availableSheets.length === 0) {
    return (
      <div className="space-y-3">
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No sheets found in the spreadsheet. Please check if the spreadsheet exists and contains data.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-full max-w-xs">
        <Select onValueChange={onSheetSelect}>
          <SelectTrigger className="w-full border-green-300 focus:border-red-500 focus:ring-red-500">
            <SelectValue placeholder="Select a sheet" />
          </SelectTrigger>
          <SelectContent className="bg-white border-green-200">
            {availableSheets.map((sheet) => (
              <SelectItem key={sheet.id} value={sheet.id} className="hover:bg-green-50">
                {sheet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SheetSelector;
