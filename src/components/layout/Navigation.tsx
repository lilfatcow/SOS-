import {
  Home,
  Receipt,
  CreditCard,
  DollarSign,
  Users,
  Building2,
  Link,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  // Core Features
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Receipt, label: 'Bill Pay', href: '/dashboard/bill-pay' },
  { icon: DollarSign, label: 'Invoicing & Receivables', href: '/dashboard/invoicing' },
  { icon: Building2, label: 'WonderPay Capital', href: '/dashboard/capital' },
  { icon: CreditCard, label: 'Pay By Card', href: '/dashboard/card', divider: true },
  
  // Connections
  { icon: Users, label: 'Clients & Vendors', href: '/dashboard/clients' },
  { icon: Building2, label: 'Banking Connections', href: '/dashboard/banking' },
  { icon: FileSpreadsheet, label: 'Accounting Integrations', href: '/dashboard/integrations', divider: true },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="space-y-1">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.href;
        
        return (
          <div key={item.label}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-10 px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50",
                isActive && "bg-muted/50 text-foreground"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm font-normal">{item.label}</span>
            </Button>
            {item.divider && index !== navItems.length - 1 && (
              <div className="my-2 border-t border-border/50" />
            )}
          </div>
        );
      })}
    </nav>
  );
}