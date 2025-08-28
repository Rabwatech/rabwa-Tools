import { useState, useMemo } from "react";
import { Ruler, Copy, RotateCcw, Calculator, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ConversionCategory {
  id: string;
  name: string;
  units: Unit[];
}

interface Unit {
  id: string;
  name: string;
  symbol: string;
  category: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const conversionCategories: ConversionCategory[] = [
  {
    id: 'length',
    name: 'Length',
    units: [
      { id: 'mm', name: 'Millimeter', symbol: 'mm', category: 'length', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', category: 'length', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'm', name: 'Meter', symbol: 'm', category: 'length', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', name: 'Kilometer', symbol: 'km', category: 'length', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'in', name: 'Inch', symbol: 'in', category: 'length', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'ft', name: 'Foot', symbol: 'ft', category: 'length', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'yd', name: 'Yard', symbol: 'yd', category: 'length', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: 'mi', name: 'Mile', symbol: 'mi', category: 'length', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 }
    ]
  },
  {
    id: 'weight',
    name: 'Weight',
    units: [
      { id: 'mg', name: 'Milligram', symbol: 'mg', category: 'weight', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      { id: 'g', name: 'Gram', symbol: 'g', category: 'weight', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'kg', name: 'Kilogram', symbol: 'kg', category: 'weight', toBase: (v) => v, fromBase: (v) => v },
      { id: 't', name: 'Metric Ton', symbol: 't', category: 'weight', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', category: 'weight', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { id: 'lb', name: 'Pound', symbol: 'lb', category: 'weight', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { id: 'st', name: 'Stone', symbol: 'st', category: 'weight', toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 }
    ]
  },
  {
    id: 'volume',
    name: 'Volume',
    units: [
      { id: 'ml', name: 'Milliliter', symbol: 'ml', category: 'volume', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'l', name: 'Liter', symbol: 'L', category: 'volume', toBase: (v) => v, fromBase: (v) => v },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', category: 'volume', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'gal', name: 'Gallon (US)', symbol: 'gal', category: 'volume', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { id: 'qt', name: 'Quart (US)', symbol: 'qt', category: 'volume', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      { id: 'pt', name: 'Pint (US)', symbol: 'pt', category: 'volume', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
      { id: 'cup', name: 'Cup (US)', symbol: 'cup', category: 'volume', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 }
    ]
  },
  {
    id: 'area',
    name: 'Area',
    units: [
      { id: 'mm2', name: 'Square Millimeter', symbol: 'mm²', category: 'area', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', category: 'area', toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
      { id: 'm2', name: 'Square Meter', symbol: 'm²', category: 'area', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km2', name: 'Square Kilometer', symbol: 'km²', category: 'area', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      { id: 'in2', name: 'Square Inch', symbol: 'in²', category: 'area', toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
      { id: 'ft2', name: 'Square Foot', symbol: 'ft²', category: 'area', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      { id: 'yd2', name: 'Square Yard', symbol: 'yd²', category: 'area', toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
      { id: 'ac', name: 'Acre', symbol: 'ac', category: 'area', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      { id: 'ha', name: 'Hectare', symbol: 'ha', category: 'area', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 }
    ]
  },
  {
    id: 'speed',
    name: 'Speed',
    units: [
      { id: 'mps', name: 'Meters per Second', symbol: 'm/s', category: 'speed', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kmh', name: 'Kilometers per Hour', symbol: 'km/h', category: 'speed', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: 'mph', name: 'Miles per Hour', symbol: 'mph', category: 'speed', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: 'knots', name: 'Knots', symbol: 'kn', category: 'speed', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
      { id: 'fps', name: 'Feet per Second', symbol: 'ft/s', category: 'speed', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 }
    ]
  }
];

export const UnitConverter = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [inputValue, setInputValue] = useState<string>('1');
  const { toast } = useToast();

  const currentCategory = useMemo(() => 
    conversionCategories.find(cat => cat.id === selectedCategory), 
    [selectedCategory]
  );

  const fromUnitData = useMemo(() => 
    currentCategory?.units.find(unit => unit.id === fromUnit), 
    [currentCategory, fromUnit]
  );

  const toUnitData = useMemo(() => 
    currentCategory?.units.find(unit => unit.id === toUnit), 
    [currentCategory, toUnit]
  );

  const convertedValue = useMemo(() => {
    if (!inputValue || !fromUnitData || !toUnitData) return null;
    
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return null;
    
    // Convert to base unit first, then to target unit
    const baseValue = fromUnitData.toBase(numValue);
    const result = toUnitData.fromBase(baseValue);
    
    return result;
  }, [inputValue, fromUnitData, toUnitData]);

  const conversionFormula = useMemo(() => {
    if (!fromUnitData || !toUnitData) return '';
    
    if (fromUnitData.id === toUnitData.id) {
      return 'Same unit - no conversion needed';
    }
    
    return `${inputValue} ${fromUnitData.symbol} = ${convertedValue?.toFixed(6)} ${toUnitData.symbol}`;
  }, [inputValue, fromUnitData, toUnitData, convertedValue]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Conversion result copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy result",
        variant: "destructive",
      });
    }
  };

  const resetAll = () => {
    setInputValue('1');
    setFromUnit('m');
    setToUnit('ft');
    setSelectedCategory('length');
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = conversionCategories.find(cat => cat.id === categoryId);
    if (category) {
      setFromUnit(category.units[0].id);
      setToUnit(category.units[1]?.id || category.units[0].id);
    }
  };

  const getCommonConversions = () => {
    if (!currentCategory) return [];
    
    const commonPairs = [
      [currentCategory.units[0], currentCategory.units[1]],
      [currentCategory.units[1], currentCategory.units[2]],
      [currentCategory.units[2], currentCategory.units[3]]
    ].filter(([from, to]) => from && to);
    
    return commonPairs.map(([from, to]) => ({
      from: from!,
      to: to!,
      value: from.fromBase(to.toBase(1))
    }));
  };

  const commonConversions = getCommonConversions();

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Conversion Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {conversionCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`p-3 rounded-lg border transition-colors text-center ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted hover:bg-muted/80 border-border'
                }`}
              >
                <div className="text-sm font-medium">{category.name}</div>
                <div className="text-xs opacity-80">{category.units.length} units</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Convert {currentCategory?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="input-value">Value</Label>
              <Input
                id="input-value"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="text-right"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="from-unit">From</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentCategory?.units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.symbol} - {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to-unit">To</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentCategory?.units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.symbol} - {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={swapUnits} className="flex-1">
              Swap Units
            </Button>
            <Button variant="outline" onClick={resetAll}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Conversion Result */}
          {convertedValue !== null && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {convertedValue.toFixed(6)}
                </div>
                <div className="text-lg text-muted-foreground">
                  {toUnitData?.symbol}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">Conversion Formula</div>
                <div className="font-mono text-sm bg-muted p-3 rounded">
                  {conversionFormula}
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(`${convertedValue.toFixed(6)} ${toUnitData?.symbol}`)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Result
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Common Conversions */}
      {commonConversions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Common {currentCategory?.name} Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {commonConversions.map((conversion, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setFromUnit(conversion.from.id);
                    setToUnit(conversion.to.id);
                    setInputValue('1');
                  }}
                >
                  <div className="text-lg font-medium">
                    1 {conversion.from.symbol}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {conversion.value.toFixed(4)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {conversion.to.symbol}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unit Information */}
      <Card>
        <CardHeader>
          <CardTitle>About {currentCategory?.name} Units</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm mb-3">Metric Units</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                {currentCategory?.units
                  .filter(unit => ['mm', 'cm', 'm', 'km', 'mg', 'g', 'kg', 'ml', 'l', 'm3', 'mm2', 'cm2', 'm2', 'km2', 'mps', 'kmh'].includes(unit.id))
                  .map(unit => (
                    <div key={unit.id} className="flex justify-between">
                      <span>{unit.name}</span>
                      <Badge variant="outline">{unit.symbol}</Badge>
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-3">Imperial Units</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                {currentCategory?.units
                  .filter(unit => !['mm', 'cm', 'm', 'km', 'mg', 'g', 'kg', 'ml', 'l', 'm3', 'mm2', 'cm2', 'm2', 'km2', 'mps', 'kmh'].includes(unit.id))
                  .map(unit => (
                    <div key={unit.id} className="flex justify-between">
                      <span>{unit.name}</span>
                      <Badge variant="outline">{unit.symbol}</Badge>
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
          <CardTitle>Conversion Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Metric units are based on powers of 10, making conversions simple</li>
            <li>• Imperial units have historical origins and vary by country</li>
            <li>• Use the swap button to quickly reverse conversions</li>
            <li>• Common conversions show frequently used unit pairs</li>
            <li>• All conversions are calculated using standard conversion factors</li>
            <li>• Results are displayed with 6 decimal places for precision</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
