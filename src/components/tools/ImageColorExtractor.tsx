import { useState, useRef } from "react";
import { Palette, Upload, Download, Copy, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-components";
import { Slider } from "@/components/ui/slider";

export const ImageColorExtractor = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [extractionMethod, setExtractionMethod] = useState("dominant");
  const [colorCount, setColorCount] = useState(8);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const extractionMethods = [
    { value: "dominant", label: "Dominant Colors", description: "Extract the most prominent colors" },
    { value: "average", label: "Average Colors", description: "Calculate average colors from image regions" },
    { value: "palette", label: "Color Palette", description: "Generate a harmonious color palette" },
    { value: "pixel", label: "Pixel Sampling", description: "Sample colors from specific pixel locations" }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setExtractedColors([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColors = () => {
    if (!selectedImage || !canvasRef.current) return;
    
    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let colors: string[] = [];
        
        switch (extractionMethod) {
          case "dominant":
            colors = extractDominantColors(data, colorCount);
            break;
          case "average":
            colors = extractAverageColors(data, colorCount);
            break;
          case "palette":
            colors = generateColorPalette(data, colorCount);
            break;
          case "pixel":
            colors = samplePixelColors(data, canvas.width, canvas.height, colorCount);
            break;
        }
        
        setExtractedColors(colors);
      }
      
      setIsProcessing(false);
    };
    
    img.src = selectedImage;
  };

  const extractDominantColors = (data: Uint8ClampedArray, count: number): string[] => {
    const colorMap = new Map<string, number>();
    
    // Count color occurrences (with some tolerance for similar colors)
    for (let i = 0; i < data.length; i += 4) {
      const r = Math.round(data[i] / 16) * 16;
      const g = Math.round(data[i + 1] / 16) * 16;
      const b = Math.round(data[i + 2] / 16) * 16;
      const key = `${r},${g},${b}`;
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }
    
    // Sort by frequency and take top colors
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([color]) => {
        const [r, g, b] = color.split(',').map(Number);
        return rgbToHex(r, g, b);
      });
    
    return sortedColors;
  };

  const extractAverageColors = (data: Uint8ClampedArray, count: number): string[] => {
    const colors: string[] = [];
    const segmentSize = Math.floor(data.length / (count * 4));
    
    for (let i = 0; i < count; i++) {
      const start = i * segmentSize;
      const end = start + segmentSize;
      
      let r = 0, g = 0, b = 0, pixelCount = 0;
      
      for (let j = start; j < end && j < data.length; j += 4) {
        r += data[j];
        g += data[j + 1];
        b += data[j + 2];
        pixelCount++;
      }
      
      if (pixelCount > 0) {
        colors.push(rgbToHex(
          Math.round(r / pixelCount),
          Math.round(g / pixelCount),
          Math.round(b / pixelCount)
        ));
      }
    }
    
    return colors;
  };

  const generateColorPalette = (data: Uint8ClampedArray, count: number): string[] => {
    // Use k-means clustering approach for palette generation
    const colors: string[] = [];
    const sampleSize = Math.min(1000, Math.floor(data.length / 4));
    const samples: [number, number, number][] = [];
    
    // Sample random pixels
    for (let i = 0; i < sampleSize; i++) {
      const index = Math.floor(Math.random() * (data.length / 4)) * 4;
      samples.push([data[index], data[index + 1], data[index + 2]]);
    }
    
    // Simple clustering: group similar colors
    const clusters: [number, number, number][] = [];
    
    for (const sample of samples) {
      let addedToCluster = false;
      
      for (const cluster of clusters) {
        const distance = colorDistance(sample, cluster);
        if (distance < 50) { // Threshold for similarity
          // Update cluster center
          cluster[0] = Math.round((cluster[0] + sample[0]) / 2);
          cluster[1] = Math.round((cluster[1] + sample[1]) / 2);
          cluster[2] = Math.round((cluster[2] + sample[2]) / 2);
          addedToCluster = true;
          break;
        }
      }
      
      if (!addedToCluster) {
        clusters.push([...sample]);
      }
    }
    
    // Take the most representative colors
    return clusters
      .slice(0, count)
      .map(([r, g, b]) => rgbToHex(r, g, b));
  };

  const samplePixelColors = (data: Uint8ClampedArray, width: number, height: number, count: number): string[] => {
    const colors: string[] = [];
    const stepX = Math.floor(width / Math.sqrt(count));
    const stepY = Math.floor(height / Math.sqrt(count));
    
    for (let y = 0; y < height && colors.length < count; y += stepY) {
      for (let x = 0; x < width && colors.length < count; x += stepX) {
        const index = (y * width + x) * 4;
        colors.push(rgbToHex(data[index], data[index + 1], data[index + 2]));
      }
    }
    
    return colors;
  };

  const colorDistance = (color1: [number, number, number], color2: [number, number, number]): number => {
    const dr = color1[0] - color2[0];
    const dg = color1[1] - color2[1];
    const db = color1[2] - color2[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadPalette = () => {
    const cssContent = extractedColors.map((color, index) => 
      `--color-${index + 1}: ${color};`
    ).join('\n');
    
    const blob = new Blob([`:root {\n${cssContent}\n}`], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-colors.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getContrastColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Palette className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Image Color Extractor</h2>
        <p className="text-muted-foreground">
          Extract colors from images using different methods and generate color palettes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Extraction Settings
            </CardTitle>
            <CardDescription>
              Upload an image and configure color extraction parameters
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
              <Label htmlFor="extractionMethod">Extraction Method</Label>
              <Select value={extractionMethod} onValueChange={setExtractionMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {extractionMethods.map(method => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number of Colors: {colorCount}</Label>
              <Slider
                value={[colorCount]}
                onValueChange={(value) => setColorCount(value[0])}
                max={20}
                min={3}
                step={1}
                className="w-full"
              />
            </div>

            <div className="p-3 bg-muted rounded-md">
              <h4 className="font-semibold text-sm mb-2">
                {extractionMethods.find(m => m.value === extractionMethod)?.label}
              </h4>
              <p className="text-xs text-muted-foreground">
                {extractionMethods.find(m => m.value === extractionMethod)?.description}
              </p>
            </div>

            <Button 
              onClick={extractColors}
              disabled={!selectedImage || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Extracting Colors...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Extract Colors
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
              <div>
                <img 
                  src={selectedImage} 
                  alt="Uploaded" 
                  className="w-full h-48 object-contain border rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
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

      {/* Extracted Colors Section */}
      {extractedColors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Extracted Colors ({extractedColors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {extractedColors.map((color, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="w-full h-20 rounded-lg border shadow-sm mb-2 cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color)}
                    title="Click to copy color"
                  >
                    <span 
                      className="text-lg font-bold flex items-center justify-center h-full"
                      style={{ color: getContrastColor(color) }}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <div className="text-sm font-mono">{color}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => copyToClipboard(extractedColors.join('\n'))}
                variant="outline"
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy All Colors
              </Button>
              <Button 
                onClick={downloadPalette}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSS
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Extraction Methods Explained</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Dominant Colors</h4>
              <p className="text-sm text-muted-foreground">
                Analyzes the entire image and finds the most frequently occurring colors. Best for identifying the main color scheme.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Average Colors</h4>
              <p className="text-sm text-muted-foreground">
                Divides the image into segments and calculates the average color of each segment. Good for understanding color distribution.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Color Palette</h4>
              <p className="text-sm text-muted-foreground">
                Uses clustering algorithms to generate a harmonious color palette. Ideal for design work and color schemes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Pixel Sampling</h4>
              <p className="text-sm text-muted-foreground">
                Samples colors from evenly distributed pixel locations across the image. Provides a systematic color overview.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
