import { Link, Outlet, useLocation } from "react-router";
import { Scale, MessageSquare, FileText, Home } from "lucide-react";
import { Button } from "./ui/button";

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 h-16">
            <Link to="/" className="flex items-center gap-2">
              <Scale className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Zanai</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/">
                <Button 
                  variant={isActive("/") ? "default" : "ghost"}
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  Басты бет
                </Button>
              </Link>
              <Link to="/laws">
                <Button 
                  variant={isActive("/laws") ? "default" : "ghost"}
                  className="gap-2"
                >
                  <Scale className="w-4 h-4" />
                  Заңдар
                </Button>
              </Link>
              <Link to="/ai-consultant">
                <Button 
                  variant={isActive("/ai-consultant") ? "default" : "ghost"}
                  className="gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  ЖИ Кеңесші
                </Button>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Mobile navigation */}
          <nav className="md:hidden pb-4 flex flex-wrap gap-2">
            <Link to="/">
              <Button 
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Басты бет
              </Button>
            </Link>
            <Link to="/laws">
              <Button 
                variant={isActive("/laws") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Scale className="w-4 h-4" />
                Заңдар
              </Button>
            </Link>
            <Link to="/ai-consultant">
              <Button 
                variant={isActive("/ai-consultant") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                ЖИ Кеңесші
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2026 Zanai. Барлық құқықтар қорғалған.</p>
            <p className="text-sm">Қазақстан Республикасының заңдары туралы ақпараттық платформа</p>
          </div>
        </div>
      </footer>
    </div>
  );
}