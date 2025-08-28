import { useState, useMemo } from "react";
import { Binary, Copy, RotateCcw, Calculator, Hash, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface BaseInfo {
  id: string;
  name: string;
  prefix: string;
  digits: string;
  validate: (value: string) => boolean;
  toDecimal: (value: string) => number;
  fromDecimal: (value: number) => string;
}

const numberBases: BaseInfo[] = [
  {
    id: 'binary',
    name: 'Binary',
    prefix: '0b',
    digits: '01',
    validate: (value) => /^[01]+$/.test(value),
    toDecimal: (value) => parseInt(value, 2),
    fromDecimal: (value) => Math.floor(value).toString(2)
  },
  {
    id: 'octal',
    name: 'Octal',
    prefix: '0o',
    digits: '01234567',
    validate: (value) => /^[0-7]+$/.test(value),
    toDecimal: (value) => parseInt(value, 8),
    fromDecimal: (value) => Math.floor(value).toString(8)
  },
  {
    id: 'decimal',
    name: 'Decimal',
    prefix: '',
    digits: '0123456789',
    validate: (value) => /^\d+$/.test(value),
    toDecimal: (value) => parseInt(value, 10),
    fromDecimal: (value) => Math.floor(value).toString(10)
  },
  {
    id: 'hexadecimal',
    name: 'Hexadecimal',
    prefix: '0x',
    digits: '0123456789ABCDEF',
    validate: (value) => /^[0-9A-Fa-f]+$/.test(value),
    toDecimal: (value) => parseInt(value, 16),
    fromDecimal: (value) => Math.floor(value).toString(16).toUpperCase()
  }
];

interface BitwiseOperation {
  id: string;
  name: string;
  symbol: string;
  operation: (a: number, b: number) => number;
}

const bitwiseOperations: BitwiseOperation[] = [
  { id: 'and', name: 'AND', symbol: '&', operation: (a, b) => a & b },
  { id: 'or', name: 'OR', symbol: '|', operation: (a, b) => a | b },
  { id: 'xor', name: 'XOR', symbol: '^', operation: (a, b) => a ^ b },
  { id: 'not', name: 'NOT', symbol: '~', operation: (a) => ~a },
  { id: 'leftShift', name: 'Left Shift', symbol: '<<', operation: (a, b) => a << b },
  { id: 'rightShift', name: 'Right Shift', symbol: '>>', operation: (a, b) => a >> b }
];

export const NumberBaseConverter = () => {
  const [fromBase, setFromBase] = useState<string>('decimal');
  const [toBase, setToBase] = useState<string>('binary');
  const [inputValue, setInputValue] = useState<string>('42');
  const [bitwiseOp, setBitwiseOp] = useState<string>('and');
  const [secondValue, setSecondValue] = useState<string>('15');
  const [showBitwise, setShowBitwise] = useState<boolean>(false);
  const { toast } = useToast();

  const fromBaseInfo = useMemo(() => 
    numberBases.find(base => base.id === fromBase), 
    [fromBase]
  );

  const toBaseInfo = useMemo(() => 
    numberBases.find(base => base.id === toBase), 
    [toBase]
  );

  const convertedValue = useMemo(() => {
    if (!inputValue || !fromBaseInfo || !toBaseInfo) return null;
    
    if (!fromBaseInfo.validate(inputValue)) return null;
    
    try {
      const decimalValue = fromBaseInfo.toDecimal(inputValue);
      return toBaseInfo.fromDecimal(decimalValue);
    } catch (error) {
      return null;
    }
  }, [inputValue, fromBaseInfo, toBaseInfo]);

  const decimalValue = useMemo(() => {
    if (!inputValue || !fromBaseInfo) return null;
    
    if (!fromBaseInfo.validate(inputValue)) return null;
    
    try {
      return fromBaseInfo.toDecimal(inputValue);
    } catch (error) {
      return null;
    }
  }, [inputValue, fromBaseInfo]);

  const bitwiseResult = useMemo(() => {
    if (!decimalValue || !secondValue || !fromBaseInfo) return null;
    
    if (!fromBaseInfo.validate(secondValue)) return null;
    
    try {
      const secondDecimal = fromBaseInfo.toDecimal(secondValue);
      const operation = bitwiseOperations.find(op => op.id === bitwiseOp);
      
      if (!operation) return null;
      
      let result: number;
      if (operation.id === 'not') {
        result = operation.operation(decimalValue);
      } else if (operation.id === 'leftShift' || operation.id === 'rightShift') {
        result = operation.operation(decimalValue, secondDecimal);
      } else {
        result = operation.operation(decimalValue, secondDecimal);
      }
      
      return {
        decimal: result,
        binary: result.toString(2),
        octal: result.toString(8),
        hexadecimal: result.toString(16).toUpperCase()
      };
    } catch (error) {
      return null;
    }
  }, [decimalValue, secondValue, fromBaseInfo, bitwiseOp]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Value copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy value",
        variant: "destructive",
      });
    }
  };

  const resetAll = () => {
    setInputValue('42');
    setFromBase('decimal');
    setToBase('binary');
    setSecondValue('15');
    setBitwiseOp('and');
    setShowBitwise(false);
  };

  const swapBases = () => {
    setFromBase(toBase);
    setToBase(fromBase);
  };

  const handleInputChange = (value: string) => {
    // Remove prefix if present
    const cleanValue = value.replace(/^0[bxo]/, '');
    setInputValue(cleanValue);
  };

  const getInputWithPrefix = (value: string, baseId: string) => {
    const base = numberBases.find(b => b.id === baseId);
    return base ? base.prefix + value : value;
  };

  const getValidationError = () => {
    if (!inputValue) return null;
    if (!fromBaseInfo?.validate(inputValue)) {
      return `Invalid ${fromBaseInfo?.name} number. Only digits ${fromBaseInfo?.digits} are allowed.`;
    }
    return null;
  };

  const getNumberInfo = () => {
    if (!decimalValue) return null;
    
    return {
      isEven: decimalValue % 2 === 0,
      isPositive: decimalValue > 0,
      isPowerOf2: (decimalValue & (decimalValue - 1)) === 0,
      bitCount: decimalValue.toString(2).length,
      factors: getFactors(decimalValue),
      isPrime: isPrime(decimalValue)
    };
  };

  const getFactors = (num: number): number[] => {
    const factors: number[] = [];
    for (let i = 1; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        factors.push(i);
        if (i !== num / i) {
          factors.push(num / i);
        }
      }
    }
    return factors.sort((a, b) => a - b);
  };

  const isPrime = (num: number): boolean => {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
      if (num % i === 0) return false;
    }
    return true;
  };

  const numberInfo = getNumberInfo();
  const validationError = getValidationError();

  return (
    <div className="space-y-6">
      {/* Base Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Binary className="w-5 h-5" />
            Number Base Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="from-base">From Base</Label>
              <Select value={fromBase} onValueChange={setFromBase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {numberBases.map((base) => (
                    <SelectItem key={base.id} value={base.id}>
                      {base.name} ({base.prefix || 'none'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to-base">To Base</Label>
              <Select value={toBase} onValueChange={setToBase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {numberBases.map((base) => (
                    <SelectItem key={base.id} value={base.id}>
                      {base.name} ({base.prefix || 'none'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="input-value">Value</Label>
              <Input
                id="input-value"
                value={getInputWithPrefix(inputValue, fromBase)}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={`Enter ${fromBaseInfo?.name} number`}
                className="font-mono"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={swapBases} className="flex-1">
              Swap Bases
            </Button>
            <Button variant="outline" onClick={resetAll}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Result */}
      {convertedValue !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Conversion Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-primary mb-2 font-mono">
                {getInputWithPrefix(convertedValue, toBase)}
              </div>
              <div className="text-lg text-muted-foreground">
                {toBaseInfo?.name}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {numberBases.map((base) => (
                <div key={base.id} className="p-4 border rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-1">{base.name}</div>
                  <div className="font-mono text-lg font-medium">
                    {getInputWithPrefix(base.fromDecimal(decimalValue || 0), base.id)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(getInputWithPrefix(base.fromDecimal(decimalValue || 0), base.id))}
                    className="mt-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Number Information */}
      {numberInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Number Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-sm text-muted-foreground">Even/Odd</div>
                <Badge variant={numberInfo.isEven ? "default" : "secondary"}>
                  {numberInfo.isEven ? "Even" : "Odd"}
                </Badge>
              </div>
              
              <div className="text-center p-3 border rounded-lg">
                <div className="text-sm text-muted-foreground">Sign</div>
                <Badge variant={numberInfo.isPositive ? "default" : "secondary"}>
                  {numberInfo.isPositive ? "Positive" : "Negative"}
                </Badge>
              </div>
              
              <div className="text-center p-3 border rounded-lg">
                <div className="text-sm text-muted-foreground">Power of 2</div>
                <Badge variant={numberInfo.isPowerOf2 ? "default" : "secondary"}>
                  {numberInfo.isPowerOf2 ? "Yes" : "No"}
                </Badge>
              </div>
              
              <div className="text-center p-3 border rounded-lg">
                <div className="text-sm text-muted-foreground">Prime</div>
                <Badge variant={numberInfo.isPrime ? "default" : "secondary"}>
                  {numberInfo.isPrime ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Binary Representation</div>
                <div className="font-mono text-lg bg-muted p-3 rounded">
                  {decimalValue?.toString(2).padStart(8, '0')}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-2">Factors</div>
                <div className="flex flex-wrap gap-2">
                  {numberInfo.factors.map((factor) => (
                    <Badge key={factor} variant="outline">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bitwise Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Bitwise Operations
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBitwise(!showBitwise)}
            >
              {showBitwise ? "Hide" : "Show"}
            </Button>
          </CardTitle>
        </CardHeader>
        {showBitwise && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bitwise-op">Operation</Label>
                <Select value={bitwiseOp} onValueChange={setBitwiseOp}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bitwiseOperations.map((op) => (
                      <SelectItem key={op.id} value={op.id}>
                        {op.name} ({op.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="second-value">Second Value</Label>
                <Input
                  id="second-value"
                  value={getInputWithPrefix(secondValue, fromBase)}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter second value"
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Result</Label>
                <div className="h-10 flex items-center justify-center bg-muted rounded-md">
                  {bitwiseResult ? (
                    <span className="font-mono text-lg">
                      {getInputWithPrefix(bitwiseResult[toBase as keyof typeof bitwiseResult] || '', toBase)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </div>
            </div>
            
            {bitwiseResult && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {numberBases.map((base) => (
                  <div key={base.id} className="p-3 border rounded-lg text-center">
                    <div className="text-sm text-muted-foreground mb-1">{base.name}</div>
                    <div className="font-mono text-sm">
                      {getInputWithPrefix(bitwiseResult[base.id as keyof typeof bitwiseResult] || '', base.id)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Error Display */}
      {validationError && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive text-center">
              {validationError}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Number Base Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Binary: Base-2, uses only 0 and 1 (prefix: 0b)</li>
            <li>• Octal: Base-8, uses digits 0-7 (prefix: 0o)</li>
            <li>• Decimal: Base-10, uses digits 0-9 (no prefix)</li>
            <li>• Hexadecimal: Base-16, uses digits 0-9 and A-F (prefix: 0x)</li>
            <li>• Use bitwise operations for low-level programming tasks</li>
            <li>• All conversions are performed using JavaScript's built-in functions</li>
            <li>• Negative numbers are supported for all operations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
