import { useState } from "react";
import { DollarSign, Calculator, Info, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const NetSalaryCalculator = () => {
  const [grossSalary, setGrossSalary] = useState("");
  const [deductions, setDeductions] = useState({
    socialSecurity: { enabled: true, percentage: 10, fixed: 0 },
    incomeTax: { enabled: false, percentage: 0, fixed: 0 },
    healthInsurance: { enabled: true, percentage: 2, fixed: 0 },
    pensionFund: { enabled: true, percentage: 5, fixed: 0 },
    otherDeductions: { enabled: false, percentage: 0, fixed: 0 }
  });
  const [results, setResults] = useState<any>(null);

  const calculateNetSalary = () => {
    const gross = parseFloat(grossSalary);
    if (isNaN(gross) || gross <= 0) return;

    let totalDeductions = 0;
    const deductionBreakdown: any = {};

    Object.entries(deductions).forEach(([key, deduction]) => {
      if (deduction.enabled) {
        let amount = 0;
        if (deduction.percentage > 0) {
          amount = (gross * deduction.percentage) / 100;
        }
        if (deduction.fixed > 0) {
          amount += deduction.fixed;
        }
        totalDeductions += amount;
        deductionBreakdown[key] = amount;
      }
    });

    const netSalary = gross - totalDeductions;

    setResults({
      grossSalary: gross.toFixed(2),
      totalDeductions: totalDeductions.toFixed(2),
      netSalary: netSalary.toFixed(2),
      deductionBreakdown
    });
  };

  const resetCalculator = () => {
    setGrossSalary("");
    setDeductions({
      socialSecurity: { enabled: true, percentage: 10, fixed: 0 },
      incomeTax: { enabled: false, percentage: 0, fixed: 0 },
      healthInsurance: { enabled: true, percentage: 2, fixed: 0 },
      pensionFund: { enabled: true, percentage: 5, fixed: 0 },
      otherDeductions: { enabled: false, percentage: 0, fixed: 0 }
    });
    setResults(null);
  };

  const updateDeduction = (key: string, field: 'enabled' | 'percentage' | 'fixed', value: any) => {
    setDeductions(prev => ({
      ...prev,
      [key]: {
        ...prev[key as keyof typeof deductions],
        [field]: field === 'enabled' ? value : parseFloat(value) || 0
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Net Salary Calculator</h2>
        <p className="text-muted-foreground">
          Calculate net salary after deductions and benefits
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Salary Details
            </CardTitle>
            <CardDescription>
              Enter gross salary and configure deductions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grossSalary">Gross Salary (SAR)</Label>
              <Input
                id="grossSalary"
                type="number"
                placeholder="Enter gross salary"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Deductions</h4>
              
              {/* Social Security */}
              <div className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ss-enabled">Social Security</Label>
                  <Switch
                    id="ss-enabled"
                    checked={deductions.socialSecurity.enabled}
                    onCheckedChange={(checked) => updateDeduction('socialSecurity', 'enabled', checked)}
                  />
                </div>
                {deductions.socialSecurity.enabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="ss-percentage">Percentage (%)</Label>
                      <Input
                        id="ss-percentage"
                        type="number"
                        value={deductions.socialSecurity.percentage}
                        onChange={(e) => updateDeduction('socialSecurity', 'percentage', e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ss-fixed">Fixed Amount (SAR)</Label>
                      <Input
                        id="ss-fixed"
                        type="number"
                        value={deductions.socialSecurity.fixed}
                        onChange={(e) => updateDeduction('socialSecurity', 'fixed', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Income Tax */}
              <div className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tax-enabled">Income Tax</Label>
                  <Switch
                    id="tax-enabled"
                    checked={deductions.incomeTax.enabled}
                    onCheckedChange={(checked) => updateDeduction('incomeTax', 'enabled', checked)}
                  />
                </div>
                {deductions.incomeTax.enabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="tax-percentage">Percentage (%)</Label>
                      <Input
                        id="tax-percentage"
                        type="number"
                        value={deductions.incomeTax.percentage}
                        onChange={(e) => updateDeduction('incomeTax', 'percentage', e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tax-fixed">Fixed Amount (SAR)</Label>
                      <Input
                        id="tax-fixed"
                        type="number"
                        value={deductions.incomeTax.fixed}
                        onChange={(e) => updateDeduction('incomeTax', 'fixed', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Health Insurance */}
              <div className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="health-enabled">Health Insurance</Label>
                  <Switch
                    id="health-enabled"
                    checked={deductions.healthInsurance.enabled}
                    onCheckedChange={(checked) => updateDeduction('healthInsurance', 'enabled', checked)}
                  />
                </div>
                {deductions.healthInsurance.enabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="health-percentage">Percentage (%)</Label>
                      <Input
                        id="health-percentage"
                        type="number"
                        value={deductions.healthInsurance.percentage}
                        onChange={(e) => updateDeduction('healthInsurance', 'percentage', e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="health-fixed">Fixed Amount (SAR)</Label>
                      <Input
                        id="health-fixed"
                        type="number"
                        value={deductions.healthInsurance.fixed}
                        onChange={(e) => updateDeduction('healthInsurance', 'fixed', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Pension Fund */}
              <div className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pension-enabled">Pension Fund</Label>
                  <Switch
                    id="pension-enabled"
                    checked={deductions.pensionFund.enabled}
                    onCheckedChange={(checked) => updateDeduction('pensionFund', 'enabled', checked)}
                  />
                </div>
                {deductions.pensionFund.enabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="pension-percentage">Percentage (%)</Label>
                      <Input
                        id="pension-percentage"
                        type="number"
                        value={deductions.pensionFund.percentage}
                        onChange={(e) => updateDeduction('pensionFund', 'percentage', e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pension-fixed">Fixed Amount (SAR)</Label>
                      <Input
                        id="pension-fixed"
                        type="number"
                        value={deductions.pensionFund.fixed}
                        onChange={(e) => updateDeduction('pensionFund', 'fixed', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Other Deductions */}
              <div className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="other-enabled">Other Deductions</Label>
                  <Switch
                    id="other-enabled"
                    checked={deductions.otherDeductions.enabled}
                    onCheckedChange={(checked) => updateDeduction('otherDeductions', 'enabled', checked)}
                  />
                </div>
                {deductions.otherDeductions.enabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="other-percentage">Percentage (%)</Label>
                      <Input
                        id="other-percentage"
                        type="number"
                        value={deductions.otherDeductions.percentage}
                        onChange={(e) => updateDeduction('otherDeductions', 'percentage', e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="other-fixed">Fixed Amount (SAR)</Label>
                      <Input
                        id="other-fixed"
                        type="number"
                        value={deductions.otherDeductions.fixed}
                        onChange={(e) => updateDeduction('otherDeductions', 'fixed', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateNetSalary} className="flex-1">
                Calculate Net Salary
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
                Salary Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Gross Salary</p>
                  <p className="text-2xl font-bold text-primary">
                    SAR {results.grossSalary}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Deductions</p>
                  <p className="text-2xl font-bold text-destructive">
                    SAR {results.totalDeductions}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Net Salary</p>
                  <p className="text-2xl font-bold text-green-600">
                    SAR {results.netSalary}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Deduction Breakdown</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(results.deductionBreakdown).map(([key, amount]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span>SAR {Number(amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About Salary Deductions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Common Deductions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Social Security: 10% of gross salary</li>
                <li>• Health Insurance: 2-5% of gross salary</li>
                <li>• Pension Fund: 5-10% of gross salary</li>
                <li>• Income Tax: Varies by country and income level</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Calculation Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Deductions can be percentage-based or fixed amounts</li>
                <li>• Some deductions have maximum limits</li>
                <li>• Benefits may reduce taxable income</li>
                <li>• Consult HR for company-specific policies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
