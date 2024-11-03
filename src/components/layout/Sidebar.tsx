import { Logo } from '@/components/layout/Logo';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="h-full bg-background border-r flex flex-col">
      <div className="flex-1 flex flex-col gap-1 p-3">
        <Logo />
        <Navigation />
      </div>
      <div className="p-3 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start gap-3 h-10 px-3 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/dashboard/settings')}
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm font-normal">Settings</span>
        </Button>
      </div>
    </aside>
  );
}