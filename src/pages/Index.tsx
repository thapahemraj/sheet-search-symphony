
import SheetViewerContainer from "@/components/SheetViewerContainer";

const Index = () => {
  return (
    <div className="min-h-screen p-6 md:p-10 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Sheet Search Symphony
          </h1>
          <p className="text-slate-600">
            Search and view data from Google Sheets with ease
          </p>
        </header>
        
        <main>
          <SheetViewerContainer />
        </main>
        
        <footer className="mt-16 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Sheet Search Symphony. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
