
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getConfig, saveConfig } from "@/lib/customization";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvailableSheets } from "@/lib/googleSheetsApi";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigSaved: () => void;
}

const ConfigurationDialog = ({ open, onOpenChange, onConfigSaved }: ConfigurationDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [availableSheets, setAvailableSheets] = useState<{id: string, name: string}[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const config = getConfig();
      setApiKey(config.googleApiKey);
      setSheetId(config.sheetId);
    }
  }, [open]);

  const handleValidate = async () => {
    if (!apiKey || !sheetId) {
      setError("Please enter both API Key and Sheet ID");
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const sheets = await getAvailableSheets(sheetId);
      setAvailableSheets(sheets);
      
      if (sheets.length === 0) {
        setError("No sheets found in this spreadsheet");
      } else {
        toast({
          title: "Success",
          description: `Found ${sheets.length} sheets in the document`,
        });
      }
    } catch (err) {
      setError("Failed to validate sheet. Please check your credentials.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    if (!apiKey || !sheetId) {
      setError("Please enter both API Key and Sheet ID");
      return;
    }

    const config = saveConfig({
      googleApiKey: apiKey,
      sheetId: sheetId,
    });

    toast({
      title: "Configuration Saved",
      description: "Your Google Sheets configuration has been saved",
    });

    onConfigSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Configure Google Sheets
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Google API Key</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google API Key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sheetId">Google Sheet ID</Label>
            <div className="flex gap-2">
              <Input
                id="sheetId"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                placeholder="Enter Sheet ID"
              />
              <Button 
                onClick={handleValidate}
                disabled={isValidating || !apiKey || !sheetId}
                variant="outline"
              >
                Validate
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              The ID is found in your Google Sheet URL between /d/ and /edit
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {availableSheets.length > 0 && (
            <div className="space-y-2">
              <Label>Available Sheets</Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {availableSheets.map(sheet => (
                  <div key={sheet.id} className="p-2 bg-gray-50 rounded-md text-sm">
                    {sheet.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationDialog;
