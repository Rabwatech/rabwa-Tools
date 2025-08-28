import { useState } from "react";
import { Languages, Copy, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface TransliterationMap {
  [key: string]: string;
}

const arabicToEnglish: TransliterationMap = {
  // Basic Arabic letters
  'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
  'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's',
  'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
  'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y',
  
  // Arabic numbers
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  
  // Vowel marks (harakat)
  'َ': 'a', 'ُ': 'u', 'ِ': 'i', 'ّ': '', 'ْ': '', 'ً': 'an', 'ٌ': 'un', 'ٍ': 'in',
  
  // Common combinations
  'الله': 'Allah', 'محمد': 'Muhammad', 'علي': 'Ali', 'فاطمة': 'Fatima',
  
  // Extended characters
  'ة': 'a', 'ى': 'a', 'ئ': 'i', 'ؤ': 'u', 'إ': 'i', 'أ': 'a', 'آ': 'aa'
};

const englishToArabic: TransliterationMap = {
  // Basic English letters
  'a': 'ا', 'b': 'ب', 'c': 'س', 'd': 'د', 'e': 'ي', 'f': 'ف', 'g': 'ج',
  'h': 'ه', 'i': 'ي', 'j': 'ج', 'k': 'ك', 'l': 'ل', 'm': 'م', 'n': 'ن',
  'o': 'و', 'p': 'ب', 'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت', 'u': 'و',
  'v': 'ف', 'w': 'و', 'x': 'كس', 'y': 'ي', 'z': 'ز',
  
  // Common English words to Arabic
  'hello': 'مرحبا', 'goodbye': 'مع السلامة', 'thank you': 'شكرا لك',
  'please': 'من فضلك', 'yes': 'نعم', 'no': 'لا', 'water': 'ماء',
  'food': 'طعام', 'house': 'بيت', 'car': 'سيارة', 'book': 'كتاب',
  'friend': 'صديق', 'family': 'عائلة', 'work': 'عمل', 'time': 'وقت'
};

export const ArabicTransliterator = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [direction, setDirection] = useState<'arabic-to-english' | 'english-to-arabic'>('arabic-to-english');
  const [showVowelMarks, setShowVowelMarks] = useState(true);
  const [preserveNumbers, setPreserveNumbers] = useState(true);
  const { toast } = useToast();

  const transliterate = () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to transliterate",
        description: "Please enter some text first",
        variant: "destructive",
      });
      return;
    }

    let result = '';
    
    if (direction === 'arabic-to-english') {
      result = transliterateArabicToEnglish(inputText);
    } else {
      result = transliterateEnglishToArabic(inputText);
    }
    
    setOutputText(result);
  };

  const transliterateArabicToEnglish = (text: string): string => {
    let result = text;
    
    // Handle special combinations first
    result = result.replace(/الله/g, 'Allah');
    result = result.replace(/محمد/g, 'Muhammad');
    result = result.replace(/علي/g, 'Ali');
    result = result.replace(/فاطمة/g, 'Fatima');
    
    // Convert individual characters
    for (const [arabic, english] of Object.entries(arabicToEnglish)) {
      if (arabic !== 'الله' && arabic !== 'محمد' && arabic !== 'علي' && arabic !== 'فاطمة') {
        result = result.replace(new RegExp(arabic, 'g'), english);
      }
    }
    
    // Handle vowel marks
    if (!showVowelMarks) {
      result = result.replace(/[ًٌٍَُِّْ]/g, '');
    }
    
    // Handle numbers
    if (!preserveNumbers) {
      result = result.replace(/[0-9]/g, '');
    }
    
    // Clean up multiple vowels
    result = result.replace(/([aeiou])\1+/g, '$1');
    
    return result;
  };

  const transliterateEnglishToArabic = (text: string): string => {
    let result = text.toLowerCase();
    
    // Handle common words first
    for (const [english, arabic] of Object.entries(englishToArabic)) {
      if (english.length > 1) {
        result = result.replace(new RegExp(`\\b${english}\\b`, 'g'), arabic);
      }
    }
    
    // Convert individual letters
    for (const [english, arabic] of Object.entries(englishToArabic)) {
      if (english.length === 1) {
        result = result.replace(new RegExp(english, 'g'), arabic);
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

  const resetAll = () => {
    setInputText('');
    setOutputText('');
  };

  const swapDirection = () => {
    setDirection(prev => prev === 'arabic-to-english' ? 'english-to-arabic' : 'arabic-to-english');
    setInputText(outputText);
    setOutputText('');
  };

  const getStats = (text: string) => {
    if (!text) return null;
    
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    const numbers = (text.match(/[0-9٠-٩]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const specialChars = (text.match(/[^\w\s\u0600-\u06FF]/g) || []).length;
    
    return { arabicChars, englishChars, numbers, spaces, specialChars };
  };

  const inputStats = getStats(inputText);
  const outputStats = getStats(outputText);

  return (
    <div className="space-y-6">
      {/* Direction Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Transliteration Direction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="arabic-to-english"
                name="direction"
                checked={direction === 'arabic-to-english'}
                onChange={() => setDirection('arabic-to-english')}
                className="w-4 h-4 text-primary"
              />
              <Label htmlFor="arabic-to-english" className="text-sm font-medium">
                Arabic → English
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="english-to-arabic"
                name="direction"
                checked={direction === 'english-to-arabic'}
                onChange={() => setDirection('english-to-arabic')}
                className="w-4 h-4 text-primary"
              />
              <Label htmlFor="english-to-arabic" className="text-sm font-medium">
                English → Arabic
              </Label>
            </div>
          </div>
          
          {/* Options */}
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-vowels"
                checked={showVowelMarks}
                onChange={(e) => setShowVowelMarks(e.target.checked)}
                className="w-4 h-4 text-primary"
              />
              <Label htmlFor="show-vowels" className="text-sm">
                Show vowel marks (harakat)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="preserve-numbers"
                checked={preserveNumbers}
                onChange={(e) => setPreserveNumbers(e.target.checked)}
                className="w-4 h-4 text-primary"
              />
              <Label htmlFor="preserve-numbers" className="text-sm">
                Preserve numbers
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Text */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="input-text">
            {direction === 'arabic-to-english' ? 'Arabic Text' : 'English Text'}
          </Label>
          <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={direction === 'arabic-to-english' 
              ? 'اكتب النص العربي هنا...' 
              : 'Type English text here...'
            }
            className="min-h-[200px] text-right"
            dir={direction === 'arabic-to-english' ? 'rtl' : 'ltr'}
          />
          {inputStats && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {direction === 'arabic-to-english' ? 'Arabic' : 'English'}: {direction === 'arabic-to-english' ? inputStats.arabicChars : inputStats.englishChars}
              </Badge>
              <Badge variant="outline">Numbers: {inputStats.numbers}</Badge>
              <Badge variant="outline">Spaces: {inputStats.spaces}</Badge>
              <Badge variant="outline">Special: {inputStats.specialChars}</Badge>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={transliterate} disabled={!inputText.trim()}>
            <ArrowRight className="w-4 h-4 mr-2" />
            Transliterate
          </Button>
          <Button variant="outline" onClick={swapDirection} disabled={!inputText && !outputText}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Swap Direction
          </Button>
          <Button variant="outline" onClick={resetAll}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      {/* Output Text */}
      {outputText && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="output-text">
              {direction === 'arabic-to-english' ? 'English Text' : 'Arabic Text'}
            </Label>
            <Textarea
              id="output-text"
              value={outputText}
              readOnly
              className="min-h-[200px] bg-muted/50"
              dir={direction === 'arabic-to-english' ? 'ltr' : 'rtl'}
            />
            {outputStats && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {direction === 'arabic-to-english' ? 'English' : 'Arabic'}: {direction === 'arabic-to-english' ? outputStats.englishChars : outputStats.arabicChars}
                </Badge>
                <Badge variant="secondary">Numbers: {outputStats.numbers}</Badge>
                <Badge variant="secondary">Spaces: {outputStats.spaces}</Badge>
                <Badge variant="secondary">Special: {outputStats.specialChars}</Badge>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => copyToClipboard(outputText)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy {direction === 'arabic-to-english' ? 'English' : 'Arabic'} Text
            </Button>
            <Button variant="outline" onClick={() => copyToClipboard(inputText)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy {direction === 'arabic-to-english' ? 'Arabic' : 'English'} Text
            </Button>
          </div>
        </div>
      )}

      {/* Common Phrases */}
      <Card>
        <CardHeader>
          <CardTitle>Common Arabic Phrases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Greetings</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>مرحبا</span>
                  <span className="text-muted-foreground">Marhaba (Hello)</span>
                </div>
                <div className="flex justify-between">
                  <span>أهلا وسهلا</span>
                  <span className="text-muted-foreground">Ahlan wa Sahlan (Welcome)</span>
                </div>
                <div className="flex justify-between">
                  <span>صباح الخير</span>
                  <span className="text-muted-foreground">Sabah al-Khair (Good Morning)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Common Words</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>شكرا</span>
                  <span className="text-muted-foreground">Shukran (Thank You)</span>
                </div>
                <div className="flex justify-between">
                  <span>من فضلك</span>
                  <span className="text-muted-foreground">Min Fadlik (Please)</span>
                </div>
                <div className="flex justify-between">
                  <span>مع السلامة</span>
                  <span className="text-muted-foreground">Ma'a as-Salamah (Goodbye)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Transliteration Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Arabic transliteration is phonetic - it represents how words sound</li>
            <li>• Some Arabic sounds don't have exact English equivalents</li>
            <li>• Vowel marks (harakat) help with pronunciation</li>
            <li>• Arabic is read from right to left (RTL)</li>
            <li>• Numbers in Arabic are written from left to right</li>
            <li>• This tool provides approximate transliterations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
