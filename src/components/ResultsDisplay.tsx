
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSpreadsheet, AlertCircle, Search } from "lucide-react";

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
            <FileSpreadsheet className="h-16 w-16 text-blue-300 mb-4" />
            <p className="text-blue-600">
              Select a sheet and search by ID to view results.
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
              No matching record was found. Please try a different search term.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-red-300 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
        <CardTitle className="text-green-700 flex items-center">
          <FileSpreadsheet className="h-5 w-5 mr-2" /> Search Result
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-gradient-to-b from-white to-green-50">
        {headers.length > 0 ? (
          <div className="grid gap-4 p-2">
            {headers.map((header) => (
              <div 
                key={header} 
                className="grid grid-cols-3 gap-4 items-center border-b border-green-100 pb-2 hover:bg-white/80 rounded px-2"
              >
                <div className="font-medium text-green-700">{header}</div>
                <div className="col-span-2 text-blue-700">{result[header] || 'N/A'}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-red-600">
            No data headers found. Please check the selected sheet data.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
