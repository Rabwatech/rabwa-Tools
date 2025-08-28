import { useState, useMemo } from "react";
import { Thermometer, Copy, RotateCcw, Calculator, TrendingUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TemperatureScale {
  id: string;
  name: string;
  symbol: string;
  toKelvin: (value: number) => number;
  fromKelvin: (value: number) => number;
  freezingPoint: number;
  boilingPoint: number;
  absoluteZero: number;
}

const temperatureScales: TemperatureScale[] = [
  {
    id: 'celsius',
    name: 'Celsius',
    symbol: '°C',
    toKelvin: (value) => value + 273.15,
    fromKelvin: (value) => value - 273.15,
    freezingPoint: 0,
    boilingPoint: 100,
    absoluteZero: -273.15
  },
  {
    id: 'fahrenheit',
    name: 'Fahrenheit',
    symbol: '°F',
    toKelvin: (value) => (value + 459.67) * 5/9,
    fromKelvin: (value) => value * 9/5 - 459.67,
    freezingPoint: 32,
    boilingPoint: 212,
    absoluteZero: -459.67
  },
  {
    id: 'kelvin',
    name: 'Kelvin',
    symbol: 'K',
    toKelvin: (value) => value,
    fromKelvin: (value) => value,
    freezingPoint: 273.15,
    boilingPoint: 373.15,
    absoluteZero: 0
  },
  {
    id: 'rankine',
    name: 'Rankine',
    symbol: '°R',
    toKelvin: (value) => value * 5/9,
    fromKelvin: (value) => value * 9/5,
    freezingPoint: 491.67,
    boilingPoint: 671.67,
    absoluteZero: 0
  }
];

interface CommonTemperature {
  name: string;
  celsius: number;
  description: string;
  category: string;
}

const commonTemperatures: CommonTemperature[] = [
  // Absolute Zero
  { name: 'Absolute Zero', celsius: -273.15, description: 'Theoretical minimum temperature', category: 'Scientific' },
  
  // Cryogenic
  { name: 'Liquid Nitrogen', celsius: -196, description: 'Boiling point of nitrogen', category: 'Scientific' },
  { name: 'Dry Ice', celsius: -78.5, description: 'Sublimation point of CO2', category: 'Scientific' },
  
  // Cold
  { name: 'Antarctica', celsius: -89.2, description: 'Coldest recorded on Earth', category: 'Weather' },
  { name: 'Freezing Point', celsius: 0, description: 'Water freezes', category: 'Weather' },
  
  // Cool
  { name: 'Refrigerator', celsius: 4, description: 'Typical fridge temperature', category: 'Home' },
  { name: 'Room Temperature', celsius: 20, description: 'Comfortable indoor temperature', category: 'Home' },
  
  // Warm
  { name: 'Body Temperature', celsius: 37, description: 'Normal human body temperature', category: 'Health' },
  { name: 'Hot Shower', celsius: 40, description: 'Typical shower temperature', category: 'Home' },
  
  // Hot
  { name: 'Boiling Point', celsius: 100, description: 'Water boils at sea level', category: 'Weather' },
  { name: 'Oven', celsius: 180, description: 'Typical baking temperature', category: 'Home' },
  
  // Very Hot
  { name: 'Pizza Oven', celsius: 260, description: 'Wood-fired pizza oven', category: 'Food' },
  { name: 'Iron Melting', celsius: 1538, description: 'Iron melts', category: 'Industrial' },
  
  // Extreme
  { name: 'Sun Surface', celsius: 5500, description: 'Surface of the Sun', category: 'Astronomical' },
  { name: 'Sun Core', celsius: 15000000, description: 'Core of the Sun', category: 'Astronomical' }
];

export const TemperatureConverter = () => {
  const [fromScale, setFromScale] = useState<string>('celsius');
  const [toScale, setToScale] = useState<string>('fahrenheit');
  const [inputValue, setInputValue] = useState<string>('25');
  const { toast } = useToast();

  const fromScaleInfo = useMemo(() => 
    temperatureScales.find(scale => scale.id === fromScale), 
    [fromScale]
  );

  const toScaleInfo = useMemo(() => 
    temperatureScales.find(scale => scale.id === toScale), 
    [toScale]
  );

  const convertedValue = useMemo(() => {
    if (!inputValue || !fromScaleInfo || !toScaleInfo) return null;
    
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return null;
    
    // Convert to Kelvin first, then to target scale
    const kelvinValue = fromScaleInfo.toKelvin(numValue);
    const result = toScaleInfo.fromKelvin(kelvinValue);
    
    return result;
  }, [inputValue, fromScaleInfo, toScaleInfo]);

  const kelvinValue = useMemo(() => {
    if (!inputValue || !fromScaleInfo) return null;
    
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return null;
    
    return fromScaleInfo.toKelvin(numValue);
  }, [inputValue, fromScaleInfo]);

  const allConversions = useMemo(() => {
    if (!kelvinValue) return null;
    
    return temperatureScales.map(scale => ({
      scale: scale,
      value: scale.fromKelvin(kelvinValue)
    }));
  }, [kelvinValue]);

  const temperatureCategory = useMemo(() => {
    if (!kelvinValue) return null;
    
    const celsius = fromScaleInfo?.fromKelvin(kelvinValue) || 0;
    
    if (celsius < -100) return 'Extreme Cold';
    if (celsius < -20) return 'Very Cold';
    if (celsius < 0) return 'Cold';
    if (celsius < 15) return 'Cool';
    if (celsius < 25) return 'Mild';
    if (celsius < 35) return 'Warm';
    if (celsius < 50) return 'Hot';
    if (celsius < 100) return 'Very Hot';
    return 'Extreme Heat';
  }, [kelvinValue, fromScaleInfo]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Temperature value copied to clipboard",
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
    setInputValue('25');
    setFromScale('celsius');
    setToScale('fahrenheit');
  };

  const swapScales = () => {
    setFromScale(toScale);
    setToScale(fromScale);
  };

  const setCommonTemperature = (temp: CommonTemperature) => {
    setInputValue(temp.celsius.toString());
    setFromScale('celsius');
  };

  const getTemperatureColor = (temp: number, scale: TemperatureScale) => {
    const celsius = scale.fromKelvin(scale.toKelvin(temp));
    
    if (celsius < -50) return 'text-blue-600';
    if (celsius < 0) return 'text-blue-400';
    if (celsius < 20) return 'text-green-600';
    if (celsius < 40) return 'text-yellow-600';
    if (celsius < 100) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTemperatureIcon = (temp: number, scale: TemperatureScale) => {
    const celsius = scale.fromKelvin(scale.toKelvin(temp));
    
    if (celsius < 0) return '❄️';
    if (celsius < 20) return '🌤️';
    if (celsius < 40) return '☀️';
    if (celsius < 100) return '🔥';
    return '💥';
  };

  return (
    <div className="space-y-6">
      {/* Scale Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5" />
            Temperature Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="from-scale">From Scale</Label>
              <Select value={fromScale} onValueChange={setFromScale}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {temperatureScales.map((scale) => (
                    <SelectItem key={scale.id} value={scale.id}>
                      {scale.name} ({scale.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to-scale">To Scale</Label>
              <Select value={toScale} onValueChange={setToScale}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {temperatureScales.map((scale) => (
                    <SelectItem key={scale.id} value={scale.id}>
                      {scale.name} ({scale.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="input-value">Temperature</Label>
              <Input
                id="input-value"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter temperature"
                className="text-right"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={swapScales} className="flex-1">
              Swap Scales
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
                {convertedValue.toFixed(2)} {toScaleInfo?.symbol}
              </div>
              <div className="text-lg text-muted-foreground">
                {toScaleInfo?.name}
              </div>
              {temperatureCategory && (
                <div className="mt-2">
                  <Badge variant="outline">{temperatureCategory}</Badge>
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(`${convertedValue.toFixed(2)} ${toScaleInfo?.symbol}`)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Result
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Scale Conversions */}
      {allConversions && (
        <Card>
          <CardHeader>
            <CardTitle>All Temperature Scales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {allConversions.map((conversion) => (
                <div
                  key={conversion.scale.id}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    conversion.scale.id === fromScale ? 'bg-primary/10 border-primary' : ''
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {getTemperatureIcon(conversion.value, conversion.scale)}
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${getTemperatureColor(conversion.value, conversion.scale)}`}>
                    {conversion.value.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {conversion.scale.symbol}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {conversion.scale.name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Common Temperatures */}
      <Card>
        <CardHeader>
          <CardTitle>Common Temperature References</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonTemperatures.map((temp) => (
              <div
                key={temp.name}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setCommonTemperature(temp)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-medium">{temp.name}</div>
                  <div className={`text-2xl ${getTemperatureColor(temp.celsius, temperatureScales[0])}`}>
                    {getTemperatureIcon(temp.celsius, temperatureScales[0])}
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {temp.celsius}°C
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {temp.description}
                </div>
                <Badge variant="outline" className="text-xs">
                  {temp.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scale Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About Temperature Scales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm mb-3">Key Reference Points</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Absolute Zero</span>
                  <span>0 K, -273.15°C, -459.67°F</span>
                </div>
                <div className="flex justify-between">
                  <span>Water Freezes</span>
                  <span>273.15 K, 0°C, 32°F</span>
                </div>
                <div className="flex justify-between">
                  <span>Water Boils</span>
                  <span>373.15 K, 100°C, 212°F</span>
                </div>
                <div className="flex justify-between">
                  <span>Body Temperature</span>
                  <span>310.15 K, 37°C, 98.6°F</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-3">Scale Characteristics</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Celsius</span>
                  <span>Water-based, metric standard</span>
                </div>
                <div className="flex justify-between">
                  <span>Fahrenheit</span>
                  <span>US customary, brine-based</span>
                </div>
                <div className="flex justify-between">
                  <span>Kelvin</span>
                  <span>Absolute scale, scientific</span>
                </div>
                <div className="flex justify-between">
                  <span>Rankine</span>
                  <span>Absolute scale, imperial</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature Conversion Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Kelvin is the absolute temperature scale (0 K = absolute zero)</li>
            <li>• Celsius and Fahrenheit are relative scales based on water</li>
            <li>• Water freezes at 0°C (32°F) and boils at 100°C (212°F)</li>
            <li>• Body temperature is 37°C (98.6°F)</li>
            <li>• Room temperature is typically 20-25°C (68-77°F)</li>
            <li>• Use the common temperatures for quick reference</li>
            <li>• All conversions are mathematically precise</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
