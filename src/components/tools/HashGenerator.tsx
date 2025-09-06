import { useState, useMemo } from "react";
import { Hash, Copy, RotateCcw, Download, Settings, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface HashOptions {
  algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512';
  outputFormat: 'hex' | 'base64' | 'binary';
  includeOriginal: boolean;
  showComparison: boolean;
  caseSensitive: boolean;
}

interface HashResult {
  algorithm: string;
  hash: string;
  originalText: string;
  timestamp: string;
}

export const HashGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [options, setOptions] = useState<HashOptions>({
    algorithm: 'sha256',
    outputFormat: 'hex',
    includeOriginal: true,
    showComparison: false,
    caseSensitive: true
  });
  const { toast } = useToast();

  const generateHash = async () => {
    if (!inputText.trim()) {
      toast({
        title: "لا يوجد نص للتجزئة",
        description: "يرجى إدخال بعض النص أولاً",
        variant: "destructive",
      });
      return;
    }

    try {
      const textToHash = options.caseSensitive ? inputText : inputText.toLowerCase();
      const hash = await generateHashValue(textToHash, options.algorithm, options.outputFormat);
      
      const newResult: HashResult = {
        algorithm: options.algorithm.toUpperCase(),
        hash,
        originalText: inputText,
        timestamp: new Date().toISOString()
      };
      
      setHashResults(prev => [newResult, ...prev]);
      
      toast({
        title: "تم إنشاء التجزئة",
        description: `تم إنشاء تجزئة ${options.algorithm.toUpperCase()} بنجاح`,
      });
    } catch (error) {
      toast({
        title: "فشل في إنشاء التجزئة",
        description: error instanceof Error ? error.message : "فشل في إنشاء التجزئة",
        variant: "destructive",
      });
    }
  };

  const generateHashValue = async (text: string, algorithm: string, format: string): Promise<string> => {
    // Use Web Crypto API for modern browsers
    if (window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      let hashBuffer: ArrayBuffer;
      
      switch (algorithm) {
        case 'sha1':
          hashBuffer = await window.crypto.subtle.digest('SHA-1', data);
          break;
        case 'sha256':
          hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
          break;
        case 'sha512':
          hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
          break;
        default:
          throw new Error('Unsupported algorithm');
      }
      
      return formatHashOutput(hashBuffer, format);
    } else {
      // Fallback for older browsers (basic implementation)
      return generateFallbackHash(text, algorithm, format);
    }
  };

  const formatHashOutput = (buffer: ArrayBuffer, format: string): string => {
    const uint8Array = new Uint8Array(buffer);
    
    switch (format) {
      case 'hex':
        return Array.from(uint8Array)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      case 'base64':
        return btoa(String.fromCharCode(...uint8Array));
      case 'binary':
        return Array.from(uint8Array)
          .map(b => b.toString(2).padStart(8, '0'))
          .join('');
      default:
        return Array.from(uint8Array)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
    }
  };

  const generateFallbackHash = (text: string, algorithm: string, format: string): string => {
    // Simple fallback hash function (not cryptographically secure)
    let hash = 0;
    const prime = 31;
    
    for (let i = 0; i < text.length; i++) {
      hash = (hash * prime + text.charCodeAt(i)) >>> 0;
    }
    
    // Convert to different formats
    switch (format) {
      case 'hex':
        return hash.toString(16).padStart(8, '0');
      case 'base64':
        return btoa(hash.toString());
      case 'binary':
        return hash.toString(2).padStart(32, '0');
      default:
        return hash.toString(16).padStart(8, '0');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "تم النسخ!",
        description: "تم نسخ التجزئة إلى الحافظة",
      });
    } catch (err) {
      toast({
        title: "خطأ",
        description: "فشل في نسخ التجزئة",
        variant: "destructive",
      });
    }
  };

  const downloadResults = () => {
    if (hashResults.length === 0) return;
    
    let content = 'نتائج إنشاء التجزئة\n';
    content += '='.repeat(50) + '\n\n';
    
    hashResults.forEach((result, index) => {
      content += `التجزئة رقم ${index + 1}\n`;
      content += `الخوارزمية: ${result.algorithm}\n`;
      content += `التجزئة: ${result.hash}\n`;
      if (options.includeOriginal) {
        content += `النص الأصلي: ${result.originalText}\n`;
      }
      content += `الطابع الزمني: ${new Date(result.timestamp).toLocaleString()}\n`;
      content += '-'.repeat(30) + '\n\n';
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hash-results-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
              title: "تم التحميل!",
        description: "تم حفظ نتائج التجزئة في الملف",
    });
  };

  const resetAll = () => {
    setInputText('');
    setHashResults([]);
    setOptions({
      algorithm: 'sha256',
      outputFormat: 'hex',
      includeOriginal: true,
      showComparison: false,
      caseSensitive: true
    });
  };

  const clearResults = () => {
    setHashResults([]);
  };

  const getHashStats = () => {
    if (hashResults.length === 0) return null;
    
    const totalHashes = hashResults.length;
    const algorithms = [...new Set(hashResults.map(r => r.algorithm))];
    const averageLength = hashResults.reduce((sum, r) => sum + r.hash.length, 0) / totalHashes;
    
    return {
      totalHashes,
      algorithms,
      averageLength: Math.round(averageLength)
    };
  };

  const stats = getHashStats();

  return (
    <div className="space-y-6">
      {/* Hash Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            خيارات التجزئة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Algorithm and Format Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">خوارزمية التجزئة</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['md5', 'sha1', 'sha256', 'sha512'] as const).map((algo) => (
                  <div key={algo} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={algo}
                      name="algorithm"
                      checked={options.algorithm === algo}
                      onChange={() => setOptions(prev => ({ ...prev, algorithm: algo }))}
                      className="w-4 h-4 text-primary"
                    />
                    <Label htmlFor={algo} className="text-sm font-medium uppercase">
                      {algo}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">تنسيق الإخراج</Label>
              <div className="space-y-2">
                {(['hex', 'base64', 'binary'] as const).map((format) => (
                  <div key={format} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={format}
                      name="outputFormat"
                      checked={options.outputFormat === format}
                      onChange={() => setOptions(prev => ({ ...prev, outputFormat: format }))}
                      className="w-4 h-4 text-primary"
                    />
                    <Label htmlFor={format} className="text-sm capitalize">
                      {format}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">خيارات العرض</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="include-original"
                    checked={options.includeOriginal}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeOriginal: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="include-original" className="text-sm">
                    تضمين النص الأصلي
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show-comparison"
                    checked={options.showComparison}
                    onChange={(e) => setOptions(prev => ({ ...prev, showComparison: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="show-comparison" className="text-sm">
                    عرض مقارنة التجزئة
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">خيارات المعالجة</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="case-sensitive"
                    checked={options.caseSensitive}
                    onChange={(e) => setOptions(prev => ({ ...prev, caseSensitive: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="case-sensitive" className="text-sm">
                    حساس لحالة الأحرف
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Text */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="input-text">النص للتجزئة</Label>
          <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="أدخل النص لإنشاء التجزئة..."
            className="min-h-[150px]"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={generateHash} disabled={!inputText.trim()} className="flex-1">
            <Hash className="w-4 h-4 mr-2" />
            إنشاء تجزئة {options.algorithm.toUpperCase()}
          </Button>
          <Button variant="outline" onClick={resetAll}>
            <RotateCcw className="w-4 h-4 mr-2" />
            إعادة تعيين الكل
          </Button>
        </div>
      </div>

      {/* Hash Results */}
      {hashResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-medium">التجزئات المنشأة</Label>
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadResults} size="sm">
                <Download className="w-4 h-4 mr-2" />
                تحميل الكل
              </Button>
              <Button variant="outline" onClick={clearResults} size="sm">
                مسح النتائج
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {hashResults.map((result, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{result.algorithm}</Badge>
                      <Badge variant="secondary">{options.outputFormat.toUpperCase()}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm break-all">
                      {result.hash}
                    </div>
                    
                    {options.includeOriginal && (
                      <div className="text-sm">
                        <span className="font-medium">الأصلي:</span>
                        <span className="ml-2 text-muted-foreground">{result.originalText}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(result.hash)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        نسخ التجزئة
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(result.originalText)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        نسخ النص
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>إحصائيات التجزئة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalHashes}</div>
                <div className="text-muted-foreground">إجمالي التجزئات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{stats.algorithms.length}</div>
                <div className="text-muted-foreground">الخوارزميات المستخدمة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.averageLength}</div>
                <div className="text-muted-foreground">متوسط طول التجزئة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hash Comparison */}
      {options.showComparison && hashResults.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>مقارنة التجزئة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">الخوارزمية</th>
                    <th className="text-left p-2">التجزئة</th>
                    <th className="text-left p-2">الطول</th>
                    <th className="text-left p-2">التنسيق</th>
                  </tr>
                </thead>
                <tbody>
                  {hashResults.map((result, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{result.algorithm}</td>
                      <td className="p-2 font-mono text-xs max-w-[200px] truncate" title={result.hash}>
                        {result.hash}
                      </td>
                      <td className="p-2">{result.hash.length}</td>
                      <td className="p-2">{options.outputFormat.toUpperCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information */}
      <Card>
        <CardHeader>
                      <CardTitle>حول دوال التجزئة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              دوال التجزئة هي دوال رياضية تحول بيانات الإدخال من حجم عشوائي إلى سلسلة من الأحرف بحجم ثابت.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-medium text-sm mb-2">أنواع التجزئة:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>MD5:</strong> 128-bit hash (not secure)</li>
                  <li>• <strong>SHA-1:</strong> 160-bit hash (not secure)</li>
                  <li>• <strong>SHA-256:</strong> 256-bit hash (secure)</li>
                  <li>• <strong>SHA-512:</strong> 512-bit hash (secure)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">حالات الاستخدام:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• التحقق من كلمات المرور</li>
                  <li>• فحص سلامة الملفات</li>
                  <li>• التوقيعات الرقمية</li>
                  <li>• إزالة تكرار البيانات</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
                      <CardTitle>نصائح الأمان</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>MD5 و SHA-1 مكسوران تشفيرياً</strong> - تجنب استخدامهما للأغراض الأمنية</li>
            <li>• <strong>SHA-256 و SHA-512 آمنان</strong> لمعظم التطبيقات</li>
            <li>• استخدم دائماً الملح مع تجزئة كلمات المرور</li>
            <li>• دوال التجزئة أحادية الاتجاه - لا يمكن عكسها</li>
            <li>• استخدمها لسلامة البيانات، وليس للتشفير</li>
            <li>• فكر في استخدام خوارزميات تجزئة كلمات المرور المتخصصة مثل bcrypt</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
