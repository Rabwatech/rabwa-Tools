import { useState } from "react";
import { Calculator, User, Activity } from "lucide-react";

interface BMIResult {
  bmi: number;
  category: string;
  description: string;
  color: string;
  healthRisk: string;
}

export const BMICalculator = () => {
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('170');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    if (isNaN(weightNum) || isNaN(heightNum) || weightNum <= 0 || heightNum <= 0) {
      setResult(null);
      return;
    }

    let bmi: number;
    
    if (unit === 'metric') {
      // BMI = weight(kg) / height(m)²
      const heightInMeters = heightNum / 100;
      bmi = weightNum / (heightInMeters * heightInMeters);
    } else {
      // BMI = (weight(lbs) / height(inches)²) × 703
      bmi = (weightNum / (heightNum * heightNum)) * 703;
    }

    let category: string;
    let description: string;
    let color: string;
    let healthRisk: string;

    if (bmi < 18.5) {
      category = 'نقص الوزن';
      description = 'أقل من الوزن الطبيعي';
      color = 'text-warning';
      healthRisk = 'خطر سوء التغذية، ضعف الجهاز المناعي';
    } else if (bmi < 25) {
      category = 'الوزن الطبيعي';
      description = 'نطاق الوزن الصحي';
      color = 'text-success';
      healthRisk = 'خطر منخفض من المشاكل الصحية المتعلقة بالوزن';
    } else if (bmi < 30) {
      category = 'زيادة الوزن';
      description = 'أعلى من الوزن الطبيعي';
      color = 'text-warning';
      healthRisk = 'زيادة خطر الإصابة بأمراض القلب والسكري';
    } else if (bmi < 35) {
      category = 'السمنة من الدرجة الأولى';
      description = 'سمنة معتدلة';
      color = 'text-destructive';
      healthRisk = 'خطر عالي من المضاعفات الصحية';
    } else if (bmi < 40) {
      category = 'السمنة من الدرجة الثانية';
      description = 'سمنة شديدة';
      color = 'text-destructive';
      healthRisk = 'خطر عالي جداً من المضاعفات الصحية';
    } else {
      category = 'السمنة من الدرجة الثالثة';
      description = 'سمنة شديدة جداً';
      color = 'text-destructive';
      healthRisk = 'خطر عالي للغاية من المضاعفات الصحية';
    }

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      description,
      color,
      healthRisk
    });
  };

  const handleCalculate = () => {
    calculateBMI();
  };

  const getBMIPosition = (bmi: number) => {
    // Position on a scale from 15 to 40
    const minBMI = 15;
    const maxBMI = 40;
    const position = ((bmi - minBMI) / (maxBMI - minBMI)) * 100;
    return Math.min(Math.max(position, 0), 100);
  };

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex justify-center">
        <div className="bg-muted rounded-lg p-1 flex">
          <button
            onClick={() => setUnit('metric')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              unit === 'metric' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            متري
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              unit === 'imperial' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            إمبراطوري
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            الوزن {unit === 'metric' ? '(كجم)' : '(باوند)'}
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? 'Enter weight in kg' : 'Enter weight in lbs'}
            className="tool-input"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            الطول {unit === 'metric' ? '(سم)' : '(بوصة)'}
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === 'metric' ? 'Enter height in cm' : 'Enter height in inches'}
            className="tool-input"
            min="0"
            step={unit === 'metric' ? '1' : '0.1'}
          />
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Calculator className="w-4 h-4" />
        احسب مؤشر كتلة الجسم
      </button>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {result.bmi}
              </div>
              <div className={`text-xl font-semibold mb-1 ${result.color}`}>
                {result.category}
              </div>
              <div className="text-muted-foreground">
                {result.description}
              </div>
            </div>
          </div>

          {/* BMI Scale */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">مقياس مؤشر كتلة الجسم</h4>
            <div className="relative">
              <div className="h-3 bg-gradient-to-r from-warning via-success via-warning to-destructive rounded-full"></div>
              <div 
                className="absolute top-0 w-1 h-3 bg-foreground rounded-full transform -translate-x-1/2"
                style={{ left: `${getBMIPosition(result.bmi)}%` }}
              ></div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
              <div className="text-center">
                <div className="w-3 h-3 bg-warning rounded-full mx-auto mb-1"></div>
                <span className="text-muted-foreground">نقص الوزن</span>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-success rounded-full mx-auto mb-1"></div>
                <span className="text-muted-foreground">طبيعي</span>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-warning rounded-full mx-auto mb-1"></div>
                <span className="text-muted-foreground">زيادة الوزن</span>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-destructive rounded-full mx-auto mb-1"></div>
                <span className="text-muted-foreground">سمنة</span>
              </div>
            </div>
          </div>

          {/* Health Information */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              تقييم المخاطر الصحية
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              {result.healthRisk}
            </p>
            <div className="text-xs text-muted-foreground">
              <p className="mb-2">
                <strong>ملاحظة:</strong> مؤشر كتلة الجسم هو أداة فحص وليس مقياس تشخيصي. 
                لا يأخذ في الاعتبار كتلة العضلات أو كثافة العظام أو توزيع الدهون.
              </p>
              <p>
                استشر مقدم الرعاية الصحية للحصول على تقييم صحي شامل.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BMI Categories Reference */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          فئات مؤشر كتلة الجسم
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">نقص الوزن:</span>
            <span className="font-medium text-foreground">أقل من 18.5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الوزن الطبيعي:</span>
            <span className="font-medium text-foreground">18.5 - 24.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">زيادة الوزن:</span>
            <span className="font-medium text-foreground">25.0 - 29.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">السمنة:</span>
            <span className="font-medium text-foreground">30.0 وما فوق</span>
          </div>
        </div>
      </div>
    </div>
  );
};