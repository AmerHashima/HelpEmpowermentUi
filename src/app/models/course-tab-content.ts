export type CourseTabKey =
  | 'exam-simulator' | 'recorded-course' | 'live-course' | 'webinar'
  | 'quiz-game' | 'faq' | 'reviews' | 'certificate-settings';

export interface CertificationDisplaySettings {
  certificate: {
    title: string;
    awardedToLabel: string;
    completionText: string;
    dateLabel: string;
    instructorName: string;
    instructorRole: string;
    hours: number;
    badgeHtml: string;
    providerCode: string;
    website: string;
    logoImage: string;
    partnerLogoImage: string;
    signatureImage: string;
    checkerImage: string;
  };
  examResult: {
    displayMode: 'levels' | 'pass-fail';
    performanceLevelsImage: string;
    showPerformanceLevel: boolean;
    showPassPercentage: boolean;
    showScorePercentage: boolean;
    levels: Array<{
      key: 'aboveTarget' | 'target' | 'belowTarget' | 'improvement';
      nameEn: string;
      nameAr: string;
      minimumPercentage: number;
    }>;
  };
}

export interface LocalizedTabText {
  titlePart1: string;
  titlePart2: string;
  description: string;
}

export interface CourseTabSectionItem {
  name?: string | { en: string; ar: string };
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
  certificationSettings?: CertificationDisplaySettings;
  socialProof?: {
    count: string;
    images: string[];
  };
  quizGame?: {
    availability: 'play-now' | 'coming-soon';
  };
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
