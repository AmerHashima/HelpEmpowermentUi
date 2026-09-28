import { CourseTabContent, CourseTabSection, CourseTabSectionItem } from '../../../../models/course-tab-content';
import enTranslations from '../../../../../assets/i18n/en.json';
import arTranslations from '../../../../../assets/i18n/ar.json';

export const COURSE_CODE_TOKEN = '{{coursecode}}';

const en: any = enTranslations;
const ar: any = arTranslations;

function text(enText: string, arText: string): { en: string; ar: string } {
  return { en: enText, ar: arText };
}

function reviewText(value: string): string {
  return value.replace(/PMP/g, 'CAPM');
}

function item(enItem: any, arItem: any, icon?: string): CourseTabSectionItem {
  return {
    title: text(enItem.title ?? enItem.header ?? '', arItem.title ?? arItem.header ?? ''),
    description: text(enItem.description ?? enItem.text ?? '', arItem.description ?? arItem.text ?? ''),
    ...(icon ? { icon } : {})
  };
}

function section(
  type: string,
  headerEn: string,
  headerAr: string,
  items: CourseTabSectionItem[],
  descriptionEn = '',
  descriptionAr = ''
): CourseTabSection {
  return {
    type,
    header: text(headerEn, headerAr),
    description: text(descriptionEn, descriptionAr),
    isEnabled: true,
    items
  };
}

function banner(sourceEn: any, sourceAr: any, mediaUrl: string) {
  return {
    en: { titlePart1: sourceEn.master, titlePart2: sourceEn.title ?? sourceEn.realisticSimulation ?? '', description: sourceEn.description },
    ar: { titlePart1: sourceAr.master, titlePart2: sourceAr.title ?? sourceAr.realisticSimulation ?? '', description: sourceAr.description },
    mediaUrl,
    mediaType: 'image' as const
  };
}

function courseSections(): CourseTabSection[] {
  const featureKeys = Object.keys(en.courseFeatures.capm.features);
  const outlineEn = en.courseOutlines.capm as string[];
  const outlineAr = ar.courseOutlines.capm as string[];
  const audienceEn = en.targetAudiences.capm as string[];
  const audienceAr = ar.targetAudiences.capm as string[];
  const skillsEn = en.instructor.skills as any[];
  const skillsAr = ar.instructor.skills as any[];
  const certificationsEn = en.instructor.certifications as string[];
  const certificationsAr = ar.instructor.certifications as string[];

  return [
    section('outline', 'Course Outline', 'محتوى الدورة',
      outlineEn.map((title, index) => ({ title: text(title, outlineAr[index] ?? '') }))),
    section('instructorIntro', en.instructor.info, ar.instructor.info,
      [{ title: text(en.instructor.introParagragh, ar.instructor.introParagragh) }]),
    section('instructorSkills', 'Instructor Expertise', 'خبرات المدرب',
      skillsEn.map((skill, index) => item(skill, skillsAr[index], [
        'bi bi-person-badge', 'bi bi-briefcase', 'bi bi-building', 'bi bi-bar-chart'
      ][index]))),
    section('instructorCertifications', 'Instructor Certifications', 'شهادات المدرب',
      certificationsEn.map((title, index) => ({ title: text(title, certificationsAr[index] ?? '') }))),
    section('features', 'Course Features', 'مميزات الدورة',
      featureKeys.map(key => item(en.courseFeatures.capm.features[key], ar.courseFeatures.capm.features[key]))),
    section('targetAudience', 'Target Audience', 'الفئة المستهدفة',
      audienceEn.map((title, index) => ({ title: text(title, audienceAr[index] ?? '') })))
  ];
}

const benefitIcons = [
  'bi bi-arrow-clockwise', 'bi bi-database', 'bi bi-toggles',
  'bi bi-lightbulb', 'bi bi-journal-check', 'bi bi-bar-chart-line',
  'bi bi-infinity', 'bi bi-calendar-check', 'bi bi-headset'
];
const benefitKeys = Object.keys(en.capmBenefits);
const webinarAgendaKeys = ['hour1', 'hour2'];
const faqItems = [1, 2, 3, 4, 5].map(index => ({
  title: text(en.campFaq[`question${index}`], ar.campFaq[`question${index}`]),
  description: text(en.campFaq[`answer${index}`], ar.campFaq[`answer${index}`])
}));

