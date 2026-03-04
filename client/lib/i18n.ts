export type Language = "en" | "te" | "ur";

type Messages = Record<string, string>;

const en: Messages = {
  "nav.services": "Services",
  "nav.complaint": "Complaint",
  "nav.login": "Login",
  "nav.adminDashboard": "Admin Dashboard",
  "hero.badge": "PRAJA PALANA",
  "hero.title": "Public Connect",
  "hero.subtitle":
    "Apply for Rythu Bandhu, Aasara Pensions, Kalyana Lakshmi, and other government schemes easily.",
  "home.applyForScheme": "Apply for Scheme",
  "home.applicationStatus": "Application Status",
  "home.raiseComplaint": "Raise Complaint",
  "home.availableServices": "Available Services",
  "home.noServices": "No services found matching your search.",
  "login.title": "Citizen Login",
  "login.mobileNumber": "Mobile Number",
  "login.sendOtp": "Send OTP",
  "login.forTesting": "For Testing",
  "login.testLogin": "Test Login (Skip OTP)",
  "login.adminLogin": "Login as Admin (Officer)",
  "login.orContinueWith": "Or continue with",
  "login.google": "Sign in with Google",
  "login.enterOtp": "Enter OTP",
  "login.verifyLogin": "Verify & Login",
  "login.changeNumber": "Change Number",
};

const te: Messages = {
  "nav.services": "సేవలు",
  "nav.complaint": "ఫిర్యాదు",
  "nav.login": "లాగిన్",
  "nav.adminDashboard": "అధికారి డ్యాష్‌బోర్డు",
  "hero.badge": "ప్రజా పాలన",
  "hero.title": "పబ్లిక్ కనెక్ట్",
  "hero.subtitle":
    "రైతు బంధు, ఆసరా పెన్షన్, కళ్యాణ లక్ష్మి ఇంకా ఇతర ప్రభుత్వ పథకాలకు సులభంగా దరఖాస్తు చేయండి.",
  "home.applyForScheme": "పథకానికి దరఖాస్తు",
  "home.applicationStatus": "దరఖాస్తు స్థితి",
  "home.raiseComplaint": "ఫిర్యాదు నమోదు",
  "home.availableServices": "అందుబాటులో ఉన్న సేవలు",
  "home.noServices": "మీ వెతుకులాటకు సరిపడే సేవలు లభించలేదు.",
  "login.title": "పౌరుల లాగిన్",
  "login.mobileNumber": "మొబైల్ నంబర్",
  "login.sendOtp": "OTP పంపు",
  "login.forTesting": "పరీక్ష కోసం",
  "login.testLogin": "టెస్ట్ లాగిన్ (OTP లేకుండా)",
  "login.adminLogin": "అధికారి లాగిన్",
  "login.orContinueWith": "లేదా ఇలా కొనసాగండి",
  "login.google": "Google తో సైన్ ఇన్ అవ్వండి",
  "login.enterOtp": "OTP నమోదు చేయండి",
  "login.verifyLogin": "తనిఖీ చేసి లాగిన్ అవ్వండి",
  "login.changeNumber": "నంబర్ మార్చండి",
};

const ur: Messages = {
  "nav.services": "سروسز",
  "nav.complaint": "شکایت",
  "nav.login": "لاگ اِن",
  "nav.adminDashboard": "ایڈمن ڈیش بورڈ",
  "hero.badge": "پراجا پالنا",
  "hero.title": "پبلک کنیکٹ",
  "hero.subtitle":
    "رِیتھو بندھو، آسرا پنشن، کلیانہ لکشمی اور دیگر سرکاری اسکیموں کے لیے آسانی سے درخواست دیں۔",
  "home.applyForScheme": "اسکیم کے لیے درخواست دیں",
  "home.applicationStatus": "درخواست کی حیثیت",
  "home.raiseComplaint": "شکایت درج کریں",
  "home.availableServices": "دستیاب سروسز",
  "home.noServices": "آپ کی تلاش سے کوئی سروس نہیں ملی۔",
  "login.title": "شہری لاگ اِن",
  "login.mobileNumber": "موبائل نمبر",
  "login.sendOtp": "او ٹی پی بھیجیں",
  "login.forTesting": "ٹیسٹنگ کے لیے",
  "login.testLogin": "ٹیسٹ لاگ اِن (بغیر او ٹی پی)",
  "login.adminLogin": "ایڈمن (آفیسر) لاگ اِن",
  "login.orContinueWith": "یا جاری رکھیں",
  "login.google": "Google کے ساتھ سائن اِن کریں",
  "login.enterOtp": "او ٹی پی درج کریں",
  "login.verifyLogin": "تصدیق اور لاگ اِن",
  "login.changeNumber": "نمبر تبدیل کریں",
};

const messagesByLang: Record<Language, Messages> = {
  en,
  te,
  ur,
};

export function t(language: Language | null, key: string): string {
  const lang = language ?? "en";
  const table = messagesByLang[lang] || messagesByLang.en;
  return table[key] ?? messagesByLang.en[key] ?? key;
}

