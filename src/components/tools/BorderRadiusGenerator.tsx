import { useState, useEffect } from "react";
import { Palette, Copy, Download, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export const BorderRadiusGenerator = () => {
  const [radiusValues, setRadiusValues] = useState({
    topLeft: 8,
    topRight: 8,
    bottomRight: 8,
    bottomLeft: 8
  });
  const [useIndividualValues, setUseIndividualValues] = useState(false);
  const [uniformRadius, setUniformRadius] = useState(8);
  const [cssCode, setCssCode] = useState("");
  const [previewElement, setPreviewElement] = useState("box");

  const previewElements = [
    { value: "box", label: "Box", description: "Simple rectangular element" },
    { value: "card", label: "Card", description: "Card-like component" },
    { value: "button", label: "Button", description: "Button element" },
    { value: "image", label: "Image", description: "Image element" },
    { value: "avatar", label: "Avatar", description: "Circular avatar" }
  ];

  useEffect(() => {
    generateCSS();
  }, [radiusValues, useIndividualValues, uniformRadius]);

  const generateCSS = () => {
    if (useIndividualValues) {
      const { topLeft, topRight, bottomRight, bottomLeft } = radiusValues;
      setCssCode(`border-radius: ${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px;`);
    } else {
      setCssCode(`border-radius: ${uniformRadius}px;`);
    }
  };

  const updateRadius = (corner: string, value: number) => {
    setRadiusValues(prev => ({
      ...prev,
      [corner]: value
    }));
  };

  const updateUniformRadius = (value: number) => {
    setUniformRadius(value);
    setRadiusValues({
      topLeft: value,
      topRight: value,
      bottomRight: value,
      bottomLeft: value
    });
  };

  const randomizeRadius = () => {
    if (useIndividualValues) {
      const newValues = {
        topLeft: Math.floor(Math.random() * 50),
        topRight: Math.floor(Math.random() * 50),
        bottomRight: Math.floor(Math.random() * 50),
        bottomLeft: Math.floor(Math.random() * 50)
      };
      setRadiusValues(newValues);
    } else {
      const newValue = Math.floor(Math.random() * 50);
      setUniformRadius(newValue);
      setRadiusValues({
        topLeft: newValue,
        topRight: newValue,
        bottomRight: newValue,
        bottomLeft: newValue
      });
    }
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
    const cssContent = `.rounded-element {\n  ${cssCode}\n}`;
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'border-radius.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPreviewStyle = () => {
    if (useIndividualValues) {
      const { topLeft, topRight, bottomRight, bottomLeft } = radiusValues;
      return {
        borderTopLeftRadius: `${topLeft}px`,
        borderTopRightRadius: `${topRight}px`,
        borderBottomRightRadius: `${bottomRight}px`,
        borderBottomLeftRadius: `${bottomLeft}px`
      };
    } else {
      return {
        borderRadius: `${uniformRadius}px`
      };
    }
  };

  const getPreviewElementClass = () => {
    switch (previewElement) {
      case "box":
        return "w-32 h-32 bg-white border border-gray-200";
      case "card":
        return "w-48 h-32 bg-white border border-gray-200";
      case "button":
        return "w-32 h-12 bg-blue-500 text-white flex items-center justify-center font-medium";
      case "image":
        return "w-32 h-32 bg-gray-300 border border-gray-200";
      case "avatar":
        return "w-32 h-32 bg-blue-500 text-white flex items-center justify-center font-medium";
      default:
        return "w-32 h-32 bg-white border border-gray-200";
    }
  };

  const getPreviewContent = () => {
    switch (previewElement) {
      case "button":
        return "Button";
      case "avatar":
        return "👤";
      case "image":
        return "📷";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Palette className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Border Radius Generator</h2>
        <p className="text-muted-foreground">
          Create and customize CSS border radius with real-time preview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Radius Settings
            </CardTitle>
            <CardDescription>
              Configure border radius values for each corner
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

            <div className="flex items-center space-x-2">
              <Switch
                id="individual-values"
                checked={useIndividualValues}
                onCheckedChange={setUseIndividualValues}
              />
              <Label htmlFor="individual-values" className="text-sm">Use individual corner values</Label>
            </div>

            {useIndividualValues ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Top Left: {radiusValues.topLeft}px</Label>
                    <Slider
                      value={[radiusValues.topLeft]}
                      onValueChange={(value) => updateRadius('topLeft', value[0])}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Top Right: {radiusValues.topRight}px</Label>
                    <Slider
                      value={[radiusValues.topRight]}
                      onValueChange={(value) => updateRadius('topRight', value[0])}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Bottom Right: {radiusValues.bottomRight}px</Label>
                    <Slider
                      value={[radiusValues.bottomRight]}
                      onValueChange={(value) => updateRadius('bottomRight', value[0])}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Bottom Left: {radiusValues.bottomLeft}px</Label>
                    <Slider
                      value={[radiusValues.bottomLeft]}
                      onValueChange={(value) => updateRadius('bottomLeft', value[0])}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Uniform Radius: {uniformRadius}px</Label>
                <Slider
                  value={[uniformRadius]}
                  onValueChange={(value) => updateUniformRadius(value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={randomizeRadius} variant="outline" className="flex-1">
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
                {getPreviewContent()}
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

      {/* Preset Radius Values */}
      <Card>
        <CardHeader>
          <CardTitle>Preset Radius Values</CardTitle>
          <CardDescription>
            Click on any preset to apply it to your element
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "None", value: 0 },
              { name: "Small", value: 4 },
              { name: "Medium", value: 8 },
              { name: "Large", value: 16 },
              { name: "XL", value: 24 },
              { name: "2XL", value: 32 },
              { name: "3XL", value: 48 },
              { name: "Full", value: 9999 },
              { name: "Rounded", value: 6 },
              { name: "Soft", value: 12 },
              { name: "Pill", value: 9999 },
              { name: "Custom", value: 20 }
            ].map((preset, index) => (
              <div
                key={index}
                className="cursor-pointer group"
                onClick={() => {
                  setUseIndividualValues(false);
                  updateUniformRadius(preset.value);
                }}
              >
                <div 
                  className="h-20 bg-white border border-gray-200 flex items-center justify-center group-hover:border-primary transition-colors"
                  style={{ borderRadius: preset.value === 9999 ? '50%' : `${preset.value}px` }}
                >
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
          <CardTitle>Border Radius Properties Explained</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Individual Corners</h4>
              <p className="text-sm text-muted-foreground">
                Control each corner independently: top-left, top-right, bottom-right, and bottom-left. Values are applied clockwise starting from top-left.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Uniform Radius</h4>
              <p className="text-sm text-muted-foreground">
                Apply the same radius value to all corners for consistent, symmetrical rounding.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Common Values</h4>
              <p className="text-sm text-muted-foreground">
                0px (sharp), 4-8px (subtle), 16-24px (rounded), 9999px (fully rounded/circular).
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Best Practices</h4>
              <p className="text-sm text-muted-foreground">
                Use consistent radius values across your design system. Subtle rounding (4-8px) works well for most UI elements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
