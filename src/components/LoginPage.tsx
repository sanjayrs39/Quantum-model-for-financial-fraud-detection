import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, Brain, Eye, CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import { signInWithEmail, signUpWithEmail } from '../utils/supabase/client';

interface LoginPageProps {
  onLogin: (role: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [step, setStep] = useState<'login' | '2fa'>('login');
  // Pre-fill for easier demo access
  const [role, setRole] = useState('fraud-analyst');
  const [email, setEmail] = useState('analyst@securebank.com');
  const [password, setPassword] = useState('secure123');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Explicit validation feedback
    if (!role) { setError('Please select a Security Clearance Level'); return; }
    if (!email) { setError('Please enter your email'); return; }
    if (!password) { setError('Please enter your password'); return; }

    setIsLoading(true);
    setError('');

    // Basic email format validation (allows any email format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Mock authentication - accept any email/password combination
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // For demo purposes, accept any email and password
      // Just require minimum password length
      if (password.length < 4) {
        setError('Password must be at least 4 characters long');
        setIsLoading(false);
        return;
      }

      setSuccess('Credentials verified! Proceed to two-factor authentication.');
      setStep('2fa');

    } catch (err) {
      setError('Authentication service unavailable. Please try again later.');
    }

    setIsLoading(false);
  };

  const handle2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      // In production, this would verify with actual 2FA service
      // For now, simulate verification with any 6-digit code
      setSuccess('Two-factor authentication successful!');
      setTimeout(() => onLogin(role), 1000);
    } else {
      setError('Please enter a valid 6-digit verification code.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30"></div>

      <Card className="w-full max-w-lg relative z-10 backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <Shield className="h-10 w-10 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <Brain className="h-10 w-10 text-emerald-600" />
            <Eye className="h-10 w-10 text-cyan-600" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            SecureBank AI
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {step === 'login' ? 'Advanced Fraud Detection Platform' : 'Secure Access Verification'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 'login' ? (
            <>
              {/* Error/Success Messages */}
              {error && (
                <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">Security Clearance Level</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your authorized role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-manager">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Bank Manager - Executive Access</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="fraud-analyst">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Fraud Analyst - Investigation Access</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="compliance-officer">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Compliance Officer - Regulatory Access</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Corporate Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@securebank.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Secure Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    New users will be automatically registered with security approval
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-700 hover:via-cyan-700 hover:to-emerald-700 text-white font-medium shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Secure Login</span>
                    </div>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/20 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit verification code from your authenticator app
                </p>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handle2FA} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    className="text-center tracking-widest text-2xl h-14 font-mono"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium"
                  disabled={otpCode.length !== 6}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Verify & Access Platform</span>
                  </div>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => {
                    setStep('login');
                    setError('');
                    setOtpCode('');
                  }}
                >
                  Back to Login
                </Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}