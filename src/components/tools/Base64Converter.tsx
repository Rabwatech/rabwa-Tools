import { useState, useMemo } from "react";
import { FileCode, Copy, RotateCcw, Download, Settings, ArrowRight, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ConverterOptions {
  direction: 'encode' | 'decode';
  format: 'standard' | 'url-safe' | 'mime';
  lineBreaks: boolean;
  lineLength: number;
  validateInput: boolean;
  showStats: boolean;
}

interface ConversionStats {
  inputLength: number;
  outputLength: number;
  compressionRatio: number;
  isValid: boolean;
  encodingType: string;
}

export const Base64Converter = () => {
  const [inputText, setInputText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [options, setOptions] = useState<ConverterOptions>({
    direction: 'encode',
    format: 'standard',
    lineBreaks: false,
    lineLength: 76,
    validateInput: true,
    showStats: true
  });
  const { toast } = useToast();

  const conversionStats = useMemo(() => {
    if (!inputText.trim() || !convertedText.trim()) return null;
    return calculateStats(inputText, convertedText, options);
  }, [inputText, convertedText, options]);

  const calculateStats = (input: string, output: string, options: ConverterOptions): ConversionStats => {
    const inputLength = input.length;
    const outputLength = output.length;
    const compressionRatio = inputLength > 0 ? ((outputLength - inputLength) / inputLength) * 100 : 0;
    
    let isValid = true;
    let encodingType = 'Unknown';
    
    if (options.direction === 'decode') {
      try {
        // Try to decode to check validity
        atob(output);
        encodingType = 'Valid Base64';
      } catch {
        isValid = false;
        encodingType = 'Invalid Base64';
      }
    } else {
      encodingType = 'UTF-8 Text';
    }
    
    return {
      inputLength,
      outputLength,
      compressionRatio,
      isValid,
      encodingType
    };
  };

  const convert = () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to convert",
        description: "Please enter some text first",
        variant: "destructive",
      });
      return;
    }

    try {
      let result = '';
      
      if (options.direction === 'encode') {
        result = encodeText(inputText, options);
      } else {
        result = decodeText(inputText, options);
      }
      
      setConvertedText(result);
      
      toast({
        title: "Conversion successful",
        description: `Text ${options.direction === 'encode' ? 'encoded' : 'decoded'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "Invalid input for conversion",
        variant: "destructive",
      });
    }
  };

  const encodeText = (text: string, options: ConverterOptions): string => {
    let encoded = '';
    
    if (options.format === 'url-safe') {
      encoded = btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    } else if (options.format === 'mime') {
      encoded = btoa(text);
    } else {
      encoded = btoa(text);
    }
    
    if (options.lineBreaks && options.lineLength > 0) {
      const lines = [];
      for (let i = 0; i < encoded.length; i += options.lineLength) {
        lines.push(encoded.slice(i, i + options.lineLength));
      }
      encoded = lines.join('\n');
    }
    
    return encoded;
  };

  const decodeText = (text: string, options: ConverterOptions): string => {
    let decoded = '';
    
    // Remove line breaks and whitespace
    const cleanText = text.replace(/[\r\n\s]/g, '');
    
    if (options.format === 'url-safe') {
      // Add padding back
      let padded = cleanText;
      while (padded.length % 4 !== 0) {
        padded += '=';
      }
      // Replace URL-safe characters back
      padded = padded.replace(/-/g, '+').replace(/_/g, '/');
      decoded = atob(padded);
    } else {
      decoded = atob(cleanText);
    }
    
    return decoded;
  };

  const validateBase64 = (text: string): boolean => {
    try {
      // Remove line breaks and whitespace
      const cleanText = text.replace(/[\r\n\s]/g, '');
      
      // Check if length is valid (must be multiple of 4)
      if (cleanText.length % 4 !== 0) {
        return false;
      }
      
      // Check if contains only valid Base64 characters
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanText)) {
        return false;
      }
      
      // Try to decode
      atob(cleanText);
      return true;
    } catch {
      return false;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const downloadText = () => {
    const blob = new Blob([convertedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64-${options.direction}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Converted text saved to file",
    });
  };

  const resetAll = () => {
    setInputText('');
    setConvertedText('');
    setOptions({
      direction: 'encode',
      format: 'standard',
      lineBreaks: false,
      lineLength: 76,
      validateInput: true,
      showStats: true
    });
  };

  const swapDirection = () => {
    setOptions(prev => ({
      ...prev,
      direction: prev.direction === 'encode' ? 'decode' : 'encode'
    }));
    setInputText(convertedText);
    setConvertedText('');
  };

  const isInputValid = options.direction === 'decode' ? validateBase64(inputText) : true;

  return (
    <div className="space-y-6">
      {/* Converter Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Converter Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Direction Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Conversion Direction</Label>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="encode"
                  name="direction"
                  checked={options.direction === 'encode'}
                  onChange={() => setOptions(prev => ({ ...prev, direction: 'encode' }))}
                  className="w-4 h-4 text-primary"
                />
                <Label htmlFor="encode" className="text-sm">
                  Encode (Text → Base64)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="decode"
                  name="direction"
                  checked={options.direction === 'decode'}
                  onChange={() => setOptions(prev => ({ ...prev, direction: 'decode' }))}
                  className="w-4 h-4 text-primary"
                />
                <Label htmlFor="decode" className="text-sm">
                  Decode (Base64 → Text)
                </Label>
              </div>
            </div>
          </div>

          {/* Format and Line Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Base64 Format</Label>
              <div className="space-y-2">
                {([
                  { value: 'standard', label: 'Standard', description: 'Standard Base64 encoding' },
                  { value: 'url-safe', label: 'URL Safe', description: 'URL-safe Base64 (no +/= chars)' },
                  { value: 'mime', label: 'MIME', description: 'MIME-compliant Base64' }
                ] as const).map(({ value, label, description }) => (
                  <div key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={value}
                      name="format"
                      checked={options.format === value}
                      onChange={() => setOptions(prev => ({ ...prev, format: value }))}
                      className="w-4 h-4 text-primary"
                    />
                    <Label htmlFor={value} className="text-sm">
                      {label}
                    </Label>
                    <span className="text-xs text-muted-foreground">({description})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Line Formatting</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="line-breaks"
                    checked={options.lineBreaks}
                    onChange={(e) => setOptions(prev => ({ ...prev, lineBreaks: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="line-breaks" className="text-sm">
                    Add line breaks
                  </Label>
                </div>
                {options.lineBreaks && (
                  <div className="ml-6">
                    <Label htmlFor="line-length" className="text-xs text-muted-foreground">
                      Line length: {options.lineLength}
                    </Label>
                    <input
                      type="range"
                      id="line-length"
                      min="40"
                      max="120"
                      step="4"
                      value={options.lineLength}
                      onChange={(e) => setOptions(prev => ({ ...prev, lineLength: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Validation Options</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="validate-input"
                    checked={options.validateInput}
                    onChange={(e) => setOptions(prev => ({ ...prev, validateInput: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="validate-input" className="text-sm">
                    Validate input
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show-stats"
                    checked={options.showStats}
                    onChange={(e) => setOptions(prev => ({ ...prev, showStats: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="show-stats" className="text-sm">
                    Show conversion statistics
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
          <Label htmlFor="input-text">
            {options.direction === 'encode' ? 'Input Text' : 'Input Base64'}
          </Label>
          <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={options.direction === 'encode' 
              ? 'Enter text to encode to Base64...' 
              : 'Enter Base64 string to decode...'
            }
            className="min-h-[200px] font-mono"
          />
          {options.validateInput && options.direction === 'decode' && inputText && (
            <div className="flex items-center gap-2 text-sm">
              {isInputValid ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span className={isInputValid ? 'text-green-600' : 'text-red-600'}>
                {isInputValid ? 'Valid Base64' : 'Invalid Base64'}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={convert} disabled={!inputText.trim()} className="flex-1">
            <ArrowRight className="w-4 h-4 mr-2" />
            {options.direction === 'encode' ? 'Encode' : 'Decode'}
          </Button>
          <Button variant="outline" onClick={swapDirection} disabled={!inputText && !convertedText}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Swap Direction
          </Button>
          <Button variant="outline" onClick={resetAll}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      {/* Conversion Result */}
      {convertedText && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="converted-text">
              {options.direction === 'encode' ? 'Base64 Output' : 'Decoded Text'}
            </Label>
            <Textarea
              id="converted-text"
              value={convertedText}
              readOnly
              className="min-h-[200px] bg-muted/50 font-mono"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => copyToClipboard(convertedText)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy {options.direction === 'encode' ? 'Base64' : 'Text'}
            </Button>
            <Button variant="outline" onClick={() => copyToClipboard(inputText)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy {options.direction === 'encode' ? 'Text' : 'Base64'}
            </Button>
            <Button variant="outline" onClick={downloadText}>
              <Download className="w-4 h-4 mr-2" />
              Download as TXT
            </Button>
          </div>
        </div>
      )}

      {/* Conversion Statistics */}
      {conversionStats && options.showStats && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Size Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Input Length:</span>
                    <span className="font-medium">{conversionStats.inputLength} characters</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Output Length:</span>
                    <span className="font-medium">{conversionStats.outputLength} characters</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size Change:</span>
                    <span className={`font-medium ${conversionStats.compressionRatio > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {conversionStats.compressionRatio > 0 ? '+' : ''}{conversionStats.compressionRatio.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Validation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-medium ${conversionStats.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {conversionStats.isValid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{conversionStats.encodingType}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Base64 Information */}
      <Card>
        <CardHeader>
          <CardTitle>About Base64</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format 
              by translating it into a radix-64 representation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Use Cases:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Email attachments</li>
                  <li>• Data URLs</li>
                  <li>• API responses</li>
                  <li>• File encoding</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Formats:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Standard:</strong> RFC 4648 compliant</li>
                  <li>• <strong>URL Safe:</strong> No +/= characters</li>
                  <li>• <strong>MIME:</strong> Email attachment format</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Base64 encoding increases data size by approximately 33%</li>
            <li>• URL-safe format is useful for embedding in URLs and cookies</li>
            <li>• Line breaks improve readability for long Base64 strings</li>
            <li>• Always validate Base64 input before decoding</li>
            <li>• Use MIME format for email attachments and web applications</li>
            <li>• The tool automatically handles padding and line breaks</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
