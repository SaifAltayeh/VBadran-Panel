export type ProgramFeature = { id: number; text: string };
export type ProgramFaq = { id: number; question: string; answer: string };

export type Program = {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  price: string;
  currency: string;
  duration_weeks: number;
  difficulty: string;
  difficulty_label: string;
  category: string;
  category_label: string;
  goal: string;
  featured_image: string;
  image_alt: string;
  is_featured: boolean;
  includes_nutrition: boolean;
  includes_training: boolean;
  expected_outcome: string;
  who_for: string;
  training_structure: string;
  nutrition_overview: string;
  support_overview: string;
  features: ProgramFeature[];
  faqs: ProgramFaq[];
};

export type PackageFeatures = {
  training_plan: boolean;
  nutrition: boolean;
  weekly_checkins: boolean;
  video_library: boolean;
  coach_support: boolean;
  progress_tracking: boolean;
  program_adjustments: boolean;
  messaging: boolean;
};

export type Package = {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  duration_weeks: number;
  price: string;
  currency: string;
  expected_outcome: string;
  is_highlighted: boolean;
  program_slug: string | null;
  support_label: string;
  features: PackageFeatures;
};

export type Testimonial = {
  id: number;
  client_name: string;
  photo: string;
  quote: string;
  program_name: string;
  rating: number;
  is_featured: boolean;
};

export type Transformation = {
  id: number;
  client_name: string;
  slug: string;
  before_image: string;
  after_image: string;
  cover_image: string;
  image_alt: string;
  duration_weeks: number;
  result_summary: string;
  program_name: string;
  story: string;
  is_featured: boolean;
};

export type Exercise = {
  id: number;
  name: string;
  slug: string;
  description: string;
  video_url: string;
  thumbnail: string;
  image_alt: string;
  muscle_group: string;
  difficulty: string;
  difficulty_label: string;
  instructions: string;
  tips: string;
};

export type WorkoutExercise = {
  id: number;
  order: number;
  sets: string;
  reps: string;
  rest_seconds: number;
  tempo: string;
  notes: string;
  exercise: Exercise;
};

export type Workout = {
  id: number;
  title: string;
  slug: string;
  description: string;
  duration_minutes: number;
  focus: string;
  coach_notes: string;
  warmup: string;
  exercises: WorkoutExercise[];
};

export type ScheduleItem = {
  id: number;
  day_label: string;
  date: string;
  is_rest: boolean;
  status: "upcoming" | "completed" | "rest";
  workout: {
    id: number;
    title: string;
    slug: string;
    duration_minutes: number;
    exercise_count: number;
    focus: string;
  } | null;
};

export type DashboardData = {
  user: { first_name: string; last_name: string; email: string; phone: string };
  program: {
    title: string;
    slug: string;
    start_date: string;
    end_date: string;
    duration_weeks: number;
    current_week: number;
    goal: string;
    progress_percent: number;
    coach_instructions: string;
    nutrition_included: boolean;
    image: string;
  } | null;
  next_workout: ScheduleItem | null;
  week_schedule: ScheduleItem[];
  coach_note: string;
  progress_summary: {
    weight: number | null;
    change: number | null;
    workouts_completed: number;
    consistency: number;
    latest_date: string | null;
  };
  upcoming_checkin: string;
};

export type MyProgram = {
  program: DashboardData["program"];
  coach_note: string;
  schedule: ScheduleItem[];
  description?: string;
  training_structure?: string;
  nutrition_overview?: string;
};

export type Meal = { id: number; name: string; suggestion: string };
export type NutritionDay = { id: number; name: string; meals: Meal[] };
export type NutritionPlan = {
  id: number;
  title: string;
  overview: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fats_g: number | null;
  coach_notes: string;
  download_label: string;
  download_url: string;
  days: NutritionDay[];
  notes: { id: number; body: string }[];
};

export type ProgressEntry = {
  id: number;
  date: string;
  weight: string | number | null;
  body_fat: string | number | null;
  chest: string | number | null;
  waist: string | number | null;
  arms: string | number | null;
  legs: string | number | null;
  notes: string;
};

export type ProgressPhoto = {
  id: number;
  url: string | null;
  caption: string;
  date: string;
};

export type ChatMessage = {
  id: number;
  body: string;
  is_coach: boolean;
  created_at: string;
};

export type MessageThread = {
  coach: { name: string; avatar: string };
  messages: ChatMessage[];
};

export type Purchase = {
  order_number: string;
  title: string;
  status: string;
  amount: string;
  currency: string;
  created_at: string;
};

export type Account = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  goal: string;
  fitness_level: string;
  current_program?: string | null;
  purchases?: Purchase[];
};

export type CheckoutResult = {
  order_number: string;
  title: string;
  email: string;
  full_name: string;
  amount: string;
  currency: string;
  status: string;
  payment?: { provider: string; status: string; detail: string };
};

export type AuthUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff?: boolean;
};

export type AdminOverview = {
  programs: number;
  packages: number;
  transformations: number;
  testimonials: number;
  inquiries: number;
  inquiries_new: number;
  clients: number;
  orders: number;
};

export type AdminProgram = {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  price: string;
  currency: string;
  duration_weeks: number;
  difficulty: string;
  category: string;
  goal: string;
  featured_image: string;
  image_alt: string;
  is_featured: boolean;
  is_active: boolean;
  includes_nutrition: boolean;
  includes_training: boolean;
  expected_outcome: string;
  who_for: string;
  training_structure: string;
  nutrition_overview: string;
  support_overview: string;
};

export type AdminPackage = {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  duration_weeks: number;
  price: string;
  currency: string;
  expected_outcome: string;
  is_highlighted: boolean;
  program: number | null;
  support_label: string;
  training_plan: boolean;
  nutrition: boolean;
  weekly_checkins: boolean;
  video_library: boolean;
  coach_support: boolean;
  progress_tracking: boolean;
  program_adjustments: boolean;
  messaging: boolean;
  order: number;
  is_active: boolean;
};

export type AdminTransformation = {
  id: number;
  client_name: string;
  slug: string;
  before_image: string;
  after_image: string;
  cover_image: string;
  image_alt: string;
  duration_weeks: number;
  result_summary: string;
  program: number | null;
  program_name: string;
  story: string;
  is_featured: boolean;
  order: number;
};

export type AdminTestimonial = {
  id: number;
  client_name: string;
  photo: string;
  quote: string;
  program_name: string;
  rating: number;
  is_featured: boolean;
  order: number;
};

export type AdminInquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  goal: string;
  fitness_level: string;
  program: string;
  message: string;
  status: "new" | "read" | "closed";
  created_at: string;
};

export type AdminClient = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  phone: string;
  goal: string;
};
