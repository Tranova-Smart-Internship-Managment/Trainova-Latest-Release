import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client (server-side only)
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API routes go here FIRST
  app.post("/api/gemini/analyze-report", async (req, res) => {
    try {
      const { studentName, weekNumber, completedTasks, challenges } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ 
          error: "مفتاح الذكاء الاصطناعي (GEMINI_API_KEY) غير متاح حالياً. يرجى إضافته من الإعدادات." 
        });
      }

      const prompt = `
أنت مشرف أكاديمي خبير ومستشار تدريب ميداني لطلبة جامعات قطاع غزة.
قم بتحليل التقرير الأسبوعي التالي للطالب وتزويده بتقييم مهني وبنّاء:

اسم الطالب: ${studentName}
الأسبوع: الأسبوع رقم ${weekNumber}
المهام المنجزة: ${completedTasks}
التحديات والصعوبات: ${challenges}

يرجى تقديم رد باللغة العربية منسق بـ Markdown الأنيق يتضمن:
1. **تقييم المهام**: تحليل مهني وموضوعي للأعمال التي أنجزها الطالب.
2. **التوجيه الإرشادي للتحديات**: اقتراح حلول ملموسة وعملية للمشاكل والعقبات التي واجهت الطالب.
3. **توصيات للأسبوع القادم**: مهام أو مهارات يفضل التركيز عليها.
4. **الدرجة المقترحة والتقييم**: درجة مقترحة لجودة التقرير من 25 (مثلاً: 24/25) مع تبرير سريع.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error?.message || "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي" });
    }
  });

  app.post("/api/gemini/improve-report", async (req, res) => {
    try {
      const { completedTasks, challenges } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ 
          error: "مفتاح الذكاء الاصطناعي (GEMINI_API_KEY) غير متاح حالياً. يرجى إضافته من الإعدادات." 
        });
      }

      const prompt = `
أنت مساعد ذكاء اصطناعي مخصص لمساعدة الطلاب في كتابة تقارير التدريب الميداني بشكل احترافي وأكاديمي ممتاز.
لديك هذه المسودة الأولية من الطالب:
المهام المنجزة: ${completedTasks || 'لم يحدد مهام واضحة'}
التحديات: ${challenges || 'لم يحدد تحديات واضحة'}

يرجى إعادة صياغة المهام والتحديات بأسلوب علمي، تقني، ومهني يناسب تقرير تدريب جامعي رسمي لجامعات غزة.
اجعل الصياغة باللغة العربية، ومقسمة إلى قسمين واضحين:
1. **المهام المنجزة المصاغة باحترافية**: (نقاط تقنية قوية ومحددة).
2. **التحديات وكيفية التعامل معها**: (نقاط مهنية تظهر قدرة الطالب على التعامل مع الصعوبات).

لا تضف أي مقدمات أو خاتمة خارج هذا التنسيق، لكي يسهل على الطالب نسخها مباشرة.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ improved: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error?.message || "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي" });
    }
  });

  // Vite middleware for development or Static Assets for Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
