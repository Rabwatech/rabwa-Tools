import { useState, useMemo } from "react";
import { Search, Settings, Moon, Sun, Wrench, Calculator, Palette, FileText, Clock, Globe, Star } from "lucide-react";
import { WordCounter } from "@/components/tools/WordCounter";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";
import { ColorPicker } from "@/components/tools/ColorPicker";
import { TextCaseConverter } from "@/components/tools/TextCaseConverter";
import { CurrencyConverter } from "@/components/tools/CurrencyConverter";
import { BMICalculator } from "@/components/tools/BMICalculator";
import { QRCodeGenerator } from "@/components/tools/QRCodeGenerator";
import { PomodoroTimer } from "@/components/tools/PomodoroTimer";

// Tool definitions with categories
const tools = [
  // Text & Writing Tools
  { id: 'word-counter', name: 'Word & Character Counter', category: 'Text & Writing', icon: FileText, component: WordCounter, description: 'Count words, characters, and paragraphs in real-time' },
  { id: 'text-case', name: 'Text Case Converter', category: 'Text & Writing', icon: FileText, component: TextCaseConverter, description: 'Convert text to UPPER, lower, Title Case, camelCase' },
  { id: 'password-gen', name: 'Password Generator', category: 'Text & Writing', icon: Settings, component: PasswordGenerator, description: 'Generate secure passwords with custom options' },

  // Conversion Tools  
  { id: 'currency', name: 'Currency Converter', category: 'Conversion', icon: Globe, component: CurrencyConverter, description: 'Convert between SAR, USD, EUR and other currencies' },

  // Color & Design Tools
  { id: 'color-picker', name: 'Color Picker', category: 'Color & Design', icon: Palette, component: ColorPicker, description: 'Pick colors and get HEX, RGB, HSL values' },

  // Calculator Tools
  { id: 'bmi-calc', name: 'BMI Calculator', category: 'Calculator', icon: Calculator, component: BMICalculator, description: 'Calculate Body Mass Index with health categories' },

  // File Tools
  { id: 'qr-gen', name: 'QR Code Generator', category: 'File', icon: Settings, component: QRCodeGenerator, description: 'Generate QR codes from text or URLs' },

  // Productivity Tools
  { id: 'pomodoro', name: 'Pomodoro Timer', category: 'Productivity', icon: Clock, component: PomodoroTimer, description: '25-minute focus sessions with breaks' },
];

const categories = [
  { name: 'Text & Writing', icon: FileText, color: 'text-primary' },
  { name: 'Conversion', icon: Globe, color: 'text-secondary' },
  { name: 'Color & Design', icon: Palette, color: 'text-accent' },
  { name: 'Calculator', icon: Calculator, color: 'text-highlight' },
  { name: 'File', icon: Settings, color: 'text-primary' },
  { name: 'Productivity', icon: Clock, color: 'text-secondary' },
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('rabwa-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('rabwa-theme');
    return saved === 'dark';
  });

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleFavorite = (toolId: string) => {
    const newFavorites = favorites.includes(toolId) 
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];
    setFavorites(newFavorites);
    localStorage.setItem('rabwa-favorites', JSON.stringify(newFavorites));
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('rabwa-theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  const selectedToolData = selectedTool ? tools.find(t => t.id === selectedTool) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">RabwaTools</h1>
                <p className="text-xs text-muted-foreground">Simple Tools for Everyday Problems</p>
              </div>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'All' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              All Tools
            </button>
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category.name 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {selectedTool && selectedToolData ? (
          /* Tool View */
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSelectedTool(null)}
                className="btn-secondary"
              >
                ← Back to Tools
              </button>
              <div className="flex items-center gap-3">
                <selectedToolData.icon className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedToolData.name}</h2>
                  <p className="text-muted-foreground">{selectedToolData.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(selectedTool)}
                className={`p-2 rounded-lg transition-colors ${
                  favorites.includes(selectedTool) 
                    ? 'text-highlight hover:text-highlight/80' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label="Toggle favorite"
              >
                <Star className={`w-5 h-5 ${favorites.includes(selectedTool) ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <div className="bg-card rounded-xl border border-border p-6">
              <selectedToolData.component />
            </div>
          </div>
        ) : (
          /* Tools Grid */
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Choose Your Tool
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A comprehensive collection of simple, powerful tools to solve your everyday problems. 
                All tools work offline and your data never leaves your browser.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map(tool => (
                <div
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className="tool-card group relative"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <tool.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                        {tool.category}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tool.id);
                      }}
                      className={`p-1 rounded transition-colors ${
                        favorites.includes(tool.id) 
                          ? 'text-highlight hover:text-highlight/80' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${favorites.includes(tool.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No tools found</h3>
                <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-lg primary-gradient flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-foreground">RabwaTools</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Made with ❤️ for simplifying daily tasks
            </p>
            <p className="text-xs text-muted-foreground">
              All tools work offline. Your data never leaves your browser.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;