
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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
    onSheetIdSubmit(sheetId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Configure Google Sheet
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto h-8 w-8" 
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Enter the ID of the Google Sheet you want to access
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sheetId">Google Sheet ID</Label>
            <Input
              id="sheetId"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              placeholder="Enter Google Sheet ID"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              The ID is the part of the URL between /d/ and /edit in your Google Sheet link.
            </p>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="submit" className="w-full">
              Connect to Sheet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleSheetsDialog;
