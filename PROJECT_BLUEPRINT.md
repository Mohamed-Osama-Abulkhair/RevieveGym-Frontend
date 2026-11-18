# 📋 الدستور المعماري للمشاريع البرمجية (Full-Stack Blueprint & Standards)

هذا الملف يمثل المرجع الشامل والدستور البرمجي الثابت لطريقة العمل المعتمدة في بناء المشاريع وتطوير الواجهات الخلفية (`Backend`) والأمامية (`Frontend`)، ويمكن تزويد هذا الملف للذكاء الاصطناعي أو أي مطور برمجيات مع بداية أي مشروع جديد للالتزام التام بذات النمط، النظافة، السرعة، ومعايير الكاش والفالديشن والتصميم.

---

## 🏛️ 1. المبادئ الهندسية الأساسية (Core Philosophy)

1. **فصل الواجهة الأمامية عن الخلفية:**
   - تطبيق الواجهة الخلفية (`Backend`) يكون مستقلاً تماماً ومبنياً كواجهة برمجة تطبيقات (`RESTful API`).
   - تطبيق الواجهة الأمامية (`Frontend`) يكون تطبيقاً أحادي الصفحة (`SPA`) مبنياً بواسطة `Angular`.
2. **البساطة والوضوح (KISS & DRY):**
   - كتابة كود نظيف، مقروء، ومباشر دون طبقات تعقيد لا حاجة لها.
   - الاعتماد على دوال المصنع (`Factory Handlers`) لتفادي تكرار عمليات (`CRUD`).
3. **مصدر وحيد وموثوق للبيانات (Single Source of Truth):**
   - استخراج وتدقيق قيم الطلبات في الباك أند من مصدر موحد دون استخدام الرموز البديلة العشوائية (`||`).
   - منع الفحص اليدوي للأنواع (`Zero manual type-checking`) داخل المتحكمات (`Controllers`) والاعتماد الكلي على الفاليديشن الصارم.
4. **الفاليديشن الصارم والقيم الافتراضية:**
   - مخططات التحقق (`Joi Validation`) لا تحتوي إطلاقاً على قيم افتراضية (`.default()`).
   - القيم الافتراضية مكانها الحصري داخل سكيمات `Mongoose` فقط.

---

## ⚙️ 2. هندسة الواجهة الخلفية (Backend Architecture)

### 2.1 التقنيات المعتمدة (Tech Stack)
- **بيئة التشغيل:** `Node.js (ES Modules: "type": "module")`
- **إطار العمل:** `Express.js`
- **قاعدة البيانات:** `MongoDB` عبر مكتبة `Mongoose`
- **التحقق من البيانات:** `Joi`
- **المصادقة والتشفير:** `jsonwebtoken` و `bcrypt`
- **رفع وضغط الملفات:** `multer` و `cloudinary` و `file-type`
- **الأداء والأمان:** `compression` و `cors` و `morgan` و `dotenv`

### 2.2 هيكل المجلدات المعتمد (Backend Folder Structure)
```text
RevieveGym-Backend/
├── .env.example
├── .gitignore
├── package.json
├── server.js
├── index.routes.js
├── databases/
│   ├── dbConnection.js
│   └── models/
│       ├── user.model.js
│       ├── token.model.js
│       ├── tokenSession.model.js
│       ├── plan.model.js
│       ├── subscription.model.js
│       └── attendance.model.js
└── src/
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── plan.controller.js
    │   ├── subscription.controller.js
    │   └── token.controller.js
    ├── routers/
    │   ├── auth.router.js
    │   ├── user.router.js
    │   ├── plan.router.js
    │   ├── subscription.router.js
    │   └── token.router.js
    ├── validations/
    │   ├── shared.validation.js
    │   ├── auth.validation.js
    │   ├── user.validation.js
    │   └── plan.validation.js
    ├── services/
    └── utils/
        ├── appError.js
        ├── ApiFeatures.js
        ├── factory.handler.js
        ├── queryByRole.handler.js
        ├── token.js
        ├── variables.js
        └── middleware/
            ├── catchAsyncError.js
            ├── commonGlobalMiddleware.js
            ├── fileUpload.js
            ├── globalErrorMiddleware.js
            ├── protectFuns.js
            └── validation.js
```

### 2.3 القواعد الأساسية في الباك أند
- **معالجة الأخطاء غير المتزامنة (`catchAsyncError`):**
  كل متحكم أو دالة مسار يجب تغليفها بدالة `catchAsyncError` لتمرير أي خطأ إلى `next(err)` تلقائياً دون الحاجة إلى كتل `try/catch` متكررة.
- **فئة الخطأ المخصصة (`appError`):**
  إنشاء وتمرير الأخطاء باستخدام `new appError(message, statusCode)`.
- **معالج الأخطاء العام (`globalErrorMiddleware`):**
  يميز بين بيئة التطوير (`development`) لإظهار مصفوفة التتبع (`stack`) وبيئة الإنتاج (`production`) لإرسال رسالة مختصرة واضحة، مع معالجة خاصة لأخطاء `Mongoose` الشائعة (`CastError` و `ValidationError`).
