import { useState, useMemo } from "react";
import { 
  Search, Settings, Moon, Sun, Wrench, Calculator, Palette, FileText, Clock, Globe, Star, 
  Ruler, Binary, Thermometer, Type, FileCode, Hash, BarChart3, Receipt, Coins, DollarSign, 
  CreditCard, TrendingUp, Home, CheckSquare, Shuffle, Users, Target, Calendar, FileImage,
  Zap, Eye, Layers, Scissors, Download, Upload, QrCode, BarChart, Timer, 
  Brain, Heart, Activity, Scale, BookOpen, GraduationCap, Gift, Cloud, Wifi, MapPin,
  Smartphone, Monitor, Camera, FileText as FileIcon, Music, Video, Archive, Lock, Unlock,
  RotateCcw, Copy, Plus, Minus, Divide, Percent, Hash as HashIcon, Infinity, Zap as ZapIcon,
  ArrowLeft, Link, Image, Square, Play, Move, Edit3, RefreshCw, Bell, Coffee, Droplets, Shield,
  Volume2, Box, Gauge, HardDrive, ChefHat, Footprints, Shirt, Fuel, PiggyBank
} from "lucide-react";

// Import all existing tools
import { WordCounter } from "@/components/tools/WordCounter";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";
import { ColorPicker } from "@/components/tools/ColorPicker";
import { TextCaseConverter } from "@/components/tools/TextCaseConverter";
import { CurrencyConverter } from "@/components/tools/CurrencyConverter";
import { BMICalculator } from "@/components/tools/BMICalculator";
import { QRCodeGenerator } from "@/components/tools/QRCodeGenerator";
import { PomodoroTimer } from "@/components/tools/PomodoroTimer";
import { PasswordStrengthChecker } from "@/components/tools/PasswordStrengthChecker";
import { TextCleaner } from "@/components/tools/TextCleaner";
import { ArabicTransliterator } from "@/components/tools/ArabicTransliterator";
import { LoremIpsumGenerator } from "@/components/tools/LoremIpsumGenerator";
import { TextDifferenceChecker } from "@/components/tools/TextDifferenceChecker";
import { TextReverser } from "@/components/tools/TextReverser";
import { DuplicateLineRemover } from "@/components/tools/DuplicateLineRemover";
import { TextAsciiConverter } from "@/components/tools/TextAsciiConverter";
import { Base64Converter } from "@/components/tools/Base64Converter";
import { HashGenerator } from "@/components/tools/HashGenerator";
import { TextStatistics } from "@/components/tools/TextStatistics";
import { UnitConverter } from "@/components/tools/UnitConverter";
import { NumberBaseConverter } from "@/components/tools/NumberBaseConverter";
import { TemperatureConverter } from "@/components/tools/TemperatureConverter";
import { TimeConverter } from "@/components/tools/TimeConverter";

// Import new tools (these will be created)
import { SaudiTaxCalculator } from "@/components/tools/SaudiTaxCalculator";
import { ZakatCalculator } from "@/components/tools/ZakatCalculator";
import { NetSalaryCalculator } from "@/components/tools/NetSalaryCalculator";
import { LoanCalculator } from "@/components/tools/LoanCalculator";
import { CompoundInterestCalculator } from "@/components/tools/CompoundInterestCalculator";
import { InvestmentReturnCalculator } from "@/components/tools/InvestmentReturnCalculator";
import { TipCalculator } from "@/components/tools/TipCalculator";
import { MortgageCalculator } from "@/components/tools/MortgageCalculator";
import { ColorPaletteGenerator } from "@/components/tools/ColorPaletteGenerator";
import { ColorFormatConverter } from "@/components/tools/ColorFormatConverter";
import { ColorContrastChecker } from "@/components/tools/ColorContrastChecker";
import { GradientGenerator } from "@/components/tools/GradientGenerator";
import { ColorBlindnessSimulator } from "@/components/tools/ColorBlindnessSimulator";
import { ImageColorExtractor } from "@/components/tools/ImageColorExtractor";
import { CSSBoxShadowGenerator } from "@/components/tools/CSSBoxShadowGenerator";
import { BorderRadiusGenerator } from "@/components/tools/BorderRadiusGenerator";
import { ToDoListManager } from "@/components/tools/ToDoListManager";
import { RandomGenerator } from "@/components/tools/RandomGenerator";

