import { CertificationDisplaySettings } from './course-tab-content';

export function defaultCertificationDisplaySettings(courseCode = ''): CertificationDisplaySettings {
  const code = courseCode.trim().toUpperCase();
  const isCapm = code === 'CAPM';
  return {
    certificate: {
      title: 'Certificate of Attendance',
      awardedToLabel: 'Awarded to:',
      completionText: 'For successfully completing training in:',
      dateLabel: 'Date:',
      instructorName: 'Mahmoud Elhelbawi',
      instructorRole: 'Course Instructor',
      hours: isCapm ? 23 : code === 'PMP' ? 35 : 0,
      badgeHtml: isCapm ? 'CAPM® #182<br>0429' : code === 'PMP' ? 'PMP® #1870<br>023' : '',
      providerCode: '5090',
      website: 'www.HelpEmpowerment.com',
      logoImage: 'assets/images/finishCourse/logo.png',
      partnerLogoImage: 'assets/images/finishCourse/anotherLogo.png',
      signatureImage: 'assets/images/finishCourse/signature.png',
      checkerImage: 'assets/images/finishCourse/checker.png'
    },
    examResult: {
      displayMode: 'levels',
      performanceLevelsImage: '',
      showPerformanceLevel: true,
      showPassPercentage: true,
      showScorePercentage: true,
      levels: [
        { key: 'aboveTarget', nameEn: 'Above Target', nameAr: 'أعلى من المستهدف', minimumPercentage: 83 },
        { key: 'target', nameEn: 'Target', nameAr: 'المستهدف', minimumPercentage: 65 },
        { key: 'belowTarget', nameEn: 'Below Target', nameAr: 'أقل من المستهدف', minimumPercentage: 54 },
        { key: 'improvement', nameEn: 'Needs Improvement', nameAr: 'يحتاج إلى تحسين', minimumPercentage: 0 }
      ]
    }
  };
}
