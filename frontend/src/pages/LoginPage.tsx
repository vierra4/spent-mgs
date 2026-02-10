import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid credentials. Try one of the demo accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'employee@example.com', role: 'Employee', description: 'Submit expenses, view status' },
    { email: 'manager@example.com', role: 'Manager', description: 'Approve/reject expenses' },
    { email: 'finance@example.com', role: 'Finance', description: 'Review expenses, manage policies' },
    { email: 'admin@example.com', role: 'Admin', description: 'Full access, audit logs' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 rounded-lg bg-[#0047AB] flex items-center justify-center">
              <span className="text-white font-bold text-lg">SP</span>
            </div>
            <span className="text-2xl font-bold text-[#1A1A1A] tracking-tight">SpendFlow</span>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight">Welcome back</h1>
              <p className="text-muted-foreground mt-2">Sign in to manage your expenses</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-[#0047AB] hover:bg-[#003d94] text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Demo accounts */}
      <div className="hidden lg:flex flex-1 bg-[#1A1A1A] items-center justify-center p-8">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-white mb-2">Demo Accounts</h2>
          <p className="text-slate-400 mb-8">
            Click any account to auto-fill credentials. Use any password to sign in.
          </p>

          <div className="space-y-3">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setEmail(account.email);
                  setPassword('demo123');
                }}
                className="w-full p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-left transition-colors border border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-semibold">{account.role}</span>
                    <span className="text-slate-400 text-sm ml-2">{account.email}</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mt-1">{account.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
