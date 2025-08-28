import { useState, useEffect } from "react";
import { Palette, Copy, Download, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-components";
import { Slider } from "@/components/ui/slider";

export const GradientGenerator = () => {
  const [gradientType, setGradientType] = useState("linear");
  const [direction, setDirection] = useState("to right");
  const [colors, setColors] = useState([
    { color: "#4A638D", stop: 0 },
    { color: "#1ABC9C", stop: 100 }
  ]);
  const [angle, setAngle] = useState(90);
  const [cssCode, setCssCode] = useState("");

  const gradientTypes = [
    { value: "linear", label: "Linear Gradient" },
    { value: "radial", label: "Radial Gradient" },
    { value: "conic", label: "Conic Gradient" }
  ];

  const directions = [
    { value: "to right", label: "To Right" },
    { value: "to left", label: "To Left" },
    { value: "to top", label: "To Top" },
    { value: "to bottom", label: "To Bottom" },
    { value: "to top right", label: "To Top Right" },
    { value: "to top left", label: "To Top Left" },
    { value: "to bottom right", label: "To Bottom Right" },
    { value: "to bottom left", label: "To Bottom Left" }
  ];

  useEffect(() => {
    generateCSS();
  }, [gradientType, direction, colors, angle]);

  const generateCSS = () => {
    let css = "";
    
    switch (gradientType) {
      case "linear":
        if (direction === "custom") {
          css = `linear-gradient(${angle}deg, ${colors.map(c => `${c.color} ${c.stop}%`).join(", ")})`;
        } else {
          css = `linear-gradient(${direction}, ${colors.map(c => `${c.color} ${c.stop}%`).join(", ")})`;
        }
        break;
      case "radial":
        css = `radial-gradient(circle, ${colors.map(c => `${c.color} ${c.stop}%`).join(", ")})`;
        break;
      case "conic":
        css = `conic-gradient(from ${angle}deg, ${colors.map(c => `${c.color} ${c.stop}%`).join(", ")})`;
        break;
    }
    
    setCssCode(css);
  };

  const addColor = () => {
    const newColor = {
      color: "#" + Math.floor(Math.random()*16777215).toString(16),
      stop: Math.min(100, colors.length * 25)
    };
    setColors([...colors, newColor]);
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, field: 'color' | 'stop', value: string | number) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  const randomizeColors = () => {
    const newColors = colors.map(() => ({
      color: "#" + Math.floor(Math.random()*16777215).toString(16),
      stop: Math.floor(Math.random() * 100)
    }));
    setColors(newColors.sort((a, b) => a.stop - b.stop));
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
    const cssContent = `.gradient {\n  background: ${cssCode};\n}`;
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradient.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getGradientStyle = () => {
    return {
      background: cssCode
    };
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Palette className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Gradient Generator</h2>
        <p className="text-muted-foreground">
          Create beautiful CSS gradients with custom colors, stops, and directions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Gradient Settings
            </CardTitle>
            <CardDescription>
              Configure gradient type, direction, and colors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gradientType">Gradient Type</Label>
              <Select value={gradientType} onValueChange={setGradientType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gradientTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {gradientType === "linear" && (
              <div className="space-y-2">
                <Label htmlFor="direction">Direction</Label>
                <Select value={direction} onValueChange={setDirection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {directions.map(dir => (
                      <SelectItem key={dir.value} value={dir.value}>
                        {dir.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Angle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {(gradientType === "linear" && direction === "custom") && (
              <div className="space-y-2">
                <Label>Angle: {angle}°</Label>
                <Slider
                  value={[angle]}
                  onValueChange={(value) => setAngle(value[0])}
                  max={360}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {gradientType === "conic" && (
              <div className="space-y-2">
                <Label>Starting Angle: {angle}°</Label>
                <Slider
                  value={[angle]}
                  onValueChange={(value) => setAngle(value[0])}
                  max={360}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Colors</Label>
                <Button onClick={addColor} size="sm" variant="outline">
                  Add Color
                </Button>
              </div>
              <div className="space-y-3">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={color.color}
                      onChange={(e) => updateColor(index, 'color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      type="number"
                      value={color.stop}
                      onChange={(e) => updateColor(index, 'stop', parseInt(e.target.value) || 0)}
                      min="0"
                      max="100"
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                    {colors.length > 2 && (
                      <Button
                        onClick={() => removeColor(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={randomizeColors} variant="outline" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Random Colors
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Gradient Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="w-full h-48 rounded-lg border-2 border-dashed"
              style={getGradientStyle()}
            />
            
            <div className="space-y-2">
              <Label>CSS Code</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm">
                {cssCode}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => copyToClipboard(cssCode)}
                variant="outline"
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy CSS
              </Button>
              <Button 
                onClick={downloadCSS}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preset Gradients */}
      <Card>
        <CardHeader>
          <CardTitle>Preset Gradients</CardTitle>
          <CardDescription>
            Click on any preset to apply it to your gradient
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Sunset", colors: [{ color: "#FF6B6B", stop: 0 }, { color: "#FFE66D", stop: 100 }] },
              { name: "Ocean", colors: [{ color: "#4ECDC4", stop: 0 }, { color: "#44A08D", stop: 100 }] },
              { name: "Forest", colors: [{ color: "#56AB2F", stop: 0 }, { color: "#A8E6CF", stop: 100 }] },
              { name: "Berry", colors: [{ color: "#8E2DE2", stop: 0 }, { color: "#4A00E0", stop: 100 }] },
              { name: "Fire", colors: [{ color: "#FF416C", stop: 0 }, { color: "#FF4B2B", stop: 100 }] },
              { name: "Cool", colors: [{ color: "#2193B0", stop: 0 }, { color: "#6DD5ED", stop: 100 }] },
              { name: "Warm", colors: [{ color: "#FF9A9E", stop: 0 }, { color: "#FECFEF", stop: 100 }] },
              { name: "Neon", colors: [{ color: "#A8EDEA", stop: 0 }, { color: "#FED6E3", stop: 100 }] }
            ].map((preset, index) => (
              <div
                key={index}
                className="cursor-pointer group"
                onClick={() => setColors(preset.colors)}
              >
                <div 
                  className="h-20 rounded-lg border-2 border-transparent group-hover:border-primary transition-colors"
                  style={{
                    background: `linear-gradient(to right, ${preset.colors.map(c => `${c.color} ${c.stop}%`).join(", ")})`
                  }}
                />
                <div className="text-center text-sm mt-2 font-medium">
                  {preset.name}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Gradient Types Explained</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Linear Gradient</h4>
              <p className="text-sm text-muted-foreground">
                Creates a gradient that flows in a straight line. You can specify the direction (to right, to top, etc.) or use a custom angle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Radial Gradient</h4>
              <p className="text-sm text-muted-foreground">
                Creates a gradient that radiates outward from a center point, like ripples in water.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Conic Gradient</h4>
              <p className="text-sm text-muted-foreground">
                Creates a gradient that rotates around a center point, like a color wheel.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
