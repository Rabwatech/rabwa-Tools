import { useState } from "react";
import { RotateCcw, Copy, RotateCcw as ReverseIcon, Settings, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ReverserOptions {
  mode: 'character' | 'word' | 'line' | 'sentence';
  preserveCase: boolean;
  preservePunctuation: boolean;
  preserveNumbers: boolean;
  preserveSpacing: boolean;
  reverseWordsOnly: boolean;
}

export const TextReverser = () => {
  const [inputText, setInputText] = useState('');
  const [reversedText, setReversedText] = useState('');
  const [options, setOptions] = useState<ReverserOptions>({
    mode: 'character',
    preserveCase: true,
    preservePunctuation: true,
    preserveNumbers: true,
    preserveSpacing: true,
    reverseWordsOnly: false
  });
  const { toast } = useToast();

  const reverseText = () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to reverse",
        description: "Please enter some text first",
        variant: "destructive",
      });
      return;
    }

    let result = '';

    switch (options.mode) {
      case 'character':
        result = reverseByCharacters(inputText);
        break;
      case 'word':
        result = reverseByWords(inputText);
        break;
      case 'line':
        result = reverseByLines(inputText);
        break;
      case 'sentence':
        result = reverseBySentences(inputText);
        break;
    }

    setReversedText(result);
  };

  const reverseByCharacters = (text: string): string => {
    if (options.reverseWordsOnly) {
      return text.split(/\s+/).map(word => {
        if (options.preserveCase) {
          return reverseWordPreservingCase(word);
        }
        return word.split('').reverse().join('');
      }).join(' ');
    }

    if (options.preserveCase) {
      return reverseTextPreservingCase(text);
    }

    return text.split('').reverse().join('');
  };

  const reverseByWords = (text: string): string => {
    const words = text.split(/\s+/);
    const reversedWords = words.reverse();
    
    if (options.preserveSpacing) {
      // Preserve original spacing patterns
      const spacingPattern = text.match(/\s+/g) || [];
      let result = '';
      
      for (let i = 0; i < reversedWords.length; i++) {
        result += reversedWords[i];
        if (i < spacingPattern.length) {
          result += spacingPattern[i];
        } else if (i < reversedWords.length - 1) {
          result += ' ';
        }
      }
      
      return result;
    }
    
    return reversedWords.join(' ');
  };

  const reverseByLines = (text: string): string => {
    const lines = text.split('\n');
    return lines.reverse().join('\n');
  };

  const reverseBySentences = (text: string): string => {
    // Split by sentence endings and preserve them
    const sentences = text.split(/([.!?]+)/);
    const reversedSentences = [];
    
    for (let i = 0; i < sentences.length; i += 2) {
      if (sentences[i + 1]) {
        reversedSentences.unshift(sentences[i] + sentences[i + 1]);
      } else {
        reversedSentences.unshift(sentences[i]);
      }
    }
    
    return reversedSentences.join(' ');
  };

  const reverseWordPreservingCase = (word: string): string => {
    const reversed = word.split('').reverse();
    
    // Preserve the case pattern
    for (let i = 0; i < reversed.length; i++) {
      const originalChar = word[i];
      const reversedChar = reversed[i];
      
      if (originalChar === originalChar.toUpperCase()) {
        reversed[i] = reversedChar.toUpperCase();
      } else {
        reversed[i] = reversedChar.toLowerCase();
      }
    }
    
    return reversed.join('');
  };

  const reverseTextPreservingCase = (text: string): string => {
    const reversed = text.split('').reverse();
    
    // Preserve the case pattern
    for (let i = 0; i < reversed.length; i++) {
      const originalChar = text[i];
      const reversedChar = reversed[i];
      
      if (originalChar === originalChar.toUpperCase()) {
        reversed[i] = reversedChar.toUpperCase();
      } else {
        reversed[i] = reversedChar.toLowerCase();
      }
    }
    
    return reversed.join('');
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
    const blob = new Blob([reversedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reversed-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Reversed text saved to file",
    });
  };

  const resetAll = () => {
    setInputText('');
    setReversedText('');
    setOptions({
      mode: 'character',
      preserveCase: true,
      preservePunctuation: true,
      preserveNumbers: true,
      preserveSpacing: true,
      reverseWordsOnly: false
    });
  };

  const getStats = (text: string) => {
    if (!text) return null;
    
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    
    return { characters, charactersNoSpaces, words, lines, sentences };
  };

  const inputStats = getStats(inputText);
  const reversedStats = getStats(reversedText);

  return (
    <div className="space-y-6">
      {/* Reverser Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Reverser Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Reversal Mode</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['character', 'word', 'line', 'sentence'] as const).map((mode) => (
                <div key={mode} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={mode}
                    name="mode"
                    checked={options.mode === mode}
                    onChange={() => setOptions(prev => ({ ...prev, mode }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor={mode} className="text-sm capitalize">
                    {mode}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Preservation Options</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="preserve-case"
                    checked={options.preserveCase}
                    onChange={(e) => setOptions(prev => ({ ...prev, preserveCase: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="preserve-case" className="text-sm">
                    Preserve case pattern
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="preserve-punctuation"
                    checked={options.preservePunctuation}
                    onChange={(e) => setOptions(prev => ({ ...prev, preservePunctuation: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="preserve-punctuation" className="text-sm">
                    Preserve punctuation
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="preserve-numbers"
                    checked={options.preserveNumbers}
                    onChange={(e) => setOptions(prev => ({ ...prev, preserveNumbers: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="preserve-numbers" className="text-sm">
                    Preserve numbers
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Formatting Options</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="preserve-spacing"
                    checked={options.preserveSpacing}
                    onChange={(e) => setOptions(prev => ({ ...prev, preserveSpacing: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="preserve-spacing" className="text-sm">
                    Preserve spacing
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="reverse-words-only"
                    checked={options.reverseWordsOnly}
                    onChange={(e) => setOptions(prev => ({ ...prev, reverseWordsOnly: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                    disabled={options.mode !== 'character'}
                  />
                  <Label htmlFor="reverse-words-only" className="text-sm">
                    Reverse words only (character mode)
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
            placeholder="Enter text to reverse..."
            className="min-h-[200px]"
          />
          {inputStats && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Chars: {inputStats.characters}</Badge>
              <Badge variant="outline">Words: {inputStats.words}</Badge>
              <Badge variant="outline">Lines: {inputStats.lines}</Badge>
              <Badge variant="outline">Sentences: {inputStats.sentences}</Badge>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={reverseText} disabled={!inputText.trim()} className="flex-1">
            <ReverseIcon className="w-4 h-4 mr-2" />
            Reverse Text
          </Button>
          <Button variant="outline" onClick={resetAll}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      {/* Reversed Text */}
      {reversedText && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reversed-text">Reversed Text</Label>
            <Textarea
              id="reversed-text"
              value={reversedText}
              readOnly
              className="min-h-[200px] bg-muted/50 font-mono"
            />
            {reversedStats && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Chars: {reversedStats.characters}</Badge>
                <Badge variant="secondary">Words: {reversedStats.words}</Badge>
                <Badge variant="secondary">Lines: {reversedStats.lines}</Badge>
                <Badge variant="secondary">Sentences: {reversedStats.sentences}</Badge>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => copyToClipboard(reversedText)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Reversed Text
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

      {/* Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Character Mode</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Hello World →</span>
                  <span className="text-muted-foreground">dlroW olleH</span>
                </div>
                <div className="flex justify-between">
                  <span>12345 →</span>
                  <span className="text-muted-foreground">54321</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Word Mode</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Hello World →</span>
                  <span className="text-muted-foreground">World Hello</span>
                </div>
                <div className="flex justify-between">
                  <span>One Two Three →</span>
                  <span className="text-muted-foreground">Three Two One</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Line Mode</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Line 1<br/>Line 2<br/>Line 3 →</span>
                  <span className="text-muted-foreground">Line 3<br/>Line 2<br/>Line 1</span>
                </div>
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
            <li>• <strong>Character mode:</strong> Reverses each character individually</li>
            <li>• <strong>Word mode:</strong> Reverses the order of words</li>
            <li>• <strong>Line mode:</strong> Reverses the order of lines</li>
            <li>• <strong>Sentence mode:</strong> Reverses the order of sentences</li>
            <li>• Preserve case option maintains the original capitalization pattern</li>
            <li>• Preserve spacing maintains original whitespace formatting</li>
            <li>• Use for creating mirror text, palindromes, or creative writing</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
