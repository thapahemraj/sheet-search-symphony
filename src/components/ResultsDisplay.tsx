import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSpreadsheet, AlertCircle, Search, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsDisplayProps {
  result: Record<string, string> | null;
  headers: string[];
  loading: boolean;
  error: string | null;
  searchPerformed: boolean;
}

const ResultsDisplay = ({
  result,
  headers,
  loading,
  error,
  searchPerformed
}: ResultsDisplayProps) => {
  if (loading) {
    return (
      <Card className="w-full border-blue-300 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="flex items-center">
            <Skeleton className="h-8 w-64" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="mb-4">
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-red-50 border-red-300 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-100 to-red-50">
          <CardTitle className="text-red-700 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" /> Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!searchPerformed) {
    return (
      <Card className="w-full border-blue-200 shadow-md bg-gradient-to-b from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-blue-700 flex items-center">
            <Search className="h-5 w-5 mr-2" /> Search Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileSpreadsheet className="h-16 w-16 text-blue-300 mb-4 animate-pulse" />
            <p className="text-blue-600">
              Select columns and enter search values to view results
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="w-full border-amber-200 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
          <CardTitle className="text-amber-700">No Results Found</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="h-12 w-12 text-amber-300 mb-4" />
            <p className="text-amber-600">
              No matching record was found. Please try different search values.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-green-300 shadow-lg overflow-hidden bg-gradient-to-br from-white to-green-50">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
        <CardTitle className="text-green-700 flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" /> Match Found
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-0 divide-y divide-green-100">
          {headers.map((header, index) => (
            <div 
              key={header}
              className={cn(
                "grid grid-cols-3 items-center p-4 transition-colors hover:bg-green-50/50",
                index % 2 === 0 ? "bg-white" : "bg-green-50/30"
              )}
            >
              <div className="font-medium text-green-800">{header}</div>
              <div className="col-span-2 text-blue-700">{result[header] || 'N/A'}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
