
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchBarProps {
  onSearch: (criteria: { field: string, value: string }[]) => void;
  disabled: boolean;
  headers: string[];
}

const SearchBar = ({ onSearch, disabled, headers }: SearchBarProps) => {
  const [column1, setColumn1] = useState<string>("");
  const [column2, setColumn2] = useState<string>("");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (column1 && value1.trim() && column2 && value2.trim()) {
      onSearch([
        { field: column1, value: value1.trim() },
        { field: column2, value: value2.trim() }
      ]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/70 p-6 rounded-lg border border-green-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="column1" className="text-blue-700 mb-2 block">Select First Column</Label>
            <Select value={column1} onValueChange={setColumn1}>
              <SelectTrigger className="w-full border-green-200">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {column1 && (
            <div>
              <Label htmlFor="value1" className="text-blue-700 mb-2 block">Enter {column1}</Label>
              <Input
                id="value1"
                type="text"
                placeholder={`Enter ${column1}`}
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                disabled={disabled}
                className="w-full border-green-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="column2" className="text-blue-700 mb-2 block">Select Second Column</Label>
            <Select value={column2} onValueChange={setColumn2}>
              <SelectTrigger className="w-full border-green-200">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {headers.filter(h => h !== column1).map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {column2 && (
            <div>
              <Label htmlFor="value2" className="text-blue-700 mb-2 block">Enter {column2}</Label>
              <Input
                id="value2"
                type="text"
                placeholder={`Enter ${column2}`}
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                disabled={disabled}
                className="w-full border-green-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          )}
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={disabled || !column1 || !value1.trim() || !column2 || !value2.trim()}
        className="w-full md:w-auto bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
      >
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
