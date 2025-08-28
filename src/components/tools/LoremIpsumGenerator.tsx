import { useState } from "react";
import { FileText, Copy, RotateCcw, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface GeneratorOptions {
  type: 'paragraphs' | 'words' | 'characters';
  count: number;
  startWithLorem: boolean;
  includeHTML: boolean;
  includePunctuation: boolean;
  sentenceLength: 'short' | 'medium' | 'long';
}

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est',
  'laborum', 'sed', 'ut', 'perspiciatis', 'unde', 'omnis', 'iste', 'natus',
  'error', 'sit', 'voluptatem', 'accusantium', 'doloremque', 'laudantium',
  'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore',
  'veritatis', 'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt',
  'explicabo', 'nemo', 'enim', 'ipsam', 'voluptatem', 'quia', 'voluptas',
  'sit', 'aspernatur', 'aut', 'odit', 'aut', 'fugit', 'sed', 'quia',
  'consequuntur', 'magni', 'dolores', 'eos', 'qui', 'ratione', 'voluptatem',
  'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'est', 'qui', 'dolorem',
  'ipsum', 'quia', 'dolor', 'sit', 'amet', 'consectetur', 'adipisci', 'velit',
  'sed', 'quia', 'non', 'numquam', 'eius', 'modi', 'tempora', 'incidunt',
  'ut', 'labore', 'et', 'dolore', 'magnam', 'aliquam', 'quaerat', 'voluptatem'
];

const punctuationMarks = [',', ';', ':', '.', '!', '?'];

