import { useState } from "react";
import { Palette, Copy, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-components";

export const ColorPaletteGenerator = () => {
  const [baseColor, setBaseColor] = useState("#4A638D");
  const [colorTheory, setColorTheory] = useState("monochromatic");
  const [paletteSize, setPaletteSize] = useState("5");
  const [generatedPalette, setGeneratedPalette] = useState<string[]>([]);

  const generatePalette = () => {
    const colors: string[] = [];
    const baseHSL = hexToHSL(baseColor);
    
    switch (colorTheory) {
      case "monochromatic":
        colors.push(...generateMonochromatic(baseHSL, parseInt(paletteSize)));
        break;
      case "analogous":
        colors.push(...generateAnalogous(baseHSL, parseInt(paletteSize)));
        break;
      case "complementary":
        colors.push(...generateComplementary(baseHSL, parseInt(paletteSize)));
        break;
      case "triadic":
        colors.push(...generateTriadic(baseHSL, parseInt(paletteSize)));
        break;
      case "tetradic":
        colors.push(...generateTetradic(baseHSL, parseInt(paletteSize)));
        break;
      case "split-complementary":
        colors.push(...generateSplitComplementary(baseHSL, parseInt(paletteSize)));
        break;
    }
    
    setGeneratedPalette(colors);
  };

  const hexToHSL = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const HSLToHex = (h: number, s: number, l: number) => {
    h = h % 360;
    s = Math.max(0, Math.min(100, s));
    l = Math.max(0, Math.min(100, l));

    const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l / 100 - c / 2;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }

    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  };

  const generateMonochromatic = (base: { h: number; s: number; l: number }, size: number) => {
    const colors = [baseColor];
    const step = 100 / (size - 1);
    
    for (let i = 1; i < size; i++) {
      const lightness = Math.max(10, Math.min(90, base.l + (i * step - 50)));
      colors.push(HSLToHex(base.h, base.s, lightness));
    }
    
    return colors;
  };

  const generateAnalogous = (base: { h: number; s: number; l: number }, size: number) => {
    const colors = [baseColor];
    const step = 30;
    
    for (let i = 1; i < size; i++) {
      const hue = (base.h + i * step) % 360;
      colors.push(HSLToHex(hue, base.s, base.l));
    }
    
    return colors;
  };

  const generateComplementary = (base: { h: number; s: number; l: number }, size: number) => {
    const colors = [baseColor];
    const complementaryHue = (base.h + 180) % 360;
    
    for (let i = 1; i < size; i++) {
      if (i === 1) {
        colors.push(HSLToHex(complementaryHue, base.s, base.l));
      } else {
        const lightness = Math.max(10, Math.min(90, base.l + (i * 15)));
        colors.push(HSLToHex(base.h, base.s, lightness));
      }
    }
    
    return colors;
  };

  const generateTriadic = (base: { h: number; s: number; l: number }, size: number) => {
    const colors = [baseColor];
    const triadicHue1 = (base.h + 120) % 360;
    const triadicHue2 = (base.h + 240) % 360;
    
    colors.push(HSLToHex(triadicHue1, base.s, base.l));
    colors.push(HSLToHex(triadicHue2, base.s, base.l));
    
    // Add variations
    for (let i = 3; i < size; i++) {
      const hue = i % 2 === 0 ? triadicHue1 : triadicHue2;
      const lightness = Math.max(10, Math.min(90, base.l + (i * 10)));
      colors.push(HSLToHex(hue, base.s, lightness));
    }
    
    return colors.slice(0, size);
  };

  const generateTetradic = (base: { h: number; s: number; l: number }, size: number) => {
    const colors = [baseColor];
    const tetradicHue1 = (base.h + 90) % 360;
    const tetradicHue2 = (base.h + 180) % 360;
    const tetradicHue3 = (base.h + 270) % 360;
    
    colors.push(HSLToHex(tetradicHue1, base.s, base.l));
    colors.push(HSLToHex(tetradicHue2, base.s, base.l));
    colors.push(HSLToHex(tetradicHue3, base.s, base.l));
    
    return colors.slice(0, size);
  };

  const generateSplitComplementary = (base: { h: number; s: number; l: number }, size: number) => {
    const colors = [baseColor];
    const splitHue1 = (base.h + 150) % 360;
    const splitHue2 = (base.h + 210) % 360;
    
    colors.push(HSLToHex(splitHue1, base.s, base.l));
    colors.push(HSLToHex(splitHue2, base.s, base.l));
    
    // Add variations
    for (let i = 3; i < size; i++) {
      const hue = i % 2 === 0 ? splitHue1 : splitHue2;
      const lightness = Math.max(10, Math.min(90, base.l + (i * 10)));
      colors.push(HSLToHex(hue, base.s, lightness));
    }
    
    return colors.slice(0, size);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadCSS = () => {
    const css = generatedPalette.map((color, index) => 
      `--color-${index + 1}: ${color};`
    ).join('\n');
    
    const blob = new Blob([`:root {\n${css}\n}`], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Palette className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Color Palette Generator</h2>
        <p className="text-muted-foreground">
          Generate harmonious color palettes using color theory principles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Palette Settings
            </CardTitle>
            <CardDescription>
              Choose base color, color theory, and palette size
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseColor">Base Color</Label>
              <div className="flex gap-2">
                <Input
                  id="baseColor"
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  placeholder="#4A638D"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colorTheory">Color Theory</Label>
              <Select value={colorTheory} onValueChange={setColorTheory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monochromatic">Monochromatic</SelectItem>
                  <SelectItem value="analogous">Analogous</SelectItem>
                  <SelectItem value="complementary">Complementary</SelectItem>
                  <SelectItem value="triadic">Triadic</SelectItem>
                  <SelectItem value="tetradic">Tetradic</SelectItem>
                  <SelectItem value="split-complementary">Split-Complementary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paletteSize">Palette Size</Label>
              <Select value={paletteSize} onValueChange={setPaletteSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Colors</SelectItem>
                  <SelectItem value="4">4 Colors</SelectItem>
                  <SelectItem value="5">5 Colors</SelectItem>
                  <SelectItem value="6">6 Colors</SelectItem>
                  <SelectItem value="8">8 Colors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={generatePalette} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Palette
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {generatedPalette.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Generated Palette
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {generatedPalette.map((color, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div 
                      className="w-12 h-12 rounded-lg border"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1">
                      <div className="font-mono text-sm">{color}</div>
                      <div className="text-xs text-muted-foreground">
                        Color {index + 1}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(color)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => copyToClipboard(generatedPalette.join('\n'))}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Colors
                </Button>
                <Button 
                  onClick={downloadCSS}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSS
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Color Theory Explained</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Monochromatic</h4>
              <p className="text-sm text-muted-foreground">
                Uses variations of a single color with different lightness and saturation levels.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Analogous</h4>
              <p className="text-sm text-muted-foreground">
                Uses colors that are next to each other on the color wheel.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Complementary</h4>
              <p className="text-sm text-muted-foreground">
                Uses colors that are opposite each other on the color wheel.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Triadic</h4>
              <p className="text-sm text-muted-foreground">
                Uses three colors that are evenly spaced around the color wheel.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
