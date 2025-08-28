import { useState, useMemo } from "react";
import { Type, Copy, RotateCcw, Download, Settings, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ConverterOptions {
  direction: 'text-to-ascii' | 'ascii-to-text';
  format: 'decimal' | 'hex' | 'binary' | 'octal';
  separator: 'space' | 'comma' | 'hyphen' | 'none';
  includeOriginal: boolean;
  showCharInfo: boolean;
  groupBy: 'none' | 'word' | 'line';
  padding: 'none' | 'zero' | 'space';
}

interface CharInfo {
  char: string;
  ascii: number;
  hex: string;
  binary: string;
  octal: string;
  description: string;
}

export const TextAsciiConverter = () => {
  const [inputText, setInputText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [options, setOptions] = useState<ConverterOptions>({
    direction: 'text-to-ascii',
    format: 'decimal',
    separator: 'space',
    includeOriginal: true,
    showCharInfo: false,
    groupBy: 'none',
    padding: 'none'
  });
  const { toast } = useToast();

  const convertedResult = useMemo(() => {
    if (!inputText.trim()) return null;
    
    if (options.direction === 'text-to-ascii') {
      return convertTextToAscii(inputText, options);
    } else {
      return convertAsciiToText(inputText, options);
    }
  }, [inputText, options]);

  const convertTextToAscii = (text: string, options: ConverterOptions) => {
    const chars = text.split('');
    const result: string[] = [];
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const ascii = char.charCodeAt(0);
      
      let formatted: string;
      switch (options.format) {
        case 'decimal':
          formatted = ascii.toString();
          break;
        case 'hex':
          formatted = ascii.toString(16).toUpperCase();
          break;
        case 'binary':
          formatted = ascii.toString(2);
          break;
        case 'octal':
          formatted = ascii.toString(8);
          break;
        default:
          formatted = ascii.toString();
      }
      
      // Apply padding
      if (options.padding !== 'none') {
        const maxLength = options.format === 'binary' ? 8 : options.format === 'hex' ? 2 : 3;
        const paddingChar = options.padding === 'zero' ? '0' : ' ';
        formatted = formatted.padStart(maxLength, paddingChar);
      }
      
      result.push(formatted);
    }
    
    // Apply grouping
    if (options.groupBy === 'word') {
      const words = text.split(/\s+/);
      const groupedResult: string[] = [];
      
      for (const word of words) {
        if (word.trim()) {
          const wordChars = word.split('').map(char => {
            const ascii = char.charCodeAt(0);
            return formatAscii(ascii, options.format, options.padding);
          });
          groupedResult.push(wordChars.join(getSeparator(options.separator)));
        }
      }
      return groupedResult.join('\n');
    } else if (options.groupBy === 'line') {
      const lines = text.split('\n');
      const groupedResult: string[] = [];
      
      for (const line of lines) {
        if (line.trim()) {
          const lineChars = line.split('').map(char => {
            const ascii = char.charCodeAt(0);
            return formatAscii(ascii, options.format, options.padding);
          });
          groupedResult.push(lineChars.join(getSeparator(options.separator)));
        }
      }
      return groupedResult.join('\n');
    }
    
    return result.join(getSeparator(options.separator));
  };

  const convertAsciiToText = (text: string, options: ConverterOptions) => {
    let separator = getSeparator(options.separator);
    let asciiCodes: string[];
    
    if (separator === '') {
      // No separator - try to parse as continuous string
      asciiCodes = parseContinuousAscii(text, options.format);
    } else {
      asciiCodes = text.split(separator).filter(code => code.trim());
    }
    
    const result: string[] = [];
    
    for (const code of asciiCodes) {
      try {
        let ascii: number;
        
        switch (options.format) {
          case 'decimal':
            ascii = parseInt(code.trim(), 10);
            break;
          case 'hex':
            ascii = parseInt(code.trim(), 16);
            break;
          case 'binary':
            ascii = parseInt(code.trim(), 2);
            break;
          case 'octal':
            ascii = parseInt(code.trim(), 8);
            break;
          default:
            ascii = parseInt(code.trim(), 10);
        }
        
        if (!isNaN(ascii) && ascii >= 0 && ascii <= 127) {
          result.push(String.fromCharCode(ascii));
        } else {
          result.push(''); // Invalid character
        }
      } catch {
        result.push(''); // Invalid character
      }
    }
    
    return result.join('');
  };

  const parseContinuousAscii = (text: string, format: string): string[] => {
    const result: string[] = [];
    let currentCode = '';
    
    for (const char of text) {
      if (isValidAsciiChar(char, format)) {
        currentCode += char;
      } else if (currentCode) {
        result.push(currentCode);
        currentCode = '';
      }
    }
    
    if (currentCode) {
      result.push(currentCode);
    }
    
    return result;
  };

  const isValidAsciiChar = (char: string, format: string): boolean => {
    switch (format) {
      case 'decimal':
        return /[0-9]/.test(char);
      case 'hex':
        return /[0-9A-Fa-f]/.test(char);
      case 'binary':
        return /[01]/.test(char);
      case 'octal':
        return /[0-7]/.test(char);
      default:
        return /[0-9]/.test(char);
    }
  };

  const formatAscii = (ascii: number, format: string, padding: string): string => {
    let formatted: string;
    switch (format) {
      case 'decimal':
        formatted = ascii.toString();
        break;
      case 'hex':
        formatted = ascii.toString(16).toUpperCase();
        break;
      case 'binary':
        formatted = ascii.toString(2);
        break;
      case 'octal':
        formatted = ascii.toString(8);
        break;
      default:
        formatted = ascii.toString();
    }
    
    if (padding !== 'none') {
      const maxLength = format === 'binary' ? 8 : format === 'hex' ? 2 : 3;
      const paddingChar = padding === 'zero' ? '0' : ' ';
      formatted = formatted.padStart(maxLength, paddingChar);
    }
    
    return formatted;
  };

  const getSeparator = (separator: string): string => {
    switch (separator) {
      case 'space': return ' ';
      case 'comma': return ', ';
      case 'hyphen': return ' - ';
      case 'none': return '';
      default: return ' ';
    }
  };

  const getCharInfo = (text: string): CharInfo[] => {
    return text.split('').map(char => {
      const ascii = char.charCodeAt(0);
      return {
        char,
        ascii,
        hex: ascii.toString(16).toUpperCase().padStart(2, '0'),
        binary: ascii.toString(2).padStart(8, '0'),
        octal: ascii.toString(8).padStart(3, '0'),
        description: getCharDescription(char, ascii)
      };
    });
  };

  const getCharDescription = (char: string, ascii: number): string => {
    if (ascii === 32) return 'Space';
    if (ascii === 9) return 'Tab';
    if (ascii === 10) return 'Line Feed';
    if (ascii === 13) return 'Carriage Return';
    if (ascii >= 32 && ascii <= 126) return 'Printable ASCII';
    if (ascii >= 0 && ascii <= 31) return 'Control Character';
    if (ascii === 127) return 'Delete';
    return 'Extended ASCII';
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
    const blob = new Blob([convertedResult || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-conversion-${options.direction}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Conversion result saved to file",
    });
  };

  const resetAll = () => {
    setInputText('');
    setConvertedText('');
    setOptions({
      direction: 'text-to-ascii',
      format: 'decimal',
      separator: 'space',
      includeOriginal: true,
      showCharInfo: false,
      groupBy: 'none',
      padding: 'none'
    });
  };

  const swapDirection = () => {
    setOptions(prev => ({
      ...prev,
      direction: prev.direction === 'text-to-ascii' ? 'ascii-to-text' : 'text-to-ascii'
    }));
    setInputText(convertedResult || '');
    setConvertedText('');
  };

  const charInfo = options.showCharInfo && inputText ? getCharInfo(inputText) : null;

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
                  id="text-to-ascii"
                  name="direction"
                  checked={options.direction === 'text-to-ascii'}
                  onChange={() => setOptions(prev => ({ ...prev, direction: 'text-to-ascii' }))}
                  className="w-4 h-4 text-primary"
                />
                <Label htmlFor="text-to-ascii" className="text-sm">
                  Text → ASCII
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="ascii-to-text"
                  name="direction"
                  checked={options.direction === 'ascii-to-text'}
                  onChange={() => setOptions(prev => ({ ...prev, direction: 'ascii-to-text' }))}
                  className="w-4 h-4 text-primary"
                />
                <Label htmlFor="ascii-to-text" className="text-sm">
                  ASCII → Text
                </Label>
              </div>
            </div>
          </div>

          {/* Format and Separator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Number Format</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['decimal', 'hex', 'binary', 'octal'] as const).map((format) => (
                  <div key={format} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={format}
                      name="format"
                      checked={options.format === format}
                      onChange={() => setOptions(prev => ({ ...prev, format }))}
                      className="w-4 h-4 text-primary"
                    />
                    <Label htmlFor={format} className="text-sm capitalize">
                      {format}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Separator</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['space', 'comma', 'hyphen', 'none'] as const).map((separator) => (
                  <div key={separator} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={separator}
                      name="separator"
                      checked={options.separator === separator}
                      onChange={() => setOptions(prev => ({ ...prev, separator }))}
                      className="w-4 h-4 text-primary"
                    />
                    <Label htmlFor={separator} className="text-sm capitalize">
                      {separator}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Formatting Options</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="include-original"
                    checked={options.includeOriginal}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeOriginal: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="include-original" className="text-sm">
                    Include original text
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show-char-info"
                    checked={options.showCharInfo}
                    onChange={(e) => setOptions(prev => ({ ...prev, showCharInfo: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="show-char-info" className="text-sm">
                    Show character information
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Grouping & Padding</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <select
                    value={options.groupBy}
                    onChange={(e) => setOptions(prev => ({ ...prev, groupBy: e.target.value as any }))}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="none">No grouping</option>
                    <option value="word">Group by word</option>
                    <option value="line">Group by line</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={options.padding}
                    onChange={(e) => setOptions(prev => ({ ...prev, padding: e.target.value as any }))}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="none">No padding</option>
                    <option value="zero">Zero padding</option>
                    <option value="space">Space padding</option>
                  </select>
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
            {options.direction === 'text-to-ascii' ? 'Input Text' : 'Input ASCII Codes'}
          </Label>
          <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={options.direction === 'text-to-ascii' 
              ? 'Enter text to convert to ASCII...' 
              : 'Enter ASCII codes to convert to text...'
            }
            className="min-h-[200px]"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={swapDirection} disabled={!inputText && !convertedResult}>
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
      {convertedResult && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="converted-text">
              {options.direction === 'text-to-ascii' ? 'ASCII Codes' : 'Converted Text'}
            </Label>
            <Textarea
              id="converted-text"
              value={convertedResult}
              readOnly
              className="min-h-[200px] bg-muted/50 font-mono"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => copyToClipboard(convertedResult)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Result
            </Button>
            <Button variant="outline" onClick={() => copyToClipboard(inputText)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Input
            </Button>
            <Button variant="outline" onClick={downloadText}>
              <Download className="w-4 h-4 mr-2" />
              Download as TXT
            </Button>
          </div>
        </div>
      )}

      {/* Character Information */}
      {charInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Character Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Char</th>
                    <th className="text-left p-2">Decimal</th>
                    <th className="text-left p-2">Hex</th>
                    <th className="text-left p-2">Binary</th>
                    <th className="text-left p-2">Octal</th>
                    <th className="text-left p-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {charInfo.map((info, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-mono">{info.char}</td>
                      <td className="p-2 font-mono">{info.ascii}</td>
                      <td className="p-2 font-mono">{info.hex}</td>
                      <td className="p-2 font-mono">{info.binary}</td>
                      <td className="p-2 font-mono">{info.octal}</td>
                      <td className="p-2 text-xs">{info.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ASCII Reference */}
      <Card>
        <CardHeader>
          <CardTitle>ASCII Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-sm mb-2">Control Characters (0-31)</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>0-8: Control codes</div>
                <div>9: Tab</div>
                <div>10: Line Feed</div>
                <div>13: Carriage Return</div>
                <div>27: Escape</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Printable Characters (32-126)</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>32: Space</div>
                <div>48-57: Numbers (0-9)</div>
                <div>65-90: Uppercase (A-Z)</div>
                <div>97-122: Lowercase (a-z)</div>
                <div>33-47, 58-64, 91-96, 123-126: Punctuation</div>
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
            <li>• <strong>Decimal:</strong> Standard ASCII codes (0-127)</li>
            <li>• <strong>Hex:</strong> Hexadecimal representation (00-7F)</li>
            <li>• <strong>Binary:</strong> Binary representation (00000000-11111111)</li>
            <li>• <strong>Octal:</strong> Octal representation (000-177)</li>
            <li>• Use different separators for different output formats</li>
            <li>• Padding ensures consistent code lengths</li>
            <li>• Grouping helps organize output by words or lines</li>
            <li>• Character information shows detailed breakdown of each character</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
