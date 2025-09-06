import { useState, useMemo } from "react";
import { Copy, FileText } from "lucide-react";

export const WordCounter = () => {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const readingTime = Math.ceil(words / 200); // Average reading speed

    return {
      words,
      characters,
      charactersNoSpaces,
      paragraphs,
      sentences,
      readingTime
    };
  }, [text]);

  const copyToClipboard = () => {
    const statsText = `إحصائيات النص:
الكلمات: ${stats.words}
الأحرف: ${stats.characters}
الأحرف (بدون مسافات): ${stats.charactersNoSpaces}
الفقرات: ${stats.paragraphs}
الجمل: ${stats.sentences}
وقت القراءة: ${stats.readingTime} دقيقة`;

    navigator.clipboard.writeText(statsText);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="text-input" className="block text-sm font-medium text-foreground mb-2">
          أدخل نصك
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب أو الصق نصك هنا..."
          className="tool-input h-48 resize-y"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.words}</div>
          <div className="text-sm text-muted-foreground">الكلمات</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-secondary">{stats.characters}</div>
          <div className="text-sm text-muted-foreground">الأحرف</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">{stats.charactersNoSpaces}</div>
          <div className="text-sm text-muted-foreground">الأحرف (بدون مسافات)</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-highlight">{stats.paragraphs}</div>
          <div className="text-sm text-muted-foreground">الفقرات</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.sentences}</div>
          <div className="text-sm text-muted-foreground">الجمل</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-secondary">{stats.readingTime}</div>
          <div className="text-sm text-muted-foreground">دقائق للقراءة</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={copyToClipboard}
          className="btn-primary flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          نسخ الإحصائيات
        </button>
        
        <button
          onClick={() => setText('')}
          className="btn-secondary"
        >
          مسح النص
        </button>
      </div>

      {text && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            تحليل النص
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>متوسط الكلمات في الجملة: {stats.sentences > 0 ? Math.round(stats.words / stats.sentences) : 0}</p>
            <p>متوسط الأحرف في الكلمة: {stats.words > 0 ? Math.round(stats.charactersNoSpaces / stats.words) : 0}</p>
            <p>صعوبة القراءة: {stats.words > 0 && stats.sentences > 0 ? 
              (stats.words / stats.sentences > 20 ? 'معقد' : 
               stats.words / stats.sentences > 15 ? 'متوسط' : 'بسيط') : 'غير متوفر'}</p>
          </div>
        </div>
      )}
    </div>
  );
};