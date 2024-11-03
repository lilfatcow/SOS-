import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from 'react';

export function Home() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleInquire = () => {
    window.location.href = 'mailto:hello@wonderpay.co';
  };

  const NavLinks = () => (
    <>
      <a href="#about" className="text-sm text-foreground hover:text-foreground/80 transition-colors">
        About
      </a>
      <a href="#services" className="text-sm text-foreground hover:text-foreground/80 transition-colors">
        Services
      </a>
      <a href="#studio" className="text-sm text-foreground hover:text-foreground/80 transition-colors">
        Studio
      </a>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex justify-between items-center py-8">
          <div className="font-bold text-lg">WonderPay</div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-4 mt-8">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="mt-20 text-center">
          <div className="space-y-6 max-w-3xl mx-auto px-4">
            <h1 className="text-6xl font-semibold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
              WonderPay
            </h1>
            
            <p className="text-sm uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              By Wonderland Studio
            </p>
            
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              WonderPay by Wonderland Studio is a private bill pay and payments automation platform 
              to streamline AP & AR and offer working capital solutions for our clients, partners, 
              and colleagues in music, entertainment, and luxury hospitality.
            </p>

            <div className="h-px w-24 bg-border mx-auto my-12 animate-in fade-in zoom-in duration-1000 delay-500" />

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[150px]"
                onClick={handleSignUp}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[150px]"
                onClick={handleLogin}
              >
                Sign In
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}