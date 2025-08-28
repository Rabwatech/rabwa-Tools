import { useState, useEffect } from "react";
import { Palette, Eye, EyeOff, Copy, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ColorBlindnessSimulator = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [colorBlindnessType, setColorBlindnessType] = useState("deuteranopia");
  const [simulatedImage, setSimulatedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const colorBlindnessTypes = [
    { value: "deuteranopia", label: "Deuteranopia (Red-Green)", description: "Difficulty distinguishing between red and green colors" },
    { value: "protanopia", label: "Protanopia (Red-Blind)", description: "Reduced sensitivity to red light" },
    { value: "tritanopia", label: "Tritanopia (Blue-Yellow)", description: "Difficulty distinguishing between blue and yellow colors" },
    { value: "achromatopsia", label: "Achromatopsia (Complete)", description: "Complete color blindness, seeing only in grayscale" }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setSimulatedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateColorBlindness = () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Apply color blindness simulation
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const simulated = simulateColorBlindnessType(r, g, b, colorBlindnessType);
            
            data[i] = simulated.r;
            data[i + 1] = simulated.g;
            data[i + 2] = simulated.b;
          }
          
          ctx.putImageData(imageData, 0, 0);
          setSimulatedImage(canvas.toDataURL());
        }
        
        setIsProcessing(false);
      };
      
      img.src = selectedImage;
    }, 500);
  };

  const simulateColorBlindnessType = (r: number, g: number, b: number, type: string) => {
    // Convert RGB to LMS color space
    const lms = rgbToLMS(r, g, b);
    
    let simulatedLMS = { l: lms.l, m: lms.m, s: lms.s };
    
    switch (type) {
      case "deuteranopia":
        // Deuteranopia: reduced sensitivity to medium wavelengths (green)
        simulatedLMS = {
          l: lms.l,
          m: lms.l * 0.625 + lms.m * 0.375,
          s: lms.s
        };
        break;
        
      case "protanopia":
        // Protanopia: reduced sensitivity to long wavelengths (red)
        simulatedLMS = {
          l: lms.m * 0.567 + lms.s * 0.433,
          m: lms.m,
          s: lms.s
        };
        break;
        
      case "tritanopia":
        // Tritanopia: reduced sensitivity to short wavelengths (blue)
        simulatedLMS = {
          l: lms.l,
          m: lms.m,
          s: lms.l * 0.95 + lms.m * 0.05
        };
        break;
        
      case "achromatopsia":
        // Achromatopsia: complete color blindness
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        simulatedLMS = {
          l: gray / 255,
          m: gray / 255,
          s: gray / 255
        };
        break;
    }
    
    // Convert back to RGB
    return lmsToRGB(simulatedLMS.l, simulatedLMS.m, simulatedLMS.s);
  };

  const rgbToLMS = (r: number, g: number, b: number) => {
    // Convert RGB to LMS using transformation matrix
    const l = 0.313 * r + 0.155 * g + 0.017 * b;
    const m = 0.117 * r + 0.563 * g + 0.109 * b;
    const s = 0.017 * r + 0.109 * g + 0.214 * b;
    
    return { l, m, s };
  };

  const lmsToRGB = (l: number, m: number, s: number) => {
    // Convert LMS back to RGB using inverse transformation matrix
    const r = 5.472 * l - 4.641 * m + 0.169 * s;
    const g = -1.667 * l + 6.333 * m - 2.000 * s;
    const b = 0.000 * l - 0.000 * m + 9.333 * s;
    
    return {
      r: Math.max(0, Math.min(255, Math.round(r))),
      g: Math.max(0, Math.min(255, Math.round(g))),
      b: Math.max(0, Math.min(255, Math.round(b)))
    };
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getColorBlindnessInfo = (type: string) => {
    switch (type) {
      case "deuteranopia":
        return {
          prevalence: "~6% of males, ~0.4% of females",
          description: "Most common type of color blindness. Difficulty distinguishing between red and green colors.",
          examples: "Red and green traffic lights may look similar, red berries on green leaves may be hard to spot."
        };
      case "protanopia":
        return {
          prevalence: "~1% of males, ~0.01% of females",
          description: "Reduced sensitivity to red light. Reds appear darker and may be confused with black.",
          examples: "Red text on dark backgrounds may be unreadable, red objects may appear black."
        };
      case "tritanopia":
        return {
          prevalence: "~0.008% of population",
          description: "Rare form affecting blue-yellow color vision. Blues and yellows may be confused.",
          examples: "Blue and yellow objects may look similar, blue text on yellow backgrounds may be hard to read."
        };
      case "achromatopsia":
        return {
          prevalence: "~0.00003% of population",
          description: "Complete color blindness. Only sees in shades of gray.",
          examples: "All colors appear as different shades of gray, making color-based information inaccessible."
        };
      default:
        return { prevalence: "", description: "", examples: "" };
    }
  };

  const info = getColorBlindnessInfo(colorBlindnessType);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Palette className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Color Blindness Simulator</h2>
        <p className="text-muted-foreground">
          Simulate how images appear to people with different types of color blindness
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Simulation Settings
            </CardTitle>
            <CardDescription>
              Upload an image and select color blindness type to simulate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUpload">Upload Image</Label>
              <div className="flex gap-2">
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                <Button
                  onClick={() => document.getElementById('imageUpload')?.click()}
                  variant="outline"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colorBlindnessType">Color Blindness Type</Label>
              <Select value={colorBlindnessType} onValueChange={setColorBlindnessType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorBlindnessTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-muted rounded-md">
              <h4 className="font-semibold text-sm mb-2">{colorBlindnessTypes.find(t => t.value === colorBlindnessType)?.label}</h4>
              <p className="text-xs text-muted-foreground">{info.description}</p>
            </div>

            <Button 
              onClick={simulateColorBlindness}
              disabled={!selectedImage || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Simulate Color Blindness
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Image Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Image Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedImage ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Original Image</Label>
                  <img 
                    src={selectedImage} 
                    alt="Original" 
                    className="w-full h-48 object-contain border rounded-lg"
                  />
                </div>
                
                {simulatedImage && (
                  <div>
                    <Label className="text-sm font-medium">Simulated Image ({colorBlindnessTypes.find(t => t.value === colorBlindnessType)?.label})</Label>
                    <img 
                      src={simulatedImage} 
                      alt="Simulated" 
                      className="w-full h-48 object-contain border rounded-lg"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-48 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p>Upload an image to get started</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Actions */}
      {simulatedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Download & Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                onClick={() => downloadImage(simulatedImage, `colorblind-simulation-${colorBlindnessType}.png`)}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Simulated Image
              </Button>
              <Button 
                onClick={() => copyToClipboard(`Color blindness simulation (${colorBlindnessTypes.find(t => t.value === colorBlindnessType)?.label}) generated with RabwaTools`)}
                variant="outline"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Description
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Color Blindness</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Prevalence</h4>
              <p className="text-sm text-muted-foreground">{info.prevalence}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Real-World Impact</h4>
              <p className="text-sm text-muted-foreground">{info.examples}</p>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Design Tips for Accessibility</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Don't rely solely on color to convey information</li>
              <li>• Use high contrast ratios (4.5:1 minimum)</li>
              <li>• Include text labels or icons alongside colors</li>
              <li>• Test your designs with color blindness simulators</li>
              <li>• Consider using patterns or textures in addition to colors</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
