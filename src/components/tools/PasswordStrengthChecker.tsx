import { useState, useMemo } from "react";
import { Check, X, Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface StrengthCriteria {
  id: string;
  label: string;
  test: (password: string) => boolean;
  description: string;
}

const strengthCriteria: StrengthCriteria[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
    description: 'Longer passwords are harder to crack'
  },
  {
    id: 'uppercase',
    label: 'Uppercase letter',
    test: (password) => /[A-Z]/.test(password),
    description: 'Include at least one capital letter'
  },
  {
    id: 'lowercase',
    label: 'Lowercase letter',
    test: (password) => /[a-z]/.test(password),
    description: 'Include at least one small letter'
  },
  {
    id: 'number',
    label: 'Number',
    test: (password) => /\d/.test(password),
    description: 'Include at least one digit'
  },
  {
    id: 'special',
    label: 'Special character',
    test: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    description: 'Include symbols for extra security'
  },
  {
    id: 'noCommon',
    label: 'Not a common password',
    test: (password) => !['password', '123456', 'qwerty', 'admin', 'letmein'].includes(password.toLowerCase()),
    description: 'Avoid easily guessable passwords'
  },
  {
    id: 'noRepeating',
    label: 'No repeating characters',
    test: (password) => !/(.)\1{2,}/.test(password),
    description: 'Avoid patterns like "aaa" or "111"'
  }
];

export const PasswordStrengthChecker = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const strengthAnalysis = useMemo(() => {
    if (!password) return { score: 0, level: 'none', criteria: [] };

    const criteria = strengthCriteria.map(criterion => ({
      ...criterion,
      passed: criterion.test(password)
    }));

    const passedCount = criteria.filter(c => c.passed).length;
    const totalCriteria = criteria.length;
    const score = Math.round((passedCount / totalCriteria) * 100);

    let level: 'none' | 'weak' | 'medium' | 'strong' | 'very-strong' = 'none';
    if (score >= 90) level = 'very-strong';
    else if (score >= 75) level = 'strong';
    else if (score >= 50) level = 'medium';
    else if (score > 0) level = 'weak';

    return { score, level, criteria };
  }, [password]);

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'very-strong': return 'bg-green-500';
      case 'strong': return 'bg-green-400';
      case 'medium': return 'bg-yellow-500';
      case 'weak': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthText = (level: string) => {
    switch (level) {
      case 'very-strong': return 'Very Strong';
      case 'strong': return 'Strong';
      case 'medium': return 'Medium';
      case 'weak': return 'Weak';
      default: return 'Enter a password';
    }
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy password",
        variant: "destructive",
      });
    }
  };

  const getSuggestions = () => {
    const suggestions = [];
    if (password.length < 8) suggestions.push("Make your password at least 8 characters long");
    if (!/[A-Z]/.test(password)) suggestions.push("Add at least one uppercase letter");
    if (!/[a-z]/.test(password)) suggestions.push("Add at least one lowercase letter");
    if (!/\d/.test(password)) suggestions.push("Include at least one number");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) suggestions.push("Add a special character for extra security");
    if (password.length < 12) suggestions.push("Consider making it 12+ characters for maximum security");
    return suggestions;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to check..."
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="h-8 w-8 p-0"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateStrongPassword}
                className="h-8 w-8 p-0"
                title="Generate strong password"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {password && (
          <Button
            type="button"
            variant="outline"
            onClick={copyToClipboard}
            className="w-full"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Password
          </Button>
        )}
      </div>

      {/* Strength Indicator */}
      {password && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Password Strength
              <Badge 
                variant={strengthAnalysis.level === 'very-strong' ? 'default' : 'secondary'}
                className={getStrengthColor(strengthAnalysis.level)}
              >
                {getStrengthText(strengthAnalysis.level)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Strength Score</span>
                <span className="font-medium">{strengthAnalysis.score}%</span>
              </div>
              <Progress value={strengthAnalysis.score} className="h-2" />
            </div>

            {/* Criteria Checklist */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Requirements:</h4>
              <div className="grid gap-2">
                {strengthAnalysis.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                  >
                    {criterion.passed ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {criterion.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {criterion.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            {strengthAnalysis.score < 100 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Suggestions to improve:</h4>
                <ul className="space-y-1">
                  {getSuggestions().map((suggestion, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Password Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use a unique password for each account</li>
            <li>• Consider using a passphrase instead of a single word</li>
            <li>• Enable two-factor authentication when available</li>
            <li>• Use a password manager for better security</li>
            <li>• Regularly update your passwords</li>
            <li>• Never share passwords via email or text</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
