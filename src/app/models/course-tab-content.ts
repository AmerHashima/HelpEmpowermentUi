export type CourseTabKey =
  | 'exam-simulator' | 'recorded-course' | 'live-course' | 'webinar'
  | 'quiz-game' | 'faq' | 'reviews';

export interface LocalizedTabText {
  titlePart1: string;
  titlePart2: string;
  description: string;
}

export interface CourseTabSectionItem {
  title?: string | { en: string; ar: string };
  description?: string | { en: string; ar: string };
  icon?: string;
  imageUrl?: string;
}

export interface CourseTabSection {
  type: string;
  title?: string;
  subtitle?: string;
  id?: string;
  header?: { en: string; ar: string };
  description?: { en: string; ar: string };
  orderNo?: number;
  isEnabled?: boolean;
  items: CourseTabSectionItem[];
}

export interface CourseCustomSection extends CourseTabSection {
  type: 'custom';
  id: string;
  header: { en: string; ar: string };
  description: { en: string; ar: string };
  orderNo: number;
  isEnabled: boolean;
}

export interface CourseTabDocument {
  banner: {
    en: LocalizedTabText;
    ar: LocalizedTabText;
    mediaUrl: string;
    mediaType: 'image' | 'video';
  };
  sections: CourseTabSection[];
}

export interface CourseTabContent {
  oid: string;
  courseCode: string;
  tabKey: CourseTabKey;
  isEnabled: boolean;
  orderNo: number;
  status: 'Draft' | 'Published' | 'Archived';
  content: CourseTabDocument;
  updatedAt?: string;
}
