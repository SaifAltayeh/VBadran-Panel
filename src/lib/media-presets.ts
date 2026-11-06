export type MediaPreset = {
  id: string;
  aspect: number;
  width: number;
  height: number;
  maxMb: number;
  sizeHint: string;
  sizeHintAr: string;
  cropHint: string;
  cropHintAr: string;
};

export const mediaPresets = {
  hero: {
    id: "hero",
    aspect: 16 / 9,
    width: 1920,
    height: 1080,
    maxMb: 5,
    sizeHint: "Recommended 1920×1080 (16:9), JPG/WebP under 5MB.",
    sizeHintAr: "المقاس المقترح 1920×1080 (16:9)، JPG/WebP أقل من 5MB.",
    cropHint: "This cropped area is what visitors see in the homepage hero.",
    cropHintAr: "هذه المنطقة المقصوصة هي ما يراه الزوار في بانر الرئيسية.",
  },
  program: {
    id: "program",
    aspect: 4 / 5,
    width: 1080,
    height: 1350,
    maxMb: 4,
    sizeHint: "Recommended 1080×1350 (4:5), JPG/WebP under 4MB.",
    sizeHintAr: "المقاس المقترح 1080×1350 (4:5)، JPG/WebP أقل من 4MB.",
    cropHint: "This cropped area is what visitors see on program cards.",
    cropHintAr: "هذه المنطقة المقصوصة هي ما يراه الزوار على بطاقات البرامج.",
  },
  transformation: {
    id: "transformation",
    aspect: 4 / 5,
    width: 1080,
    height: 1350,
    maxMb: 4,
    sizeHint: "Recommended 1080×1350 (4:5), JPG/WebP under 4MB.",
    sizeHintAr: "المقاس المقترح 1080×1350 (4:5)، JPG/WebP أقل من 4MB.",
    cropHint: "This cropped area is what visitors see on results photos.",
    cropHintAr: "هذه المنطقة المقصوصة هي ما يراه الزوار في صور النتائج.",
  },
  about: {
    id: "about",
    aspect: 4 / 5,
    width: 1200,
    height: 1500,
    maxMb: 4,
    sizeHint: "Recommended 1200×1500 (4:5), JPG/WebP under 4MB.",
    sizeHintAr: "المقاس المقترح 1200×1500 (4:5)، JPG/WebP أقل من 4MB.",
    cropHint: "This cropped area is what visitors see on the about page.",
    cropHintAr: "هذه المنطقة المقصوصة هي ما يراه الزوار في صفحة من نحن.",
  },
  exercise: {
    id: "exercise",
    aspect: 4 / 5,
    width: 800,
    height: 1000,
    maxMb: 3,
    sizeHint: "Recommended 800×1000 (4:5), JPG/WebP under 3MB.",
    sizeHintAr: "المقاس المقترح 800×1000 (4:5)، JPG/WebP أقل من 3MB.",
    cropHint: "This cropped area is what members see in the exercise library.",
    cropHintAr: "هذه المنطقة المقصوصة هي ما يراه الأعضاء في مكتبة التمارين.",
  },
  videoThumb: {
    id: "videoThumb",
    aspect: 16 / 9,
    width: 1280,
    height: 720,
    maxMb: 3,
    sizeHint: "Recommended 1280×720 (16:9), JPG/WebP under 3MB.",
    sizeHintAr: "المقاس المقترح 1280×720 (16:9)، JPG/WebP أقل من 3MB.",
    cropHint: "This cropped area is the video cover members see before play.",
    cropHintAr: "هذه المنطقة المقصوصة هي غلاف الفيديو الذي يراه الأعضاء قبل التشغيل.",
  },
  testimonial: {
    id: "testimonial",
    aspect: 1,
    width: 800,
    height: 800,
    maxMb: 2,
    sizeHint: "Recommended 800×800 (1:1), JPG/WebP under 2MB.",
    sizeHintAr: "المقاس المقترح 800×800 (1:1)، JPG/WebP أقل من 2MB.",
    cropHint: "This cropped area is what visitors see as the client photo.",
    cropHintAr: "هذه المنطقة المقصوصة هي ما يراه الزوار كصورة العميل.",
  },
  video: {
    id: "video",
    aspect: 16 / 9,
    width: 1280,
    height: 720,
    maxMb: 12,
    sizeHint: "Staging/production: paste a YouTube, Vimeo, or MP4 URL. Local file upload is development-only and is not production storage.",
    sizeHintAr: "للتجربة والإطلاق: الصق رابط يوتيوب أو فيميو أو MP4. رفع الملف محلياً للتطوير فقط وليس تخزيناً للإنتاج.",
    cropHint: "Members watch this video in their portal.",
    cropHintAr: "يشاهد الأعضاء هذا الفيديو في بوابتهم.",
  },
} as const satisfies Record<string, MediaPreset>;

export type MediaPresetKey = keyof typeof mediaPresets;
