import { accountSchema, loginParamsSchema, signUpParamsSchema, addSurveyParamsSchema, errorSchema, surveysSchema, surveySchema, surveyAnswerSchema, saveSurveyParamsSchema, surveyResultSchema, surveyResultAnswerSchema } from './schemas/index'

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  addSurveyParams: addSurveyParamsSchema,
  error: errorSchema,
  surveys: surveysSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  saveSurveyParams: saveSurveyParamsSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema
}
