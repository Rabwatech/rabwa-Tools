import { useState, useEffect } from "react";
import { Palette, Eye, CheckCircle, XCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ColorContrastChecker = () => {
  const [foregroundColor, setForegroundColor] = useState("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState("#4A638D");
  const [contrastRatio, setContrastRatio] = useState(0);
  const [wcagResults, setWcagResults] = useState<{
    AA: { normal: boolean; large: boolean };
    AAA: { normal: boolean; large: boolean };
  }>({ AA: { normal: false, large: false }, AAA: { normal: false, large: false } });

  useEffect(() => {
    calculateContrast();
  }, [foregroundColor, backgroundColor]);

  const calculateContrast = () => {
    const ratio = getContrastRatio(foregroundColor, backgroundColor);
    setContrastRatio(ratio);
    
    // WCAG 2.1 guidelines
    const aaNormal = ratio >= 4.5;
    const aaLarge = ratio >= 3;
    const aaaNormal = ratio >= 7;
    const aaaLarge = ratio >= 4.5;
    
    setWcagResults({
      AA: { normal: aaNormal, large: aaLarge },
      AAA: { normal: aaaNormal, large: aaaLarge }
    });
  };

  const getContrastRatio = (color1: string, color2: string) => {
    const luminance1 = getRelativeLuminance(color1);
    const luminance2 = getRelativeLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  };

  const getRelativeLuminance = (hexColor: string) => {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return 0;
    
    const { r, g, b } = rgb;
    
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;
    
    const rL = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gL = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bL = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
    
    return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getContrastColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const getContrastRating = (ratio: number) => {
    if (ratio >= 7) return { rating: "Excellent", color: "text-green-600", bg: "bg-green-100" };
    if (ratio >= 4.5) return { rating: "Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (ratio >= 3) return { rating: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { rating: "Poor", color: "text-red-600", bg: "bg-red-100" };
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const generateRandomColors = () => {
    const colors = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
      "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
      "#F8C471", "#82E0AA", "#F1948A", "#85C1E9", "#D7BDE2",
      "#FFFFFF", "#000000", "#333333", "#666666", "#999999"
    ];
    
    const fg = colors[Math.floor(Math.random() * colors.length)];
    const bg = colors[Math.floor(Math.random() * colors.length)];
    
    setForegroundColor(fg);
    setBackgroundColor(bg);
  };

  const swapColors = () => {
    setForegroundColor(backgroundColor);
    setBackgroundColor(foregroundColor);
  };

  const contrastRating = getContrastRating(contrastRatio);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Palette className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Color Contrast Checker</h2>
        <p className="text-muted-foreground">
          Check color contrast ratios for accessibility compliance with WCAG guidelines
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Selection
            </CardTitle>
            <CardDescription>
              Choose foreground and background colors to test contrast
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="foregroundColor">Foreground Color (Text)</Label>
              <div className="flex gap-2">
                <Input
                  id="foregroundColor"
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  placeholder="#FFFFFF"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="#4A638D"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={swapColors} variant="outline" className="flex-1">
                Swap Colors
              </Button>
              <Button onClick={generateRandomColors} variant="outline">
                Random Colors
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Color Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="p-6 rounded-lg border-2 border-dashed"
              style={{ backgroundColor: backgroundColor }}
            >
              <div 
                className="text-2xl font-bold text-center"
                style={{ color: foregroundColor }}
              >
                Sample Text
              </div>
              <div 
                className="text-lg text-center mt-2"
                style={{ color: foregroundColor }}
              >
                This is how your colors will look together
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Foreground: {foregroundColor}</p>
              <p>Background: {backgroundColor}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle>Contrast Analysis Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contrast Ratio */}
          <div className="text-center p-6 border rounded-lg">
            <div className="text-3xl font-bold mb-2">
              {contrastRatio.toFixed(2)}:1
            </div>
            <Badge 
              className={`${contrastRating.bg} ${contrastRating.color} text-sm px-3 py-1`}
            >
              {contrastRating.rating} Contrast
            </Badge>
          </div>

          {/* WCAG Compliance */}
          <div>
            <h3 className="font-semibold mb-4">WCAG 2.1 Compliance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-lg">Level AA</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Normal Text (4.5:1)</span>
                    {wcagResults.AA.normal ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Large Text (3:1)</span>
                    {wcagResults.AA.large ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-lg">Level AAA</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Normal Text (7:1)</span>
                    {wcagResults.AAA.normal ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Large Text (4.5:1)</span>
                    {wcagResults.AAA.large ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copy Results */}
          <div className="flex gap-2">
            <Button 
              onClick={() => copyToClipboard(`Contrast Ratio: ${contrastRatio.toFixed(2)}:1\nForeground: ${foregroundColor}\nBackground: ${backgroundColor}`)}
              variant="outline"
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">WCAG 2.1 Level AA</h4>
              <p className="text-sm text-muted-foreground">
                Minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (18pt+ or 14pt+ bold).
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">WCAG 2.1 Level AAA</h4>
              <p className="text-sm text-muted-foreground">
                Enhanced contrast ratio of 7:1 for normal text and 4.5:1 for large text.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Large Text Definition</h4>
              <p className="text-sm text-muted-foreground">
                Text that is at least 18pt or 14pt bold is considered large text for contrast requirements.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Best Practices</h4>
              <p className="text-sm text-muted-foreground">
                Aim for contrast ratios above 7:1 for optimal readability, especially for body text and important content.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
