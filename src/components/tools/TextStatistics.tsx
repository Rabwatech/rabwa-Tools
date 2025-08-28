import { useState, useMemo } from "react";
import { BarChart3, Copy, RotateCcw, Download, TrendingUp, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  syllables: number;
  readingTime: number;
  speakingTime: number;
  wordFrequency: Map<string, number>;
  longestWords: string[];
  shortestWords: string[];
  averageWordLength: number;
  averageSentenceLength: number;
  averageParagraphLength: number;
  uniqueWords: number;
  vocabularyDiversity: number;
}

export const TextStatistics = () => {
  const [inputText, setInputText] = useState('');
  const { toast } = useToast();

  const stats = useMemo(() => {
    if (!inputText.trim()) return null;
    return calculateTextStats(inputText);
  }, [inputText]);

  const calculateTextStats = (text: string): TextStats => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const lines = text.split('\n').length;
    
    // Calculate syllables (approximate)
    const syllables = countSyllables(text);
    
    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);
    
    // Calculate speaking time (average 150 words per minute)
    const speakingTime = Math.ceil(words / 150);
    
    // Word frequency analysis
    const wordFrequency = new Map<string, number>();
    const wordsList = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
    
    wordsList.forEach(word => {
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    });
    
    // Sort words by frequency
    const sortedWords = Array.from(wordFrequency.entries())
      .sort((a, b) => b[1] - a[1]);
    
    const longestWords = sortedWords
      .sort((a, b) => b[0].length - a[0].length)
      .slice(0, 10)
      .map(([word]) => word);
    
    const shortestWords = sortedWords
      .sort((a, b) => a[0].length - b[0].length)
      .slice(0, 10)
      .map(([word]) => word);
    
    const averageWordLength = words > 0 
      ? wordsList.reduce((sum, word) => sum + word.length, 0) / words 
      : 0;
    
    const averageSentenceLength = sentences > 0 ? words / sentences : 0;
    const averageParagraphLength = paragraphs > 0 ? sentences / paragraphs : 0;
    const uniqueWords = wordFrequency.size;
    const vocabularyDiversity = words > 0 ? (uniqueWords / words) * 100 : 0;
    
    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      syllables,
      readingTime,
      speakingTime,
      wordFrequency,
      longestWords,
      shortestWords,
      averageWordLength,
      averageSentenceLength,
      averageParagraphLength,
      uniqueWords,
      vocabularyDiversity
    };
  };

  const countSyllables = (text: string): number => {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
    
    let totalSyllables = 0;
    
    words.forEach(word => {
      totalSyllables += countWordSyllables(word);
    });
    
    return totalSyllables;
  };

  const countWordSyllables = (word: string): number => {
    if (word.length <= 3) return 1;
    
    word = word.toLowerCase();
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? Math.max(1, matches.length) : 1;
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

  const downloadStats = () => {
    if (!stats) return;
    
    let content = 'Text Statistics Report\n';
    content += '='.repeat(50) + '\n\n';
    
    content += `Basic Statistics:\n`;
    content += `Characters: ${stats.characters}\n`;
    content += `Characters (no spaces): ${stats.charactersNoSpaces}\n`;
    content += `Words: ${stats.words}\n`;
    content += `Sentences: ${stats.sentences}\n`;
    content += `Paragraphs: ${stats.paragraphs}\n`;
    content += `Lines: ${stats.lines}\n`;
    content += `Syllables: ${stats.syllables}\n\n`;
    
    content += `Time Estimates:\n`;
    content += `Reading time: ${stats.readingTime} minute(s)\n`;
    content += `Speaking time: ${stats.speakingTime} minute(s)\n\n`;
    
    content += `Averages:\n`;
    content += `Average word length: ${stats.averageWordLength.toFixed(2)} characters\n`;
    content += `Average sentence length: ${stats.averageSentenceLength.toFixed(2)} words\n`;
    content += `Average paragraph length: ${stats.averageParagraphLength.toFixed(2)} sentences\n\n`;
    
    content += `Vocabulary:\n`;
    content += `Unique words: ${stats.uniqueWords}\n`;
    content += `Vocabulary diversity: ${stats.vocabularyDiversity.toFixed(2)}%\n\n`;
    
    content += `Most Common Words:\n`;
    const sortedWords = Array.from(stats.wordFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    
    sortedWords.forEach(([word, count]) => {
      content += `${word}: ${count}\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `text-statistics-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Statistics report saved to file",
    });
  };

  const resetAll = () => {
    setInputText('');
  };

  return (
    <div className="space-y-6">
      {/* Input Text */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="input-text">Text to Analyze</Label>
          <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter or paste text to analyze..."
            className="min-h-[300px]"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={resetAll}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear Text
          </Button>
          {stats && (
            <Button variant="outline" onClick={downloadStats}>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Display */}
      {stats && (
        <div className="space-y-6">
          {/* Basic Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Basic Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.characters}</div>
                  <div className="text-sm text-muted-foreground">Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{stats.words}</div>
                  <div className="text-sm text-muted-foreground">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{stats.sentences}</div>
                  <div className="text-sm text-muted-foreground">Sentences</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-highlight">{stats.paragraphs}</div>
                  <div className="text-sm text-muted-foreground">Paragraphs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Estimates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Time Estimates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.readingTime}</div>
                  <div className="text-sm text-muted-foreground">Minutes to Read</div>
                  <div className="text-xs text-muted-foreground mt-1">(200 words/minute)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">{stats.speakingTime}</div>
                  <div className="text-sm text-muted-foreground">Minutes to Speak</div>
                  <div className="text-xs text-muted-foreground mt-1">(150 words/minute)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Averages and Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Averages & Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stats.averageWordLength.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Word Length</div>
                  <div className="text-xs text-muted-foreground">characters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {stats.averageSentenceLength.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Sentence Length</div>
                  <div className="text-xs text-muted-foreground">words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {stats.averageParagraphLength.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Paragraph Length</div>
                  <div className="text-xs text-muted-foreground">sentences</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-highlight">{stats.uniqueWords}</div>
                  <div className="text-sm text-muted-foreground">Unique Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stats.vocabularyDiversity.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Vocabulary Diversity</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Word Frequency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Most Common Words
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(stats.wordFrequency.entries())
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 20)
                  .map(([word, count], index) => (
                    <div key={word} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 text-center">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{word}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{count}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(word)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Word Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Longest Words */}
            <Card>
              <CardHeader>
                <CardTitle>Longest Words</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.longestWords.slice(0, 10).map((word, index) => (
                    <div key={word} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="font-medium">{word}</span>
                      <Badge variant="outline">{word.length} chars</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shortest Words */}
            <Card>
              <CardHeader>
                <CardTitle>Shortest Words</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.shortestWords.slice(0, 10).map((word, index) => (
                    <div key={word} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="font-medium">{word}</span>
                      <Badge variant="outline">{word.length} chars</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle>About Text Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              This tool provides comprehensive text analysis including character counts, word frequency, 
              reading time estimates, and vocabulary diversity metrics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Metrics Explained:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Vocabulary Diversity:</strong> Percentage of unique words</li>
                  <li>• <strong>Reading Time:</strong> Based on 200 words/minute</li>
                  <li>• <strong>Speaking Time:</strong> Based on 150 words/minute</li>
                  <li>• <strong>Syllables:</strong> Approximate count using rules</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Use Cases:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Content analysis</li>
                  <li>• Writing improvement</li>
                  <li>• SEO optimization</li>
                  <li>• Academic writing</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
