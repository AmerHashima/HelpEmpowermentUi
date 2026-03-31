// src\app\models\certification.ts

export interface Certification {
  oid?: string,
  courseCode: string,
  courseName: string,
  durationMinutes: number,
  courseDescription: string,
  courseLevelLookupId: string | null,
  courseCategoryLookupId: string | null,
  createdBy?: string,
  updatedBy?: string,
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
  examName: string,
  courseName: string,
  courseLevelLookupId: string | null,
  courseCategoryLookupId: string | null,
  questionCount?: number,
  durationMinutes?: number,
  orderNo?: number,
  isActive: boolean,
  createdBy: string,
  freeExam:boolean
}

export interface APIExam {
  oid: string,
  courseOid: string,
  examName: string,
  courseName: string,
  courseCode: string,
  courseLevelLookupId: string | null,
  courseLevelName: string,
  courseCategoryLookupId: string | null,
  courseCategoryName: string | null,
  isActive: boolean,
  questionCount: number,
  durationMinutes: number,
  orderNo: number,
  createdAt: string,
  createdBy: string,
  updatedAt: string,
  updatedBy: string,
  freeExam:boolean
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

export interface startStudentExam{
  // studentOid: string ,

  studentOid: string | null,
coursesMasterExamOid: string,
  attemptNo: number,
    createdBy: string| null,
  // createdBy: string

}

export interface APIStudentExamResponse {
  oid:string,
  studentOid: string,
  studentName:string,
  coursesMasterExamOid: string,
  examName: string,
  totalScore:number
  attemptNo: number,
  obtainedScore:number,
  passPercent:number,
  isPassed:boolean,
  examStatusLookupId:string,
  examModeLookupId:string,
  examModeName:string,
  examStatusName:string,
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string | null;
  createdBy: string,
  updatedAt: string,
  updatedBy: string,
  examQuestions: APIStudentExamQuestion[]
  statusSummary: StatusSummary[],
  summary?:{
    correct:number,
    incorrect:number,
    notAnswered:number
  }
}

export interface ExamSummary{
  studentId: string,
  masrterExamId: string
}

export interface APIExamSummary{
  studentExamOid: string,
  studentOid: string,
  studentName: string,
  examName: string,
  attemptNo: number,
  totalScore: number,
  obtainedScore: number,
  percentage: number,
  isPassed: boolean,
  startedAt:string,
  examStatusLookupId:string,
  finishedAt: string,
  totalQuestions: number,
  examModeLookupId: string,
  examModeName: string,
  statusSummary: StatusSummary[]
}
export interface StatusSummary{
  questionStatusLookupId: string,
    statusName: string,
      count: number,
        percentage: number
}

export interface StudentExamQuestion{
  studentExamOid: string,
  questionOid: string,
  selectedAnswerOid: string,
  createdBy: string
}
export interface APIStudentExamQuestion{
  oid: string,
  studentExamOid: string,
  questionOid: string,
  questionText: string,
  selectedAnswerOid: string,
  selectedAnswerText: string,
  isCorrect: boolean,
  questionScore: number,
  obtainedScore: number,
  createdAt: string,
  createdBy: string,
  updatedAt: string,
  updatedBy: string
}

export interface submitStudentExam{
  studentExamOid: string,
  answers: any[],
  updatedBy:string
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

export interface matchingQuestionExamSubmit{

  studentExamOid: string,
    questionOid: string,
      answers: [
        {
          selectedAnswerOid: string,
          answerSelectedAnswerOid: string
        }
      ],
        createdBy: string

}


export interface choiceQuestionExamSubmit {

  studentExamOid: string
  questions: [
    {
      questionOid: string,
      selectedAnswerOids: [
        string
      ]
    }
  ],
  createdBy: string
}


