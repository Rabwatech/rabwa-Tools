import { useState, useMemo } from "react";
import { Trash2, Copy, RotateCcw, Download, Settings, Filter, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface RemovalOptions {
  caseSensitive: boolean;
  ignoreEmptyLines: boolean;
  ignoreWhitespace: boolean;
  preserveOrder: boolean;
  removeMode: 'all' | 'consecutive' | 'keep-first' | 'keep-last';
  trimLines: boolean;
}

interface DuplicateStats {
  totalLines: number;
  uniqueLines: number;
  duplicateLines: number;
  removedLines: number;
  duplicateCount: number;
  mostCommonLine: string;
  mostCommonCount: number;
}

export const DuplicateLineRemover = () => {
  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');
  const [options, setOptions] = useState<RemovalOptions>({
    caseSensitive: false,
    ignoreEmptyLines: true,
    ignoreWhitespace: true,
    preserveOrder: true,
    removeMode: 'all',
    trimLines: true
  });
  const { toast } = useToast();

  const stats = useMemo(() => {
    if (!inputText.trim()) return null;
    return calculateStats(inputText, options);
  }, [inputText, options]);

  const cleanedStats = useMemo(() => {
    if (!cleanedText.trim()) return null;
    return calculateStats(cleanedText, options);
  }, [cleanedText, options]);

  const calculateStats = (text: string, options: RemovalOptions): DuplicateStats => {
    const lines = text.split('\n');
    const totalLines = lines.length;
    
    let processedLines = lines;
    
    if (options.trimLines) {
      processedLines = processedLines.map(line => line.trim());
    }
    
    if (options.ignoreEmptyLines) {
      processedLines = processedLines.filter(line => line.trim() !== '');
    }
    
    if (!options.caseSensitive) {
      processedLines = processedLines.map(line => line.toLowerCase());
    }
    
    if (options.ignoreWhitespace) {
      processedLines = processedLines.map(line => line.replace(/\s+/g, ' ').trim());
    }
    
    const lineCounts = new Map<string, number>();
    const originalLines = new Map<string, string>();
    
    processedLines.forEach((processedLine, index) => {
      const originalLine = lines[index];
      const count = lineCounts.get(processedLine) || 0;
      lineCounts.set(processedLine, count + 1);
      
      if (!originalLines.has(processedLine)) {
        originalLines.set(processedLine, originalLine);
      }
    });
    
    const uniqueLines = lineCounts.size;
    const duplicateLines = processedLines.length - uniqueLines;
    
    let mostCommonLine = '';
    let mostCommonCount = 0;
    
    lineCounts.forEach((count, line) => {
      if (count > mostCommonCount) {
        mostCommonCount = count;
        mostCommonLine = originalLines.get(line) || line;
      }
    });
    
    return {
      totalLines,
      uniqueLines,
      duplicateLines,
      removedLines: duplicateLines,
      duplicateCount: Array.from(lineCounts.values()).filter(count => count > 1).length,
      mostCommonLine,
      mostCommonCount
    };
  };

  const removeDuplicates = () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to process",
        description: "Please enter some text first",
        variant: "destructive",
      });
      return;
    }

    const lines = inputText.split('\n');
    let processedLines = lines;
    
    if (options.trimLines) {
      processedLines = processedLines.map(line => line.trim());
    }
    
    if (options.ignoreEmptyLines) {
      processedLines = processedLines.filter(line => line.trim() !== '');
    }
    
    let comparisonLines = processedLines;
    
    if (!options.caseSensitive) {
      comparisonLines = comparisonLines.map(line => line.toLowerCase());
    }
    
    if (options.ignoreWhitespace) {
      comparisonLines = comparisonLines.map(line => line.replace(/\s+/g, ' ').trim());
    }
    
    let result: string[] = [];
    
    switch (options.removeMode) {
      case 'all':
        result = removeAllDuplicates(processedLines, comparisonLines);
        break;
      case 'consecutive':
        result = removeConsecutiveDuplicates(processedLines, comparisonLines);
        break;
      case 'keep-first':
        result = keepFirstOccurrence(processedLines, comparisonLines);
        break;
      case 'keep-last':
        result = keepLastOccurrence(processedLines, comparisonLines);
        break;
    }
    
    setCleanedText(result.join('\n'));
  };

  const removeAllDuplicates = (originalLines: string[], comparisonLines: string[]): string[] => {
    const seen = new Set<string>();
    const result: string[] = [];
    
    for (let i = 0; i < comparisonLines.length; i++) {
      const comparisonLine = comparisonLines[i];
      if (!seen.has(comparisonLine)) {
        seen.add(comparisonLine);
        result.push(originalLines[i]);
      }
    }
    
    return result;
  };

  const removeConsecutiveDuplicates = (originalLines: string[], comparisonLines: string[]): string[] => {
    const result: string[] = [];
    
    for (let i = 0; i < comparisonLines.length; i++) {
      if (i === 0 || comparisonLines[i] !== comparisonLines[i - 1]) {
        result.push(originalLines[i]);
      }
    }
    
    return result;
  };

  const keepFirstOccurrence = (originalLines: string[], comparisonLines: string[]): string[] => {
    const seen = new Set<string>();
    const result: string[] = [];
    
    for (let i = 0; i < comparisonLines.length; i++) {
      const comparisonLine = comparisonLines[i];
      if (!seen.has(comparisonLine)) {
        seen.add(comparisonLine);
        result.push(originalLines[i]);
      }
    }
    
    return result;
  };

  const keepLastOccurrence = (originalLines: string[], comparisonLines: string[]): string[] => {
    const lastOccurrence = new Map<string, number>();
    
    // Find last occurrence of each line
    for (let i = 0; i < comparisonLines.length; i++) {
      lastOccurrence.set(comparisonLines[i], i);
    }
    
    // Keep only the last occurrence
    const result: string[] = [];
    for (let i = 0; i < comparisonLines.length; i++) {
      if (lastOccurrence.get(comparisonLines[i]) === i) {
        result.push(originalLines[i]);
      }
    }
    
    return result;
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
    const blob = new Blob([cleanedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned-text-no-duplicates.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Cleaned text saved to file",
    });
  };

  const resetAll = () => {
    setInputText('');
    setCleanedText('');
    setOptions({
      caseSensitive: false,
      ignoreEmptyLines: true,
      ignoreWhitespace: true,
      preserveOrder: true,
      removeMode: 'all',
      trimLines: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Removal Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Removal Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Removal Mode */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Removal Mode</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([
                { value: 'all', label: 'All Duplicates', description: 'Remove all duplicate lines' },
                { value: 'consecutive', label: 'Consecutive Only', description: 'Remove only consecutive duplicates' },
                { value: 'keep-first', label: 'Keep First', description: 'Keep first occurrence of each line' },
                { value: 'keep-last', label: 'Keep Last', description: 'Keep last occurrence of each line' }
              ] as const).map(({ value, label, description }) => (
                <div key={value} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={value}
                      name="removeMode"
                      checked={options.removeMode === value}
                      onChange={() => setOptions(prev => ({ ...prev, removeMode: value }))}
                      className="w-4 h-4 text-primary"
                    />
                    <Label htmlFor={value} className="text-sm font-medium">
                      {label}
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Processing Options</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="case-sensitive"
                    checked={options.caseSensitive}
                    onChange={(e) => setOptions(prev => ({ ...prev, caseSensitive: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="case-sensitive" className="text-sm">
                    Case sensitive
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="trim-lines"
                    checked={options.trimLines}
                    onChange={(e) => setOptions(prev => ({ ...prev, trimLines: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="trim-lines" className="text-sm">
                    Trim lines
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ignore-whitespace"
                    checked={options.ignoreWhitespace}
                    onChange={(e) => setOptions(prev => ({ ...prev, ignoreWhitespace: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="ignore-whitespace" className="text-sm">
                    Ignore whitespace differences
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Filter Options</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ignore-empty-lines"
                    checked={options.ignoreEmptyLines}
                    onChange={(e) => setOptions(prev => ({ ...prev, ignoreEmptyLines: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="ignore-empty-lines" className="text-sm">
                    Ignore empty lines
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="preserve-order"
                    checked={options.preserveOrder}
                    onChange={(e) => setOptions(prev => ({ ...prev, preserveOrder: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="preserve-order" className="text-sm">
                    Preserve original order
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
          <Label htmlFor="input-text">Input Text</Label>
          <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text with duplicate lines here..."
            className="min-h-[300px]"
          />
          {stats && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Total: {stats.totalLines}</Badge>
              <Badge variant="outline">Unique: {stats.uniqueLines}</Badge>
              <Badge variant="destructive">Duplicates: {stats.duplicateLines}</Badge>
              <Badge variant="secondary">Duplicate Sets: {stats.duplicateCount}</Badge>
              {stats.mostCommonCount > 1 && (
                <Badge variant="secondary">
                  Most Common: {stats.mostCommonCount}x
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={removeDuplicates} disabled={!inputText.trim()} className="flex-1">
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Duplicates
          </Button>
          <Button variant="outline" onClick={resetAll}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      {/* Cleaned Text */}
      {cleanedText && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cleaned-text">Cleaned Text (No Duplicates)</Label>
            <Textarea
              id="cleaned-text"
              value={cleanedText}
              readOnly
              className="min-h-[300px] bg-muted/50"
            />
            {cleanedStats && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Total: {cleanedStats.totalLines}</Badge>
                <Badge variant="secondary">Unique: {cleanedStats.uniqueLines}</Badge>
                <Badge variant="secondary">Removed: {cleanedStats.removedLines}</Badge>
                <Badge variant="secondary">Remaining: {cleanedStats.uniqueLines}</Badge>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => copyToClipboard(cleanedText)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Cleaned Text
            </Button>
            <Button variant="outline" onClick={() => copyToClipboard(inputText)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Original Text
            </Button>
            <Button variant="outline" onClick={downloadText}>
              <Download className="w-4 h-4 mr-2" />
              Download as TXT
            </Button>
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Duplicate Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Line Counts</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Lines:</span>
                    <span className="font-medium">{stats.totalLines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unique Lines:</span>
                    <span className="font-medium text-green-600">{stats.uniqueLines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duplicate Lines:</span>
                    <span className="font-medium text-red-600">{stats.duplicateLines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duplicate Sets:</span>
                    <span className="font-medium text-orange-600">{stats.duplicateCount}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Most Common</h4>
                {stats.mostCommonCount > 1 ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Line:</span>
                      <span className="font-medium max-w-[200px] truncate" title={stats.mostCommonLine}>
                        {stats.mostCommonLine}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Occurrences:</span>
                      <span className="font-medium text-red-600">{stats.mostCommonCount}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No duplicates found</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>All Duplicates:</strong> Removes every duplicate line, keeping only unique ones</li>
            <li>• <strong>Consecutive Only:</strong> Removes only lines that repeat immediately after</li>
            <li>• <strong>Keep First:</strong> Keeps the first occurrence of each unique line</li>
            <li>• <strong>Keep Last:</strong> Keeps the last occurrence of each unique line</li>
            <li>• Case sensitive option distinguishes between "Hello" and "hello"</li>
            <li>• Ignore whitespace treats "hello" and " hello " as the same</li>
            <li>• Use for cleaning up data, removing redundant entries, or deduplicating lists</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
