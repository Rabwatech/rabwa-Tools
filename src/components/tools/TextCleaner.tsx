import { useState } from "react";
import { Trash2, Copy, RotateCcw, FileText, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CleaningOptions {
  removeExtraSpaces: boolean;
  removeLineBreaks: boolean;
  removeTabs: boolean;
  removeSpecialChars: boolean;
  removeNumbers: boolean;
  removePunctuation: boolean;
  trimWhitespace: boolean;
  normalizeUnicode: boolean;
}

export const TextCleaner = () => {
  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');
  const [options, setOptions] = useState<CleaningOptions>({
    removeExtraSpaces: true,
    removeLineBreaks: false,
    removeTabs: true,
    removeSpecialChars: false,
    removeNumbers: false,
    removePunctuation: false,
    trimWhitespace: true,
    normalizeUnicode: true,
  });
  const { toast } = useToast();

  const toggleOption = (key: keyof CleaningOptions) => {
    setOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const cleanText = () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to clean",
        description: "Please enter some text first",
        variant: "destructive",
      });
      return;
    }

    let result = inputText;

    if (options.removeTabs) {
      result = result.replace(/\t/g, ' ');
    }

    if (options.removeLineBreaks) {
      result = result.replace(/\r?\n/g, ' ');
    }

    if (options.removeExtraSpaces) {
      result = result.replace(/\s+/g, ' ');
    }

    if (options.removeSpecialChars) {
      result = result.replace(/[^\w\s]/g, '');
    }

    if (options.removeNumbers) {
      result = result.replace(/\d/g, '');
    }

    if (options.removePunctuation) {
      result = result.replace(/[.,!?;:]/g, '');
    }

    if (options.trimWhitespace) {
      result = result.trim();
    }

    if (options.normalizeUnicode) {
      result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    setCleanedText(result);
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

  const resetAll = () => {
    setInputText('');
    setCleanedText('');
    setOptions({
      removeExtraSpaces: true,
      removeLineBreaks: false,
      removeTabs: true,
      removeSpecialChars: false,
      removeNumbers: false,
      removePunctuation: false,
      trimWhitespace: true,
      normalizeUnicode: true,
    });
  };

  const getStats = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const spaces = (text.match(/\s/g) || []).length;
    const tabs = (text.match(/\t/g) || []).length;
    const specialChars = (text.match(/[^\w\s]/g) || []).length;

    return { lines, words, chars, charsNoSpaces, spaces, tabs, specialChars };
  };

  const inputStats = getStats(inputText);
  const cleanedStats = getStats(cleanedText);

  return (
    <div className="space-y-6">
      {/* Cleaning Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Cleaning Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(options).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <button
                  onClick={() => toggleOption(key as keyof CleaningOptions)}
                  className="flex items-center justify-center w-5 h-5"
                >
                  {value ? (
                    <CheckSquare className="w-5 h-5 text-primary" />
                  ) : (
                    <Square className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <Label className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
              </div>
            ))}
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
            placeholder="Paste your messy text here..."
            className="min-h-[200px]"
          />
          {inputStats && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Lines: {inputStats.lines}</Badge>
              <Badge variant="outline">Words: {inputStats.words}</Badge>
              <Badge variant="outline">Chars: {inputStats.chars}</Badge>
              <Badge variant="outline">Spaces: {inputStats.spaces}</Badge>
              <Badge variant="outline">Tabs: {inputStats.tabs}</Badge>
              <Badge variant="outline">Special: {inputStats.specialChars}</Badge>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={cleanText} disabled={!inputText.trim()}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clean Text
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
            <Label htmlFor="cleaned-text">Cleaned Text</Label>
            <Textarea
              id="cleaned-text"
              value={cleanedText}
              readOnly
              className="min-h-[200px] bg-muted/50"
            />
            {cleanedStats && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Lines: {cleanedStats.lines}</Badge>
                <Badge variant="secondary">Words: {cleanedStats.words}</Badge>
                <Badge variant="secondary">Chars: {cleanedStats.chars}</Badge>
                <Badge variant="secondary">Spaces: {cleanedStats.spaces}</Badge>
                <Badge variant="secondary">Tabs: {cleanedStats.tabs}</Badge>
                <Badge variant="secondary">Special: {cleanedStats.specialChars}</Badge>
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
          </div>
        </div>
      )}

      {/* Comparison View */}
      {inputText && cleanedText && (
        <Card>
          <CardHeader>
            <CardTitle>Before vs After Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2 text-red-600">Before (Original)</h4>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <pre className="text-sm whitespace-pre-wrap break-words">{inputText}</pre>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2 text-green-600">After (Cleaned)</h4>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <pre className="text-sm whitespace-pre-wrap break-words">{cleanedText}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Text Cleaning Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Remove Extra Spaces:</strong> Eliminates multiple consecutive spaces</li>
            <li>• <strong>Remove Line Breaks:</strong> Converts line breaks to single spaces</li>
            <li>• <strong>Remove Tabs:</strong> Converts tab characters to spaces</li>
            <li>• <strong>Remove Special Characters:</strong> Removes symbols and punctuation</li>
            <li>• <strong>Remove Numbers:</strong> Eliminates all numeric characters</li>
            <li>• <strong>Remove Punctuation:</strong> Removes common punctuation marks</li>
            <li>• <strong>Trim Whitespace:</strong> Removes leading and trailing spaces</li>
            <li>• <strong>Normalize Unicode:</strong> Standardizes special characters</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
