import { CourseTabContent } from '../../../../models/course-tab-content';

// Keep this token in the reusable content. The editor replaces it with the
// current course code when the administrator loads the template.
export const COURSE_CODE_TOKEN = '{{coursecode}}';

export const COURSE_CONTENT_TEMPLATE: CourseTabContent[] = [
  {
    oid: '', courseCode: COURSE_CODE_TOKEN, tabKey: 'exam-simulator', isEnabled: true,
    orderNo: 1, status: 'Published',
    content: {
      banner: {
        en: { titlePart1: `Master the ${COURSE_CODE_TOKEN}`, titlePart2: 'exam environment', description: `Prepare confidently for the ${COURSE_CODE_TOKEN} exam with realistic practice and detailed feedback.` },
        ar: { titlePart1: `أتقن اختبار ${COURSE_CODE_TOKEN}`, titlePart2: 'في بيئة محاكاة واقعية', description: `استعد بثقة لاختبار ${COURSE_CODE_TOKEN} من خلال تدريب واقعي ونتائج تفصيلية.` },
        mediaUrl: 'assets/images/examSimulator/examSimulator.jpeg', mediaType: 'image'
      },
      sections: [{
        type: 'benefits', header: { en: 'Everything you need to succeed', ar: 'كل ما تحتاجه للنجاح' },
        description: { en: `A complete ${COURSE_CODE_TOKEN} exam preparation experience.`, ar: `تجربة متكاملة للاستعداد لاختبار ${COURSE_CODE_TOKEN}.` },
        isEnabled: true,
        items: [
          { title: { en: 'Realistic practice', ar: 'تدريب واقعي' }, description: { en: 'Practice in an environment close to the real exam.', ar: 'تدرب في بيئة قريبة من الاختبار الحقيقي.' }, icon: 'bi bi-journal-check' },
          { title: { en: 'Detailed feedback', ar: 'نتائج تفصيلية' }, description: { en: 'Understand your strengths and improvement areas.', ar: 'تعرّف على نقاط قوتك وفرص التحسين.' }, icon: 'bi bi-graph-up' }
        ]
      }]
    }
  },
  {
    oid: '', courseCode: COURSE_CODE_TOKEN, tabKey: 'recorded-course', isEnabled: true,
    orderNo: 2, status: 'Published',
    content: {
      banner: {
        en: { titlePart1: `Learn ${COURSE_CODE_TOKEN}`, titlePart2: 'on your schedule', description: `A structured recorded ${COURSE_CODE_TOKEN} course that you can access whenever it suits you.` },
        ar: { titlePart1: `تعلّم ${COURSE_CODE_TOKEN}`, titlePart2: 'في الوقت الذي يناسبك', description: `دورة ${COURSE_CODE_TOKEN} مسجلة ومنظمة يمكنك الوصول إليها في أي وقت.` },
        mediaUrl: 'assets/images/recordedCourse.jpeg', mediaType: 'image'
      },
      sections: [{
        type: 'features', header: { en: 'Course features', ar: 'مميزات الدورة' },
        description: { en: `A flexible path to master ${COURSE_CODE_TOKEN}.`, ar: `مسار مرن لإتقان ${COURSE_CODE_TOKEN}.` }, isEnabled: true,
        items: [
          { title: { en: 'Learn at your own pace', ar: 'تعلّم بالسرعة التي تناسبك' }, description: { en: 'Pause and revisit lessons whenever needed.', ar: 'أوقف الدروس وراجعها وقتما تحتاج.' }, icon: 'bi bi-play-circle' },
          { title: { en: 'Structured learning', ar: 'تعلم منظم' }, description: { en: 'Follow a clear path from fundamentals to exam readiness.', ar: 'اتبع مسارًا واضحًا من الأساسيات حتى الاستعداد للاختبار.' }, icon: 'bi bi-list-check' }
        ]
      }]
    }
  },
  {
    oid: '', courseCode: COURSE_CODE_TOKEN, tabKey: 'live-course', isEnabled: true,
    orderNo: 3, status: 'Published',
    content: {
      banner: {
        en: { titlePart1: `Transform your career with ${COURSE_CODE_TOKEN}`, titlePart2: 'live guidance', description: `Interactive live ${COURSE_CODE_TOKEN} training led by experienced instructors.` },
        ar: { titlePart1: `طوّر مسيرتك مع ${COURSE_CODE_TOKEN}`, titlePart2: 'من خلال تدريب مباشر', description: `تدريب ${COURSE_CODE_TOKEN} مباشر وتفاعلي بقيادة مدربين ذوي خبرة.` },
        mediaUrl: 'assets/images/liveCourse/liveCourse.jpeg', mediaType: 'image'
      },
      sections: [{
        type: 'features', header: { en: 'Live learning experience', ar: 'تجربة تعلم مباشرة' },
        description: { en: 'Learn, discuss, and apply the concepts with your instructor.', ar: 'تعلّم وناقش وطبّق المفاهيم مع مدربك.' }, isEnabled: true,
        items: [
          { title: { en: 'Expert instruction', ar: 'تدريب متخصص' }, description: { en: 'Get direct explanations and answers.', ar: 'احصل على شرح وإجابات مباشرة.' }, icon: 'bi bi-person-video3' },
          { title: { en: 'Interactive sessions', ar: 'جلسات تفاعلية' }, description: { en: 'Participate in discussions and practical activities.', ar: 'شارك في المناقشات والأنشطة العملية.' }, icon: 'bi bi-people' }
        ]
      }]
    }
  },
  {
    oid: '', courseCode: COURSE_CODE_TOKEN, tabKey: 'webinar', isEnabled: true,
    orderNo: 4, status: 'Published',
    content: {
      banner: {
        en: { titlePart1: `Discover ${COURSE_CODE_TOKEN}`, titlePart2: 'in a free live webinar', description: `Understand the ${COURSE_CODE_TOKEN} journey, exam, and next steps in one focused session.` },
        ar: { titlePart1: `اكتشف ${COURSE_CODE_TOKEN}`, titlePart2: 'في ويبينار مباشر مجاني', description: `تعرّف على رحلة ${COURSE_CODE_TOKEN} والاختبار والخطوات التالية في جلسة مركزة.` },
        mediaUrl: 'assets/images/webinar/webinar.jpeg', mediaType: 'image'
      },
      sections: [{
        type: 'agenda', header: { en: 'Webinar agenda', ar: 'محاور الويبينار' },
        description: { en: 'A clear introduction to the certification journey.', ar: 'مقدمة واضحة عن رحلة الحصول على الشهادة.' }, isEnabled: true,
        items: [
          { title: { en: 'Certification overview', ar: 'نظرة عامة على الشهادة' }, description: { en: `Understand the ${COURSE_CODE_TOKEN} requirements and exam format.`, ar: `تعرّف على متطلبات ${COURSE_CODE_TOKEN} ونظام الاختبار.` } },
          { title: { en: 'Your study roadmap', ar: 'خطة مذاكرتك' }, description: { en: 'Leave with practical next steps.', ar: 'اخرج بخطوات عملية واضحة.' } }
        ]
      }]
    }
  },
  {
    oid: '', courseCode: COURSE_CODE_TOKEN, tabKey: 'quiz-game', isEnabled: true,
    orderNo: 5, status: 'Published',
    content: {
      banner: {
        en: { titlePart1: `Level up your ${COURSE_CODE_TOKEN}`, titlePart2: 'knowledge', description: `Reinforce important ${COURSE_CODE_TOKEN} concepts through quick interactive challenges.` },
        ar: { titlePart1: `طوّر معرفتك في ${COURSE_CODE_TOKEN}`, titlePart2: 'من خلال تحديات تفاعلية', description: `ثبّت مفاهيم ${COURSE_CODE_TOKEN} المهمة من خلال تحديات سريعة وتفاعلية.` },
        mediaUrl: 'assets/images/quizGame/quizGame.jpeg', mediaType: 'image'
      },
      sections: []
    }
  },
  {
    oid: '', courseCode: COURSE_CODE_TOKEN, tabKey: 'faq', isEnabled: true,
    orderNo: 6, status: 'Published',
    content: {
      banner: {
        en: { titlePart1: `${COURSE_CODE_TOKEN} frequently asked`, titlePart2: 'questions', description: 'Clear answers to the questions learners ask most.' },
        ar: { titlePart1: `الأسئلة الشائعة عن ${COURSE_CODE_TOKEN}`, titlePart2: '', description: 'إجابات واضحة عن أكثر الأسئلة التي يطرحها المتعلمون.' },
        mediaUrl: '', mediaType: 'image'
      },
      sections: [{
        type: 'faq', header: { en: 'Frequently asked questions', ar: 'الأسئلة الشائعة' },
        description: { en: `Everything you need to know before starting ${COURSE_CODE_TOKEN}.`, ar: `كل ما تحتاج إلى معرفته قبل بدء ${COURSE_CODE_TOKEN}.` }, isEnabled: true,
        items: [
          { title: { en: `What is ${COURSE_CODE_TOKEN}?`, ar: `ما هي ${COURSE_CODE_TOKEN}؟` }, description: { en: 'Add the certification overview here.', ar: 'أضف هنا نبذة عن الشهادة.' } },
          { title: { en: 'Who is this course for?', ar: 'لمن تناسب هذه الدورة؟' }, description: { en: 'Add the target audience and prerequisites here.', ar: 'أضف هنا الفئة المستهدفة والمتطلبات.' } }
        ]
      }]
    }
  },
  {
    oid: '', courseCode: COURSE_CODE_TOKEN, tabKey: 'reviews', isEnabled: true,
    orderNo: 7, status: 'Published',
    content: {
      banner: {
        en: { titlePart1: `${COURSE_CODE_TOKEN} learner`, titlePart2: 'reviews', description: 'See what learners say about their experience.' },
        ar: { titlePart1: `آراء متعلمي ${COURSE_CODE_TOKEN}`, titlePart2: '', description: 'تعرّف على آراء المتعلمين حول تجربتهم.' },
        mediaUrl: 'assets/images/reviewers/review.jpeg', mediaType: 'image'
      },
      sections: []
    }
  }
];
