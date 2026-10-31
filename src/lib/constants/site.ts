export const site = {
  name: "VBADRAN",
  email: "hello@vbadran.com",
  phoneDisplay: "+962 79 000 0000",
  phoneHref: "tel:+962790000000",
  whatsapp: "https://wa.me/962790000000",
  instagram: "https://instagram.com/vbadran",
  tiktok: "https://www.tiktok.com/@vbadran",
  youtube: "https://youtube.com/@vbadran",
  description:
    "Personal training and online coaching from VBADRAN. Programs built around your goals, schedule, and progress.",
};

export const nav = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/transformations", label: "Transformations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
] as const;

export const footerPages = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/transformations", label: "Transformations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const socials = [
  { href: site.instagram, label: "Instagram" },
  { href: site.tiktok, label: "TikTok" },
  { href: site.youtube, label: "YouTube" },
  { href: site.whatsapp, label: "WhatsApp" },
] as const;

export const crops: Record<string, string> = {
  "/images/hero/coach-portrait.jpg": "center 12%",
  "/images/hero/coach-studio.jpg": "center 18%",
  "/images/hero/stage-cinematic.jpg": "70% 10%",
  "/images/about/coach-square.jpg": "center 18%",
  "/images/about/gym-walk.jpg": "center 15%",
  "/images/about/back-gym.jpg": "center 30%",
  "/images/programs/stage-front.jpg": "center 18%",
  "/images/programs/stage-clasp.jpg": "center 16%",
  "/images/programs/stage-back.jpg": "center 22%",
  "/images/programs/trophy.jpg": "center 14%",
  "/images/programs/winners.jpg": "center 45%",
  "/images/programs/stage-side.jpg": "62% 40%",
  "/images/programs/stage-award.jpg": "68% 42%",
  "/images/programs/stage-pose.jpg": "58% 38%",
  "/images/transformations/client-1.jpg": "center",
  "/images/transformations/client-2.jpg": "center",
  "/images/transformations/client-3.jpg": "center",
  "/images/transformations/client-4.jpg": "center",
  "/images/dashboard/coach.jpg": "center 18%",
};

export const process = [
  {
    n: "01",
    title: "Choose your program",
    body: "Start from a clear block. Training, nutrition, or the full system.",
    points: ["Training", "Nutrition", "Full system"],
  },
  {
    n: "02",
    title: "Complete your assessment",
    body: "The plan starts from your week, not from a generic template.",
    points: ["Goals", "Schedule", "Training history"],
  },
  {
    n: "03",
    title: "Receive your plan",
    body: "Sessions, targets, and the first week are set before you begin.",
    points: ["Sessions", "Targets", "First week"],
  },
  {
    n: "04",
    title: "Train and track",
    body: "Follow the work, log what matters, and keep the check-in honest.",
    points: ["Workouts", "Check-ins", "Progress"],
  },
  {
    n: "05",
    title: "Adjust and progress",
    body: "The plan changes when your recovery, calendar, or strength changes.",
    points: ["Recovery", "Calendar", "Strength"],
  },
];

export const reasons = [
  { n: "01", title: "Personalized programming", body: "Sessions are written for your level, equipment, and the week you actually have." },
  { n: "02", title: "Real coach support", body: "Check-ins are read by the coach. Adjustments come from your progress, not a template." },
  { n: "03", title: "Train anywhere", body: "Online coaching works in a commercial gym, a home setup, or while you travel." },
  { n: "04", title: "Structured progress", body: "Weeks are sequenced. You always know the session, the intent, and what comes next." },
  { n: "05", title: "Video training library", body: "Each movement has a reference for setup, tempo, and the mistakes to avoid." },
  { n: "06", title: "Nutrition guidance", body: "Targets and meal structure that fit your life, with room to adjust." },
];