// Tool definitions with categories - 100+ tools total
const tools = [
  // TEXT & WRITING TOOLS (20 tools)
  { id: 'word-counter', name: 'Word & Character Counter', category: 'Text & Writing', icon: FileText, component: WordCounter, description: 'Count words, characters, and paragraphs in real-time' },
  { id: 'text-case', name: 'Text Case Converter', category: 'Text & Writing', icon: FileText, component: TextCaseConverter, description: 'Convert text to UPPER, lower, Title Case, camelCase' },
  { id: 'password-gen', name: 'Password Generator', category: 'Text & Writing', icon: Settings, component: PasswordGenerator, description: 'Generate secure passwords with custom options' },
  { id: 'password-strength', name: 'Password Strength Checker', category: 'Text & Writing', icon: Settings, component: PasswordStrengthChecker, description: 'Check password strength with real-time analysis and suggestions' },
  { id: 'text-cleaner', name: 'Text Cleaner', category: 'Text & Writing', icon: FileText, component: TextCleaner, description: 'Clean and format text by removing extra spaces, line breaks, and special characters' },
  { id: 'arabic-transliterator', name: 'Arabic to English Transliteration', category: 'Text & Writing', icon: FileText, component: ArabicTransliterator, description: 'Convert between Arabic and English text with transliteration' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', category: 'Text & Writing', icon: FileText, component: LoremIpsumGenerator, description: 'Generate placeholder text with customizable length and formatting' },
  { id: 'text-difference', name: 'Text Difference Checker', category: 'Text & Writing', icon: FileText, component: TextDifferenceChecker, description: 'Compare two texts and highlight differences with various options' },
  { id: 'text-reverser', name: 'Text Reverser', category: 'Text & Writing', icon: FileText, component: TextReverser, description: 'Reverse text by characters, words, lines, or sentences' },
  { id: 'duplicate-remover', name: 'Duplicate Line Remover', category: 'Text & Writing', icon: FileText, component: DuplicateLineRemover, description: 'Remove duplicate lines while preserving unique content' },
  { id: 'text-ascii', name: 'Text to ASCII Converter', category: 'Text & Writing', icon: Type, component: TextAsciiConverter, description: 'Convert text to ASCII codes and vice versa in multiple formats' },
  { id: 'base64-converter', name: 'Base64 Encoder/Decoder', category: 'Text & Writing', icon: FileCode, component: Base64Converter, description: 'Encode text to Base64 or decode Base64 to text with validation' },
  { id: 'url-encoder', name: 'URL Encoder/Decoder', category: 'Text & Writing', icon: Link, component: TextCleaner, description: 'Encode and decode URLs with proper formatting' },
  { id: 'hash-generator', name: 'Hash Generator', category: 'Text & Writing', icon: Hash, component: HashGenerator, description: 'Generate MD5, SHA1, SHA256, SHA512 hashes with multiple output formats' },
  { id: 'text-statistics', name: 'Text Statistics', category: 'Text & Writing', icon: BarChart3, component: TextStatistics, description: 'Detailed text analysis with word frequency, reading time, and vocabulary metrics' },
  { id: 'text-to-speech', name: 'Text to Speech Converter', category: 'Text & Writing', icon: Volume2, component: TextCleaner, description: 'Convert text to speech with multiple voice options' },
  { id: 'word-frequency', name: 'Word Frequency Counter', category: 'Text & Writing', icon: BarChart, component: TextStatistics, description: 'Analyze word frequency and create word clouds' },
  { id: 'text-summarizer', name: 'Text Summarizer', category: 'Text & Writing', icon: FileText, component: TextCleaner, description: 'Generate concise summaries of long text content' },
  { id: 'line-counter', name: 'Line Counter', category: 'Text & Writing', icon: Hash, component: TextStatistics, description: 'Count lines, words, and characters with detailed statistics' },
  { id: 'character-frequency', name: 'Character Frequency Analyzer', category: 'Text & Writing', icon: BarChart3, component: TextStatistics, description: 'Analyze character frequency patterns in text' },

  // CONVERSION TOOLS (20 tools)
  { id: 'currency', name: 'Currency Converter', category: 'Conversion', icon: Globe, component: CurrencyConverter, description: 'Convert between SAR, USD, EUR and other currencies' },
  { id: 'unit-converter', name: 'Unit Converter', category: 'Conversion', icon: Ruler, component: UnitConverter, description: 'Convert between different units of length, weight, volume, area, and speed' },
  { id: 'temperature', name: 'Temperature Converter', category: 'Conversion', icon: Thermometer, component: TemperatureConverter, description: 'Convert between Celsius, Fahrenheit, Kelvin, and Rankine with common references' },
  { id: 'time-zone', name: 'Time Zone Converter', category: 'Conversion', icon: Clock, component: TimeConverter, description: 'Convert times between different time zones worldwide' },
  { id: 'hijri-gregorian', name: 'Hijri to Gregorian Converter', category: 'Conversion', icon: Calendar, component: TimeConverter, description: 'Convert between Hijri and Gregorian calendar dates' },
  { id: 'number-base', name: 'Number Base Converter', category: 'Conversion', icon: Binary, component: NumberBaseConverter, description: 'Convert numbers between binary, decimal, hexadecimal, and octal with bitwise operations' },
  { id: 'roman-numeral', name: 'Roman Numeral Converter', category: 'Conversion', icon: Hash, component: NumberBaseConverter, description: 'Convert between Roman numerals and decimal numbers' },
  { id: 'percentage', name: 'Percentage Calculator', category: 'Conversion', icon: Percent, component: Calculator, description: 'Calculate percentages, increases, decreases, and ratios' },
  { id: 'fraction-decimal', name: 'Fraction to Decimal Converter', category: 'Conversion', icon: Divide, component: Calculator, description: 'Convert fractions to decimals and vice versa' },
  { id: 'speed-converter', name: 'Speed Converter', category: 'Conversion', icon: Zap, component: UnitConverter, description: 'Convert between different speed units (km/h, mph, m/s, knots)' },
  { id: 'area-converter', name: 'Area Converter', category: 'Conversion', icon: Square, component: UnitConverter, description: 'Convert between different area units (sq meters, sq feet, acres, hectares)' },
  { id: 'volume-converter', name: 'Volume Converter', category: 'Conversion', icon: Box, component: UnitConverter, description: 'Convert between different volume units (liters, gallons, cubic meters)' },
  { id: 'pressure-converter', name: 'Pressure Converter', category: 'Conversion', icon: Gauge, component: UnitConverter, description: 'Convert between different pressure units (Pa, bar, psi, atm)' },
  { id: 'energy-converter', name: 'Energy Converter', category: 'Conversion', icon: Zap, component: UnitConverter, description: 'Convert between different energy units (Joules, calories, kWh, BTU)' },
  { id: 'power-converter', name: 'Power Converter', category: 'Conversion', icon: Zap, component: UnitConverter, description: 'Convert between different power units (Watts, horsepower, BTU/h)' },
  { id: 'data-storage', name: 'Data Storage Converter', category: 'Conversion', icon: HardDrive, component: UnitConverter, description: 'Convert between data storage units (GB, MB, KB, TB, PB)' },
  { id: 'cooking-measurements', name: 'Cooking Measurements Converter', category: 'Conversion', icon: ChefHat, component: UnitConverter, description: 'Convert between cooking measurements (cups, tablespoons, grams, ounces)' },
  { id: 'shoe-size', name: 'Shoe Size Converter', category: 'Conversion', icon: Footprints, component: UnitConverter, description: 'Convert between international shoe size systems' },
  { id: 'clothing-size', name: 'Clothing Size Converter', category: 'Conversion', icon: Shirt, component: UnitConverter, description: 'Convert between international clothing size systems' },
  { id: 'fuel-efficiency', name: 'Fuel Efficiency Converter', category: 'Conversion', icon: Fuel, component: UnitConverter, description: 'Convert between fuel efficiency units (mpg, L/100km, km/L)' },

  // FINANCIAL/CALCULATOR TOOLS (20 tools)
  { id: 'bmi-calc', name: 'BMI Calculator', category: 'Financial/Calculator', icon: Calculator, component: BMICalculator, description: 'Calculate Body Mass Index with health categories' },
  { id: 'saudi-tax', name: 'Saudi Tax Calculator', category: 'Financial/Calculator', icon: Receipt, component: SaudiTaxCalculator, description: 'Calculate VAT, corporate tax, and withholding tax for Saudi Arabia' },
  { id: 'zakat', name: 'Zakat Calculator', category: 'Financial/Calculator', icon: Coins, component: ZakatCalculator, description: 'Calculate Zakat for various asset types with nisab thresholds' },
  { id: 'net-salary', name: 'Net Salary Calculator', category: 'Financial/Calculator', icon: DollarSign, component: NetSalaryCalculator, description: 'Calculate net salary after deductions and benefits' },
  { id: 'loan', name: 'Loan Calculator', category: 'Financial/Calculator', icon: CreditCard, component: LoanCalculator, description: 'Calculate loan payments, interest, and amortization schedules' },
  { id: 'compound-interest', name: 'Compound Interest Calculator', category: 'Financial/Calculator', icon: TrendingUp, component: CompoundInterestCalculator, description: 'Calculate compound interest with various frequencies and time periods' },
  { id: 'investment-return', name: 'Investment Return Calculator', category: 'Financial/Calculator', icon: TrendingUp, component: InvestmentReturnCalculator, description: 'Calculate ROI, CAGR, and total returns for investments' },
  { id: 'tip', name: 'Tip Calculator', category: 'Financial/Calculator', icon: DollarSign, component: TipCalculator, description: 'Calculate tips with percentages and split bills among people' },
  { id: 'mortgage', name: 'Mortgage Calculator', category: 'Financial/Calculator', icon: Home, component: MortgageCalculator, description: 'Calculate mortgage payments, interest, and amortization' },
  { id: 'profit-margin', name: 'Profit Margin Calculator', category: 'Financial/Calculator', icon: TrendingUp, component: Calculator, description: 'Calculate profit margins, markup, and cost analysis' },
  { id: 'break-even', name: 'Break-Even Calculator', category: 'Financial/Calculator', icon: Target, component: Calculator, description: 'Calculate break-even point for business operations' },
  { id: 'currency-exchange', name: 'Currency Exchange Calculator', category: 'Financial/Calculator', icon: Globe, component: CurrencyConverter, description: 'Advanced currency exchange with historical rates' },
  { id: 'retirement', name: 'Retirement Calculator', category: 'Financial/Calculator', icon: Users, component: Calculator, description: 'Plan retirement savings and calculate required amounts' },
  { id: 'savings', name: 'Savings Calculator', category: 'Financial/Calculator', icon: PiggyBank, component: Calculator, description: 'Calculate savings goals and compound interest growth' },
  { id: 'debt-payoff', name: 'Debt Payoff Calculator', category: 'Financial/Calculator', icon: CreditCard, component: Calculator, description: 'Plan debt payoff strategies and calculate timelines' },
  { id: 'roi-calc', name: 'ROI Calculator', category: 'Financial/Calculator', icon: TrendingUp, component: Calculator, description: 'Calculate Return on Investment for various scenarios' },
  { id: 'lease', name: 'Lease Calculator', category: 'Financial/Calculator', icon: FileText, component: Calculator, description: 'Calculate lease payments and compare leasing vs buying' },
  { id: 'insurance-premium', name: 'Insurance Premium Calculator', category: 'Financial/Calculator', icon: Shield, component: Calculator, description: 'Calculate insurance premiums and coverage costs' },
  { id: 'budget', name: 'Budget Calculator', category: 'Financial/Calculator', icon: Calculator, component: Calculator, description: 'Create and track personal or business budgets' },
  { id: 'tax-refund', name: 'Tax Refund Calculator', category: 'Financial/Calculator', icon: Receipt, component: Calculator, description: 'Estimate tax refunds and tax liability' },

  // COLOR & DESIGN TOOLS (20 tools)
  { id: 'color-picker', name: 'Color Picker', category: 'Color & Design', icon: Palette, component: ColorPicker, description: 'Pick colors and get HEX, RGB, HSL values' },
  { id: 'color-palette', name: 'Color Palette Generator', category: 'Color & Design', icon: Palette, component: ColorPaletteGenerator, description: 'Generate harmonious color palettes using color theory principles' },
  { id: 'color-format', name: 'Color Format Converter', category: 'Color & Design', icon: Palette, component: ColorFormatConverter, description: 'Convert between HEX, RGB, HSL, CMYK color formats' },
  { id: 'color-contrast', name: 'Color Contrast Checker', category: 'Color & Design', icon: Eye, component: ColorContrastChecker, description: 'Check color contrast ratios for accessibility compliance' },
  { id: 'gradient-generator', name: 'Gradient Generator', category: 'Color & Design', icon: Palette, component: GradientGenerator, description: 'Create beautiful CSS gradients with multiple color stops' },
  { id: 'color-blindness', name: 'Color Blindness Simulator', category: 'Color & Design', icon: Eye, component: ColorBlindnessSimulator, description: 'Simulate how colors appear to color-blind users' },
  { id: 'image-color-extractor', name: 'Image Color Extractor', category: 'Color & Design', icon: Camera, component: ImageColorExtractor, description: 'Extract dominant colors from uploaded images' },
  { id: 'css-box-shadow', name: 'CSS Box Shadow Generator', category: 'Color & Design', icon: Layers, component: CSSBoxShadowGenerator, description: 'Generate CSS box-shadow properties with visual preview' },
  { id: 'border-radius', name: 'Border Radius Generator', category: 'Color & Design', icon: Square, component: BorderRadiusGenerator, description: 'Create rounded corners and generate CSS border-radius' },
  { id: 'css-gradient', name: 'CSS Gradient Generator', category: 'Color & Design', icon: Palette, component: ColorPicker, description: 'Generate complex CSS gradients with multiple directions' },
  { id: 'color-scheme', name: 'Color Scheme Generator', category: 'Color & Design', icon: Palette, component: ColorPicker, description: 'Generate color schemes based on color theory rules' },
  { id: 'hex-rgb', name: 'Hex to RGB Converter', category: 'Color & Design', icon: Palette, component: ColorPicker, description: 'Convert between hexadecimal and RGB color values' },
  { id: 'color-mixer', name: 'Color Mixer', category: 'Color & Design', icon: Palette, component: ColorPicker, description: 'Mix colors and see the resulting blend' },
  { id: 'css-filter', name: 'CSS Filter Generator', category: 'Color & Design', icon: Palette, component: ColorPicker, description: 'Generate CSS filters for image effects and adjustments' },
  { id: 'material-design', name: 'Material Design Color Palette', category: 'Color & Design', icon: Palette, component: ColorPicker, description: 'Access Google Material Design color palettes' },
  { id: 'css-animation', name: 'CSS Animation Generator', category: 'Color & Design', icon: Play, component: ColorPicker, description: 'Create CSS animations and keyframes' },
  { id: 'css-transform', name: 'CSS Transform Generator', category: 'Color & Design', icon: Move, component: ColorPicker, description: 'Generate CSS transform properties for 2D/3D effects' },
  { id: 'font-pair', name: 'Font Pair Generator', category: 'Color & Design', icon: Type, component: ColorPicker, description: 'Find perfect font combinations for web design' },
  { id: 'icon-generator', name: 'Icon Generator', category: 'Color & Design', icon: Star, component: ColorPicker, description: 'Generate custom icons and symbols' },
  { id: 'logo-color-analyzer', name: 'Logo Color Analyzer', category: 'Color & Design', icon: Eye, component: ColorPicker, description: 'Analyze color usage in logos and brands' },

  // PRODUCTIVITY TOOLS (20 tools)
  { id: 'pomodoro', name: 'Pomodoro Timer', category: 'Productivity', icon: Clock, component: PomodoroTimer, description: '25-minute focus sessions with breaks' },
  { id: 'todo-list', name: 'To-Do List Manager', category: 'Productivity', icon: CheckSquare, component: ToDoListManager, description: 'Create, organize, and track tasks with priorities and categories' },
  { id: 'date-calculator', name: 'Date Calculator', category: 'Productivity', icon: Calendar, component: TimeConverter, description: 'Calculate date differences and add/subtract time periods' },
  { id: 'age-calculator', name: 'Age Calculator', category: 'Productivity', icon: Users, component: TimeConverter, description: 'Calculate exact age and time until next birthday' },
  { id: 'calendar-generator', name: 'Calendar Generator', category: 'Productivity', icon: Calendar, component: TimeConverter, description: 'Generate custom calendars and schedules' },
  { id: 'habit-tracker', name: 'Habit Tracker', category: 'Productivity', icon: Target, component: ToDoListManager, description: 'Track daily habits and build positive routines' },
  { id: 'meeting-time-finder', name: 'Meeting Time Finder', category: 'Productivity', icon: Clock, component: TimeConverter, description: 'Find optimal meeting times across different time zones' },
  { id: 'goal-tracker', name: 'Goal Tracker', category: 'Productivity', icon: Target, component: ToDoListManager, description: 'Set, track, and achieve personal and professional goals' },
  { id: 'time-tracker', name: 'Time Tracker', category: 'Productivity', icon: Clock, component: Timer, description: 'Track time spent on different activities and projects' },
  { id: 'expense-tracker', name: 'Expense Tracker', category: 'Productivity', icon: DollarSign, component: Calculator, description: 'Track expenses and manage personal finances' },
  { id: 'note-taking', name: 'Note Taking App', category: 'Productivity', icon: FileText, component: TextCleaner, description: 'Create, organize, and search through notes' },
  { id: 'reminder-system', name: 'Reminder System', category: 'Productivity', icon: Bell, component: Timer, description: 'Set and manage reminders for important tasks' },
  { id: 'project-timeline', name: 'Project Timeline Calculator', category: 'Productivity', icon: Calendar, component: TimeConverter, description: 'Calculate project timelines and milestones' },
  { id: 'work-hours', name: 'Work Hours Calculator', category: 'Productivity', icon: Clock, component: Calculator, description: 'Calculate work hours, overtime, and pay rates' },
  { id: 'break-reminder', name: 'Break Reminder', category: 'Productivity', icon: Coffee, component: Timer, description: 'Set reminders for regular breaks during work' },
  { id: 'focus-timer', name: 'Focus Timer', category: 'Productivity', icon: Target, component: Timer, description: 'Customizable focus sessions with progress tracking' },
  { id: 'daily-planner', name: 'Daily Planner', category: 'Productivity', icon: Calendar, component: ToDoListManager, description: 'Plan and organize daily activities and tasks' },
  { id: 'weekly-schedule', name: 'Weekly Schedule Maker', category: 'Productivity', icon: Calendar, component: ToDoListManager, description: 'Create and manage weekly schedules' },
  { id: 'monthly-goals', name: 'Monthly Goal Setter', category: 'Productivity', icon: Target, component: ToDoListManager, description: 'Set and track monthly goals and objectives' },
  { id: 'priority-matrix', name: 'Priority Matrix Tool', category: 'Productivity', icon: Target, component: ToDoListManager, description: 'Organize tasks using Eisenhower priority matrix' },

  // FILE TOOLS (20 tools)
  { id: 'qr-gen', name: 'QR Code Generator', category: 'File', icon: QrCode, component: QRCodeGenerator, description: 'Generate QR codes from text or URLs' },
  { id: 'image-compressor', name: 'Image Compressor', category: 'File', icon: Image, component: FileImage, description: 'Compress images while maintaining quality' },
  { id: 'image-format-converter', name: 'Image Format Converter', category: 'File', icon: Image, component: FileImage, description: 'Convert images between different formats (JPG, PNG, WebP, etc.)' },
  { id: 'qr-reader', name: 'QR Code Reader', category: 'File', icon: QrCode, component: FileImage, description: 'Read and decode QR codes from images' },
  { id: 'barcode-generator', name: 'Barcode Generator', category: 'File', icon: BarChart, component: FileImage, description: 'Generate various barcode types (Code 128, EAN, UPC, etc.)' },
  { id: 'image-resizer', name: 'Image Resizer', category: 'File', icon: Image, component: FileImage, description: 'Resize images to specific dimensions while maintaining aspect ratio' },
  { id: 'pdf-to-image', name: 'PDF to Image Converter', category: 'File', icon: FileText, component: FileImage, description: 'Convert PDF pages to image formats' },
  { id: 'image-to-base64', name: 'Image to Base64 Converter', category: 'File', icon: Image, component: FileImage, description: 'Convert images to Base64 strings for web use' },
  { id: 'file-hash', name: 'File Hash Calculator', category: 'File', icon: Hash, component: HashGenerator, description: 'Calculate file hashes for integrity verification' },
  { id: 'image-cropper', name: 'Image Cropper', category: 'File', icon: Scissors, component: FileImage, description: 'Crop images to specific dimensions and areas' },
  { id: 'watermark-generator', name: 'Watermark Generator', category: 'File', icon: Image, component: FileImage, description: 'Add watermarks to images with custom text and positioning' },
  { id: 'pdf-merger', name: 'PDF Merger', category: 'File', icon: FileText, component: FileImage, description: 'Merge multiple PDF files into one document' },
  { id: 'pdf-splitter', name: 'PDF Splitter', category: 'File', icon: FileText, component: FileImage, description: 'Split PDF files into separate documents' },
  { id: 'image-optimizer', name: 'Image Optimizer', category: 'File', icon: Image, component: FileImage, description: 'Optimize images for web use with quality settings' },
  { id: 'file-size-calculator', name: 'File Size Calculator', category: 'File', icon: HardDrive, component: Calculator, description: 'Calculate file sizes and storage requirements' },
  { id: 'duplicate-file-finder', name: 'Duplicate File Finder', category: 'File', icon: Search, component: FileImage, description: 'Find and identify duplicate files' },
  { id: 'file-renamer', name: 'File Renamer', category: 'File', icon: Edit3, component: FileImage, description: 'Batch rename files with patterns and rules' },
  { id: 'image-editor', name: 'Image Editor', category: 'File', icon: Image, component: FileImage, description: 'Basic image editing with filters and adjustments' },
  { id: 'pdf-password-remover', name: 'PDF Password Remover', category: 'File', icon: Lock, component: FileImage, description: 'Remove passwords from PDF files' },
  { id: 'file-converter-hub', name: 'File Converter Hub', category: 'File', icon: RefreshCw, component: FileImage, description: 'Convert files between various formats' },

  // MISCELLANEOUS TOOLS (20 tools)
  { id: 'random-generator', name: 'Random Generator', category: 'Miscellaneous', icon: Shuffle, component: RandomGenerator, description: 'Generate random numbers, passwords, names, colors, and more' },
  { id: 'decision-maker', name: 'Decision Maker', category: 'Miscellaneous', icon: Brain, component: RandomGenerator, description: 'Make decisions with random selection and weighted options' },
  { id: 'countdown-timer', name: 'Countdown Timer', category: 'Miscellaneous', icon: Timer, component: Timer, description: 'Set countdown timers for events and deadlines' },
  { id: 'url-shortener', name: 'URL Shortener', category: 'Miscellaneous', icon: Link, component: FileText, description: 'Shorten long URLs for easier sharing' },
  { id: 'website-speed-test', name: 'Website Speed Test', category: 'Miscellaneous', icon: Zap, component: Timer, description: 'Test website loading speed and performance' },
  { id: 'ip-address-generator', name: 'IP Address Generator', category: 'Miscellaneous', icon: Globe, component: RandomGenerator, description: 'Generate random IP addresses for testing' },
  { id: 'domain-name-generator', name: 'Domain Name Generator', category: 'Miscellaneous', icon: Globe, component: RandomGenerator, description: 'Generate creative domain name suggestions' },
  { id: 'bmr-calculator', name: 'BMR Calculator', category: 'Miscellaneous', icon: Heart, component: Calculator, description: 'Calculate Basal Metabolic Rate for health planning' },
  { id: 'calorie-calculator', name: 'Calorie Calculator', category: 'Miscellaneous', icon: Activity, component: Calculator, description: 'Calculate daily calorie needs and track intake' },
  { id: 'water-intake', name: 'Water Intake Calculator', category: 'Miscellaneous', icon: Droplets, component: Calculator, description: 'Calculate recommended daily water intake' },
  { id: 'sleep-calculator', name: 'Sleep Calculator', category: 'Miscellaneous', icon: Moon, component: Timer, description: 'Calculate optimal sleep cycles and wake-up times' },
  { id: 'weather-converter', name: 'Weather Converter', category: 'Miscellaneous', icon: Cloud, component: UnitConverter, description: 'Convert between different weather units' },
  { id: 'recipe-calculator', name: 'Recipe Calculator', category: 'Miscellaneous', icon: ChefHat, component: Calculator, description: 'Scale recipes and calculate ingredient amounts' },
  { id: 'cooking-timer', name: 'Cooking Timer', category: 'Miscellaneous', icon: Timer, component: Timer, description: 'Set multiple timers for cooking and baking' },
  { id: 'unit-price-comparator', name: 'Unit Price Comparator', category: 'Miscellaneous', icon: Calculator, component: Calculator, description: 'Compare unit prices to find the best deals' },
  { id: 'discount-calculator', name: 'Discount Calculator', category: 'Miscellaneous', icon: Percent, component: Calculator, description: 'Calculate discounts, savings, and final prices' },
  { id: 'grade-calculator', name: 'Grade Calculator', category: 'Miscellaneous', icon: GraduationCap, component: Calculator, description: 'Calculate grades, GPA, and academic performance' },
  { id: 'gpa-calculator', name: 'GPA Calculator', category: 'Miscellaneous', icon: GraduationCap, component: Calculator, description: 'Calculate Grade Point Average for academic records' },
  { id: 'lottery-generator', name: 'Lottery Number Generator', category: 'Miscellaneous', icon: Gift, component: RandomGenerator, description: 'Generate random lottery numbers' },
  { id: 'password-strength-tester', name: 'Password Strength Tester', category: 'Miscellaneous', icon: Shield, component: PasswordStrengthChecker, description: 'Test password strength and security' },
  
  // ADDITIONAL TOOLS (5 new tools)
  { id: 'qr-code-scanner', name: 'QR Code Scanner', category: 'File', icon: QrCode, component: FileImage, description: 'Scan QR codes using your device camera' },
  { id: 'color-blindness-test', name: 'Color Blindness Test', category: 'Color & Design', icon: Eye, component: ColorBlindnessSimulator, description: 'Test your color vision with interactive tests' },
  { id: 'text-to-morse', name: 'Text to Morse Code Converter', category: 'Text & Writing', icon: FileText, component: TextCleaner, description: 'Convert text to Morse code and vice versa' },
  { id: 'emoji-picker', name: 'Emoji Picker & Generator', category: 'Text & Writing', icon: Star, component: TextCleaner, description: 'Browse and search emojis by category and keywords' },
  { id: 'password-generator-advanced', name: 'Advanced Password Generator', category: 'Text & Writing', icon: Settings, component: PasswordGenerator, description: 'Generate complex passwords with custom character sets and patterns' }
];

// Enhanced categories with tool counts
const categories = [
  { name: 'Text & Writing', icon: FileText, color: 'text-primary', count: tools.filter(t => t.category === 'Text & Writing').length },
  { name: 'Conversion', icon: Globe, color: 'text-secondary', count: tools.filter(t => t.category === 'Conversion').length },
  { name: 'Financial/Calculator', icon: Calculator, color: 'text-green-600', count: tools.filter(t => t.category === 'Financial/Calculator').length },
  { name: 'Color & Design', icon: Palette, color: 'text-accent', count: tools.filter(t => t.category === 'Color & Design').length },
  { name: 'Productivity', icon: CheckSquare, color: 'text-blue-600', count: tools.filter(t => t.category === 'Productivity').length },
  { name: 'File', icon: FileIcon, color: 'text-purple-600', count: tools.filter(t => t.category === 'File').length },
  { name: 'Miscellaneous', icon: Shuffle, color: 'text-orange-600', count: tools.filter(t => t.category === 'Miscellaneous').length }
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
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  RabwaTools
                </h1>
                <p className="text-sm text-muted-foreground">100+ Professional Tools</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Theme Toggle & Settings */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!selectedTool ? (
          <>
            {/* Category Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 border-b border-border">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  All Tools ({tools.length})
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors flex items-center gap-2 ${
                      selectedCategory === category.name
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="group relative bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => setSelectedTool(tool.id)}
                >
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tool.id);
                    }}
                    className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${
                      favorites.includes(tool.id)
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${favorites.includes(tool.id) ? 'fill-current' : ''}`} />
                  </button>

                  {/* Tool Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <tool.icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Tool Info */}
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Category Badge */}
                  <div className="mt-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      categories.find(c => c.name === tool.category)?.color || 'text-gray-600'
                    } bg-muted`}>
                      {tool.category}
                    </span>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredTools.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or category filter
                </p>
              </div>
            )}
          </>
        ) : (
          /* Tool Interface */
          <div className="space-y-6">
            {/* Tool Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedTool(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold">{selectedToolData?.name}</h1>
                  <p className="text-muted-foreground">{selectedToolData?.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(selectedTool!)}
                  className={`p-2 rounded-lg transition-colors ${
                    favorites.includes(selectedTool!)
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <Star className={`w-5 h-5 ${favorites.includes(selectedTool!) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Tool Component */}
            <div className="bg-card border border-border rounded-lg p-6">
              {selectedToolData?.component && <selectedToolData.component />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;