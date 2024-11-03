import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/hooks/use-toast';
import { authenticateUser } from '@/lib/monite/auth';

export function SignInForm() {
  const navigate = useNavigate();
  const { initialize } = useMonite();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Initialize Monite SDK first
      await initialize();

      // Attempt authentication
      const authResult = await authenticateUser(formData.email, formData.password);
      
      if (authResult) {
        // Store auth data if needed
        if (formData.remember) {
          localStorage.setItem('wonderpay_auth', JSON.stringify({
            email: formData.email,
            token: authResult.token
          }));
        }

        navigate('/dashboard');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Authentication failed');
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to WonderPay</h1>
        <p className="text-muted-foreground">Powered by Monite</p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Button 
            variant="outline" 
            className="w-full h-12 bg-white hover:bg-gray-50 border border-gray-300"
            disabled={loading}
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-12 bg-white hover:bg-gray-50 border border-gray-300"
            disabled={loading}
          >
            <Icons.apple className="mr-2 h-4 w-4" />
            Continue with Apple
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="h-12 bg-white border-gray-300"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="h-12 bg-white border-gray-300"
              disabled={loading}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
                disabled={loading}
              />
              <Label htmlFor="remember" className="text-sm text-gray-700">Remember me</Label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}