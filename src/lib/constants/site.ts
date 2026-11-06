export const site = {
  name: "Badran",
  email: "Badranbay@gmail.com",
  phoneDisplay: "+965 550 71251",
  phoneHref: "tel:+96555071251",
  whatsapp: "https://wa.me/96555071251",
  instagram: "https://www.instagram.com/vbadrann/",
  youtube: "https://www.youtube.com/@vbadran",
  snapchat: "https://www.snapchat.com/@vbadranv",
  tiktok: "https://www.tiktok.com/@o9wr",
  description:
    "Training packages, personal workout plans, and instructional exercise videos from Badran.",
};

export const nav = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/transformations", label: "Transformations" },
  { href: "/faq", label: "FAQ" },
] as const;

export const footerPages = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/transformations", label: "Transformations" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const socials = [
  { href: site.instagram, label: "Instagram" },
  { href: site.youtube, label: "YouTube" },
  { href: site.whatsapp, label: "WhatsApp" },
  { href: site.snapchat, label: "Snapchat" },
  { href: site.tiktok, label: "TikTok" },
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
    title: "Choose your package",
    body: "Choose the gym package that matches where you train.",
    points: ["Spark", "Platinum", "Oxygen"],
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
    body: "Follow your assigned workout plan and the exercise videos for your gym.",
    points: ["Workout plan", "Exercise videos", "Progress"],
  },
  {
    n: "05",
    title: "Stay consistent",
    body: "Keep to the plan written for your package. The videos show how each movement is done.",
    points: ["Plan", "Videos", "Consistency"],
  },
];

export const reasons = [
  { n: "01", title: "Personalized programming", body: "Sessions are written for your level, equipment, and the week you actually have." },
  { n: "02", title: "Exercise videos", body: "Each package includes instructional videos for the gym you train at." },
  { n: "03", title: "Three gyms", body: "Packages are written for Spark, Platinum, and Oxygen, with videos that match that gym." },
  { n: "04", title: "Structured progress", body: "Weeks are sequenced. You always know the session, the intent, and what comes next." },
  { n: "05", title: "Video training library", body: "Each movement has a reference for setup, tempo, and the mistakes to avoid." },
  { n: "06", title: "Personal workout plan", body: "After your package is confirmed, a workout plan is assigned to your account." },
];

export const faqs = [
  {
    q: "Who are these programs for?",
    a: "Adults who want a training package, a personal workout plan, and exercise videos for Spark, Platinum, or Oxygen.",
  },
  {
    q: "Can beginners join?",
    a: "Yes. The workout plan is written for your level and the gym you train at.",
  },
  {
    q: "Do I need a gym?",
    a: "Packages are for Spark, Platinum, and Oxygen. Choose the gym where you train.",
  },
  {
    q: "Does this include nutrition?",
    a: "No. Badran offers training packages, personalized workout plans, and exercise videos.",
  },
  {
    q: "How long are the programs?",
    a: "Most blocks run 8, 12, or 16 weeks. You will see the length on the program and on the package before you pay.",
  },
  {
    q: "Can I train from home?",
    a: "Packages are gym-based. Choose Spark, Platinum, or Oxygen.",
  },
  {
    q: "How do I receive my plan?",
    a: "After payment is confirmed, your workout plan and exercise videos appear in your member account.",
  },
  {
    q: "How do the videos and plan work?",
    a: "You follow the assigned plan and watch the exercise videos for your package.",
  },
  {
    q: "How do I contact Badran?",
    a: "Contact is through the website contact form, email, or the listed social channels. The member account is for your plan and videos.",
  },
  {
    q: "What happens after payment?",
    a: "The order stays pending until payment is confirmed. Then your plan and videos are assigned.",
  },
];

export const values = [
  { title: "Precision", body: "The right dose of work. Not the most work." },
  { title: "Consistency", body: "A week you can repeat beats a week you survive once." },
  { title: "Honesty", body: "Progress is measured." },
  { title: "Adaptation", body: "Travel, stress, and soreness are part of the program, not a failure of it." },
];

export const aboutHome = {
  en: {
    label: "About us",
    title: "Built in the gym. Written for your week.",
    paragraphs: [
      "Badran offers training packages, personal workout plans, and instructional exercise videos.",
      "Each member receives a plan assigned to them, with videos that match their package and gym.",
    ],
    action: "Read the story",
    principles: [
      { title: "Precision", body: "The right dose of work. Not the most work." },
      { title: "Consistency", body: "A week you can repeat beats a week you survive once." },
      { title: "Honesty", body: "Progress is measured." },
    ],
  },
  ar: {
    label: "من نحن",
    title: "بُني في الصالة. كُتب لأسبوعك.",
    paragraphs: [
      "يقدّم بدران باقات تدريب، وخطط تمارين شخصية، وفيديوهات تعليمية للتمارين.",
      "يحصل كل مشترك على خطة مخصّصة له، مع فيديوهات تناسب باقته وصالته.",
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
  { key: "video_library", label: "Video library" },
];
