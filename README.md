# 🌟 Trainova (منصة ترينوفا)
> **منصة ترينوفا لتنسيق وإدارة التدريب الميداني لجامعات قطاع غزة بالتعاون مع الشركات والمؤسسات المحلية.**

---

## 👩‍💻 Developed By / مطور المنصة
* **Name / الاسم:** Rawan Gamal (روان جمال)
* **Email / البريد الإلكتروني:** rawangamal520@gmail.com
* **Role / الدور:** Full-Stack Web Developer & Designer

---

## 📖 About the Project / عن المشروع
**ترينوفا (Trainova)** هي منصة ويب متطورة ومصممة خصيصاً لتنظيم وتسهيل عملية التدريب الميداني لطلاب كليات الهندسة وتكنولوجيا المعلومات في جامعات قطاع غزة (مثل: **الجامعة الإسلامية بغزة**، **جامعة الأزهر**، و**جامعة الأقصى**)، وتعتبر حلقة وصل رقمية فعالة تربط بين ثلاثة أطراف رئيسية:
1. **الطلاب (Students):** للبحث عن الفرص التدريبية، تقديم الطلبات، تسليم التقارير الأسبوعية ومتابعة التقييمات.
2. **المشرفين الأكاديميين (Academic Supervisors):** لمتابعة حضور الطلاب وتفقد تقاريرهم وتصدير درجاتهم النهائية للجامعة.
3. **مؤسسات التدريب (Training Providers):** مثل شركة جوال، الاتصالات، والشركات التقنية، لعرض الفرص وتقييم المتدربين والتواصل مع المشرفين.

---

## ✨ Features Built / المميزات البرمجية التي تم تطويرها

### 1. 🔑 نظام المصادقة واختيار الأدوار (Multi-Role Authentication)
* واجهة تسجيل دخول وتسجيل حساب جديد باللغتين العربية والإنجليزية.
* دعم ثلاثة أدوار مستخدمين مختلفة مع لوحة تحكم مخصصة لكل دور.
* فحص ذكي وتثبيت لأرقام هواتف غزة وفلسطين بصيغة صحيحة (059, 056, 08).

### 2. 🎓 لوحة تحكم الطالب (Student Dashboard)
* تتبع حالة القبول في الفرص التدريبية والشركة المضيفة.
* مستكشف كامل للفرص التدريبية المتاحة للتقديم.
* نظام تسليم التقارير الأسبوعية بشكل منظم ومراجعة تعليقات المشرفين.
* محادثات فورية ومباشرة (Chat Room) مع المشرف الأكاديمي والشركة المضيفة.

### 3. 👨‍🏫 لوحة تحكم المشرف الأكاديمي (Supervisor Dashboard)
* قائمة بالطلاب تحت إشراف المشرف وحالة تدريبهم الحالية.
* نظام استعراض وتدقيق التقارير الأسبوعية للطلاب مع إمكانية كتابة مراجعات وتغذية راجعة فورية.
* رصد الدرجات النهائية وتصديرها إلكترونياً.
* نظام محادثات للتواصل وتوجيه الطلاب والتنسيق مع الشركات.

### 4. 🏢 لوحة تحكم جهة التدريب (Corporate Provider Dashboard)
* إدارة الفرص التدريبية المتاحة (إضافة وتعديل وحذف الفرص).
* فرز طلبات الطلاب المتقدمين والموافقة أو الرفض مع كتابة الملاحظات.
* نظام تقييم معياري لأداء الطلاب المتدربين (الالتزام، المهارات التقنية، العمل الجماعي).
* غرفة دردشة للتواصل الفوري مع الطلاب والمشرفين.

### 5. 🌐 نظام ثنائي اللغة بالكامل (Full Bi-directional i18n support)
* واجهة تفاعلية داعمة للغتين العربية والإنجليزية مع اتساق تصميمي كامل (RTL & LTR) باستخدام Tailwind CSS ومكتبة Motion للحركات السلسة.

---

## 🛠️ Stack & Technologies / التقنيات المستخدمة
* **Frontend:** React 19, TypeScript
* **Styling:** Tailwind CSS (Modern Theme)
* **Animations:** Motion (Framer Motion)
* **Icons:** Lucide React
* **Build Tool:** Vite

---

## 🚀 How to Run Locally / طريقة التشغيل محلياً

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd trainova
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The application will be served at `http://localhost:3000`*

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## ✍️ Code Craftsmanship & Best Practices
* **TypeScript Types:** Strong type definitions for all core entities (`Student`, `Supervisor`, `Message`, `Report`, etc.) inside `src/types.ts`.
* **State Persistence:** LocalStorage serialization with namespace separation (`trainova_*`) to preserve users' chats, registrations, and grades between browser reloads.
* **Component-Driven Architecture:** Modularity in building dashboard views to keep execution lightweight and scalable.
