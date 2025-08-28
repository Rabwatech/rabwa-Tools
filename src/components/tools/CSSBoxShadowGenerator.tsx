import { useState, useEffect } from "react";
import { Palette, Copy, Download, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export const CSSBoxShadowGenerator = () => {
  const [shadows, setShadows] = useState([
    {
      id: 1,
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadRadius: 0,
      color: "#000000",
      opacity: 0.1,
      inset: false,
      enabled: true
    }
  ]);
  const [cssCode, setCssCode] = useState("");
  const [previewElement, setPreviewElement] = useState("box");

  const previewElements = [
    { value: "box", label: "Box", description: "Simple rectangular element" },
    { value: "card", label: "Card", description: "Card-like component" },
    { value: "button", label: "Button", description: "Button element" },
    { value: "circle", label: "Circle", description: "Circular element" }
  ];

  useEffect(() => {
    generateCSS();
  }, [shadows]);

  const generateCSS = () => {
    const enabledShadows = shadows.filter(shadow => shadow.enabled);
    if (enabledShadows.length === 0) {
      setCssCode("box-shadow: none;");
      return;
    }

    const shadowStrings = enabledShadows.map(shadow => {
      const inset = shadow.inset ? "inset " : "";
      const color = hexToRgba(shadow.color, shadow.opacity);
      return `${inset}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spreadRadius}px ${color}`;
    });

    setCssCode(`box-shadow: ${shadowStrings.join(", ")};`);
  };

  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const addShadow = () => {
    const newShadow = {
      id: Math.max(...shadows.map(s => s.id)) + 1,
      offsetX: 0,
      offsetY: 8,
      blurRadius: 16,
      spreadRadius: 0,
      color: "#000000",
      opacity: 0.15,
      inset: false,
      enabled: true
    };
    setShadows([...shadows, newShadow]);
  };

  const removeShadow = (id: number) => {
    if (shadows.length > 1) {
      setShadows(shadows.filter(shadow => shadow.id !== id));
    }
  };

  const updateShadow = (id: number, field: string, value: any) => {
    setShadows(shadows.map(shadow => 
      shadow.id === id ? { ...shadow, [field]: value } : shadow
    ));
  };

  const toggleShadow = (id: number) => {
    setShadows(shadows.map(shadow => 
      shadow.id === id ? { ...shadow, enabled: !shadow.enabled } : shadow
    ));
  };

  const randomizeShadows = () => {
    const newShadows = shadows.map(shadow => ({
      ...shadow,
      offsetX: Math.floor(Math.random() * 20) - 10,
      offsetY: Math.floor(Math.random() * 20) - 10,
      blurRadius: Math.floor(Math.random() * 30) + 5,
      spreadRadius: Math.floor(Math.random() * 10) - 5,
      color: "#" + Math.floor(Math.random()*16777215).toString(16),
      opacity: Math.random() * 0.5 + 0.1
    }));
    setShadows(newShadows);
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
    const cssContent = `.shadow-element {\n  ${cssCode}\n}`;
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'box-shadow.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPreviewStyle = () => {
    const enabledShadows = shadows.filter(shadow => shadow.enabled);
    if (enabledShadows.length === 0) return {};

    const shadowStrings = enabledShadows.map(shadow => {
      const inset = shadow.inset ? "inset " : "";
      const color = hexToRgba(shadow.color, shadow.opacity);
      return `${inset}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spreadRadius}px ${color}`;
    });

    return {
      boxShadow: shadowStrings.join(", ")
    };
  };

  const getPreviewElementClass = () => {
    switch (previewElement) {
      case "box":
        return "w-32 h-32 bg-white border border-gray-200";
      case "card":
        return "w-48 h-32 bg-white border border-gray-200 rounded-lg";
      case "button":
        return "w-32 h-12 bg-blue-500 text-white rounded-md flex items-center justify-center font-medium";
      case "circle":
        return "w-32 h-32 bg-white border border-gray-200 rounded-full";
      default:
        return "w-32 h-32 bg-white border border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Palette className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">CSS Box Shadow Generator</h2>
        <p className="text-muted-foreground">
          Create and customize CSS box shadows with real-time preview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Shadow Settings
            </CardTitle>
            <CardDescription>
              Configure multiple shadows with individual controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Preview Element</Label>
              <div className="grid grid-cols-2 gap-2">
                {previewElements.map(element => (
                  <Button
                    key={element.value}
                    variant={previewElement === element.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewElement(element.value)}
                    className="justify-start"
                  >
                    {previewElement === element.value ? "✓" : ""} {element.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {shadows.map((shadow, index) => (
                <div key={shadow.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Shadow {index + 1}</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={shadow.enabled}
                        onCheckedChange={() => toggleShadow(shadow.id)}
                      />
                      {shadows.length > 1 && (
                        <Button
                          onClick={() => removeShadow(shadow.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Offset X: {shadow.offsetX}px</Label>
                      <Slider
                        value={[shadow.offsetX]}
                        onValueChange={(value) => updateShadow(shadow.id, 'offsetX', value[0])}
                        max={50}
                        min={-50}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Offset Y: {shadow.offsetY}px</Label>
                      <Slider
                        value={[shadow.offsetY]}
                        onValueChange={(value) => updateShadow(shadow.id, 'offsetY', value[0])}
                        max={50}
                        min={-50}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Blur: {shadow.blurRadius}px</Label>
                      <Slider
                        value={[shadow.blurRadius]}
                        onValueChange={(value) => updateShadow(shadow.id, 'blurRadius', value[0])}
                        max={100}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Spread: {shadow.spreadRadius}px</Label>
                      <Slider
                        value={[shadow.spreadRadius]}
                        onValueChange={(value) => updateShadow(shadow.id, 'spreadRadius', value[0])}
                        max={50}
                        min={-50}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Color</Label>
                      <Input
                        type="color"
                        value={shadow.color}
                        onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                        className="w-full h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Opacity: {Math.round(shadow.opacity * 100)}%</Label>
                      <Slider
                        value={[shadow.opacity]}
                        onValueChange={(value) => updateShadow(shadow.id, 'opacity', value[0])}
                        max={1}
                        min={0}
                        step={0.01}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`inset-${shadow.id}`}
                      checked={shadow.inset}
                      onCheckedChange={(checked) => updateShadow(shadow.id, 'inset', checked)}
                    />
                    <Label htmlFor={`inset-${shadow.id}`} className="text-sm">Inset shadow</Label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={addShadow} variant="outline" className="flex-1">
                Add Shadow
              </Button>
              <Button onClick={randomizeShadows} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Randomize
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
              <div 
                className={getPreviewElementClass()}
                style={getPreviewStyle()}
              >
                {previewElement === "button" && "Button"}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Generated CSS</Label>
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

      {/* Preset Shadows */}
      <Card>
        <CardHeader>
          <CardTitle>Preset Shadows</CardTitle>
          <CardDescription>
            Click on any preset to apply it to your shadows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Soft", shadows: [{ offsetX: 0, offsetY: 2, blurRadius: 4, spreadRadius: 0, color: "#000000", opacity: 0.1, inset: false }] },
              { name: "Medium", shadows: [{ offsetX: 0, offsetY: 4, blurRadius: 8, spreadRadius: 0, color: "#000000", opacity: 0.15, inset: false }] },
              { name: "Strong", shadows: [{ offsetX: 0, offsetY: 8, blurRadius: 16, spreadRadius: 0, color: "#000000", opacity: 0.2, inset: false }] },
              { name: "Inset", shadows: [{ offsetX: 0, offsetY: 2, blurRadius: 4, spreadRadius: 0, color: "#000000", opacity: 0.1, inset: true }] },
              { name: "Multiple", shadows: [
                { offsetX: 0, offsetY: 2, blurRadius: 4, spreadRadius: 0, color: "#000000", opacity: 0.1, inset: false },
                { offsetX: 0, offsetY: 8, blurRadius: 16, spreadRadius: 0, color: "#000000", opacity: 0.15, inset: false }
              ]},
              { name: "Colored", shadows: [{ offsetX: 0, offsetY: 4, blurRadius: 8, spreadRadius: 0, color: "#3B82F6", opacity: 0.3, inset: false }] },
              { name: "Layered", shadows: [
                { offsetX: 0, offsetY: 1, blurRadius: 3, spreadRadius: 0, color: "#000000", opacity: 0.12, inset: false },
                { offsetX: 0, offsetY: 1, blurRadius: 2, spreadRadius: 0, color: "#000000", opacity: 0.24, inset: false }
              ]},
              { name: "Glow", shadows: [{ offsetX: 0, offsetY: 0, blurRadius: 20, spreadRadius: 0, color: "#3B82F6", opacity: 0.5, inset: false }] }
            ].map((preset, index) => (
              <div
                key={index}
                className="cursor-pointer group"
                onClick={() => setShadows(preset.shadows.map((s, i) => ({ ...s, id: i + 1, enabled: true })))}
              >
                <div className="h-20 bg-white border rounded-lg flex items-center justify-center group-hover:border-primary transition-colors"
                     style={{
                       boxShadow: preset.shadows.map(s => 
                         `${s.inset ? 'inset ' : ''}${s.offsetX}px ${s.offsetY}px ${s.blurRadius}px ${s.spreadRadius}px rgba(0,0,0,${s.opacity})`
                       ).join(", ")
                     }}>
                  <span className="text-sm font-medium">{preset.name}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Box Shadow Properties Explained</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Offset X & Y</h4>
              <p className="text-sm text-muted-foreground">
                Horizontal and vertical offset of the shadow. Positive X moves right, positive Y moves down.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Blur Radius</h4>
              <p className="text-sm text-muted-foreground">
                How blurry the shadow appears. Higher values create softer, more diffused shadows.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Spread Radius</h4>
              <p className="text-sm text-muted-foreground">
                How much the shadow grows or shrinks. Positive values expand, negative values contract.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Inset</h4>
              <p className="text-sm text-muted-foreground">
                When enabled, creates an inner shadow instead of an outer shadow.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
