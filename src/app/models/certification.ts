// src\app\models\certification.ts

export interface Certification {
  oid?: string,
  courseCode: string,
  courseName: string,
  durationMinutes: number,
  courseDescription: string,
  courseLevelLookupId: string | null,
  courseCategoryLookupId: string | null,
  createdBy: string,
  isActive: boolean,
  questionCount: number,

}

export interface APICertification {
  oid: string,
  courseLevelName: string,
  courseCategoryName: string,
  isActive: boolean,
  courseCode: string,
  courseName: string,
  durationMinutes: number,
  questionCount: number,

  courseDescription: string,
  courseLevelLookupId: string | null,
  courseCategoryLookupId: string | null,
  createdBy: string
  createdAt: string,
  updatedAt: string,
  updatedBy: string
}



export interface courseExam {
  oid?: string,
  courseOid: string,
  courseName: string,
  courseLevelLookupId: string | null,
  courseCategoryLookupId: string | null,
  questionCount?: number,
  durationMinutes?: number,

  isActive: boolean,
  createdBy: string
}

export interface APIExam {
  oid: string,
  courseOid: string,
  courseName: string,
  courseCode: string,
  courseLevelLookupId: string | null,
  courseLevelName: string,
  courseCategoryLookupId: string | null,
  courseCategoryName: string | null,
  isActive: boolean,
  questionCount: number,
  durationMinutes: number,

  createdAt: string,
  createdBy: string,
  updatedAt: string,
  updatedBy: string
}
export interface courseQuestion {
  oid?: string,
  coursesMasterExamOid: string,
  questionText: string,
  questionText_Ar: string,
  questionTypeLookupId: string,
  questionExplination: string,
  questionScore: number,
  questionTypeName?: any,
  orderNo: number,
  isActive: boolean,
  correctAnswer: boolean,
  question: boolean,
  correctChoiceOid: string,
  createdBy: string,
  answers: courseAnswer[]
}
export interface courseAnswer {
  oid?: string,
  questionId?: string,
  answerText: string,
  answerText_Ar: string,
  question_Ask: boolean,
  correctAnswerOid: any,
  isCorrect: boolean,
  orderNo: number,
  createdBy: string
  createdAt?: string
  updatedAt?: string,
  updatedBy?: string
}






export interface APICourseQuestion {
  oid: string,
  coursesMasterExamOid: string,
  examName: string,
  questionText_Ar: string,
  questionText: string,
  questionTypeLookupId: string,
  questionTypeName: string,
  questionExplination: string,
  questionScore: number,
  orderNo: number,
  isActive: boolean,
  correctAnswer: boolean,
  question: boolean,
  correctChoiceOid: string,
  answers: APIAnswer[],
  createdAt: string
  createdBy: string,
  updatedAt: string
  updatedBy: string
}

export interface APIAnswer {
  oid: string
  questionId: string,
  answerText: string,
  answerText_Ar: string,

  question_Ask: boolean,
  isCorrect: boolean,
  correctAnswerOid: any
  orderNo: number,
  createdAt: string,
  createdBy: string,
  updatedAt: string,
  updatedBy: string
}
