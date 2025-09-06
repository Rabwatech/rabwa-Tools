import { useState, useCallback, useEffect } from "react";
import { Copy, Palette, RefreshCw } from "lucide-react";

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export const ColorPicker = () => {
  const [color, setColor] = useState('#4A638D');
  const [colorValues, setColorValues] = useState<ColorValues | null>(null);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
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

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
    
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setColor(randomColor);
    updateColorValues(randomColor);
  };

  const updateColorValues = useCallback((hexColor: string) => {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return;
    
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    
    setColorValues({
      hex: hexColor.toUpperCase(),
      rgb,
      hsl,
      cmyk
    });
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    updateColorValues(newColor);
  };

  const copyToClipboard = (value: string, format: string) => {
    navigator.clipboard.writeText(value);
  };

  // Initialize color values on first render
  useEffect(() => {
    updateColorValues(color);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div 
            className="w-32 h-32 rounded-2xl border-4 border-border shadow-lg transition-all duration-300"
            style={{ backgroundColor: color }}
          ></div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                اختر لون
              </label>
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-16 h-16 rounded-lg border-2 border-border cursor-pointer"
              />
            </div>
            
            <button
              onClick={generateRandomColor}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              عشوائي
            </button>
          </div>
        </div>
      </div>

      {colorValues && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* HEX */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">HEX</span>
              <button
                onClick={() => copyToClipboard(colorValues.hex, 'HEX')}
                className="p-1 rounded hover:bg-background transition-colors"
                title="نسخ قيمة HEX"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="font-mono text-lg text-foreground">
              {colorValues.hex}
            </div>
          </div>

          {/* RGB */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">RGB</span>
              <button
                onClick={() => copyToClipboard(`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`, 'RGB')}
                className="p-1 rounded hover:bg-background transition-colors"
                title="نسخ قيمة RGB"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="font-mono text-lg text-foreground">
              rgb({colorValues.rgb.r}, {colorValues.rgb.g}, {colorValues.rgb.b})
            </div>
          </div>

          {/* HSL */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">HSL</span>
              <button
                onClick={() => copyToClipboard(`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`, 'HSL')}
                className="p-1 rounded hover:bg-background transition-colors"
                title="نسخ قيمة HSL"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="font-mono text-lg text-foreground">
              hsl({colorValues.hsl.h}, {colorValues.hsl.s}%, {colorValues.hsl.l}%)
            </div>
          </div>

          {/* CMYK */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">CMYK</span>
              <button
                onClick={() => copyToClipboard(`cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`, 'CMYK')}
                className="p-1 rounded hover:bg-background transition-colors"
                title="نسخ قيمة CMYK"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="font-mono text-lg text-foreground">
              cmyk({colorValues.cmyk.c}%, {colorValues.cmyk.m}%, {colorValues.cmyk.y}%, {colorValues.cmyk.k}%)
            </div>
          </div>
        </div>
      )}

      {/* Manual Hex Input */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          أو أدخل لون HEX
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                updateColorValues(e.target.value);
              }
            }}
            placeholder="#4A638D"
            className="tool-input flex-1"
          />
          <button
            onClick={() => updateColorValues(color)}
            className="btn-primary"
          >
            تطبيق
          </button>
        </div>
      </div>

      {/* Color Palette Suggestions */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          تناسق الألوان
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {colorValues && [
            { name: 'أصلي', color: color },
            { name: 'أفتح', color: `hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${Math.min(colorValues.hsl.l + 20, 100)}%)` },
            { name: 'أغمق', color: `hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${Math.max(colorValues.hsl.l - 20, 0)}%)` },
            { name: 'مكمل', color: `hsl(${(colorValues.hsl.h + 180) % 360}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)` },
            { name: 'ثلاثي', color: `hsl(${(colorValues.hsl.h + 120) % 360}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)` },
          ].map((item) => (
            <div key={item.name} className="text-center">
              <div
                className="w-full h-12 rounded-lg border border-border cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: item.color }}
                onClick={() => {
                  setColor(item.color);
                  updateColorValues(item.color);
                }}
                title={`انقر لاستخدام ${item.name}`}
              ></div>
              <span className="text-xs text-muted-foreground mt-1 block">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};