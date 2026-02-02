export interface Certification {
  oid?: string,
  courseCode: string,
  courseName: string,
  courseDescription: string,
  courseLevelLookupId: string
  courseCategoryLookupId: string
  createdBy: string
}

export interface APICertification {
  courseLevelName: string,
  courseCategoryName: string,
  isActive: true,
  courseCode: string,
  courseName: string,
  courseDescription: string,
  courseLevelLookupId: string
  courseCategoryLookupId: string
  createdBy: string
  createdAt: string,
  updatedAt: string,
  updatedBy: string
}



export interface courseExam {
  oid?: string,
  courseOid: string,
  courseName: string,
  courseLevelLookupId: string,
  courseCategoryLookupId: string,
  isActive: boolean,
  createdBy: string
}

export interface APIExam {
  oid: string,
  courseOid: string,
  courseName: string,
  courseCode: string,
  courseLevelLookupId: string,
  courseLevelName: string,
  courseCategoryLookupId: string,
  courseCategoryName: string,
  isActive: boolean,
  questionCount: number,
  createdAt: string,
  createdBy: string,
  updatedAt: string,
  updatedBy: string
}
export interface courseQuestion {
  oid?: string,
  coursesMasterExamOid: string,
  questionText: string,
  questionTypeLookupId: string,
  questionScore: number,
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
  answerText: string,
  isCorrect: boolean,
  orderNo: number,
  createdBy: string
}


export interface APICourseQuestion {
  oid: string,
  coursesMasterExamOid: string,
  examName: string,
  questionText: string,
  questionTypeLookupId: string,
  questionTypeName: string,
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
  isCorrect: boolean,
  orderNo: number,
  createdAt: string,
  createdBy: string,
  updatedAt: string,
  updatedBy: string
}