- **تنظيف المدخلات (`sanitizeMiddleware`):**
  فحص محتويات `req.body` و `req.query` لمنع أي مفاتيح خبيثة تبدأ بـ `$` أو تحتوي على `__proto__` أو `constructor`.
- **متحكم الفاليديشن العام (`validation(schema)`):**
  دمج المدخلات في كائن واحد:
  ```javascript
  let inputs = { ...req.body, ...req.params, ...req.query };
  ```
  وفي حال وجود خطأ يتم تنظيف علامات التنصيص المزدوجة وإرجاع رسالة واضحة للمستخدم بكود `400`.
- **ميزات واجهة الاستعلام المتقدمة (`ApiFeatures`):**
  تحتوي على التصفح والترقيم (`paginate`)، الترتيب (`sort`)، التصفية المتقدمة (`filter`)، البحث النصي (`search`)، اختيار الحقول (`fields`)، والتعبئة بالبيانات المرتبطة (`populate`).
- **دوال المصنع العامة (`factory.handler.js`):**
  استخدام الدوال الجاهزة مثل `getAllDocuments` و `getOne` و `createOne` و `updateOne` و `softDeleteOne` و `countAllDocuments` لاختصار كتابة العمليات المتكررة بنسبة 90%.
- **نظام التوكن وتجديد الجلسات (`Refresh Token Rotation`):**
  استخدام `accessToken` ذي مدة قصيرة مع `refreshToken` مخزن في جدول `tokenModel` وتتبع الجلسات النشطة في `tokenSessionModel` مع التحقق من صلاحية المستخدم وحالته (`active`, `deleted`)، وتاريخ آخر تغيير لكلمة المرور (`passwordChangedAt`).

---

## 🎨 3. هندسة الواجهة الأمامية (Frontend Architecture)

### 3.1 التقنيات المعتمدة (Tech Stack)
- **إطار العمل:** `Angular 19+ (Standalone Components)`
- **المكتبات الرسومية والأيقونات:** `Tailwind CSS v3.4+` و `@fortawesome/fontawesome-free`
- **التفاعل وإدارة الحالة:** إشارات أنجولار الحديثة (`Angular Signals: signal, computed, effect`)
- **الاتصال بالخادم:** `HttpClient` مع نظام المعترضات الحديث (`HttpInterceptorFn`)

### 3.2 هيكل المجلدات المعتمد (Frontend Folder Structure)
```text
RevieveGym-Frontend/
├── angular.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── public/
│   ├── favicon.ico
│   └── images/
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css
    ├── environments/
    │   ├── environment.ts
    │   └── environment.prod.ts
    └── app/
        ├── app.config.ts
        ├── app.routes.ts
        ├── app.component.ts
        ├── app.component.html
        ├── app.component.css
        ├── core/
        │   ├── guards/
        │   │   └── auth.guard.ts
        │   ├── handlers/
        │   │   └── global-error.handler.ts
        │   ├── interceptors/
        │   │   ├── auth.interceptor.ts
        │   │   ├── cache.interceptor.ts
        │   │   └── error.interceptor.ts
        │   ├── models/
        │   │   ├── api-response.model.ts
        │   │   ├── common.model.ts
        │   │   └── user.model.ts
        │   ├── services/
        │   │   ├── all-common.services.ts
        │   │   ├── auth.service.ts
        │   │   ├── http-cache.service.ts
        │   │   ├── toast.service.ts
        │   │   ├── theme.service.ts
        │   │   └── confirm-dialog.service.ts
        │   └── utils/
        │       └── phone.utils.ts
        ├── shared/
        │   ├── components/
        │   │   ├── navbar/
        │   │   ├── footer/
        │   │   ├── toast/
        │   │   ├── confirm-modal/
        │   │   ├── loading-spinner/
        │   │   ├── empty-state/
        │   │   ├── pagination/
        │   │   └── scroll-to-top/
        │   └── directives/
        │       └── scroll-animate.directive.ts
        ├── admin/
        └── pages/
            ├── home/
            ├── login/
            └── profile/
```

### 3.3 نظام الكاش الفائق في الذاكرة (In-Memory HTTP Cache System)
هذا النظام يعد الركيزة الأساسية للسرعة الخارقة في التطبيق وتفادي تكرار طلبات الشبكة:
1. **الخدمة المركزية (`HttpCacheService`):**
   - تعتمد على بنية `Map<string, CacheEntry>` لتخزين استجابات `GET` في ذاكرة المتصفح السريعة (`RAM`).
   - تدعم تحديد مدة الصلاحية (`TTL`) وتعيين الوسوم (`Tags`).
   - توفر إمكانية الحذف الانتقائي بالوسم (`invalidateTag`) أو بالمطابقة النصية (`invalidateMatching`).
