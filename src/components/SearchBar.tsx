
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getSelectedColumns } from "@/lib/config";

interface SearchBarProps {
  onSearch: (criteria: { field: string, value: string }[]) => void;
  disabled: boolean;
  headers: string[];
}

const SearchBar = ({ onSearch, disabled, headers }: SearchBarProps) => {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [selectedColumns, setSelectedColumns] = useState({ firstColumn: "", secondColumn: "" });

  // Load selected columns from config
  useEffect(() => {
    const columns = getSelectedColumns();
    setSelectedColumns(columns);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedColumns.firstColumn && value1.trim() && selectedColumns.secondColumn && value2.trim()) {
      onSearch([
        { field: selectedColumns.firstColumn, value: value1.trim() },
        { field: selectedColumns.secondColumn, value: value2.trim() }
      ]);
    }
  };

  if (!selectedColumns.firstColumn || !selectedColumns.secondColumn) {
    return (
      <div className="bg-white/70 p-6 rounded-lg border border-amber-100 shadow-sm">
        <p className="text-amber-600">
          Please configure the search columns in the config file first.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/70 p-6 rounded-lg border border-green-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="value1" className="text-blue-700 mb-2 block">Enter {selectedColumns.firstColumn}</Label>
            <Input
              id="value1"
              type="text"
              placeholder={`Enter ${selectedColumns.firstColumn}`}
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              disabled={disabled}
              className="w-full border-green-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="value2" className="text-blue-700 mb-2 block">Enter {selectedColumns.secondColumn}</Label>
            <Input
              id="value2"
              type="text"
              placeholder={`Enter ${selectedColumns.secondColumn}`}
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              disabled={disabled}
              className="w-full border-green-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={disabled || !value1.trim() || !value2.trim()}
        className="w-full md:w-auto bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
      >
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
