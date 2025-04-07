
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAvailableSheets } from "@/lib/googleSheetsApi";

interface GoogleSheetsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSheetIdSubmit: (sheetId: string) => void;
  defaultSheetId?: string;
}

const GoogleSheetsDialog = ({ 
  open, 
  onOpenChange, 
  onSheetIdSubmit, 
  defaultSheetId = "1olSuKVcD6e-I9AI7qWR41d-gaHYKtn2PU_9B-uKYcl0" 
}: GoogleSheetsDialogProps) => {
  const [sheetId, setSheetId] = useState(defaultSheetId);
  const [isValidating, setIsValidating] = useState(false);
  const [availableSheets, setAvailableSheets] = useState<{id: string, name: string}[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open && sheetId) {
      validateSheetId(sheetId);
    }
  }, [open]);

  const validateSheetId = async (id: string) => {
    if (!id.trim()) return;
    
    setIsValidating(true);
    try {
      const sheets = await getAvailableSheets(id);
      setAvailableSheets(sheets);
      setIsValidating(false);
      
      if (sheets.length === 0) {
        toast({
          title: "Warning",
          description: "No sheets found in this Google Sheet",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Found ${sheets.length} sheets in this document`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error validating sheet ID:", error);
      toast({
        title: "Error",
        description: "Invalid Google Sheet ID or access denied",
        variant: "destructive",
      });
      setIsValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Google Sheet ID",
        variant: "destructive",
      });
      return;
    }
    
    if (availableSheets.length === 0) {
      toast({
        title: "Warning",
        description: "This Sheet ID doesn't contain any accessible sheets",
        variant: "destructive",
      });
      return;
    }
    
    onSheetIdSubmit(sheetId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-green-50 to-blue-50 border-green-300">
        <DialogHeader>
          <DialogTitle className="flex items-center text-green-700">
            Configure Google Sheet
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100" 
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-blue-700">
            Enter the ID of the Google Sheet you want to access
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sheetId" className="text-green-700">Google Sheet ID</Label>
            <div className="flex gap-2">
              <Input
                id="sheetId"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                placeholder="Enter Google Sheet ID"
                className="w-full border-green-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button 
                type="button"
                variant="outline" 
                className="flex items-center gap-2 border-green-400 text-green-700 hover:bg-green-100"
                onClick={() => validateSheetId(sheetId)}
                disabled={isValidating || !sheetId.trim()}
              >
                <RefreshCw className={`h-4 w-4 ${isValidating ? 'animate-spin' : ''}`} />
                Validate
              </Button>
            </div>
            <p className="text-xs text-blue-600">
              The ID is the part of the URL between /d/ and /edit in your Google Sheet link.
            </p>
          </div>
          
          {availableSheets.length > 0 && (
            <div className="p-3 bg-white/50 rounded-md border border-green-200">
              <p className="text-sm font-medium text-green-700 mb-2">Available Sheets:</p>
              <ul className="text-xs space-y-1 max-h-24 overflow-y-auto text-blue-700">
                {availableSheets.map(sheet => (
                  <li key={sheet.id} className="px-2 py-1 bg-white/50 rounded">
                    {sheet.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <DialogFooter className="sm:justify-start pt-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
              disabled={isValidating}
            >
              Connect to Sheet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleSheetsDialog;
