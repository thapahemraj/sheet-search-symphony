
import SheetViewerContainer from "@/components/SheetViewerContainer";
import { FileSpreadsheet } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-green-500/10 to-blue-500/10 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-green-500/10 to-blue-500/10 -z-10"></div>
      
      {/* Floating 3D-like shapes */}
      <div className="fixed top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-green-300/20 to-green-500/20 blur-xl -z-10"></div>
      <div className="fixed bottom-20 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-blue-300/20 to-blue-500/20 blur-xl -z-10"></div>
      <div className="fixed top-1/4 right-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-red-300/10 to-red-500/10 blur-lg -z-10"></div>
      
      <div className="max-w-5xl mx-auto pt-10 pb-16 px-4">
        <header className="mb-12 relative">
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-md"></div>
          <div className="relative z-10 flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-2xl shadow-lg transform -rotate-6 mr-4">
              <FileSpreadsheet className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent">
              Sheet Search Symphony
            </h1>
          </div>
          <p className="text-lg text-center text-blue-700 max-w-2xl mx-auto">
            Seamlessly search and view data from your Google Sheets with our modern interface
          </p>
          
          <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-blue-600 mx-auto mt-4 rounded-full"></div>
        </header>
        
        <main className="relative">
          <SheetViewerContainer />
        </main>
        
        <footer className="mt-16 text-center">
          <div className="w-24 h-1 bg-gradient-to-r from-green-300 to-blue-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-sm text-blue-600">
            © {new Date().getFullYear()} Sheet Search Symphony. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
