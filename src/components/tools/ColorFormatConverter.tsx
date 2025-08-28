import { useState, useEffect } from "react";
import { Palette, Copy, RefreshCw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ColorFormatConverter = () => {
  const [inputColor, setInputColor] = useState("#4A638D");
  const [inputFormat, setInputFormat] = useState("hex");
  const [outputFormats, setOutputFormats] = useState<string[]>(["rgb", "hsl", "cmyk"]);
  const [convertedColors, setConvertedColors] = useState<Record<string, string>>({});

  const formatOptions = [
    { value: "hex", label: "HEX", example: "#4A638D" },
    { value: "rgb", label: "RGB", example: "rgb(74, 99, 141)" },
    { value: "rgba", label: "RGBA", example: "rgba(74, 99, 141, 1)" },
    { value: "hsl", label: "HSL", example: "hsl(220, 31%, 42%)" },
    { value: "hsla", label: "HSLA", example: "hsla(220, 31%, 42%, 1)" },
    { value: "cmyk", label: "CMYK", example: "cmyk(48, 30, 0, 45)" },
    { value: "hsv", label: "HSV", example: "hsv(220, 48%, 55%)" },
    { value: "hwb", label: "HWB", example: "hwb(220, 29%, 45%)" }
  ];

  useEffect(() => {
    convertColor();
  }, [inputColor, inputFormat, outputFormats]);

  const convertColor = () => {
    const color = parseColor(inputColor, inputFormat);
    if (!color) return;

    const results: Record<string, string> = {};
    
    outputFormats.forEach(format => {
      switch (format) {
        case "hex":
          results.hex = rgbToHex(color.r, color.g, color.b);
          break;
        case "rgb":
          results.rgb = `rgb(${color.r}, ${color.g}, ${color.b})`;
          break;
        case "rgba":
          results.rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a || 1})`;
          break;
        case "hsl":
          const hsl = rgbToHsl(color.r, color.g, color.b);
          results.hsl = `hsl(${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
          break;
        case "hsla":
          const hsla = rgbToHsl(color.r, color.g, color.b);
          results.hsla = `hsla(${Math.round(hsla.h)}°, ${Math.round(hsla.s)}%, ${Math.round(hsla.l)}%, ${color.a || 1})`;
          break;
        case "cmyk":
          const cmyk = rgbToCmyk(color.r, color.g, color.b);
          results.cmyk = `cmyk(${Math.round(cmyk.c)}%, ${Math.round(cmyk.m)}%, ${Math.round(cmyk.y)}%, ${Math.round(cmyk.k)}%)`;
          break;
        case "hsv":
          const hsv = rgbToHsv(color.r, color.g, color.b);
          results.hsv = `hsv(${Math.round(hsv.h)}°, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`;
          break;
        case "hwb":
          const hwb = rgbToHwb(color.r, color.g, color.b);
          results.hwb = `hwb(${Math.round(hwb.h)}°, ${Math.round(hwb.w)}%, ${Math.round(hwb.b)}%)`;
          break;
      }
    });

    setConvertedColors(results);
  };

  const parseColor = (color: string, format: string) => {
    try {
      switch (format) {
        case "hex":
          return parseHex(color);
        case "rgb":
          return parseRgb(color);
        case "rgba":
          return parseRgba(color);
        case "hsl":
          return parseHsl(color);
        case "hsla":
          return parseHsla(color);
        case "cmyk":
          return parseCmyk(color);
        case "hsv":
          return parseHsv(color);
        case "hwb":
          return parseHwb(color);
        default:
          return null;
      }
    } catch {
      return null;
    }
  };

  const parseHex = (hex: string) => {
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      const r = parseInt(cleanHex[0] + cleanHex[0], 16);
      const g = parseInt(cleanHex[1] + cleanHex[1], 16);
      const b = parseInt(cleanHex[2] + cleanHex[2], 16);
      return { r, g, b };
    } else if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.slice(0, 2), 16);
      const g = parseInt(cleanHex.slice(2, 4), 16);
      const b = parseInt(cleanHex.slice(4, 6), 16);
      return { r, g, b };
    }
    return null;
  };

  const parseRgb = (rgb: string) => {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3])
      };
    }
    return null;
  };

  const parseRgba = (rgba: string) => {
    const match = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: parseFloat(match[4])
      };
    }
    return null;
  };

  const parseHsl = (hsl: string) => {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
      const h = parseInt(match[1]);
      const s = parseInt(match[2]);
      const l = parseInt(match[3]);
      return hslToRgb(h, s, l);
    }
    return null;
  };

  const parseHsla = (hsla: string) => {
    const match = hsla.match(/hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*([\d.]+)\)/);
    if (match) {
      const h = parseInt(match[1]);
      const s = parseInt(match[2]);
      const l = parseInt(match[3]);
      const a = parseFloat(match[4]);
      const rgb = hslToRgb(h, s, l);
      return { ...rgb, a };
    }
    return null;
  };

  const parseCmyk = (cmyk: string) => {
    const match = cmyk.match(/cmyk\((\d+)%,\s*(\d+)%,\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
      const c = parseInt(match[1]) / 100;
      const m = parseInt(match[2]) / 100;
      const y = parseInt(match[3]) / 100;
      const k = parseInt(match[4]) / 100;
      return cmykToRgb(c, m, y, k);
    }
    return null;
  };

  const parseHsv = (hsv: string) => {
    const match = hsv.match(/hsv\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
      const h = parseInt(match[1]);
      const s = parseInt(match[2]);
      const v = parseInt(match[3]);
      return hsvToRgb(h, s, v);
    }
    return null;
  };

  const parseHwb = (hwb: string) => {
    const match = hwb.match(/hwb\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
      const h = parseInt(match[1]);
      const w = parseInt(match[2]);
      const b = parseInt(match[3]);
      return hwbToRgb(h, w, b);
    }
    return null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

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

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);

    return {
      c: c * 100,
      m: m * 100,
      y: y * 100,
      k: k * 100
    };
  };

  const cmykToRgb = (c: number, m: number, y: number, k: number) => {
    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);

    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b)
    };
  };

  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0, s = 0, v = max;

    if (max !== 0) s = d / max;

    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, v: v * 100 };
  };

  const hsvToRgb = (h: number, s: number, v: number) => {
    h /= 360;
    s /= 100;
    v /= 100;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r, g, b;
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
      default: r = v; g = t; b = p;
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const rgbToHwb = (r: number, g: number, b: number) => {
    const hsv = rgbToHsv(r, g, b);
    const w = Math.min(r, g, b) / 255 * 100;
    const b_val = (1 - Math.max(r, g, b) / 255) * 100;

    return {
      h: hsv.h,
      w: w,
      b: b_val
    };
  };

  const hwbToRgb = (h: number, w: number, b: number) => {
    w /= 100;
    b /= 100;
    
    if (w + b >= 1) {
      const gray = w / (w + b);
      return {
        r: Math.round(gray * 255),
        g: Math.round(gray * 255),
        b: Math.round(gray * 255)
      };
    }

    const hsv = { h, s: 100, v: 100 - b };
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    
    // Mix with white
    const factor = w / (1 - b);
    return {
      r: Math.round(rgb.r + (255 - rgb.r) * factor),
      g: Math.round(rgb.g + (255 - rgb.g) * factor),
      b: Math.round(rgb.b + (255 - rgb.b) * factor)
    };
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getContrastColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const handleInputChange = (value: string) => {
    setInputColor(value);
  };

  const toggleOutputFormat = (format: string) => {
    setOutputFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Palette className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Color Format Converter</h2>
        <p className="text-muted-foreground">
          Convert colors between different formats (HEX, RGB, HSL, CMYK, HSV, HWB)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Input Color
            </CardTitle>
            <CardDescription>
              Enter a color in any format to convert it
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inputFormat">Input Format</Label>
              <Select value={inputFormat} onValueChange={setInputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map(format => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label} - {format.example}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inputColor">Color Value</Label>
              <div className="flex gap-2">
                <Input
                  id="inputColor"
                  type="text"
                  value={inputColor}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="#4A638D"
                  className="flex-1"
                />
                <div 
                  className="w-12 h-10 rounded border cursor-pointer"
                  style={{ backgroundColor: inputColor }}
                  title="Color preview"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Output Formats</Label>
              <div className="grid grid-cols-2 gap-2">
                {formatOptions.map(format => (
                  <Button
                    key={format.value}
                    variant={outputFormats.includes(format.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleOutputFormat(format.value)}
                    className="justify-start"
                  >
                    {outputFormats.includes(format.value) ? "✓" : ""} {format.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {Object.keys(convertedColors).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Converted Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {Object.entries(convertedColors).map(([format, value]) => (
                  <div key={format} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold text-sm uppercase">{format}</div>
                      <div className="font-mono text-sm">{value}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(value)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => copyToClipboard(Object.values(convertedColors).join('\n'))}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
                <Button 
                  onClick={() => {
                    setInputColor("#" + Math.floor(Math.random()*16777215).toString(16));
                  }}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Random Color
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Color Format Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">HEX</h4>
              <p className="text-sm text-muted-foreground">
                Hexadecimal color codes (#RRGGBB) - most common for web development.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">RGB/RGBA</h4>
              <p className="text-sm text-muted-foreground">
                Red, Green, Blue values (0-255) with optional alpha transparency.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">HSL/HSLA</h4>
              <p className="text-sm text-muted-foreground">
                Hue, Saturation, Lightness values with optional alpha transparency.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">CMYK</h4>
              <p className="text-sm text-muted-foreground">
                Cyan, Magenta, Yellow, Key (Black) - used in print design.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
