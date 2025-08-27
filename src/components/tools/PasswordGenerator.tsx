import { useState, useCallback } from "react";
import { Copy, RefreshCw, Shield, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

export const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
  });

  const generatePassword = useCallback(() => {
    let charset = '';
    
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.includeNumbers) charset += '0123456789';
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }
    
    if (!charset) return;
    
    let result = '';
    for (let i = 0; i < options.length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(result);
  }, [options]);

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    let feedback = [];
    
    if (pwd.length >= 12) score += 25;
    else if (pwd.length >= 8) score += 15;
    else feedback.push('Use at least 8 characters');
    
    if (/[a-z]/.test(pwd)) score += 15;
    else feedback.push('Add lowercase letters');
    
    if (/[A-Z]/.test(pwd)) score += 15;
    else feedback.push('Add uppercase letters');
    
    if (/[0-9]/.test(pwd)) score += 15;
    else feedback.push('Add numbers');
    
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 20;
    else feedback.push('Add special characters');
    
    if (pwd.length >= 16) score += 10;
    
    let strength = 'Very Weak';
    let color = 'text-destructive';
    let icon = XCircle;
    
    if (score >= 80) {
      strength = 'Very Strong';
      color = 'text-success';
      icon = CheckCircle;
    } else if (score >= 60) {
      strength = 'Strong';
      color = 'text-success';
      icon = CheckCircle;
    } else if (score >= 40) {
      strength = 'Moderate';
      color = 'text-warning';
      icon = AlertCircle;
    } else if (score >= 20) {
      strength = 'Weak';
      color = 'text-destructive';
      icon = XCircle;
    }
    
    return { score, strength, color, icon, feedback };
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
  };

  const strength = password ? getPasswordStrength(password) : null;

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Length: {options.length}
          </label>
          <input
            type="range"
            min="4"
            max="50"
            value={options.length}
            onChange={(e) => setOptions(prev => ({ ...prev, length: parseInt(e.target.value) }))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={(e) => setOptions(prev => ({ ...prev, includeUppercase: e.target.checked }))}
              className="w-4 h-4 text-primary bg-background border-2 border-input-border rounded focus:ring-ring"
            />
            <span className="text-sm text-foreground">Uppercase (A-Z)</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={(e) => setOptions(prev => ({ ...prev, includeLowercase: e.target.checked }))}
              className="w-4 h-4 text-primary bg-background border-2 border-input-border rounded focus:ring-ring"
            />
            <span className="text-sm text-foreground">Lowercase (a-z)</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) => setOptions(prev => ({ ...prev, includeNumbers: e.target.checked }))}
              className="w-4 h-4 text-primary bg-background border-2 border-input-border rounded focus:ring-ring"
            />
            <span className="text-sm text-foreground">Numbers (0-9)</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) => setOptions(prev => ({ ...prev, includeSymbols: e.target.checked }))}
              className="w-4 h-4 text-primary bg-background border-2 border-input-border rounded focus:ring-ring"
            />
            <span className="text-sm text-foreground">Symbols (!@#$%^&*)</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer md:col-span-2">
            <input
              type="checkbox"
              checked={options.excludeSimilar}
              onChange={(e) => setOptions(prev => ({ ...prev, excludeSimilar: e.target.checked }))}
              className="w-4 h-4 text-primary bg-background border-2 border-input-border rounded focus:ring-ring"
            />
            <span className="text-sm text-foreground">Exclude similar characters (i, l, 1, L, o, 0, O)</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Generate Password
      </button>

      {/* Generated Password */}
      {password && (
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Generated Password</label>
              <button
                onClick={copyToClipboard}
                className="p-1 rounded hover:bg-background transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="font-mono text-lg bg-background rounded p-3 border border-input-border break-all">
              {password}
            </div>
          </div>

          {/* Password Strength */}
          {strength && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Password Strength</span>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <strength.icon className={`w-5 h-5 ${strength.color}`} />
                <span className={`font-medium ${strength.color}`}>{strength.strength}</span>
                <div className="flex-1 bg-background rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      strength.score >= 80 ? 'bg-success' :
                      strength.score >= 60 ? 'bg-success' :
                      strength.score >= 40 ? 'bg-warning' : 'bg-destructive'
                    }`}
                    style={{ width: `${Math.min(strength.score, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              {strength.feedback.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Suggestions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {strength.feedback.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};