export const LoremIpsumGenerator = () => {
  const [options, setOptions] = useState<GeneratorOptions>({
    type: 'paragraphs',
    count: 3,
    startWithLorem: true,
    includeHTML: false,
    includePunctuation: true,
    sentenceLength: 'medium'
  });
  const [generatedText, setGeneratedText] = useState('');
  const { toast } = useToast();

  const generateSentence = (): string => {
    const sentenceLengths = {
      short: { min: 5, max: 8 },
      medium: { min: 8, max: 15 },
      long: { min: 15, max: 25 }
    };

    const length = sentenceLengths[options.sentenceLength];
    const wordCount = Math.floor(Math.random() * (length.max - length.min + 1)) + length.min;
    
    let sentence = '';
    for (let i = 0; i < wordCount; i++) {
      const word = loremWords[Math.floor(Math.random() * loremWords.length)];
      if (i === 0) {
        sentence += word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        sentence += ' ' + word;
      }
    }

    if (options.includePunctuation) {
      const mark = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
      sentence += mark;
    } else {
      sentence += '.';
    }

    return sentence;
  };

  const generateParagraph = (): string => {
    const sentenceCount = Math.floor(Math.random() * 3) + 2; // 2-4 sentences
    let paragraph = '';
    
    for (let i = 0; i < sentenceCount; i++) {
      paragraph += generateSentence() + ' ';
    }
    
    return paragraph.trim();
  };

  const generateText = () => {
    let result = '';
    
    if (options.type === 'paragraphs') {
      for (let i = 0; i < options.count; i++) {
        if (i === 0 && options.startWithLorem) {
          result += 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ';
        }
        result += generateParagraph();
        if (i < options.count - 1) {
          result += '\n\n';
        }
      }
    } else if (options.type === 'words') {
      let wordCount = 0;
      let currentParagraph = '';
      
      while (wordCount < options.count) {
        const sentence = generateSentence();
        const sentenceWords = sentence.split(' ').length;
        
        if (wordCount + sentenceWords > options.count) {
          // Add partial sentence to reach exact word count
          const remainingWords = options.count - wordCount;
          const partialSentence = sentence.split(' ').slice(0, remainingWords).join(' ');
          currentParagraph += partialSentence + '.';
          break;
        }
        
        currentParagraph += sentence + ' ';
        wordCount += sentenceWords;
        
        // Start new paragraph every ~50 words
        if (wordCount % 50 === 0 && wordCount < options.count) {
          result += currentParagraph.trim() + '\n\n';
          currentParagraph = '';
        }
      }
      
      if (currentParagraph.trim()) {
        result += currentParagraph.trim();
      }
    } else if (options.type === 'characters') {
      let charCount = 0;
      let currentParagraph = '';
      
      while (charCount < options.count) {
        const sentence = generateSentence();
        
        if (charCount + sentence.length > options.count) {
          // Add partial sentence to reach exact character count
          const remainingChars = options.count - charCount;
          const partialSentence = sentence.substring(0, remainingChars);
          currentParagraph += partialSentence;
          break;
        }
        
        currentParagraph += sentence + ' ';
        charCount += sentence.length + 1; // +1 for space
        
        // Start new paragraph every ~100 characters
        if (charCount % 100 === 0 && charCount < options.count) {
          result += currentParagraph.trim() + '\n\n';
          currentParagraph = '';
        }
      }
      
      if (currentParagraph.trim()) {
        result += currentParagraph.trim();
      }
    }

    // Add HTML tags if requested
    if (options.includeHTML) {
      result = result.split('\n\n').map(paragraph => 
        `<p>${paragraph}</p>`
      ).join('\n');
    }

    setGeneratedText(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      toast({
        title: "Copied!",
        description: "Lorem ipsum text copied to clipboard",
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
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lorem-ipsum-${options.type}-${options.count}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Lorem ipsum text saved to file",
    });
  };

  const resetAll = () => {
    setOptions({
      type: 'paragraphs',
      count: 3,
      startWithLorem: true,
      includeHTML: false,
      includePunctuation: true,
      sentenceLength: 'medium'
    });
    setGeneratedText('');
  };

  const getStats = (text: string) => {
    if (!text) return null;
    
    const paragraphs = text.split('\n\n').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const words = text.split(/\s+/).filter(w => w.trim()).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    return { paragraphs, sentences, words, characters, charactersNoSpaces };
  };

  const stats = getStats(generatedText);

  return (
    <div className="space-y-6">
      {/* Generator Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Generator Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Output Type</Label>
            <div className="flex gap-4">
              {(['paragraphs', 'words', 'characters'] as const).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={type}
                    name="type"
                    checked={options.type === type}
                    onChange={() => setOptions(prev => ({ ...prev, type }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor={type} className="text-sm capitalize">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Count Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Number of {options.type.charAt(0).toUpperCase() + options.type.slice(1)}
              </Label>
              <Badge variant="outline">{options.count}</Badge>
            </div>
            <Slider
              value={[options.count]}
              onValueChange={(value) => setOptions(prev => ({ ...prev, count: value[0] }))}
              max={options.type === 'paragraphs' ? 20 : options.type === 'words' ? 1000 : 5000}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sentence Length</Label>
              <div className="flex gap-4">
                {(['short', 'medium', 'long'] as const).map((length) => (
                  <div key={length} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={length}
                      name="length"
                      checked={options.sentenceLength === length}
                      onChange={() => setOptions(prev => ({ ...prev, sentenceLength: length }))}
                      className="w-4 h-4 text-primary"
                    />
                    <Label htmlFor={length} className="text-sm capitalize">
                      {length}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Options</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="start-with-lorem"
                    checked={options.startWithLorem}
                    onChange={(e) => setOptions(prev => ({ ...prev, startWithLorem: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="start-with-lorem" className="text-sm">
                    Start with "Lorem ipsum"
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="include-html"
                    checked={options.includeHTML}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeHTML: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="include-html" className="text-sm">
                    Include HTML tags
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="include-punctuation"
                    checked={options.includePunctuation}
                    onChange={(e) => setOptions(prev => ({ ...prev, includePunctuation: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <Label htmlFor="include-punctuation" className="text-sm">
                    Include punctuation
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex gap-2">
        <Button onClick={generateText} className="flex-1">
          <FileText className="w-4 h-4 mr-2" />
          Generate Lorem Ipsum
        </Button>
        <Button variant="outline" onClick={resetAll}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Generated Text */}
      {generatedText && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="generated-text">Generated Text</Label>
              {stats && (
                <div className="flex gap-2">
                  <Badge variant="secondary">P: {stats.paragraphs}</Badge>
                  <Badge variant="secondary">S: {stats.sentences}</Badge>
                  <Badge variant="secondary">W: {stats.words}</Badge>
                  <Badge variant="secondary">C: {stats.characters}</Badge>
                </div>
              )}
            </div>
            <Textarea
              id="generated-text"
              value={generatedText}
              readOnly
              className="min-h-[300px] bg-muted/50 font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Text
            </Button>
            <Button variant="outline" onClick={downloadText}>
              <Download className="w-4 h-4 mr-2" />
              Download as TXT
            </Button>
          </div>
        </div>
      )}

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle>About Lorem Ipsum</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries 
              for previewing layouts and visual mockups. It's derived from a Latin text by Cicero.
            </p>
            <p>
              This generator creates realistic-looking placeholder text that maintains proper sentence structure 
              and paragraph formatting, making it perfect for design mockups and content planning.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Use Cases:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Website design mockups</li>
                  <li>• Print layout testing</li>
                  <li>• Content structure planning</li>
                  <li>• Typography testing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Features:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Customizable output length</li>
                  <li>• HTML tag support</li>
                  <li>• Variable sentence lengths</li>
                  <li>• Realistic text flow</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
