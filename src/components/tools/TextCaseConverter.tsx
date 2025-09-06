import { useState } from "react";
import { Copy, Type, RefreshCw } from "lucide-react";

export const TextCaseConverter = () => {
  const [text, setText] = useState('');

  const conversions = {
    uppercase: text.toUpperCase(),
    lowercase: text.toLowerCase(),
    titleCase: text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ),
    camelCase: text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, ''),
    pascalCase: text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, ''),
    snakeCase: text.toLowerCase().replace(/\s+/g, '_'),
    kebabCase: text.toLowerCase().replace(/\s+/g, '-'),
    constantCase: text.toUpperCase().replace(/\s+/g, '_'),
  };

  const copyToClipboard = (value: string, type: string) => {
    navigator.clipboard.writeText(value);
  };

  const convertions = [
    { name: 'UPPERCASE', key: 'uppercase', description: 'جميع الأحرف كبيرة' },
    { name: 'lowercase', key: 'lowercase', description: 'جميع الأحرف صغيرة' },
    { name: 'Title Case', key: 'titleCase', description: 'الحرف الأول من كل كلمة كبير' },
    { name: 'camelCase', key: 'camelCase', description: 'الكلمة الأولى صغيرة والباقي كبير' },
    { name: 'PascalCase', key: 'pascalCase', description: 'الحرف الأول من كل كلمة كبير' },
    { name: 'snake_case', key: 'snakeCase', description: 'كلمات مفصولة بشرطات سفلية' },
    { name: 'kebab-case', key: 'kebabCase', description: 'كلمات مفصولة بشرطات' },
    { name: 'CONSTANT_CASE', key: 'constantCase', description: 'كلمات مفصولة بشرطات سفلية' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="text-input" className="block text-sm font-medium text-foreground mb-2">
          أدخل النص للتحويل
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب نصك هنا..."
          className="tool-input h-32"
        />
      </div>

      <div className="grid gap-4">
        {convertions.map((conversion) => (
          <div key={conversion.key} className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium text-foreground">{conversion.name}</h3>
                <p className="text-xs text-muted-foreground">{conversion.description}</p>
              </div>
              <button
                onClick={() => copyToClipboard(conversions[conversion.key as keyof typeof conversions], conversion.name)}
                className="p-2 rounded-lg hover:bg-background transition-colors"
                title="نسخ إلى الحافظة"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="bg-background rounded-md p-3 border border-input-border font-mono text-sm">
              {conversions[conversion.key as keyof typeof conversions] || '...'}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setText('')}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          مسح النص
        </button>
      </div>

      {text && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Type className="w-4 h-4" />
            إحصائيات النص
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">الأحرف:</span>
              <span className="ml-2 font-medium text-foreground">{text.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">الكلمات:</span>
              <span className="ml-2 font-medium text-foreground">
                {text.trim() ? text.trim().split(/\s+/).length : 0}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">الأسطر:</span>
              <span className="ml-2 font-medium text-foreground">{text.split('\n').length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">الجمل:</span>
              <span className="ml-2 font-medium text-foreground">
                {text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};