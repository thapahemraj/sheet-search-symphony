
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-64" />
          </CardTitle>
        </CardHeader>
        <CardContent>
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
      <Card className="w-full bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!searchPerformed) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select a sheet and search by ID to view results.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Results Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No matching record was found. Please try a different search term.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {headers.map((header) => (
            <div key={header} className="grid grid-cols-3 gap-4 items-center border-b pb-2">
              <div className="font-medium">{header}</div>
              <div className="col-span-2">{result[header] || 'N/A'}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
