<div align="center">

<img src="https://img.shields.io/badge/-%F0%9F%9A%97%20COVOIT%20FRONTEND-0a0a0a?style=for-the-badge&labelColor=0a0a0a" />

### منصة مشاركة الركوب — React 19 + TypeScript + Vite

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-PostCSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/Laravel_Echo-Reverb-FF2D20?style=flat-square&logo=laravel&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/Nginx-SPA-009639?style=flat-square&logo=nginx&logoColor=white&labelColor=0a0a0a" />
</p>

<p>
  <a href="README.md">English</a> &nbsp;|&nbsp; <a href="README.fr.md">Français</a> &nbsp;|&nbsp; 🌐 <strong>العربية</strong>
</p>

</div>

---

<div dir="rtl">

> **تطبيق SPA موجّه للإنتاج** لمنصة مشاركة الركوب. مبني بـ React 19 وTypeScript 5 وVite 7 — يغطي تجربة السائق/الراكب الكاملة: اكتشاف الرحلات، إدارة الحجوزات، أدوات السائق، إعدادات الحساب والدردشة الفورية عبر Laravel Reverb.

---

## 📚 جدول المحتويات

- [✨ نظرة عامة](#-نظرة-عامة)
- [🧱 التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [🗺 الميزات الأساسية](#-الميزات-الأساسية)
- [🏗 المعمارية](#-المعمارية)
- [🔀 التوجيه](#-التوجيه)
- [🧠 الحالة والسياق](#-الحالة-والسياق)
- [🔌 تكامل الواجهة البرمجية](#-تكامل-الواجهة-البرمجية)
- [💬 الدردشة الفورية](#-الدردشة-الفورية)
- [⚙️ متغيرات البيئة](#️-متغيرات-البيئة)
- [🚀 البدء](#-البدء)
- [🛠 سير العمل التطويري](#-سير-العمل-التطويري)
- [📜 السكريبتات المتاحة](#-السكريبتات-المتاحة)
- [📁 هيكل المشروع](#-هيكل-المشروع)
- [🎨 أسلوب التصميم](#-أسلوب-التصميم)
- [🌍 البناء والنشر](#-البناء-والنشر)
- [🔧 استكشاف الأخطاء](#-استكشاف-الأخطاء)

---

## ✨ نظرة عامة

الواجهة الأمامية لـ Covoit هي تطبيق SPA مبني بـ React + TypeScript ومدعوم بـ Vite، ويتمحور حول رحلة المستخدم المسجّل دخوله:

| الخطوة | الوصف |
|---|---|
| 🔐 **المصادقة** | تسجيل الدخول، التسجيل، نسيت كلمة المرور، إعادة التعيين |
| 👤 **إكمال الملف الشخصي** | بوابة إلزامية قبل الدخول إلى التطبيق |
| 🔍 **اكتشاف الرحلات** | البحث عن رحلات متاحة وعرض التفاصيل |
| 🎟 **الحجز والإدارة** | حجز مقاعد، مراجعة وإلغاء الحجوزات |
| 🚗 **القيادة** | نشر رحلات، إدارة الركاب، إلغاء الرحلات |
| 🏠 **الحساب** | تحديث الملف الشخصي ومعلومات المركبة |
| 💬 **الدردشة** | تبادل الرسائل مع السائقين أو الركاب في الوقت الفعلي |

> يفترض التطبيق أن باك-إند Laravel متوافق يعمل. تعتمد عدة سلوكيات على ملفات تعريف الارتباط للجلسة، وعلامات الأذونات، وبث الدردشة، وعقود مسارات الواجهة البرمجية.

---

## 🧱 التقنيات المستخدمة

| التقنية | الإصدار | الدور |
|---|---|---|
| ⚛️ **React** | 19 | إطار عمل الواجهة |
| 🔷 **TypeScript** | 5 | الكتابة الستاتيكية |
| ⚡ **Vite** | 7 | خادم التطوير والحزم |
| 🔀 **React Router DOM** | 7 | التوجيه من جانب العميل |
| 🌐 **Axios** | latest | عميل HTTP |
| 📡 **Laravel Echo** | latest | غلاف عميل WebSocket |
| 🔌 **pusher-js** | latest | نقل المتصفح لـ Reverb |
| 🎨 **Tailwind CSS** | عبر PostCSS | أنماط المرافق |
| ✅ **ESLint** | 9 | فحص الكود |
| 🟩 **Nginx** | latest | خدمة SPA الستاتيكية في النشر |

> **ملاحظات:**
> - Tailwind مُفعَّل عبر توجيهات `@tailwind` في `src/index.css` وتكوين PostCSS
> - لا يوجد ملف تكوين Tailwind في المستودع حالياً
> - لم يُكوَّن أي test runner في `package.json` بعد

---

## 🗺 الميزات الأساسية

```
🔐  المصادقة .............. تسجيل دخول · تسجيل · نسيت المرور · إعادة التعيين
🛡  الحمايات .............. للضيوف فقط · بوابة الملف الشخصي · مبنية على الأذونات
🏠  لوحة التحكم ........... رحلات السائق القادمة · الحجوزات القادمة
🔍  الاكتشاف .............. بحث · نتائج · تفاصيل الرحلة
🎟  الحجوزات .............. حجز مقعد · إلغاء حجز
🚗  أدوات السائق .......... نشر · إدارة · إلغاء · التواصل مع الراكب
👤  الحساب ................ إدارة الملف الشخصي · إدارة المركبة
💬  الدردشة ............... البريد الوارد · محادثة · تحديثات فورية
⚠️  ملاحظات عامة .......... طبقة تحميل · تنبيه خطأ
```

---

## 🏗 المعمارية

يستخدم التطبيق معمارية React خفيفة قائمة على المزودين. لا Redux ولا Zustand ولا React Query — يُعالَج جلب البيانات عبر hooks مخصصة واستدعاءات Axios لكل ميزة.

### التركيب في وقت التشغيل (`src/App.tsx`)

```
LoadingProvider
  └── AxiosInterceptorProvider
        └── AuthProvider
              └── ChatInboxProvider
                    └── GlobalSpinner + GlobalErrorAlert
                          └── AppRouter
```

### مسؤوليات كل طبقة

| الطبقة | المسار | المسؤولية |
|---|---|---|
| 🏛 **بنية التطبيق** | `src/app/` | عملاء Axios، مساعدات أخطاء الواجهة البرمجية، مزود الخطأ العام |
| 🌐 **المزودون** | `src/providers/` | حالة المصادقة، التحميل، inbox الدردشة |
| 🔀 **الموجّه** | `src/router/` | شجرة المسارات وحمايات الوصول |
| 📦 **الميزات** | `src/features/` | وحدات الواجهة البرمجية وأدوات الدردشة الفورية |
| 🧠 **السياق** | `src/context/` | Hooks الصفحة/النطاق وـ React contexts |
| 📄 **الصفحات** | `src/pages/` | مكونات الصفحة على مستوى المسار |
| 🧩 **المكونات** | `src/components/` | التخطيط، الأوليات المشتركة، أقسام الواجهة |
| 🔷 **الأنواع** | `src/types/` | نماذج TypeScript للواجهة البرمجية/النطاق |

---

## 🔀 التوجيه

يُعرَّف التوجيه في `src/router/AppRouter.tsx` باستخدام `BrowserRouter` مع حمايات متداخلة.

### 🔓 المسارات العامة / للضيوف
> ملفوفة بـ `GuestRoute` — تُعيد توجيه المستخدمين المصادَق عليهم بعيداً عن شاشات المصادقة

```
/login
/register
/forgot-password
/reset-password
```

### 👤 مسار إكمال الملف الشخصي
> يُفعَّل عند غياب `first_name` أو `last_name` أو `pseudo` على المستخدم المصادَق عليه

```
/complete-profile
```

### 🔒 المسارات المحمية
> تتطلب مصادقة

```
/home
/find-trip
/find-trip/results
/trips/:tripId
/trips/:tripId/contact-driver
/chat
/chat/:conversationId
```

### 🚗 مسارات السائق
> تتطلب إذن `can_manage_own_trips`

```
/my-trips
/my-trips/new
/my-trips/:tripId
/my-trips/:tripId/contact-passenger/:passengerId
```

### 🎟 مسارات الحجوزات
> تتطلب إذن `can_view_bookings`

```
/bookings
/bookings/:tripId
```

### ⚙️ مسارات الحساب
> تتطلب إذن `can_edit_profile`

```
/my-account
```

> شريط التنقل السفلي واعٍ بالأذونات ولا يعرض سوى الأقسام المتاحة للمستخدم الحالي.

---

## 🧠 الحالة والسياق

### المزودون العامون

| المزود | المسؤولية |
|---|---|
| `AuthProvider` | يحلّ `/auth/me`، يُعيد المحاولة مع `/auth/refresh`، يكشف `status` و`user` و`refreshMe` و`logoutLocal` |
| `LoadingProvider` | يتتبع عدد الطلبات النشطة، يشغّل طبقة التحميل العامة |
| `ChatInboxProvider` | يحمّل المحادثات، يحسب عداد غير المقروء، يستمع للتحديثات الفورية، يُحدِّث بفاصل زمني |
| `ErrorProvider` | يحتفظ بحالة الخطأ العامة لـ `GlobalErrorAlert` |

### Hooks الصفحة/النطاق (`src/context/`)

| الـ Hook | الغرض |
|---|---|
| `useHome` | بيانات لوحة التحكم |
| `useTripResults` / `useTripDetails` | تدفقات اكتشاف الرحلات |
| `useMyTrips` / `usePublishTrip` / `useDriverTripDetails` | سير عمل السائق |
| `useMyBookings` / `useBookingDetails` | سير عمل حجز الراكب |
| `useMyAccount` | إدارة الملف الشخصي + المركبة |
| `useChatConversation` | خيوط الرسائل |
| `useLogin` / `useRegister` | نماذج المصادقة |

### استخدام التخزين

| المخزن | المفتاح | الاستخدام |
|---|---|---|
| `sessionStorage` | `personId` | يُخزَّن بعد تسجيل الدخول — تستخدمه استدعاءات الواجهة البرمجية للشخص/الحساب |
| `localStorage` | refresh token | مُخزَّن بواسطة تدفق تسجيل الدخول لاستمرارية الجلسة |
| `localStorage` | حالة قراءة الدردشة | بيانات وصفية للرسائل غير المقروءة بنطاق جلسة المستخدم |

---

## 🔌 تكامل الواجهة البرمجية

### عميل الواجهة البرمجية الداخلي (`src/app/apiClient.ts`)

- رابط الأساس من `VITE_API_BASE_URL`
- `Content-Type: application/json`
- `withCredentials: true` للمصادقة المبنية على الكوكيز
- إعادة المحاولة تلقائياً عند 401 عبر `/auth/refresh` للنقاط غير المتعلقة بالمصادقة

### عميل الواجهة البرمجية الخارجي (`src/app/externalApiClient.ts`)

عميل Axios ثانٍ بدون بيانات اعتماد، يُستخدَم لـ:

| الخدمة | الرابط |
|---|---|
| 🗺 البحث عن بلدية | `https://geo.api.gouv.fr` |
| 📍 الترميز الجغرافي للعنوان | `https://data.geopf.fr/geocodage/search` |

### وحدات الميزة

```
src/features/
  ├── auth/         authApi.ts · passwordApi.ts
  ├── trips/        tripApi.ts
  ├── person/       personApi.ts
  ├── cars/         carApi.ts
  ├── brands/       brandApi.ts
  ├── chat/         chatApi.ts · chatEcho.ts · chatReadState.ts
  ├── contact/      contactApi.ts
  └── geo/          geoApi.ts
```

### نقاط النهاية المتوقعة من الباك-إند

```
POST   /auth/login · /auth/register · /auth/refresh · /auth/logout
GET    /auth/me
POST   /auth/forgot-password · /auth/reset-password

GET    /persons/:id
GET    /persons/:id/trips-driver · /persons/:id/trips-passenger

GET    /trips · /trips/:id · /trips/:id/person
POST   /trips/:id/contact-driver
POST   /my-trips/:id/contact-passenger/:personId

GET    /cars · /cars/:id · /cars/search
GET    /brands

GET    /conversations · /conversations/:id
POST   /conversations/:id/messages

POST   /broadcasting/auth · /broadcasting/auth-proxy
```

---

## 💬 الدردشة الفورية

تستخدم الدردشة استراتيجية **هجينة من الوقت الفعلي + الاستطلاع الدوري** للمرونة.

### المكدس التقني

| المكوّن | التقنية |
|---|---|
| عميل Echo | `src/features/chat/chatEcho.ts` |
| النقل | `pusher-js` (متوافق مع Reverb) |
| المصادقة | مصادقة القناة الخاصة عبر الباك-إند |

### القنوات

```
chat.user.{personId}          ← تحديثات مستوى البريد الوارد
chat.conversation.{id}        ← رسائل مستوى المحادثة
```

تستمع لأحداث `.chat.message.sent`.

### الاستطلاع الاحتياطي

| النطاق | الفاصل الزمني |
|---|---|
| البريد الوارد | كل **8 ثوانٍ** |
| المحادثة النشطة | كل **5 ثوانٍ** |

### حالة الرسائل غير المقروءة

- محفوظة في `localStorage` بنطاق جلسة المستخدم
- عدادات غير المقروء تظهر في شريط التنقل السفلي
- تُعلَّم كمقروءة عند فتح المحادثة
- بطاقات تنبيه الرسائل الواردة تظهر مؤقتاً

> إذا كان البث غير متاح، يحافظ الاستطلاع على وظيفة الدردشة — لكن المؤشرات الفورية وحالة الاتصال قد لا تعمل كما هو متوقع.

---

## ⚙️ متغيرات البيئة

انسخ من `.env.example` وعدّل حسب بيئتك:

```bash
cp .env.example .env.local
```

| المتغير | مطلوب | الوصف |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ نعم | رابط أساس الواجهة البرمجية للباك-إند |
| `VITE_REVERB_APP_KEY` | ⚡ الوقت الفعلي | مفتاح Reverb العام لـ Laravel Echo |
| `VITE_REVERB_HOST` | ⚡ الوقت الفعلي | اسم مضيف WebSocket (من جانب المتصفح) |
| `VITE_REVERB_PORT` | اختياري | منفذ HTTP/WS المشترك الاحتياطي |
| `VITE_REVERB_WS_PORT` | اختياري | منفذ WebSocket غير TLS الصريح |
| `VITE_REVERB_WSS_PORT` | اختياري | منفذ WebSocket TLS الصريح |
| `VITE_REVERB_SCHEME` | اختياري | `http` أو `https` |

**مثال إعداد محلي:**

```env
VITE_API_BASE_URL=http://covoit.local
VITE_REVERB_APP_KEY=local-key
VITE_REVERB_HOST=covoit.local
VITE_REVERB_PORT=80
VITE_REVERB_WS_PORT=80
VITE_REVERB_WSS_PORT=443
VITE_REVERB_SCHEME=http
```

> استخدم `.env.local` أو `.env` للإعداد المحلي — كلاهما مُدرَج في gitignore.

---

## 🚀 البدء

### المتطلبات المسبقة

- **Node.js** 18+
- **npm** (المستودع يتضمن `package-lock.json`)
- باك-إند متوافق مع عقود الواجهة البرمجية والبث المتوقعة

### تثبيت الاعتمادات

```bash
npm install
```

### تكوين البيئة

```bash
cp .env.example .env.local
# عدّل .env.local ليتناسب مع إعدادك المحلي
```

### تشغيل خادم التطوير

```bash
npm run dev
```

تكوين خادم Vite (`vite.config.ts`):

| الإعداد | القيمة |
|---|---|
| المضيف | `127.0.0.1` |
| المنفذ | `5173` |
| المضيف المسموح به | `covoit.local` |

> إذا كنت تستخدم اسم المضيف `covoit.local`، قم بتكوين `/etc/hosts` والبروكسي المحلي وفقاً لذلك.

---

## 🛠 سير العمل التطويري

```bash
# 1. شغّل الباك-إند/الواجهة البرمجية + خدمات البث
# 2. أنشئ/حدّث .env.local
# 3. ثبّت الاعتمادات
npm install

# 4. شغّل خادم التطوير
npm run dev

# 5. افحص الكود قبل الرفع
npm run lint

# 6. تحقق من الجاهزية للإنتاج
npm run build
```

> ⚠️ لم يُكوَّن أي سكريبت اختبار تلقائي بعد. الـ linting وبناءات الإنتاج هي خطوات التحقق الرئيسية المتاحة في المستودع.

---

## 📜 السكريبتات المتاحة

| الأمر | الوصف |
|---|---|
| `npm run dev` | تشغيل خادم التطوير Vite |
| `npm run build` | تنفيذ `tsc -b && vite build` — فحص TypeScript + الحزمة |
| `npm run lint` | تنفيذ `eslint .` |
| `npm run preview` | خدمة بناء الإنتاج محلياً |

---

## 📁 هيكل المشروع

```
covoit-front/
│
├── public/                     # الأصول الستاتيكية العامة
│
├── src/
│   ├── app/                    # عملاء Axios، مساعدات الأخطاء، مزود الخطأ العام
│   ├── assets/                 # الصور والأصول الستاتيكية للواجهة
│   ├── auth/                   # مساعدات التحقق من إكمال الملف الشخصي
│   │
│   ├── components/
│   │   ├── common/             # أوليات UI قابلة لإعادة الاستخدام ومكونات الملاحظات
│   │   ├── layout/             # هيكل التطبيق وشريط التنقل السفلي
│   │   └── ui/                 # أقسام العرض الموجّهة للميزة
│   │
│   ├── context/                # Hooks الصفحة/النطاق وـ React contexts
│   ├── features/               # وحدات الواجهة البرمجية وأدوات الوقت الفعلي/الدردشة
│   ├── pages/                  # مكونات الصفحة على مستوى المسار
│   ├── providers/              # المزودون طويلو الأمد على مستوى التطبيق
│   ├── router/                 # تكوين المسارات وحمايات الوصول
│   ├── types/                  # نماذج TypeScript للواجهة البرمجية/النطاق
│   │
│   ├── App.tsx                 # تركيب مزودات الجذر
│   ├── bootstrap.ts            # إعداد معترضات Axios للتحميل
│   ├── index.css               # رموز الثيم العام + طبقات Tailwind
│   └── main.tsx                # نقطة دخول التطبيق
│
├── .env.example                # متغيرات Vite البيئية الموثقة
├── eslint.config.js            # تكوين ESLint المسطّح
├── nginx.conf                  # خدمة SPA الستاتيكية (احتياطي try_files)
├── package.json                # السكريبتات والاعتمادات
├── postcss.config.js           # خط أنابيب PostCSS لـ Tailwind + Autoprefixer
└── vite.config.ts              # تكوين خادم التطوير والبناء
```

---

## 🎨 أسلوب التصميم

يجمع التصميم بين **فئات مرافق Tailwind** ونظام رموز تصميم مخصص.

### ما هو موجود حالياً

| العنصر | الوصف |
|---|---|
| 🎨 متغيرات CSS | رموز التصميم العامة في `src/index.css` |
| 🧱 طبقات Tailwind | `base` / `components` / `utilities` عبر توجيهات `@tailwind` |
| 🧩 فئات دلالية | `serene-page-shell`، `serene-card`، `serene-button-primary`، `serene-nav-link` |
| 🔤 أوليات مشتركة | `src/components/common/SerenePrimitives.tsx` |
| 🔡 الخطوط | `Inter` + `Manrope` عبر Google Fonts |

تركّب معظم الصفحات مرافق Tailwind مباشرةً. النظام البصري الشامل مرتكز على خصائص CSS المخصصة ومجموعة صغيرة من فئات المكونات المشتركة — لغة تصميم متسقة بدون مكتبة مكونات منفصلة.

---

## 🌍 البناء والنشر

```bash
npm run build
# المخرج: dist/
```

### ملاحظات النشر

| النقطة | التفاصيل |
|---|---|
| 📦 مجلد المخرج | `dist/` |
| 🌐 توجيه SPA | `nginx.conf` يستخدم `try_files ... /index.html` للاحتياط |
| 🔐 المصادقة | تعتمد على كوكيز الباك-إند، وسياسة CORS، وتكوين الجلسة |
| 📡 الوقت الفعلي | يتطلب البث تكويناً صحيحاً لـ host/port/scheme الخاص بـ Reverb |
| 🏠 النطاق | المثال المحلي يستخدم `covoit.local` مع reverse proxy للواجهة البرمجية + Reverb |

---

## 🔧 استكشاف الأخطاء

### 🔐 تسجيل الدخول ينجح لكن التطبيق يعود لحالة الضيف

يستدعي `AuthProvider` المسار `/auth/me` ويُعيد المحاولة عبر `/auth/refresh`. إذا لم تستمر الجلسة:

- تحقق من إعدادات `SameSite` و`Secure` ونطاق الكوكيز في الباك-إند
- تأكد من أن نطاق الواجهة الأمامية يتطابق مع تكوين CORS والكوكيز في الباك-إند
- `apiClient` يستخدم `withCredentials: true` — يجب أن تمرر headers البروكسي الكوكيز

### 👤 استدعاءات الملف الشخصي/الحساب تفشل بصمت

تقرأ عدة واجهات برمجية للشخص/الحساب `personId` من `sessionStorage`. إذا كانت القيمة غائبة، تفشل ميزات الملف الشخصي والحساب. أعِد تسجيل دخول المستخدم لاستعادة القيمة.

### 💬 الدردشة لا تتحدث في الوقت الفعلي

تحقق بالترتيب التالي:

1. قيم `VITE_REVERB_*` تتطابق مع إعداد WebSocket للباك-إند
2. الباك-إند يكشف `/broadcasting/auth` أو `/broadcasting/auth-proxy`
3. جلسة المتصفح المصادَق عليها صالحة لتفويض القنوات الخاصة
4. مضيف وبروتوكول WebSocket قابلان للوصول من المتصفح

> يستمر inbox والاستطلاع الدوري للمحادثات في العمل إذا كان Reverb غير متاح.

### 🏠 مشاكل مضيف التطوير مع `covoit.local`

يربط `vite.config.ts` الخادم بـ `127.0.0.1:5173` ويسمح بـ `covoit.local` كمضيف. تأكد من:

- `/etc/hosts` (أو ما يعادله) يحلّ `covoit.local` إلى `127.0.0.1`
- الـ reverse proxy يوجّه حركة الواجهة البرمجية و WebSocket بشكل صحيح

### 📦 بناء الإنتاج يفشل

```bash
npm run lint    # التحقق من أخطاء ESLint
npm run build   # فحص TypeScript + حزمة Vite
```

> لم يُكوَّن أي أمر اختبار بعد — lint + build هما خطوات التحقق المتاحة في المستودع.

---

<div align="center">

**صُنع بـ ❤️ بواسطة عبيدة حجو — مطوّر Full Stack**

</div>

</div>