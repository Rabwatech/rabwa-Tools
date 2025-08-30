import { useState, useMemo, useEffect } from "react";
import { 
  Search, Settings, Moon, Sun, Wrench, Calculator, Palette, FileText, Clock, Globe, Star, 
  Ruler, Binary, Thermometer, Type, FileCode, Hash, BarChart3, Receipt, Coins, DollarSign, 
  CreditCard, TrendingUp, Home, CheckSquare, Shuffle, Users, Target, Calendar, FileImage,
  Zap, Eye, Layers, Scissors, Download, Upload, QrCode, BarChart, Timer, 
  Brain, Heart, Activity, Scale, BookOpen, GraduationCap, Gift, Cloud, Wifi, MapPin,
  Smartphone, Monitor, Camera, FileText as FileIcon, Music, Video, Archive, Lock, Unlock,
  RotateCcw, Copy, Plus, Minus, Divide, Percent, Hash as HashIcon, Infinity, Zap as ZapIcon,
  ArrowLeft, Link, Image, Square, Play, Move, Edit3, RefreshCw, Bell, Coffee, Droplets, Shield,
  Volume2, Box, Gauge, HardDrive, ChefHat, Footprints, Shirt, Fuel, PiggyBank, X
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
import { ToolCard } from "@/components/ui/tool-card";
import { EnhancedSelect, SelectOption } from "@/components/ui/enhanced-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";
import Cookies from 'js-cookie';

// Tool definitions with categories - 100+ tools total
const getTools = (t: any) => [
  // TEXT & WRITING TOOLS (20 tools)
  { id: 'word-counter', name: t('tools.wordCounter'), category: t('categories.textAndWriting'), icon: FileText, component: WordCounter, description: t('toolDescriptions.wordCounter') },
  { id: 'text-case', name: t('tools.textCaseConverter'), category: t('categories.textAndWriting'), icon: FileText, component: TextCaseConverter, description: t('toolDescriptions.textCaseConverter') },
  { id: 'password-gen', name: t('tools.passwordGenerator'), category: t('categories.textAndWriting'), icon: Settings, component: PasswordGenerator, description: t('toolDescriptions.passwordGenerator') },
  { id: 'password-strength', name: t('tools.passwordStrengthChecker'), category: t('categories.textAndWriting'), icon: Settings, component: PasswordStrengthChecker, description: t('toolDescriptions.passwordStrengthChecker') },
  { id: 'text-cleaner', name: t('tools.textCleaner'), category: t('categories.textAndWriting'), icon: FileText, component: TextCleaner, description: t('toolDescriptions.textCleaner') },
  { id: 'arabic-transliterator', name: t('tools.arabicTransliterator'), category: t('categories.textAndWriting'), icon: FileText, component: ArabicTransliterator, description: t('toolDescriptions.arabicTransliterator') },
  { id: 'lorem-ipsum', name: t('tools.loremIpsumGenerator'), category: t('categories.textAndWriting'), icon: FileText, component: LoremIpsumGenerator, description: t('toolDescriptions.loremIpsumGenerator') },
  { id: 'text-difference', name: t('tools.textDifferenceChecker'), category: t('categories.textAndWriting'), icon: FileText, component: TextDifferenceChecker, description: t('toolDescriptions.textDifferenceChecker') },
  { id: 'text-reverser', name: t('tools.textReverser'), category: t('categories.textAndWriting'), icon: FileText, component: TextReverser, description: t('toolDescriptions.textReverser') },
  { id: 'duplicate-remover', name: t('tools.duplicateLineRemover'), category: t('categories.textAndWriting'), icon: FileText, component: DuplicateLineRemover, description: t('toolDescriptions.duplicateLineRemover') },
  { id: 'text-ascii', name: t('tools.textAsciiConverter'), category: t('categories.textAndWriting'), icon: Type, component: TextAsciiConverter, description: t('toolDescriptions.textAsciiConverter') },
  { id: 'base64-converter', name: t('tools.base64Converter'), category: t('categories.textAndWriting'), icon: FileCode, component: Base64Converter, description: t('toolDescriptions.base64Converter') },
  { id: 'url-encoder', name: t('tools.urlEncoder'), category: t('categories.textAndWriting'), icon: Link, component: TextCleaner, description: t('toolDescriptions.urlEncoder') },
  { id: 'hash-generator', name: t('tools.hashGenerator'), category: t('categories.textAndWriting'), icon: Hash, component: HashGenerator, description: t('toolDescriptions.hashGenerator') },
  { id: 'text-statistics', name: t('tools.textStatistics'), category: t('categories.textAndWriting'), icon: BarChart3, component: TextStatistics, description: t('toolDescriptions.textStatistics') },
  { id: 'text-to-speech', name: t('tools.textToSpeech'), category: t('categories.textAndWriting'), icon: Volume2, component: TextCleaner, description: t('toolDescriptions.textToSpeech') },
  { id: 'word-frequency', name: t('tools.wordFrequency'), category: t('categories.textAndWriting'), icon: BarChart, component: TextStatistics, description: t('toolDescriptions.wordFrequency') },
  { id: 'text-summarizer', name: t('tools.textSummarizer'), category: t('categories.textAndWriting'), icon: FileText, component: TextCleaner, description: t('toolDescriptions.textSummarizer') },
  { id: 'line-counter', name: t('tools.lineCounter'), category: t('categories.textAndWriting'), icon: Hash, component: TextStatistics, description: t('toolDescriptions.lineCounter') },
  { id: 'character-frequency', name: t('tools.characterFrequency'), category: t('categories.textAndWriting'), icon: BarChart3, component: TextStatistics, description: t('toolDescriptions.characterFrequency') },

  // CONVERSION TOOLS (20 tools)
  { id: 'currency', name: t('tools.currencyConverter'), category: t('categories.conversion'), icon: Globe, component: CurrencyConverter, description: t('toolDescriptions.currencyConverter') },
  { id: 'unit-converter', name: t('tools.unitConverter'), category: t('categories.conversion'), icon: Ruler, component: UnitConverter, description: t('toolDescriptions.unitConverter') },
  { id: 'temperature', name: t('tools.temperatureConverter'), category: t('categories.conversion'), icon: Thermometer, component: TemperatureConverter, description: t('toolDescriptions.temperatureConverter') },
  { id: 'time-zone', name: t('tools.timeZone'), category: t('categories.conversion'), icon: Clock, component: TimeConverter, description: t('toolDescriptions.timeZone') },
  { id: 'hijri-gregorian', name: t('tools.hijriGregorian'), category: t('categories.conversion'), icon: Calendar, component: TimeConverter, description: t('toolDescriptions.hijriGregorian') },
  { id: 'number-base', name: t('tools.numberBaseConverter'), category: t('categories.conversion'), icon: Binary, component: NumberBaseConverter, description: t('toolDescriptions.numberBaseConverter') },
  { id: 'roman-numeral', name: t('tools.romanNumeral'), category: t('categories.conversion'), icon: Hash, component: NumberBaseConverter, description: t('toolDescriptions.romanNumeral') },
  { id: 'percentage', name: t('tools.percentage'), category: t('categories.conversion'), icon: Percent, component: Calculator, description: t('toolDescriptions.percentage') },
  { id: 'fraction-decimal', name: t('tools.fractionDecimal'), category: t('categories.conversion'), icon: Divide, component: Calculator, description: t('toolDescriptions.fractionDecimal') },
  { id: 'speed-converter', name: t('tools.speedConverter'), category: t('categories.conversion'), icon: Zap, component: UnitConverter, description: t('toolDescriptions.speedConverter') },
  { id: 'area-converter', name: t('tools.areaConverter'), category: t('categories.conversion'), icon: Square, component: UnitConverter, description: t('toolDescriptions.areaConverter') },
  { id: 'volume-converter', name: t('tools.volumeConverter'), category: t('categories.conversion'), icon: Box, component: UnitConverter, description: t('toolDescriptions.volumeConverter') },
  { id: 'pressure-converter', name: t('tools.pressureConverter'), category: t('categories.conversion'), icon: Gauge, component: UnitConverter, description: t('toolDescriptions.pressureConverter') },
  { id: 'energy-converter', name: t('tools.energyConverter'), category: t('categories.conversion'), icon: Zap, component: UnitConverter, description: t('toolDescriptions.energyConverter') },
  { id: 'power-converter', name: t('tools.powerConverter'), category: t('categories.conversion'), icon: Zap, component: UnitConverter, description: t('toolDescriptions.powerConverter') },
  { id: 'data-storage', name: t('tools.dataStorage'), category: t('categories.conversion'), icon: HardDrive, component: UnitConverter, description: t('toolDescriptions.dataStorage') },
  { id: 'cooking-measurements', name: t('tools.cookingMeasurements'), category: t('categories.conversion'), icon: ChefHat, component: UnitConverter, description: t('toolDescriptions.cookingMeasurements') },
  { id: 'shoe-size', name: t('tools.shoeSize'), category: t('categories.conversion'), icon: Footprints, component: UnitConverter, description: t('toolDescriptions.shoeSize') },
  { id: 'clothing-size', name: t('tools.clothingSize'), category: t('categories.conversion'), icon: Shirt, component: UnitConverter, description: t('toolDescriptions.clothingSize') },
  { id: 'fuel-efficiency', name: t('tools.fuelEfficiency'), category: t('categories.conversion'), icon: Fuel, component: UnitConverter, description: t('toolDescriptions.fuelEfficiency') },

  // FINANCIAL/CALCULATOR TOOLS (20 tools)
  { id: 'bmi-calc', name: t('tools.bmiCalculator'), category: t('categories.financialCalculator'), icon: Calculator, component: BMICalculator, description: t('toolDescriptions.bmiCalculator') },
  { id: 'saudi-tax', name: t('tools.saudiTaxCalculator'), category: t('categories.financialCalculator'), icon: Receipt, component: SaudiTaxCalculator, description: t('toolDescriptions.saudiTaxCalculator') },
  { id: 'zakat', name: t('tools.zakat'), category: t('categories.financialCalculator'), icon: Coins, component: ZakatCalculator, description: t('toolDescriptions.zakat') },
  { id: 'net-salary', name: t('tools.netSalaryCalculator'), category: t('categories.financialCalculator'), icon: DollarSign, component: NetSalaryCalculator, description: t('toolDescriptions.netSalaryCalculator') },
  { id: 'loan', name: t('tools.loanCalculator'), category: t('categories.financialCalculator'), icon: CreditCard, component: LoanCalculator, description: t('toolDescriptions.loanCalculator') },
  { id: 'compound-interest', name: t('tools.compoundInterestCalculator'), category: t('categories.financialCalculator'), icon: TrendingUp, component: CompoundInterestCalculator, description: t('toolDescriptions.compoundInterestCalculator') },
  { id: 'investment-return', name: t('tools.investmentReturnCalculator'), category: t('categories.financialCalculator'), icon: TrendingUp, component: InvestmentReturnCalculator, description: t('toolDescriptions.investmentReturnCalculator') },
  { id: 'tip', name: t('tools.tipCalculator'), category: t('categories.financialCalculator'), icon: DollarSign, component: TipCalculator, description: t('toolDescriptions.tipCalculator') },
  { id: 'mortgage', name: t('tools.mortgageCalculator'), category: t('categories.financialCalculator'), icon: Home, component: MortgageCalculator, description: t('toolDescriptions.mortgageCalculator') },
  { id: 'profit-margin', name: t('tools.profitMargin'), category: t('categories.financialCalculator'), icon: TrendingUp, component: Calculator, description: t('toolDescriptions.profitMargin') },
  { id: 'break-even', name: t('tools.breakEven'), category: t('categories.financialCalculator'), icon: Target, component: Calculator, description: t('toolDescriptions.breakEven') },
  { id: 'currency-exchange', name: t('tools.currencyExchange'), category: t('categories.financialCalculator'), icon: Globe, component: CurrencyConverter, description: t('toolDescriptions.currencyExchange') },
  { id: 'retirement', name: t('tools.retirement'), category: t('categories.financialCalculator'), icon: Users, component: Calculator, description: t('toolDescriptions.retirement') },
  { id: 'savings', name: t('tools.savings'), category: t('categories.financialCalculator'), icon: PiggyBank, component: Calculator, description: t('toolDescriptions.savings') },
  { id: 'debt-payoff', name: t('tools.debtPayoff'), category: t('categories.financialCalculator'), icon: CreditCard, component: Calculator, description: t('toolDescriptions.debtPayoff') },
  { id: 'roi-calc', name: t('tools.roiCalc'), category: t('categories.financialCalculator'), icon: TrendingUp, component: Calculator, description: t('toolDescriptions.roiCalc') },
  { id: 'lease', name: t('tools.lease'), category: t('categories.financialCalculator'), icon: FileText, component: Calculator, description: t('toolDescriptions.lease') },
  { id: 'insurance-premium', name: t('tools.insurancePremium'), category: t('categories.financialCalculator'), icon: Shield, component: Calculator, description: t('toolDescriptions.insurancePremium') },
  { id: 'budget', name: t('tools.budget'), category: t('categories.financialCalculator'), icon: Calculator, component: Calculator, description: t('toolDescriptions.budget') },
  { id: 'tax-refund', name: t('tools.taxRefund'), category: t('categories.financialCalculator'), icon: Receipt, component: Calculator, description: t('toolDescriptions.taxRefund') },

  // COLOR & DESIGN TOOLS (20 tools)
  { id: 'color-picker', name: t('tools.colorPicker'), category: t('categories.colorAndDesign'), icon: Palette, component: ColorPicker, description: t('toolDescriptions.colorPicker') },
  { id: 'color-palette', name: t('tools.colorPaletteGenerator'), category: t('categories.colorAndDesign'), icon: Palette, component: ColorPaletteGenerator, description: t('toolDescriptions.colorPaletteGenerator') },
  { id: 'color-format', name: t('tools.colorFormatConverter'), category: t('categories.colorAndDesign'), icon: Palette, component: ColorFormatConverter, description: t('toolDescriptions.colorFormatConverter') },
  { id: 'color-contrast', name: t('tools.colorContrastChecker'), category: t('categories.colorAndDesign'), icon: Eye, component: ColorContrastChecker, description: t('toolDescriptions.colorContrastChecker') },
  { id: 'gradient-generator', name: t('tools.gradientGenerator'), category: t('categories.colorAndDesign'), icon: Palette, component: GradientGenerator, description: t('toolDescriptions.gradientGenerator') },
  { id: 'color-blindness', name: t('tools.colorBlindnessSimulator'), category: t('categories.colorAndDesign'), icon: Eye, component: ColorBlindnessSimulator, description: t('toolDescriptions.colorBlindnessSimulator') },
  { id: 'image-color-extractor', name: t('tools.imageColorExtractor'), category: t('categories.colorAndDesign'), icon: Camera, component: ImageColorExtractor, description: t('toolDescriptions.imageColorExtractor') },
  { id: 'css-box-shadow', name: t('tools.cssBoxShadowGenerator'), category: t('categories.colorAndDesign'), icon: Layers, component: CSSBoxShadowGenerator, description: t('toolDescriptions.cssBoxShadowGenerator') },
  { id: 'border-radius', name: t('tools.borderRadiusGenerator'), category: t('categories.colorAndDesign'), icon: Square, component: BorderRadiusGenerator, description: t('toolDescriptions.borderRadiusGenerator') },
  { id: 'css-gradient', name: t('tools.cssGradient'), category: t('categories.colorAndDesign'), icon: Palette, component: ColorPicker, description: t('toolDescriptions.cssGradient') },
  { id: 'color-scheme', name: t('tools.colorScheme'), category: t('categories.colorAndDesign'), icon: Palette, component: ColorPicker, description: t('toolDescriptions.colorScheme') },
  { id: 'hex-rgb', name: t('tools.hexRgb'), category: t('categories.colorAndDesign'), icon: Palette, component: ColorPicker, description: t('toolDescriptions.hexRgb') },
  { id: 'color-mixer', name: t('tools.colorMixer'), category: t('categories.colorAndDesign'), icon: Palette, component: ColorPicker, description: t('toolDescriptions.colorMixer') },
  { id: 'css-filter', name: t('tools.cssFilter'), category: t('categories.colorAndDesign'), icon: Palette, component: ColorPicker, description: t('toolDescriptions.cssFilter') },
  { id: 'material-design', name: t('tools.materialDesign'), category: t('categories.colorAndDesign'), icon: Palette, component: ColorPicker, description: t('toolDescriptions.materialDesign') },
  { id: 'css-animation', name: t('tools.cssAnimation'), category: t('categories.colorAndDesign'), icon: Play, component: ColorPicker, description: t('toolDescriptions.cssAnimation') },
  { id: 'css-transform', name: t('tools.cssTransform'), category: t('categories.colorAndDesign'), icon: Move, component: ColorPicker, description: t('toolDescriptions.cssTransform') },
  { id: 'font-pair', name: t('tools.fontPair'), category: t('categories.colorAndDesign'), icon: Type, component: ColorPicker, description: t('toolDescriptions.fontPair') },
  { id: 'icon-generator', name: t('tools.iconGenerator'), category: t('categories.colorAndDesign'), icon: Star, component: ColorPicker, description: t('toolDescriptions.iconGenerator') },
  { id: 'logo-color-analyzer', name: t('tools.logoColorAnalyzer'), category: t('categories.colorAndDesign'), icon: Eye, component: ColorPicker, description: t('toolDescriptions.logoColorAnalyzer') },

  // PRODUCTIVITY TOOLS (20 tools)
  { id: 'pomodoro', name: t('tools.pomodoroTimer'), category: t('categories.productivity'), icon: Clock, component: PomodoroTimer, description: t('toolDescriptions.pomodoroTimer') },
  { id: 'todo-list', name: t('tools.toDoListManager'), category: t('categories.productivity'), icon: CheckSquare, component: ToDoListManager, description: t('toolDescriptions.toDoListManager') },
  { id: 'date-calculator', name: t('tools.dateCalculator'), category: t('categories.productivity'), icon: Calendar, component: TimeConverter, description: t('toolDescriptions.dateCalculator') },
  { id: 'age-calculator', name: t('tools.ageCalculator'), category: t('categories.productivity'), icon: Users, component: TimeConverter, description: t('toolDescriptions.ageCalculator') },
  { id: 'calendar-generator', name: t('tools.calendarGenerator'), category: t('categories.productivity'), icon: Calendar, component: TimeConverter, description: t('toolDescriptions.calendarGenerator') },
  { id: 'habit-tracker', name: t('tools.habitTracker'), category: t('categories.productivity'), icon: Target, component: ToDoListManager, description: t('toolDescriptions.habitTracker') },
  { id: 'meeting-time-finder', name: t('tools.meetingTimeFinder'), category: t('categories.productivity'), icon: Clock, component: TimeConverter, description: t('toolDescriptions.meetingTimeFinder') },
  { id: 'goal-tracker', name: t('tools.goalTracker'), category: t('categories.productivity'), icon: Target, component: ToDoListManager, description: t('toolDescriptions.goalTracker') },
  { id: 'time-tracker', name: t('tools.timeTracker'), category: t('categories.productivity'), icon: Clock, component: Timer, description: t('toolDescriptions.timeTracker') },
  { id: 'expense-tracker', name: t('tools.expenseTracker'), category: t('categories.productivity'), icon: DollarSign, component: Calculator, description: t('toolDescriptions.expenseTracker') },
  { id: 'note-taking', name: t('tools.noteTaking'), category: t('categories.productivity'), icon: FileText, component: TextCleaner, description: t('toolDescriptions.noteTaking') },
  { id: 'reminder-system', name: t('tools.reminderSystem'), category: t('categories.productivity'), icon: Bell, component: Timer, description: t('toolDescriptions.reminderSystem') },
  { id: 'project-timeline', name: t('tools.projectTimeline'), category: t('categories.productivity'), icon: Calendar, component: TimeConverter, description: t('toolDescriptions.projectTimeline') },
  { id: 'work-hours', name: t('tools.workHours'), category: t('categories.productivity'), icon: Clock, component: Calculator, description: t('toolDescriptions.workHours') },
  { id: 'break-reminder', name: t('tools.breakReminder'), category: t('categories.productivity'), icon: Coffee, component: Timer, description: t('toolDescriptions.breakReminder') },
  { id: 'focus-timer', name: t('tools.focusTimer'), category: t('categories.productivity'), icon: Target, component: Timer, description: t('toolDescriptions.focusTimer') },
  { id: 'daily-planner', name: t('tools.dailyPlanner'), category: t('categories.productivity'), icon: Calendar, component: ToDoListManager, description: t('toolDescriptions.dailyPlanner') },
  { id: 'weekly-schedule', name: t('tools.weeklySchedule'), category: t('categories.productivity'), icon: Calendar, component: ToDoListManager, description: t('toolDescriptions.weeklySchedule') },
  { id: 'monthly-goals', name: t('tools.monthlyGoals'), category: t('categories.productivity'), icon: Target, component: ToDoListManager, description: t('toolDescriptions.monthlyGoals') },
  { id: 'priority-matrix', name: t('tools.priorityMatrix'), category: t('categories.productivity'), icon: Target, component: ToDoListManager, description: t('toolDescriptions.priorityMatrix') },

  // FILE TOOLS (20 tools)
  { id: 'qr-gen', name: t('tools.qrCodeGenerator'), category: t('categories.fileTools'), icon: QrCode, component: QRCodeGenerator, description: t('toolDescriptions.qrCodeGenerator') },
  { id: 'image-compressor', name: t('tools.imageCompressor'), category: t('categories.fileTools'), icon: Image, component: FileImage, description: t('toolDescriptions.imageCompressor') },
  { id: 'image-format-converter', name: t('tools.imageFormatConverter'), category: t('categories.fileTools'), icon: Image, component: FileImage, description: t('toolDescriptions.imageFormatConverter') },
  { id: 'qr-reader', name: t('tools.qrReader'), category: t('categories.fileTools'), icon: QrCode, component: FileImage, description: t('toolDescriptions.qrReader') },
  { id: 'barcode-generator', name: t('tools.barcodeGenerator'), category: t('categories.fileTools'), icon: BarChart, component: FileImage, description: t('toolDescriptions.barcodeGenerator') },
  { id: 'image-resizer', name: t('tools.imageResizer'), category: t('categories.fileTools'), icon: Image, component: FileImage, description: t('toolDescriptions.imageResizer') },
  { id: 'pdf-to-image', name: t('tools.pdfToImage'), category: t('categories.fileTools'), icon: FileText, component: FileImage, description: t('toolDescriptions.pdfToImage') },
  { id: 'image-to-base64', name: t('tools.imageToBase64'), category: t('categories.fileTools'), icon: Image, component: FileImage, description: t('toolDescriptions.imageToBase64') },
  { id: 'file-hash', name: t('tools.fileHash'), category: t('categories.fileTools'), icon: Hash, component: HashGenerator, description: t('toolDescriptions.fileHash') },
  { id: 'image-cropper', name: t('tools.imageCropper'), category: t('categories.fileTools'), icon: Scissors, component: FileImage, description: t('toolDescriptions.imageCropper') },
  { id: 'watermark-generator', name: t('tools.watermarkGenerator'), category: t('categories.fileTools'), icon: Image, component: FileImage, description: t('toolDescriptions.watermarkGenerator') },
  { id: 'pdf-merger', name: t('tools.pdfMerger'), category: t('categories.fileTools'), icon: FileText, component: FileImage, description: t('toolDescriptions.pdfMerger') },
  { id: 'pdf-splitter', name: t('tools.pdfSplitter'), category: t('categories.fileTools'), icon: FileText, component: FileImage, description: t('toolDescriptions.pdfSplitter') },
  { id: 'image-optimizer', name: t('tools.imageOptimizer'), category: t('categories.fileTools'), icon: Image, component: FileImage, description: t('toolDescriptions.imageOptimizer') },
  { id: 'file-size-calculator', name: t('tools.fileSizeCalculator'), category: t('categories.fileTools'), icon: HardDrive, component: Calculator, description: t('toolDescriptions.fileSizeCalculator') },
  { id: 'duplicate-file-finder', name: t('tools.duplicateFileFinder'), category: t('categories.fileTools'), icon: Search, component: FileImage, description: t('toolDescriptions.duplicateFileFinder') },
  { id: 'file-renamer', name: t('tools.fileRenamer'), category: t('categories.fileTools'), icon: Edit3, component: FileImage, description: t('toolDescriptions.fileRenamer') },
  { id: 'image-editor', name: t('tools.imageEditor'), category: t('categories.fileTools'), icon: Image, component: FileImage, description: t('toolDescriptions.imageEditor') },
  { id: 'pdf-password-remover', name: t('tools.pdfPasswordRemover'), category: t('categories.fileTools'), icon: Lock, component: FileImage, description: t('toolDescriptions.pdfPasswordRemover') },
  { id: 'file-converter-hub', name: t('tools.fileConverterHub'), category: t('categories.fileTools'), icon: RefreshCw, component: FileImage, description: t('toolDescriptions.fileConverterHub') },

  // MISCELLANEOUS TOOLS (20 tools)
  { id: 'random-generator', name: t('tools.randomGenerator'), category: t('categories.miscellaneous'), icon: Shuffle, component: RandomGenerator, description: t('toolDescriptions.randomGenerator') },
  { id: 'decision-maker', name: t('tools.decisionMaker'), category: t('categories.miscellaneous'), icon: Brain, component: RandomGenerator, description: t('toolDescriptions.decisionMaker') },
  { id: 'countdown-timer', name: t('tools.countdownTimer'), category: t('categories.miscellaneous'), icon: Timer, component: Timer, description: t('toolDescriptions.countdownTimer') },
  { id: 'url-shortener', name: t('tools.urlShortener'), category: t('categories.miscellaneous'), icon: Link, component: FileText, description: t('toolDescriptions.urlShortener') },
  { id: 'website-speed-test', name: t('tools.websiteSpeedTest'), category: t('categories.miscellaneous'), icon: Zap, component: Timer, description: t('toolDescriptions.websiteSpeedTest') },
  { id: 'ip-address-generator', name: t('tools.ipAddressGenerator'), category: t('categories.miscellaneous'), icon: Globe, component: RandomGenerator, description: t('toolDescriptions.ipAddressGenerator') },
  { id: 'domain-name-generator', name: t('tools.domainNameGenerator'), category: t('categories.miscellaneous'), icon: Globe, component: RandomGenerator, description: t('toolDescriptions.domainNameGenerator') },
  { id: 'bmr-calculator', name: t('tools.bmrCalculator'), category: t('categories.miscellaneous'), icon: Heart, component: Calculator, description: t('toolDescriptions.bmrCalculator') },
  { id: 'calorie-calculator', name: t('tools.calorieCalculator'), category: t('categories.miscellaneous'), icon: Activity, component: Calculator, description: t('toolDescriptions.calorieCalculator') },
  { id: 'water-intake', name: t('tools.waterIntake'), category: t('categories.miscellaneous'), icon: Droplets, component: Calculator, description: t('toolDescriptions.waterIntake') },
  { id: 'sleep-calculator', name: t('tools.sleepCalculator'), category: t('categories.miscellaneous'), icon: Moon, component: Timer, description: t('toolDescriptions.sleepCalculator') },
  { id: 'weather-converter', name: t('tools.weatherConverter'), category: t('categories.miscellaneous'), icon: Cloud, component: UnitConverter, description: t('toolDescriptions.weatherConverter') },
  { id: 'recipe-calculator', name: t('tools.recipeCalculator'), category: t('categories.miscellaneous'), icon: ChefHat, component: Calculator, description: t('toolDescriptions.recipeCalculator') },
  { id: 'cooking-timer', name: t('tools.cookingTimer'), category: t('categories.miscellaneous'), icon: Timer, component: Timer, description: t('toolDescriptions.cookingTimer') },
  { id: 'unit-price-comparator', name: t('tools.unitPriceComparator'), category: t('categories.miscellaneous'), icon: Calculator, component: Calculator, description: t('toolDescriptions.unitPriceComparator') },
  { id: 'discount-calculator', name: t('tools.discountCalculator'), category: t('categories.miscellaneous'), icon: Percent, component: Calculator, description: t('toolDescriptions.discountCalculator') },
  { id: 'grade-calculator', name: t('tools.gradeCalculator'), category: t('categories.miscellaneous'), icon: GraduationCap, component: Calculator, description: t('toolDescriptions.gradeCalculator') },
  { id: 'gpa-calculator', name: t('tools.gpaCalculator'), category: t('categories.miscellaneous'), icon: GraduationCap, component: Calculator, description: t('toolDescriptions.gpaCalculator') },
  { id: 'lottery-generator', name: t('tools.lotteryGenerator'), category: t('categories.miscellaneous'), icon: Gift, component: RandomGenerator, description: t('toolDescriptions.lotteryGenerator') },
  { id: 'password-strength-tester', name: t('tools.passwordStrengthTester'), category: t('categories.miscellaneous'), icon: Shield, component: PasswordStrengthChecker, description: t('toolDescriptions.passwordStrengthTester') },
  
  // ADDITIONAL TOOLS (5 new tools)
  { id: 'qr-code-scanner', name: t('tools.qrCodeScanner'), category: t('categories.fileTools'), icon: QrCode, component: FileImage, description: t('toolDescriptions.qrCodeScanner') },
  { id: 'color-blindness-test', name: t('tools.colorBlindnessTest'), category: t('categories.colorAndDesign'), icon: Eye, component: ColorBlindnessSimulator, description: t('toolDescriptions.colorBlindnessTest') },
  { id: 'text-to-morse', name: t('tools.textToMorse'), category: t('categories.textAndWriting'), icon: FileText, component: TextCleaner, description: t('toolDescriptions.textToMorse') },
  { id: 'emoji-picker', name: t('tools.emojiPicker'), category: t('categories.textAndWriting'), icon: Star, component: TextCleaner, description: t('toolDescriptions.emojiPicker') },
  { id: 'password-generator-advanced', name: t('tools.passwordGeneratorAdvanced'), category: t('categories.textAndWriting'), icon: Settings, component: PasswordGenerator, description: t('toolDescriptions.passwordGeneratorAdvanced') }
];

// Enhanced categories function
const getCategories = (tools: any[], t: any) => [
  { name: t('categories.textAndWriting'), icon: FileText, color: 'text-primary', count: tools.filter(tool => tool.category === t('categories.textAndWriting')).length, translationKey: 'landing.categories.textWriting' },
  { name: t('categories.conversion'), icon: Globe, color: 'text-secondary', count: tools.filter(tool => tool.category === t('categories.conversion')).length, translationKey: 'landing.categories.conversion' },
  { name: t('categories.financialCalculator'), icon: Calculator, color: 'text-green-600', count: tools.filter(tool => tool.category === t('categories.financialCalculator')).length, translationKey: 'landing.categories.financial' },
  { name: t('categories.colorAndDesign'), icon: Palette, color: 'text-accent', count: tools.filter(tool => tool.category === t('categories.colorAndDesign')).length, translationKey: 'landing.categories.colorDesign' },
  { name: t('categories.productivity'), icon: CheckSquare, color: 'text-blue-600', count: tools.filter(tool => tool.category === t('categories.productivity')).length, translationKey: 'landing.categories.productivity' },
  { name: t('categories.fileTools'), icon: FileIcon, color: 'text-purple-600', count: tools.filter(tool => tool.category === t('categories.fileTools')).length, translationKey: 'landing.categories.fileTools' },
  { name: t('categories.miscellaneous'), icon: Shuffle, color: 'text-orange-600', count: tools.filter(tool => tool.category === t('categories.miscellaneous')).length, translationKey: 'landing.categories.miscellaneous' }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [advancedSearch, setAdvancedSearch] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('rabwa-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('rabwa-theme');
    return saved === 'dark';
  });
  const { t, language } = useLanguage();
  
  // Get tools with translations
  const tools = getTools(t);
  
  // Get categories with tool counts
  const categories = getCategories(tools, t);

  // Sync language with cookies on page load
  useEffect(() => {
    // Check cookies first, then localStorage backup
    let savedLanguage = Cookies.get('rabwa-language');
    
    if (!savedLanguage) {
      // Fallback to localStorage backup
      savedLanguage = localStorage.getItem('rabwa-language-backup');
    }
    
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      const lang = savedLanguage;
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
      document.body.style.direction = dir;
    }
  }, []);




  const filteredTools = useMemo(() => {
    let filtered = tools.filter(tool => {
      // Category filter - هذا هو الجزء المهم!
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      
      // If no search term, just filter by category
      if (!searchTerm.trim()) {
        return matchesCategory;
      }
      
      // Smart search with multiple criteria
      const searchLower = searchTerm.toLowerCase();
      const nameLower = tool.name.toLowerCase();
      const descLower = tool.description.toLowerCase();
      const categoryLower = tool.category.toLowerCase();
      
      // Exact matches get highest priority
      if (nameLower === searchLower || descLower === searchLower) {
        return matchesCategory;
      }
      
      // Starts with search term
      if (nameLower.startsWith(searchLower) || descLower.startsWith(searchLower)) {
        return matchesCategory;
      }
      
      // Contains search term in name, description, or category
      let matchesSearch = nameLower.includes(searchLower) ||
                         descLower.includes(searchLower) ||
                         categoryLower.includes(searchLower);
      
      // Advanced search: also search in keywords and related terms
      if (advancedSearch && searchLower.length > 2) {
        // Split search into words for better matching
        const searchWords = searchLower.split(/\s+/).filter(word => word.length > 1);
        
        // Check if all search words are found in any field
        const allWordsMatch = searchWords.every(word => 
          nameLower.includes(word) ||
          descLower.includes(word) ||
          categoryLower.includes(word)
        );
        
        if (allWordsMatch) {
          matchesSearch = true;
        }
        
        // Fuzzy search for similar words
        const fuzzyMatch = searchWords.some(word => {
          const wordLength = word.length;
          const minLength = Math.max(3, Math.floor(wordLength * 0.7));
          
          return nameLower.split(/\s+/).some(nameWord => 
            nameWord.length >= minLength && 
            (nameWord.includes(word) || word.includes(nameWord))
          );
        });
        
        if (fuzzyMatch) {
          matchesSearch = true;
        }
      }
      
      return matchesSearch && matchesCategory;
    });

    // Sort tools based on selection
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'popularity':
          // Sort by favorites count (if available) or alphabetically
          const aFavorites = favorites.includes(a.id) ? 1 : 0;
          const bFavorites = favorites.includes(b.id) ? 1 : 0;
          if (aFavorites !== bFavorites) {
            return bFavorites - aFavorites;
          }
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, favorites, advancedSearch]);

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

  // Keyboard shortcuts for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Escape to clear search
      if (e.key === 'Escape' && searchTerm) {
        setSearchTerm('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm]);

  const selectedToolData = selectedTool ? tools.find(t => t.id === selectedTool) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/50 dark:from-background dark:via-muted/10 dark:to-muted/20">
      {/* Navigation */}
      <Navbar currentPage="tools" />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t('landing.badge')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('landing.subtitle')} {t('landing.toolsCount')} {t('landing.subtitleEnd')}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-primary">{tools.length}+</div>
              <div className="text-sm text-muted-foreground">{t('common.tools')}</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-secondary">{categories.length}</div>
              <div className="text-sm text-muted-foreground">{t('common.categories')}</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-accent">100%</div>
              <div className="text-sm text-muted-foreground">{t('common.free')}</div>
            </div>
          </motion.div>
        </div>

        {!selectedTool ? (
          <>
            {/* Search and Filters Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl p-6 mb-8 shadow-lg relative z-[100]"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
                {/* Search Input */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    {t('common.search')} {t('common.tools')}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder={t('common.search') + ' ' + t('common.tools').toLowerCase() + '...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Smart Search Suggestions */}
                    {searchTerm && searchTerm.length > 1 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card/90 backdrop-blur-sm border border-border/30 rounded-lg shadow-xl z-[60] max-h-60 overflow-y-auto">
                        {tools
                          .filter(tool => {
                            const searchLower = searchTerm.toLowerCase();
                            const nameLower = tool.name.toLowerCase();
                            const descLower = tool.description.toLowerCase();
                            const categoryLower = tool.category.toLowerCase();
                            
                            return nameLower.includes(searchLower) ||
                                   descLower.includes(searchLower) ||
                                   categoryLower.includes(searchLower);
                          })
                          .slice(0, 8)
                          .map((tool) => (
                            <button
                              key={tool.id}
                              onClick={() => {
                                setSearchTerm(tool.name);
                                setSelectedCategory(tool.category);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/30 last:border-b-0"
                            >
                              <div className="flex items-center gap-3">
                                <tool.icon className="w-5 h-5 text-primary" />
                                <div className="flex-1">
                                  <div className="font-medium text-foreground">{tool.name}</div>
                                  <div className="text-sm text-muted-foreground">{tool.category}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Search Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Category Filter */}
                  <div className="min-w-[200px]">
                    <EnhancedSelect
                      label="Category"
                      options={[
                        { value: 'all', label: 'All Categories', icon: Globe },
                        ...categories.map(category => ({
                          value: category.name,
                          label: category.name,
                          icon: category.icon,
                          count: category.count
                        }))
                      ]}
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      placeholder="Select category"
                      size="md"
                      variant="default"
                    />
                  </div>

                  {/* Sort Options */}
                  <div className="min-w-[180px]">
                    <EnhancedSelect
                      label="Sort By"
                      options={[
                        { value: 'name', label: 'Name (A-Z)', icon: FileText },
                        { value: 'name-desc', label: 'Name (Z-A)', icon: FileText },
                        { value: 'category', label: 'Category', icon: Palette },
                        { value: 'popularity', label: 'Popularity', icon: Star }
                      ]}
                      value={sortBy}
                      onChange={setSortBy}
                      placeholder="Sort by"
                      size="md"
                      variant="default"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-6 bg-card/30 backdrop-blur-sm border border-border/20 rounded-xl"
            >
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedCategory === 'all' ? 'All Tools' : `${selectedCategory} Tools`}
                </h2>
                <p className="text-muted-foreground">
                  Showing {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'all' && ` out of ${tools.filter(t => t.category === selectedCategory).length} total in this category`}
                </p>
              </div>
              
              {selectedCategory !== 'all' && (
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{t('common.categoryFilterActive')}</div>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    ← {t('common.showAll')} {t('common.categories')}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mb-8"
            >
              <div className="bg-card/30 backdrop-blur-sm border border-border/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{t('common.browseByCategory')}</h3>
                  <span className="text-sm text-muted-foreground">
                    {tools.length} {t('common.tools')} {t('common.available')}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {/* All Categories Tab */}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`group relative p-4 rounded-xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                      selectedCategory === 'all'
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-border/30 bg-card/50 hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Globe className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="text-sm font-medium text-foreground">{t('common.categories')}</div>
                    <div className="text-xs text-muted-foreground">{tools.length}+</div>
                    
                    {/* Active Indicator */}
                    {selectedCategory === 'all' && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>

                  {/* Category Tabs */}
                  {categories.map((category, index) => (
                    <motion.button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                        selectedCategory === category.name
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                          : 'border-border/30 bg-card/50 hover:border-primary/50 hover:bg-primary/5'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + (index * 0.05) }}
                    >
                      <div 
                        className="w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <category.icon className="w-4 h-4" style={{ color: category.color }} />
                      </div>
                      <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {t(category.translationKey)}
                      </div>
                      <div className="text-xs text-muted-foreground">{category.count}</div>
                      
                      {/* Active Indicator */}
                      {selectedCategory === category.name && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tools Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={{
                    id: tool.id,
                    name: tool.name,
                    description: tool.description,
                    category: tool.category,
                    icon: tool.icon
                  }}
                  isFavorite={favorites.includes(tool.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={setSelectedTool}
                  className="h-80"
                />
              ))}
            </motion.div>

            {/* No Results */}
            {filteredTools.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16 bg-card/30 backdrop-blur-sm border border-border/20 rounded-2xl"
              >
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('messages.noResults')}</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedCategory !== 'all' 
                    ? `${t('messages.noResults')} ${t('common.in')} "${t(categories.find(c => c.name === selectedCategory)?.translationKey || selectedCategory)}" ${t('common.category')} ${t('common.matching')} "${searchTerm}"`
                    : `${t('messages.noResults')} ${t('common.matching')} "${searchTerm}"`
                  }
                </p>
                <div className="flex gap-2 justify-center">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                    >
                      {t('common.clear')}
                    </button>
                  )}
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
                    >
                      {t('common.showAll')} {t('common.categories')}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          /* Tool Interface */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Tool Header */}
            <div className="flex items-center justify-between bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedTool(null)}
                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold">{selectedToolData ? selectedToolData.name : ''}</h1>
                  <p className="text-muted-foreground">{selectedToolData ? selectedToolData.description : ''}</p>
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
            <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6 shadow-lg">
              {selectedToolData?.component && <selectedToolData.component />}
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;