const capmTemplate: CourseTabContent[] = [
  {
    oid: '', courseCode: 'CAPM', tabKey: 'exam-simulator', isEnabled: true, orderNo: 1, status: 'Published',
    content: {
      banner: banner(en.examSimulator.capm, ar.examSimulator.capm, 'assets/images/certification.jpg'),
      sections: [section(
        'benefits', en.examSimulator.everythingYouNeed, ar.examSimulator.everythingYouNeed,
        benefitKeys.map((key, index) => item(en.capmBenefits[key], ar.capmBenefits[key], benefitIcons[index])),
        'Master the CAPM exam with realistic questions designed to ensure your success.',
        'أتقن اختبار CAPM من خلال أسئلة واقعية مصممة لضمان نجاحك.'
      )]
    }
  },
  {
    oid: '', courseCode: 'CAPM', tabKey: 'recorded-course', isEnabled: true, orderNo: 2, status: 'Published',
    content: { banner: banner(en.recordedCourse.capm, ar.recordedCourse.capm, 'assets/images/recordedCourse.jpeg'), sections: courseSections() }
  },
  {
    oid: '', courseCode: 'CAPM', tabKey: 'live-course', isEnabled: true, orderNo: 3, status: 'Published',
    content: { banner: banner(en.liveCourse.capm, ar.liveCourse.capm, 'assets/images/liveCourse/liveCourse.jpeg'), sections: courseSections() }
  },
  {
    oid: '', courseCode: 'CAPM', tabKey: 'webinar', isEnabled: true, orderNo: 4, status: 'Published',
    content: {
      banner: banner(en.webinar.capm, ar.webinar.capm, 'assets/images/webinar/webinar.jpeg'),
      sections: [
        section('agenda', 'Webinar Agenda', 'محاور الويبينار',
          webinarAgendaKeys.map(key => item(en.courseFeatures.capm.webinar[key], ar.courseFeatures.capm.webinar[key]))),
        section('takeAway', 'Key Takeaways', 'أهم النتائج',
          [item(en.courseFeatures.capm.webinar.takeAway, ar.courseFeatures.capm.webinar.takeAway)]),
        section('audience', 'Target Audience', 'الفئة المستهدفة',
          [item(en.courseFeatures.capm.audience, ar.courseFeatures.capm.audience)])
      ]
    }
  },
  {
    oid: '', courseCode: 'CAPM', tabKey: 'quiz-game', isEnabled: true, orderNo: 5, status: 'Published',
    content: { banner: banner(en.quizGame.capm, ar.quizGame.capm, 'assets/images/quizGame/quizGame.jpeg'), sections: [] }
  },
  {
    oid: '', courseCode: 'CAPM', tabKey: 'faq', isEnabled: true, orderNo: 6, status: 'Published',
    content: {
      banner: {
        en: { titlePart1: 'CAPM Frequently Asked Questions', titlePart2: '', description: 'Clear answers to the most common CAPM questions.' },
        ar: { titlePart1: 'الأسئلة الشائعة عن CAPM', titlePart2: '', description: 'إجابات واضحة عن أكثر الأسئلة الشائعة حول CAPM.' },
        mediaUrl: '', mediaType: 'image'
      },
      sections: [section('faq', 'Frequently Asked Questions', 'الأسئلة الشائعة', faqItems)]
    }
  },
  {
    oid: '', courseCode: 'CAPM', tabKey: 'reviews', isEnabled: true, orderNo: 7, status: 'Published',
    content: {
      banner: {
        en: {
          titlePart1: reviewText(en.reviews.masterPmp),
          titlePart2: reviewText(en.reviews.title),
          description: reviewText(en.reviews.description)
        },
        ar: {
          titlePart1: reviewText(ar.reviews.masterPmp),
          titlePart2: reviewText(ar.reviews.title),
          description: reviewText(ar.reviews.description)
        },
        mediaUrl: 'assets/images/reviewers/review.jpeg', mediaType: 'image'
      },
      sections: []
    }
  }
];

// Exact CAPM content, with only the course name/code converted to a token.
export const COURSE_CONTENT_TEMPLATE = JSON.parse(
  JSON.stringify(capmTemplate).replace(/CAPM/g, COURSE_CODE_TOKEN)
) as CourseTabContent[];
