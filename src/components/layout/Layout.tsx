import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { LayoutDashboard, ShoppingCart, Package, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pos', label: 'POS', icon: ShoppingCart },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/transactions', label: 'Transactions', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-primary-foreground p-4 flex flex-col">
        <div className="mb-8 mt-2">
          <h1 className="text-2xl font-bold">POS System</h1>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-primary-foreground text-primary"
                      : "hover:bg-primary-foreground/10"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-primary-foreground/20">
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}