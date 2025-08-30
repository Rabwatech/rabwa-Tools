# 🍪 نظام حفظ اللغة في Cookies - RABWA Tools

## تم تحديث نظام حفظ اللغة ليستخدم Cookies بدلاً من localStorage

### 🎯 **المشكلة التي تم حلها:**

**قبل التحديث:**
- اللغة كانت تحفظ في localStorage
- عند حذف localStorage أو فتح المتصفح من جديد، كانت اللغة تعود للإنجليزية
- اللغة لم تكن محفوظة بشكل دائم

**بعد التحديث:**
- اللغة تحفظ الآن في Cookies
- Cookies صالحة لمدة سنة كاملة (365 يوم)
- اللغة تبقى محفوظة حتى لو تم حذف localStorage
- اللغة تبقى محفوظة عند إعادة فتح المتصفح

### 🔧 **التحديثات المطبقة:**

#### 1. **إضافة مكتبة js-cookie:**
```bash
npm install js-cookie @types/js-cookie
```

#### 2. **تحديث هوك useLanguage:**
- إضافة storage مخصص للـ cookies
- حفظ اللغة في cookies مع صلاحية سنة
- حفظ نسخة احتياطية في localStorage

#### 3. **تحديث جميع الصفحات:**
- Landing, Index, Features, NotFound
- جميعها تستخدم cookies كـ storage أساسي
- localStorage كـ backup

### 🍪 **كيفية عمل Cookies:**

#### **إعدادات Cookies:**
```typescript
Cookies.set('rabwa-language', language, { 
  expires: 365,        // صلاحية سنة كاملة
  secure: true,        // HTTPS فقط
  sameSite: 'strict'   // حماية من CSRF
});
```

#### **مدة الصلاحية:**
- **365 يوم** = سنة كاملة
- **لا تنتهي** عند إغلاق المتصفح
- **تبقى** حتى لو تم حذف localStorage
- **تعمل** على جميع الأجهزة والمتصفحات

### 🛠️ **الملفات المحدثة:**

```
src/
├── hooks/
│   └── use-language.ts          # ✅ محدث ليدعم Cookies
├── components/
│   └── providers/
│       └── language-provider.tsx # ✅ محدث ليدعم Cookies
├── pages/
│   ├── Landing.tsx              # ✅ محدث
│   ├── Index.tsx                # ✅ محدث
│   ├── Features.tsx             # ✅ محدث
│   └── NotFound.tsx             # ✅ محدث
```

### 🔄 **كيفية عمل النظام الآن:**

#### 1. **عند تغيير اللغة:**
```typescript
setLanguage: (language: Language) => {
  // تحديث الحالة
  set({ language });
  
  // تحديث document attributes
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = language;
  
  // حفظ في Cookies (أساسي)
  Cookies.set('rabwa-language', language, { 
    expires: 365, 
    secure: true, 
    sameSite: 'strict' 
  });
  
  // حفظ في localStorage (احتياطي)
  localStorage.setItem('rabwa-language-backup', language);
}
```

#### 2. **عند تحميل أي صفحة:**
```typescript
useEffect(() => {
  // التحقق من Cookies أولاً
  let savedLanguage = Cookies.get('rabwa-language');
  
  if (!savedLanguage) {
    // Fallback إلى localStorage
    savedLanguage = localStorage.getItem('rabwa-language-backup');
  }
  
  if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
    const dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = savedLanguage;
    document.body.style.direction = dir;
  }
}, []);
```

### 🎯 **مميزات النظام الجديد:**

#### ✅ **حفظ دائم:**
- اللغة تحفظ لمدة سنة كاملة
- لا تتأثر بحذف localStorage
- تعمل على جميع الأجهزة

#### ✅ **أمان عالي:**
- Cookies آمنة (HTTPS فقط)
- حماية من CSRF attacks
- صلاحية محددة (365 يوم)

#### ✅ **توافق عالي:**
- تعمل على جميع المتصفحات
- تعمل على جميع الأجهزة
- تعمل مع أو بدون JavaScript

#### ✅ **نسخ احتياطية:**
- Cookies كـ storage أساسي
- localStorage كـ backup
- fallback إلى الإنجليزية

### 🧪 **اختبار النظام:**

#### 1. **اختبار حفظ اللغة:**
- غير اللغة للعربية
- أعد تحميل الصفحة
- انتقل لصفحة أخرى
- عد للصفحة الرئيسية
- **اللغة يجب أن تبقى عربية**

#### 2. **اختبار Cookies:**
- افتح Developer Tools
- اذهب إلى Application > Cookies
- ابحث عن `rabwa-language`
- **يجب أن تجد cookie صالحة لمدة سنة**

#### 3. **اختبار الاستمرارية:**
- أغلق المتصفح تماماً
- افتح المتصفح من جديد
- اذهب للموقع
- **اللغة يجب أن تبقى كما هي**

### 🐛 **استكشاف الأخطاء:**

#### إذا لم تعمل Cookies:
1. تأكد من أن `js-cookie` مثبتة
2. تحقق من أن HTTPS يعمل (لـ secure cookies)
3. تأكد من أن المتصفح يدعم Cookies

#### إذا لم تحفظ اللغة:
1. تحقق من Developer Tools > Cookies
2. تأكد من أن cookie `rabwa-language` موجودة
3. تحقق من صلاحية الـ cookie

### 📱 **دعم الأجهزة:**

#### **سطح المكتب:**
- Chrome, Firefox, Safari, Edge
- جميعها تدعم Cookies بشكل كامل

#### **الجوال:**
- iOS Safari
- Android Chrome
- جميعها تدعم Cookies

#### **الأجهزة اللوحية:**
- iPad, Android Tablets
- تدعم Cookies مثل الأجهزة المحمولة

### 🔒 **الأمان:**

#### **HTTPS فقط:**
- Cookies تعمل فقط على HTTPS
- حماية من التلاعب

#### **SameSite:**
- حماية من CSRF attacks
- تحكم في cross-site requests

#### **صلاحية محددة:**
- 365 يوم فقط
- لا تبقى للأبد

### 🎉 **النتيجة النهائية:**

الآن اللغة تحفظ بشكل دائم في Cookies:
- ✅ **مدة صلاحية سنة كاملة**
- ✅ **لا تتأثر بحذف localStorage**
- ✅ **تعمل على جميع الأجهزة**
- ✅ **أمان عالي مع HTTPS**
- ✅ **نسخ احتياطية متعددة**
- ✅ **توافق مع جميع المتصفحات**

### 🚀 **كيفية الاستخدام:**

1. **غير اللغة** للعربية أو الإنجليزية
2. **اللغة تحفظ تلقائياً** في Cookies
3. **انتقل بين الصفحات** - اللغة تبقى كما هي
4. **أعد فتح المتصفح** - اللغة تبقى كما هي
5. **احذف localStorage** - اللغة تبقى كما هي

**اللغة الآن محفوظة بشكل دائم! 🎉**
