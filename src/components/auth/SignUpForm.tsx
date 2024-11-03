import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/hooks/use-toast';
import { useEntity } from '@/hooks/useEntity';
import type { CreateEntityRequest } from '@monite/sdk-api';

export function SignUpForm() {
  const navigate = useNavigate();
  const { initialize } = useMonite();
  const { create: createEntity } = useEntity();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    taxId: '',
    agree: false
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Initialize Monite SDK
      await initialize();

      // Create new entity
      const entityData: CreateEntityRequest = {
        type: 'organization',
        organization: {
          name: formData.organizationName,
          tax_id: formData.taxId,
        },
        email: formData.email,
      };

      const entity = await createEntity(entityData);
      
      if (entity) {
        // Store necessary data
        localStorage.setItem('wonderpay_auth', JSON.stringify({
          email: formData.email,
          entityId: entity.id
        }));

        navigate('/dashboard');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Registration failed');
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Registration Error",
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
        <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
        <p className="text-muted-foreground">Sign up for WonderPay powered by Monite</p>
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
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              name="organizationName"
              placeholder="Your company name"
              value={formData.organizationName}
              onChange={handleChange}
              className="h-12 bg-white border-gray-300"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID</Label>
            <Input
              id="taxId"
              name="taxId"
              placeholder="Company tax ID"
              value={formData.taxId}
              onChange={handleChange}
              className="h-12 bg-white border-gray-300"
              disabled={loading}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="h-12 bg-white border-gray-300"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="h-12 bg-white border-gray-300"
              disabled={loading}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="agree"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
              disabled={loading}
              required
            />
            <Label htmlFor="agree" className="text-sm text-gray-700">
              I agree to the Terms of Service and Privacy Policy
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12"
            disabled={loading || !formData.agree}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-500"
              onClick={() => navigate('/signin')}
            >
              Sign in
            </Button>
          </p>
        </form>
      </div>
    </div>
  );
}