export type TeacherUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  photo_url: string;
  role: "STUDENT" | "TEACHER";
};

export type DashboardSummary = {
  total_students: number;
  total_exams: number;
  active_exams: number;
  inactive_exams: number;
  total_attempts: number;
};

export type ChartMonthItem = {
  month: string;
  total_students: number;
};

export type ChartDailyLoginsItem = {
  date: string;
  total_logins: number;
};

export type Paginated<T> = {
  count: number;
  total_pages: number;
  current_page: number;
  next: number | null;
  previous: number | null;
  results: T[];
};

export type Topic = {
  id: string;
  name: string;
  exams_count?: number;
};

export type Exam = {
  id: string;
  title: string;
  description: string;
  topic: string;
  topic_name: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  recommended_age_min: number | null;
  recommended_age_max: number | null;
  is_active: boolean;
  is_diagnostic: boolean;
  questions_count: number;
  created_at: string;
  updated_at: string;
};

export type QuestionOption = {
  id?: string;
  label: string;
  position: "LEFT" | "RIGHT";
  is_correct: boolean;
  order: number;
};

export type Question = {
  id: string;
  exam: string;
  exam_title: string;
  title: string;
  question_text: string;
  spoken_instruction: string;
  spoken_question: string;
  spoken_feedback_correct: string;
  spoken_feedback_incorrect: string;
  order: number;
  is_active: boolean;
  options: QuestionOption[];
  created_at: string;
  updated_at: string;
};

export type StudentListItem = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  attempts_count: number;
  completed_attempts: number;
};

export type StudentAttempt = {
  id: string;
  exam: string;
  exam_title: string;
  started_at: string;
  completed_at: string | null;
  score: number;
  total_questions: number;
  is_completed: boolean;
};

export type StudentAttemptDetail = {
  id: string;
  exam_id: string;
  exam_title: string;
  topic_name: string;
  title: string;
  attempt_type: string;
  score: number;
  total_questions: number;
  percentage: number;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
  answers: Array<{
    id: string;
    question_id: string;
    question_title: string;
    question_text: string;
    selected_option_id: string;
    selected_option_label: string;
    correct_option_id: string | null;
    correct_option_label: string;
    is_correct: boolean;
    answered_at: string;
  }>;
};

export type StudentDetail = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  photo_url: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  stats: {
    total_attempts: number;
    completed_attempts: number;
    average_score: number;
  };
};
