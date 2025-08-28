import { useState, useMemo } from "react";
import { Shuffle, Copy, RotateCcw, RefreshCw, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-components";
import { useToast } from "@/hooks/use-toast";

interface RandomGenerator {
  id: string;
  name: string;
  description: string;
  generate: () => string | number;
}

const generators: RandomGenerator[] = [
  {
    id: 'numbers',
    name: 'Random Numbers',
    description: 'Generate random integers within a range',
    generate: () => Math.floor(Math.random() * 100) + 1
  },
  {
    id: 'passwords',
    name: 'Random Passwords',
    description: 'Generate secure random passwords',
    generate: () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    }
  },
  {
    id: 'names',
    name: 'Random Names',
    description: 'Generate random first and last names',
    generate: () => {
      const firstNames = ['Ahmed', 'Fatima', 'Mohammed', 'Aisha', 'Ali', 'Zainab', 'Hassan', 'Mariam', 'Omar', 'Layla'];
      const lastNames = ['Al-Rashid', 'Al-Zahra', 'Al-Mahmoud', 'Al-Saadi', 'Al-Hassan', 'Al-Amin', 'Al-Khalil', 'Al-Rahman', 'Al-Sabah', 'Al-Nasser'];
      return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }
  },
  {
    id: 'colors',
    name: 'Random Colors',
    description: 'Generate random hex color codes',
    generate: () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  },
  {
    id: 'dice',
    name: 'Dice Roller',
    description: 'Roll virtual dice with custom sides',
    generate: () => Math.floor(Math.random() * 6) + 1
  },
  {
    id: 'coin',
    name: 'Coin Flip',
    description: 'Flip a virtual coin',
    generate: () => Math.random() < 0.5 ? 'Heads' : 'Tails'
  },
  {
    id: 'cards',
    name: 'Random Cards',
    description: 'Draw random playing cards',
    generate: () => {
      const suits = ['♠', '♥', '♦', '♣'];
      const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const value = values[Math.floor(Math.random() * values.length)];
      return `${value}${suit}`;
    }
  },
  {
    id: 'words',
    name: 'Random Words',
    description: 'Generate random English words',
    generate: () => {
      const words = ['apple', 'beautiful', 'courage', 'diamond', 'elephant', 'freedom', 'garden', 'happiness', 'imagination', 'journey', 'kindness', 'laughter', 'mountain', 'nature', 'ocean', 'peace', 'queen', 'rainbow', 'sunshine', 'treasure'];
      return words[Math.floor(Math.random() * words.length)];
    }
  }
];

export const RandomGenerator = () => {
  const [selectedGenerator, setSelectedGenerator] = useState<string>('numbers');
  const [minValue, setMinValue] = useState<string>('1');
  const [maxValue, setMaxValue] = useState<string>('100');
  const [count, setCount] = useState<string>('1');
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  const selectedGen = useMemo(() => 
    generators.find(gen => gen.id === selectedGenerator), 
    [selectedGenerator]
  );

  const generateRandom = () => {
    const numCount = parseInt(count) || 1;
    const newResults: string[] = [];
    
    for (let i = 0; i < numCount; i++) {
      if (selectedGenerator === 'numbers') {
        const min = parseInt(minValue) || 1;
        const max = parseInt(maxValue) || 100;
        const result = Math.floor(Math.random() * (max - min + 1)) + min;
        newResults.push(result.toString());
      } else if (selectedGenerator === 'dice') {
        const sides = parseInt(maxValue) || 6;
        const result = Math.floor(Math.random() * sides) + 1;
        newResults.push(result.toString());
      } else {
        newResults.push(selectedGen?.generate().toString() || '');
      }
    }
    
    setResults(newResults);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Result copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy result",
        variant: "destructive",
      });
    }
  };

  const resetAll = () => {
    setMinValue('1');
    setMaxValue('100');
    setCount('1');
    setResults([]);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Generator Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="w-5 h-5" />
            Random Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Generator Type</Label>
              <Select value={selectedGenerator} onValueChange={setSelectedGenerator}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {generators.map((gen) => (
                    <SelectItem key={gen.id} value={gen.id}>
                      {gen.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Count</Label>
              <Input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="Number of results"
                min="1"
                max="100"
              />
            </div>
            
            {(selectedGenerator === 'numbers' || selectedGenerator === 'dice') && (
              <>
                <div className="space-y-2">
                  <Label>{selectedGenerator === 'dice' ? 'Number of Sides' : 'Minimum Value'}</Label>
                  <Input
                    type="number"
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                    placeholder={selectedGenerator === 'dice' ? '6' : '1'}
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{selectedGenerator === 'dice' ? 'Dice Type' : 'Maximum Value'}</Label>
                  <Input
                    type="number"
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                    placeholder={selectedGenerator === 'dice' ? '6' : '100'}
                    min="1"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={generateRandom} className="flex-1">
              <Shuffle className="w-4 h-4 mr-2" />
              Generate
            </Button>
            <Button variant="outline" onClick={resetAll}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generator Description */}
      <Card>
        <CardHeader>
          <CardTitle>About {selectedGen?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {selectedGen?.description}
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Results ({results.length})
              <Button variant="outline" size="sm" onClick={clearResults}>
                Clear
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => copyToClipboard(result)}
                    title="Click to copy"
                  >
                    <div className="text-lg font-bold text-primary mb-1">
                      {result}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Result {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(results.join(', '))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Generators */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Generators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {generators.map((gen) => (
              <Button
                key={gen.id}
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => {
                  setSelectedGenerator(gen.id);
                  setCount('1');
                  setResults([gen.generate().toString()]);
                }}
              >
                <div className="text-lg">{gen.name}</div>
                <div className="text-xs text-muted-foreground">
                  {gen.description}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle>About Random Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-2">True Randomness</div>
              <div className="text-sm text-muted-foreground">
                This tool uses JavaScript's Math.random() function, which generates pseudo-random numbers. 
                For cryptographic purposes, consider using crypto.getRandomValues() instead.
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-2">Use Cases</div>
              <div className="text-sm text-muted-foreground">
                Random generators are useful for games, testing, sampling, decision making, 
                and creative inspiration. They can help break creative blocks and add variety to projects.
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-2">Customization</div>
              <div className="text-sm text-muted-foreground">
                Most generators allow you to customize parameters like range, count, and format. 
                Use the options above to tailor the output to your specific needs.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Random Generation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use multiple results for better randomization</li>
            <li>• Customize ranges to fit your specific needs</li>
            <li>• Save interesting results for future reference</li>
            <li>• Combine different generators for variety</li>
            <li>• Use for brainstorming and creative exercises</li>
            <li>• Consider seed-based generation for reproducible results</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
