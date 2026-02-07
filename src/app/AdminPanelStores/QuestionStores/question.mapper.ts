import { APIAnswer, APICourseQuestion, courseAnswer, courseQuestion } from "../../models/certification";


// Single question mapper
export function mapApiQuestionToCourseQuestion(api: APICourseQuestion): courseQuestion {
  return {
    oid: api.oid,
    coursesMasterExamOid: api.coursesMasterExamOid,
    questionText: api.questionText,
    questionTypeLookupId: api.questionTypeLookupId,
    questionScore: api.questionScore,
    questionTypeName: api.questionTypeName,
    orderNo: api.orderNo,
    isActive: api.isActive,
    correctAnswer: api.correctAnswer,
    question: api.question,
    correctChoiceOid: api.correctChoiceOid,
    createdBy: api.createdBy,
    answers: mapApiAnswersToAnswers(api.answers),
  };
}

export function mapApiAnswerToCourseAnswer(api: APIAnswer): courseAnswer {
  return {
    oid: api.oid,
    questionId: api.questionId,
    answerText: api.answerText,
    question_Ask: api.question_Ask,
    correctAnswerOid: api.correctAnswerOid,
    isCorrect: api.isCorrect,
    orderNo: api.orderNo,
    createdBy: api.createdBy,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    updatedBy: api.updatedBy,
  };
}

// Multiple answers mapper
export const mapApiAnswersToAnswers = (answers: APIAnswer[]): courseAnswer[] =>
  answers.map(mapApiAnswerToCourseAnswer);
// Multiple questions mapper
export const mapApiQuestionsToCourseQuestions = (questions: APICourseQuestion[]): courseQuestion[] =>
  questions.map(mapApiQuestionToCourseQuestion);
