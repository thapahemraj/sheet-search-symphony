
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  disabled: boolean;
  idColumnName: string;
}

const SearchBar = ({ onSearch, disabled, idColumnName }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
      <div className="flex-1">
        <Input
          type="text"
          placeholder={`Search by ${idColumnName || 'ID'}`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          disabled={disabled}
          className="w-full"
        />
      </div>
      <Button type="submit" disabled={disabled || !searchValue.trim()}>
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
