import { Bell, HelpCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { InviteTeamMember } from '@/components/slides/InviteTeamMember';
import { VerifyBank } from '@/components/slides/VerifyBank';
import { Notifications } from '@/components/Notifications';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/');
  };

  const renderSlideContent = () => {
    if (location.pathname === '/dashboard') {
      return <InviteTeamMember />;
    }
    if (location.pathname === '/dashboard/banking') {
      return <VerifyBank />;
    }
    return null;
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-14 items-center gap-4 px-6">
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Notifications />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <Button variant="ghost" size="icon" className="hover:bg-muted" onClick={() => setIsOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
            <SheetContent 
              side="right" 
              className="w-full sm:w-[540px] bg-background/95 backdrop-blur-xl border-l"
            >
              {renderSlideContent()}
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs bg-muted">ME</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-normal">Mitch Eisner</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}