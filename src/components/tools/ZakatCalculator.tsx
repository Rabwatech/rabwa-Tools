import { useState } from "react";
import { Coins, Calculator, Info, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ZakatCalculator = () => {
  const [assets, setAssets] = useState({
    gold: "",
    silver: "",
    cash: "",
    investments: "",
    business: "",
    livestock: ""
  });
  const [nisabType, setNisabType] = useState("gold");
  const [results, setResults] = useState<any>(null);

  const nisabValues = {
    gold: 87.48, // grams
    silver: 612.36 // grams
  };

  const currentPrices = {
    gold: 250, // SAR per gram (approximate)
    silver: 3.5 // SAR per gram (approximate)
  };

  const calculateZakat = () => {
    const totalAssets = Object.values(assets).reduce((sum, value) => {
      return sum + (parseFloat(value) || 0);
    }, 0);

    const nisabValue = nisabType === "gold" 
      ? nisabValues.gold * currentPrices.gold
      : nisabValues.silver * currentPrices.silver;

    if (totalAssets < nisabValue) {
      setResults({
        totalAssets: totalAssets.toFixed(2),
        nisabValue: nisabValue.toFixed(2),
        zakatDue: 0,
        isNisabReached: false
      });
      return;
    }

    const zakatDue = totalAssets * 0.025; // 2.5%

    const breakdown = {
      gold: parseFloat(assets.gold) || 0,
      silver: parseFloat(assets.silver) || 0,
      cash: parseFloat(assets.cash) || 0,
      investments: parseFloat(assets.investments) || 0,
      business: parseFloat(assets.business) || 0,
      livestock: parseFloat(assets.livestock) || 0
    };

    setResults({
      totalAssets: totalAssets.toFixed(2),
      nisabValue: nisabValue.toFixed(2),
      zakatDue: zakatDue.toFixed(2),
      isNisabReached: true,
      breakdown
    });
  };

  const resetCalculator = () => {
    setAssets({
      gold: "",
      silver: "",
      cash: "",
      investments: "",
      business: "",
      livestock: ""
    });
    setNisabType("gold");
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Coins className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Zakat Calculator</h2>
        <p className="text-muted-foreground">
          Calculate Zakat for various asset types with Nisab thresholds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Asset Values
            </CardTitle>
            <CardDescription>
              Enter the current value of your assets in SAR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nisabType">Nisab Type</Label>
              <Select value={nisabType} onValueChange={setNisabType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Nisab type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold">Gold (87.48g)</SelectItem>
                  <SelectItem value="silver">Silver (612.36g)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gold">Gold Value (SAR)</Label>
              <Input
                id="gold"
                type="number"
                placeholder="Enter gold value"
                value={assets.gold}
                onChange={(e) => setAssets({...assets, gold: e.target.value})}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="silver">Silver Value (SAR)</Label>
              <Input
                id="silver"
                type="number"
                placeholder="Enter silver value"
                value={assets.silver}
                onChange={(e) => setAssets({...assets, silver: e.target.value})}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cash">Cash & Bank (SAR)</Label>
              <Input
                id="cash"
                type="number"
                placeholder="Enter cash value"
                value={assets.cash}
                onChange={(e) => setAssets({...assets, cash: e.target.value})}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investments">Investments (SAR)</Label>
              <Input
                id="investments"
                type="number"
                placeholder="Enter investment value"
                value={assets.investments}
                onChange={(e) => setAssets({...assets, investments: e.target.value})}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business">Business Assets (SAR)</Label>
              <Input
                id="business"
                type="number"
                placeholder="Enter business value"
                value={assets.business}
                onChange={(e) => setAssets({...assets, business: e.target.value})}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="livestock">Livestock Value (SAR)</Label>
              <Input
                id="livestock"
                type="number"
                placeholder="Enter livestock value"
                value={assets.livestock}
                onChange={(e) => setAssets({...assets, livestock: e.target.value})}
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateZakat} className="flex-1">
                Calculate Zakat
              </Button>
              <Button onClick={resetCalculator} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Zakat Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Assets</p>
                  <p className="text-2xl font-bold text-primary">
                    SAR {results.totalAssets}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Nisab Value</p>
                  <p className="text-2xl font-bold text-blue-600">
                    SAR {results.nisabValue}
                  </p>
                </div>
                {results.isNisabReached ? (
                  <div className="text-center p-4 bg-muted rounded-lg col-span-2">
                    <p className="text-sm text-muted-foreground">Zakat Due (2.5%)</p>
                    <p className="text-2xl font-bold text-green-600">
                      SAR {results.zakatDue}
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-muted rounded-lg col-span-2">
                    <p className="text-sm text-muted-foreground">Nisab Not Reached</p>
                    <p className="text-lg font-semibold text-orange-600">
                      No Zakat Due
                    </p>
                  </div>
                )}
              </div>

              {results.isNisabReached && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Asset Breakdown</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Gold:</span>
                      <span>SAR {results.breakdown.gold.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Silver:</span>
                      <span>SAR {results.breakdown.silver.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash:</span>
                      <span>SAR {results.breakdown.cash.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investments:</span>
                      <span>SAR {results.breakdown.investments.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Business:</span>
                      <span>SAR {results.breakdown.business.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livestock:</span>
                      <span>SAR {results.breakdown.livestock.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About Zakat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">What is Zakat?</h4>
              <p className="text-sm text-muted-foreground">
                Zakat is an annual charitable payment required of Muslims who meet certain wealth criteria. 
                It is calculated as 2.5% of qualifying assets.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Nisab Threshold</h4>
              <p className="text-sm text-muted-foreground">
                Nisab is the minimum amount of wealth required before Zakat becomes obligatory. 
                It is equivalent to the value of 87.48 grams of gold or 612.36 grams of silver.
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Zakatable Assets Include:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Gold and silver (jewelry, coins, bars)</li>
              <li>• Cash and bank deposits</li>
              <li>• Investments and stocks</li>
              <li>• Business inventory and assets</li>
              <li>• Livestock and agricultural produce</li>
              <li>• Rental income from properties</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