export const faqs = [
  {
    q: "Who are these programs for?",
    a: "Adults who want a clear plan and a coach who will adjust it. Beginners, returning athletes, and people already training are all in the right place if they can commit to the block.",
  },
  {
    q: "Can beginners join?",
    a: "Yes. The assessment sets the starting point. Exercises, volume, and nutrition targets are scaled to where you are, not to a competition stage.",
  },
  {
    q: "Do I need a gym?",
    a: "A gym helps for the strength work. If you train at home, say so in the assessment and the plan is written for the equipment you have.",
  },
  {
    q: "Do programs include nutrition?",
    a: "Nutrition Guidance, Training + Nutrition, Body Transformation, and the Progress, Transform, and Elite packages include it. Training-only options stay focused on the sessions.",
  },
  {
    q: "How long are the programs?",
    a: "Most blocks run 8, 12, or 16 weeks. You will see the length on the program and on the package before you pay.",
  },
  {
    q: "Can I train from home?",
    a: "Yes, when the program is online. Tell us what you have available and the sessions will match it.",
  },
  {
    q: "How do I receive my plan?",
    a: "After payment is confirmed, your account is opened and the program appears in your dashboard: schedule, sessions, and nutrition where included.",
  },
  {
    q: "How does online coaching work?",
    a: "You train with the plan in your dashboard, watch the movement references, and check in on the agreed day. The next week is adjusted from that check-in.",
  },
  {
    q: "Can I communicate directly with the coach?",
    a: "Packages with coach support and messaging include direct messages inside your account, plus the weekly check-in.",
  },
  {
    q: "What happens after payment?",
    a: "The order is confirmed, an account is created if you do not already have one, and the program is assigned. You sign in and start from week one.",
  },
];

export const values = [
  { title: "Precision", body: "The right dose of work. Not the most work." },
  { title: "Consistency", body: "A week you can repeat beats a week you survive once." },
  { title: "Honesty", body: "Progress is measured. The plan changes when the data says so." },
  { title: "Adaptation", body: "Travel, stress, and soreness are part of the program, not a failure of it." },
];

export const aboutHome = {
  en: {
    label: "About us",
    title: "Built in the gym. Written for your week.",
    paragraphs: [
      "VBADRAN is a personal training and online coaching practice. It started from a simple problem: people were training hard and still guessing. Sessions changed every week because nothing was written down, and the food had no relationship to the work.",
      "The coaching is the correction. A block with a point, sessions you can open and follow, and a review that changes the next week instead of repeating the last one. Competition is part of the background. The product is a plan a client can live with on a normal week.",
    ],
    action: "Read the story",
    principles: [
      { title: "Precision", body: "The right dose of work. Not the most work." },
      { title: "Consistency", body: "A week you can repeat beats a week you survive once." },
      { title: "Honesty", body: "Progress is measured. The plan changes when the data says so." },
    ],
  },
  ar: {
    label: "من نحن",
    title: "بُني في الصالة. كُتب لأسبوعك.",
    paragraphs: [
      "VBADRAN ممارسة للتدريب الشخصي والتدريب عن بُعد. بدأت من مشكلة بسيطة: الناس يتدرّبون بجِدّ وما زالوا يخمّنون. الجلسات كانت تتغيّر كل أسبوع لأن شيئاً لم يُكتب، والطعام لم يكن له علاقة بالتمرين.",
      "التدريب هو التصحيح. مرحلة لها هدف، وجلسات تفتحها وتتبعها، ومراجعة تغيّر الأسبوع التالي بدل تكرار الأسبوع السابق. المنافسة جزء من الخلفية. المنتج خطة يعيش معها العميل في أسبوع عادي.",
    ],
    action: "اقرأ القصة",
    principles: [
      { title: "الدقة", body: "الجرعة الصحيحة من العمل. ليست الأكثر." },
      { title: "الاستمرارية", body: "أسبوع تستطيع تكراره أفضل من أسبوع تنجيه مرة واحدة." },
      { title: "الصدق", body: "التقدّم يُقاس. والخطة تتغيّر عندما يقول الرقم ذلك." },
    ],
  },
} as const;

export const packageFeatureLabels: { key: keyof import("@/types").PackageFeatures; label: string }[] = [
  { key: "training_plan", label: "Training plan" },
  { key: "nutrition", label: "Nutrition" },
  { key: "weekly_checkins", label: "Weekly check-ins" },
  { key: "video_library", label: "Video library" },
  { key: "coach_support", label: "Coach support" },
  { key: "progress_tracking", label: "Progress tracking" },
  { key: "program_adjustments", label: "Program adjustments" },
  { key: "messaging", label: "Messaging" },
];
