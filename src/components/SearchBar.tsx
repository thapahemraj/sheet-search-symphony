
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";

interface SearchBarProps {
  onSearch: (criteria: { field: string, value: string }[]) => void;
  disabled: boolean;
  nameField: string;
  dobField: string;
}

const SearchBar = ({ onSearch, disabled, nameField, dobField }: SearchBarProps) => {
  const [nameValue, setNameValue] = useState("");
  const [dobValue, setDobValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameValue.trim() && dobValue.trim()) {
      onSearch([
        { field: nameField, value: nameValue.trim() },
        { field: dobField, value: dobValue.trim() }
      ]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nameSearch" className="text-blue-700">Name</Label>
          <Input
            id="nameSearch"
            type="text"
            placeholder={`Enter ${nameField}`}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            disabled={disabled}
            className="w-full border-green-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dobSearch" className="text-blue-700">Date of Birth</Label>
          <Input
            id="dobSearch"
            type="text"
            placeholder={`Enter ${dobField}`}
            value={dobValue}
            onChange={(e) => setDobValue(e.target.value)}
            disabled={disabled}
            className="w-full border-green-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={disabled || !nameValue.trim() || !dobValue.trim()}
        className="w-full md:w-auto bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
      >
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