2. **المعترض الذكي (`cacheInterceptor`):**
   - يعترض جميع طلبات `GET`: في حال وجود نسخة حديثة في الذاكرة، يتم إرجاعها فوراً في زمن قدره `0ms`.
   - يستثني تلقائياً المسارات الحساسة الخاصة بالمستخدم (`/auth/`, `/users/`, `/login`, إلخ).
   - يقوم بالتفريغ التلقائي للوسوم المعنية فور حدوث أي تعديل (`POST`, `PUT`, `DELETE`).
   - مدد البقاء المعتمدة (`TTL`):
     - البيانات شبه الثابتة (مثل الباقات والأنواع): 15 دقيقة (`15 * 60 * 1000`).
     - البيانات المتغيرة (مثل قوائم المشتركين والحصص): 5 دقائق (`5 * 60 * 1000`).
     - التقييمات والمراجعات: 3 دقائق (`3 * 60 * 1000`).

### 3.4 معترض المصادقة والتجديد الصامت (`authInterceptor`)
- يلحق التوكن تلقائياً في الترويسات (`Headers: Authorization: Bearer <token>`).
- في حال استلام خطأ انتهاء التوكن (`401` أو `403`):
  يقوم فوراً بطلب تجديد التوكن عبر مسار `/tokens` باستخدام `refreshToken` ثم إعادة إرسال الطلبات المعلقة بسلاسة دون إخراج المستخدم أو مقاطعته.

### 3.5 نظام التصميم والعرض العربي (Design System & RTL Standards)
- **الاتجاه والخطوط:**
  الصفحة تعمل بالكامل بالاتجاه من اليمين لليسار (`direction: rtl`) باستخدام خطوط عربية حديثة وأنيقة مثل `Cairo` و `Almarai`.
- **توحيد حقول الإدخال (`Global Form Controls`):**
  الاعتماد على الكلاسات الموحدة في ملف `styles.css` لجميع عناصر الإدخال:
  - العناوين: كلاس `form-label` بخط عريض وواضح.
  - الحقول: كلاس `form-input` بحواف ناعمة (`rounded-xl`) وظل خفيف مع دعم التنسيق للوضع الليلي والنهاري.
  - إيقاف أزرار الفأرة والأسهم على حقول الأرقام لمنع التغيير غير المقصود.
- **نظام التنبيهات (`ToastService`):**
  عرض إشعارات تفاعلية بخيارات متعددة (`success`, `error`, `info`, `warning`) تدعم الإيقاف المؤقت عند تمرير مؤشر الفأرة (`pause on hover`).
- **الوضع الليلي (`Dark Mode`):**
  دعم تبديل الوضع الليلي والنهاري بسلاسة عبر كلاس `dark` وألوان متناسقة ومريحة للعين.

---

## 🏋️‍♂️ 4. دليل مشروع الجيم المعتمد (RevieveGym Context)

### 4.1 السايكل الميدانية المقترحة للجيم (Gym Business Cycle)
1. **المشتركون والعملاء (`Members / Users`):**
   - تسجيل بيانات العضو (الاسم، الهاتف، هاتف الطوارئ، تاريخ الميلاد، باركود / رمز العضو، صورة شخصية، وتاريخ الانضمام).
2. **باقات الاشتراك (`Membership Plans`):**
   - أنواع الاشتراكات المتاحة (شهرية، ربع سنوية، نصف سنوية، سنوية، أو بعدد حصص محددة).
   - سعر الباقة، مدتها بالأيام، عدد الحصص، وأي خدمات إضافية (متابعة مدرب، ساونا، جاكوزي).
3. **الاشتراكات الفعلية (`Subscriptions`):**
   - ربط العضو بالباقة المختارة.
   - تاريخ البداية وتاريخ الانتهاء.
   - المبلغ الإجمالي، المبلغ المدفوع، والمبلغ المتبقي.
   - حالة الاشتراك الحالية: نشط (`active`)، منتهي (`expired`)، مجمد (`frozen`)، أو ملغي (`cancelled`).
4. **تسجيل الحضور والدخول (`Attendance & Check-Ins`):**
   - تسجيل دخول العضو يومياً عبر قراءة الباركود أو رقم الهاتف.
   - التحقق اللحظي من صلاحية اشتراكه وعدد الحصص المتبقية.
5. **المدربون والحصص التدريبية (`Trainers & Classes`):**
   - بيانات المدربين، حصص التدريب الخاص (`Personal Training / PT`)، والحصص الجماعية.
6. **المالية والمصروفات الإضافية (`Finances & Bar Sales`):**
   - متابعة الإيرادات والمصروفات اليومية ومبيعات المشروبات والمكملات إن وجدت داخل الجيم.

---

## 🚀 5. خطوات بدء أي مشروع جديد بهذا النمط

عند بدء أي مشروع جديد مستقبلاً، قم بتزويد الذكاء الاصطناعي بهذا الملف ثم طلب:
1. إنشاء بنية مجلدات الباك أند والفرونت أند بنفس التسميات والتقسيمات الموضحة.
2. تثبيت الحزم المعتمدة في ملفي `package.json` للمشروعين.
3. نسخ ملفات الأدوات الأساسية (`ApiFeatures`, `factory.handler`, `middleware`, `http-cache`, `interceptors`).
4. البدء بتعريف الموديلات الخاصة بالمشروع الجديد وتوليد المسارات والمتحكمات والفاليديشن المتوافقة مع هذا الدستور.
