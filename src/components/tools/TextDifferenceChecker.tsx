import { useState, useMemo } from "react";
import { Diff, Copy, RotateCcw, Download, Settings, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Difference {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  lineNumber?: number;
}

interface ComparisonOptions {
  ignoreCase: boolean;
  ignoreWhitespace: boolean;
  ignorePunctuation: boolean;
  showLineNumbers: boolean;
  highlightMode: 'word' | 'character' | 'line';
}

export const TextDifferenceChecker = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [options, setOptions] = useState<ComparisonOptions>({
    ignoreCase: false,
    ignoreWhitespace: false,
    ignorePunctuation: false,
    showLineNumbers: true,
    highlightMode: 'word'
  });
  const { toast } = useToast();

  const differences = useMemo(() => {
    if (!text1.trim() || !text2.trim()) return null;
    
    return compareTexts(text1, text2, options);
  }, [text1, text2, options]);

  const compareTexts = (text1: string, text2: string, options: ComparisonOptions) => {
    let processedText1 = text1;
    let processedText2 = text2;

    // Apply preprocessing based on options
    if (options.ignoreCase) {
      processedText1 = processedText1.toLowerCase();
      processedText2 = processedText2.toLowerCase();
    }

    if (options.ignoreWhitespace) {
      processedText1 = processedText1.replace(/\s+/g, ' ').trim();
      processedText2 = processedText2.replace(/\s+/g, ' ').trim();
    }

    if (options.ignorePunctuation) {
      processedText1 = processedText1.replace(/[.,!?;:]/g, '');
      processedText2 = processedText2.replace(/[.,!?;:]/g, '');
    }

    if (options.highlightMode === 'line') {
      return compareByLines(processedText1, processedText2, text1, text2);
    } else if (options.highlightMode === 'word') {
      return compareByWords(processedText1, processedText2, text1, text2);
    } else {
      return compareByCharacters(processedText1, processedText2, text1, text2);
    }
  };

  const compareByLines = (processed1: string, processed2: string, original1: string, original2: string) => {
    const lines1 = original1.split('\n');
    const lines2 = original2.split('\n');
    const processedLines1 = processed1.split('\n');
    const processedLines2 = processed2.split('\n');

    const maxLines = Math.max(lines1.length, lines2.length);
    const differences: Difference[][] = [];

    for (let i = 0; i < maxLines; i++) {
      const line1 = processedLines1[i] || '';
      const line2 = processedLines2[i] || '';
      const originalLine1 = lines1[i] || '';
      const originalLine2 = lines2[i] || '';

      if (line1 === line2) {
        differences.push([{ type: 'unchanged', text: originalLine1, lineNumber: i + 1 }]);
      } else {
        differences.push([
          { type: 'removed', text: originalLine1, lineNumber: i + 1 },
          { type: 'added', text: originalLine2, lineNumber: i + 1 }
        ]);
      }
    }

    return differences;
  };

  const compareByWords = (processed1: string, processed2: string, original1: string, original2: string) => {
    const words1 = original1.split(/\s+/);
    const words2 = original2.split(/\s+/);
    const processedWords1 = processed1.split(/\s+/);
    const processedWords2 = processed2.split(/\s+/);

    const differences: Difference[] = [];
    let i = 0, j = 0;

    while (i < processedWords1.length || j < processedWords2.length) {
      if (i < processedWords1.length && j < processedWords2.length && processedWords1[i] === processedWords2[j]) {
        differences.push({ type: 'unchanged', text: words1[i] });
        i++;
        j++;
      } else if (i < processedWords1.length && (j >= processedWords2.length || processedWords1[i] !== processedWords2[j])) {
        differences.push({ type: 'removed', text: words1[i] });
        i++;
      } else {
        differences.push({ type: 'added', text: words2[j] });
        j++;
      }
    }

    return differences;
  };

  const compareByCharacters = (processed1: string, processed2: string, original1: string, original2: string) => {
    const differences: Difference[] = [];
    let i = 0, j = 0;

    while (i < processed1.length || j < processed2.length) {
      if (i < processed1.length && j < processed2.length && processed1[i] === processed2[j]) {
        differences.push({ type: 'unchanged', text: original1[i] });
        i++;
        j++;
      } else if (i < processed1.length && (j >= processed2.length || processed1[i] !== processed2[j])) {
        differences.push({ type: 'removed', text: original1[i] });
        i++;
      } else {
        differences.push({ type: 'added', text: original2[j] });
        j++;
      }
    }

    return differences;
  };

  const getStats = () => {
    if (!differences) return null;

    let added = 0, removed = 0, unchanged = 0;

    if (options.highlightMode === 'line') {
      differences.forEach(lineGroup => {
        lineGroup.forEach(diff => {
          if (diff.type === 'added') added++;
          else if (diff.type === 'removed') removed++;
          else unchanged++;
        });
      });
    } else {
      differences.forEach(diff => {
        if (diff.type === 'added') added++;
        else if (diff.type === 'removed') removed++;
        else unchanged++;
      });
    }

    return { added, removed, unchanged };
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

  const downloadComparison = () => {
    if (!differences) return;

    let content = 'Text Comparison Report\n';
    content += '='.repeat(50) + '\n\n';
    content += `Comparison Mode: ${options.highlightMode}\n`;
    content += `Ignore Case: ${options.ignoreCase}\n`;
    content += `Ignore Whitespace: ${options.ignoreWhitespace}\n`;
    content += `Ignore Punctuation: ${options.ignorePunctuation}\n\n`;

    if (options.highlightMode === 'line') {
      differences.forEach(lineGroup => {
        lineGroup.forEach(diff => {
          const prefix = diff.type === 'added' ? '[+] ' : diff.type === 'removed' ? '[-] ' : '[=] ';
          const lineNum = options.showLineNumbers ? ` (Line ${diff.lineNumber})` : '';
          content += `${prefix}${diff.text}${lineNum}\n`;
        });
      });
    } else {
      differences.forEach(diff => {
        const prefix = diff.type === 'added' ? '[+] ' : diff.type === 'removed' ? '[-] ' : '[=] ';
        content += `${prefix}${diff.text}`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-comparison-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Comparison report saved to file",
    });
  };

  const resetAll = () => {
    setText1('');
    setText2('');
    setOptions({
      ignoreCase: false,
      ignoreWhitespace: false,
      ignorePunctuation: false,
      showLineNumbers: true,
      highlightMode: 'word'
    });
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Comparison Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Comparison Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Highlight Mode</Label>
              <div className="flex gap-4">
                {(['word', 'character', 'line'] as const).map((mode) => (
                  <div key={mode} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={mode}
                      name="highlightMode"
                      checked={options.highlightMode === mode}
                      onChange={() => setOptions(prev => ({ ...prev, highlightMode: mode }))}
                      className="w-4 h-4 text-primary"
                    />
                    <Label htmlFor={mode} className="text-sm capitalize">
                      {mode}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Ignore Options</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ignore-case"
                    checked={options.ignoreCase}
                    onChange={(e) => setOptions(prev => ({ ...prev, ignoreCase: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="ignore-case" className="text-sm">
                    Ignore case
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
                    Ignore whitespace
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ignore-punctuation"
                    checked={options.ignorePunctuation}
                    onChange={(e) => setOptions(prev => ({ ...prev, ignorePunctuation: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="ignore-punctuation" className="text-sm">
                    Ignore punctuation
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show-line-numbers"
                    checked={options.showLineNumbers}
                    onChange={(e) => setOptions(prev => ({ ...prev, showLineNumbers: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="show-line-numbers" className="text-sm">
                    Show line numbers
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Texts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="text1">Original Text</Label>
          <Textarea
            id="text1"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Enter the first text to compare..."
            className="min-h-[300px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="text2">Modified Text</Label>
          <Textarea
            id="text2"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Enter the second text to compare..."
            className="min-h-[300px]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={resetAll}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
        {differences && (
          <>
            <Button variant="outline" onClick={downloadComparison}>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" onClick={() => copyToClipboard(text1)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Text 1
            </Button>
            <Button variant="outline" onClick={() => copyToClipboard(text2)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Text 2
            </Button>
          </>
        )}
      </div>

      {/* Comparison Results */}
      {differences && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Diff className="w-5 h-5" />
                Comparison Results
              </span>
              {stats && (
                <div className="flex gap-2">
                  <Badge variant="destructive">-{stats.removed}</Badge>
                  <Badge variant="default">={stats.unchanged}</Badge>
                  <Badge variant="secondary">+{stats.added}</Badge>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {options.highlightMode === 'line' ? (
              <div className="space-y-2">
                {differences.map((lineGroup, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    {lineGroup.map((diff, diffIndex) => (
                      <div
                        key={diffIndex}
                        className={`p-2 font-mono text-sm ${
                          diff.type === 'added'
                            ? 'bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500'
                            : diff.type === 'removed'
                            ? 'bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500'
                            : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {options.showLineNumbers && diff.lineNumber && (
                            <span className="text-xs text-muted-foreground min-w-[3rem]">
                              {diff.lineNumber}
                            </span>
                          )}
                          <span className="flex-1">
                            {diff.text || <span className="text-muted-foreground italic">(empty line)</span>}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                {differences.map((diff, index) => (
                  <span
                    key={index}
                    className={
                      diff.type === 'added'
                        ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100'
                        : diff.type === 'removed'
                        ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100'
                        : 'text-foreground'
                    }
                  >
                    {diff.text}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 dark:bg-red-800 rounded"></div>
              <span>Removed text</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 dark:bg-green-800 rounded"></div>
              <span>Added text</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted rounded"></div>
              <span>Unchanged text</span>
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
            <li>• <strong>Word mode:</strong> Best for comparing documents with minor changes</li>
            <li>• <strong>Character mode:</strong> Best for finding exact character differences</li>
            <li>• <strong>Line mode:</strong> Best for comparing code or structured text</li>
            <li>• Use ignore options to focus on meaningful differences</li>
            <li>• Line numbers help identify specific locations of changes</li>
            <li>• Download the report for offline review or sharing</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
