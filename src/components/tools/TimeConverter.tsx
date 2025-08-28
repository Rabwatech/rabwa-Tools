import { useState, useMemo } from "react";
import { Clock, Copy, RotateCcw, Calculator, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TimeUnit {
  id: string;
  name: string;
  symbol: string;
  toSeconds: (value: number) => number;
  fromSeconds: (value: number) => number;
  description: string;
}

const timeUnits: TimeUnit[] = [
  {
    id: 'milliseconds',
    name: 'Milliseconds',
    symbol: 'ms',
    toSeconds: (value) => value / 1000,
    fromSeconds: (value) => value * 1000,
    description: '1/1000th of a second'
  },
  {
    id: 'seconds',
    name: 'Seconds',
    symbol: 's',
    toSeconds: (value) => value,
    fromSeconds: (value) => value,
    description: 'Base unit of time'
  },
  {
    id: 'minutes',
    name: 'Minutes',
    symbol: 'min',
    toSeconds: (value) => value * 60,
    fromSeconds: (value) => value / 60,
    description: '60 seconds'
  },
  {
    id: 'hours',
    name: 'Hours',
    symbol: 'h',
    toSeconds: (value) => value * 3600,
    fromSeconds: (value) => value / 3600,
    description: '60 minutes'
  },
  {
    id: 'days',
    name: 'Days',
    symbol: 'd',
    toSeconds: (value) => value * 86400,
    fromSeconds: (value) => value / 86400,
    description: '24 hours'
  },
  {
    id: 'weeks',
    name: 'Weeks',
    symbol: 'wk',
    toSeconds: (value) => value * 604800,
    fromSeconds: (value) => value / 604800,
    description: '7 days'
  },
  {
    id: 'months',
    name: 'Months',
    symbol: 'mo',
    toSeconds: (value) => value * 2592000, // 30 days average
    fromSeconds: (value) => value / 2592000,
    description: '~30 days (average)'
  },
  {
    id: 'years',
    name: 'Years',
    symbol: 'yr',
    toSeconds: (value) => value * 31536000, // 365 days
    fromSeconds: (value) => value / 31536000,
    description: '365 days'
  }
];

interface CommonTime {
  name: string;
  seconds: number;
  description: string;
  category: string;
}

const commonTimes: CommonTime[] = [
  // Very Short
  { name: 'Blink of an Eye', seconds: 0.1, description: 'Human eye blink', category: 'Human' },
  { name: 'Lightning Flash', seconds: 0.2, description: 'Lightning bolt duration', category: 'Nature' },
  
  // Short
  { name: 'Heartbeat', seconds: 0.8, description: 'Average human heartbeat', category: 'Human' },
  { name: 'Sneeze', seconds: 2, description: 'Average sneeze duration', category: 'Human' },
  
  // Medium
  { name: 'Commercial Break', seconds: 30, description: 'TV commercial duration', category: 'Media' },
  { name: 'Microwave Minute', seconds: 60, description: 'Quick food heating', category: 'Home' },
  
  // Long
  { name: 'Coffee Break', seconds: 900, description: '15-minute break', category: 'Work' },
  { name: 'Lunch Hour', seconds: 3600, description: 'Typical lunch break', category: 'Work' },
  
  // Very Long
  { name: 'Work Day', seconds: 28800, description: '8-hour work day', category: 'Work' },
  { name: 'Weekend', seconds: 172800, description: '2-day weekend', category: 'Life' },
  
  // Extended
  { name: 'Vacation Week', seconds: 604800, description: '7-day vacation', category: 'Life' },
  { name: 'Academic Year', seconds: 31536000, description: '9-month school year', category: 'Education' }
];

interface TimeCalculation {
  id: string;
  name: string;
  description: string;
  calculate: (value: number, unit: TimeUnit) => string;
}

const timeCalculations: TimeCalculation[] = [
  {
    id: 'age',
    name: 'Age Calculator',
    description: 'Calculate age from birth date',
    calculate: (value, unit) => {
      const years = unit.fromSeconds(value) / 31536000;
      const months = (years % 1) * 12;
      const days = (months % 1) * 30;
      return `${Math.floor(years)} years, ${Math.floor(months)} months, ${Math.floor(days)} days`;
    }
  },
  {
    id: 'percentage',
    name: 'Percentage of Day',
    description: 'What percentage of a day this represents',
    calculate: (value, unit) => {
      const daySeconds = 86400;
      const percentage = (unit.toSeconds(value) / daySeconds) * 100;
      return `${percentage.toFixed(2)}% of a day`;
    }
  },
  {
    id: 'frequency',
    name: 'Frequency',
    description: 'How many times per day this occurs',
    calculate: (value, unit) => {
      const daySeconds = 86400;
      const frequency = daySeconds / unit.toSeconds(value);
      return `${frequency.toFixed(2)} times per day`;
    }
  }
];

export const TimeConverter = () => {
  const [fromUnit, setFromUnit] = useState<string>('hours');
  const [toUnit, setToUnit] = useState<string>('minutes');
  const [inputValue, setInputValue] = useState<string>('1');
  const [showCalculations, setShowCalculations] = useState<boolean>(false);
  const { toast } = useToast();

  const fromUnitInfo = useMemo(() => 
    timeUnits.find(unit => unit.id === fromUnit), 
    [fromUnit]
  );

  const toUnitInfo = useMemo(() => 
    timeUnits.find(unit => unit.id === toUnit), 
    [toUnit]
  );

  const convertedValue = useMemo(() => {
    if (!inputValue || !fromUnitInfo || !toUnitInfo) return null;
    
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return null;
    
    // Convert to seconds first, then to target unit
    const secondsValue = fromUnitInfo.toSeconds(numValue);
    const result = toUnitInfo.fromSeconds(secondsValue);
    
    return result;
  }, [inputValue, fromUnitInfo, toUnitInfo]);

  const secondsValue = useMemo(() => {
    if (!inputValue || !fromUnitInfo) return null;
    
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return null;
    
    return fromUnitInfo.toSeconds(numValue);
  }, [inputValue, fromUnitInfo]);

  const allConversions = useMemo(() => {
    if (!secondsValue) return null;
    
    return timeUnits.map(unit => ({
      unit: unit,
      value: unit.fromSeconds(secondsValue)
    }));
  }, [secondsValue]);

  const timeCategory = useMemo(() => {
    if (!secondsValue) return null;
    
    if (secondsValue < 1) return 'Very Short';
    if (secondsValue < 60) return 'Short';
    if (secondsValue < 3600) return 'Medium';
    if (secondsValue < 86400) return 'Long';
    if (secondsValue < 604800) return 'Very Long';
    if (secondsValue < 31536000) return 'Extended';
    return 'Very Extended';
  }, [secondsValue]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Time value copied to clipboard",
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
    setInputValue('1');
    setFromUnit('hours');
    setToUnit('minutes');
    setShowCalculations(false);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const setCommonTime = (time: CommonTime) => {
    setInputValue(time.seconds.toString());
    setFromUnit('seconds');
  };

  const formatTimeValue = (value: number, unit: TimeUnit) => {
    if (value < 0.01 && unit.id !== 'milliseconds') {
      return `${(value * 1000).toFixed(3)} ms`;
    }
    if (value < 1 && unit.id !== 'seconds') {
      return `${value.toFixed(3)} ${unit.symbol}`;
    }
    if (value < 1000) {
      return `${value.toFixed(2)} ${unit.symbol}`;
    }
    return `${value.toFixed(2)} ${unit.symbol}`;
  };

  const getTimeIcon = (seconds: number) => {
    if (seconds < 1) return '⚡';
    if (seconds < 60) return '⏱️';
    if (seconds < 3600) return '⏰';
    if (seconds < 86400) return '📅';
    if (seconds < 604800) return '📆';
    if (seconds < 31536000) return '🗓️';
    return '📚';
  };

  return (
    <div className="space-y-6">
      {/* Unit Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Time Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="from-unit">From Unit</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to-unit">To Unit</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="input-value">Time Value</Label>
              <Input
                id="input-value"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter time value"
                className="text-right"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={swapUnits} className="flex-1">
              Swap Units
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
              <div className="text-4xl font-bold text-primary mb-2">
                {formatTimeValue(convertedValue, toUnitInfo!)}
              </div>
              <div className="text-lg text-muted-foreground">
                {toUnitInfo?.name}
              </div>
              {timeCategory && (
                <div className="mt-2">
                  <Badge variant="outline">{timeCategory}</Badge>
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(formatTimeValue(convertedValue, toUnitInfo!))}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Result
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Unit Conversions */}
      {allConversions && (
        <Card>
          <CardHeader>
            <CardTitle>All Time Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {allConversions.map((conversion) => (
                <div
                  key={conversion.unit.id}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    conversion.unit.id === fromUnit ? 'bg-primary/10 border-primary' : ''
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {getTimeIcon(conversion.unit.toSeconds(conversion.value))}
                  </div>
                  <div className="text-lg font-bold mb-1">
                    {formatTimeValue(conversion.value, conversion.unit)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {conversion.unit.name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Calculations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Time Calculations
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCalculations(!showCalculations)}
            >
              {showCalculations ? "Hide" : "Show"}
            </Button>
          </CardTitle>
        </CardHeader>
        {showCalculations && secondsValue && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {timeCalculations.map((calc) => (
                <div key={calc.id} className="p-4 border rounded-lg">
                  <div className="text-sm font-medium mb-2">{calc.name}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {calc.description}
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {calc.calculate(parseFloat(inputValue), fromUnitInfo!)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Common Times */}
      <Card>
        <CardHeader>
          <CardTitle>Common Time References</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonTimes.map((time) => (
              <div
                key={time.name}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setCommonTime(time)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-medium">{time.name}</div>
                  <div className="text-2xl">
                    {getTimeIcon(time.seconds)}
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {formatTimeValue(time.seconds, timeUnits[1])}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {time.description}
                </div>
                <Badge variant="outline" className="text-xs">
                  {time.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unit Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About Time Units
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm mb-3">Base Units</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                {timeUnits.slice(0, 4).map((unit) => (
                  <div key={unit.id} className="flex justify-between">
                    <span>{unit.name}</span>
                    <span>{unit.description}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-3">Derived Units</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                {timeUnits.slice(4).map((unit) => (
                  <div key={unit.id} className="flex justify-between">
                    <span>{unit.name}</span>
                    <span>{unit.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Time Conversion Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Seconds are the base unit for all time calculations</li>
            <li>• Months and years use average values (30 days, 365 days)</li>
            <li>• Use common time references for quick conversions</li>
            <li>• Time calculations show interesting relationships</li>
            <li>• All conversions are mathematically precise</li>
            <li>• Very small values are automatically shown in milliseconds</li>
            <li>• Use the swap button to quickly reverse conversions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
