import { Responder as ResponseHandler, ResponseBody } from '@caldwell619/common-aws-actions'

export const stitchSchema = (...schemas: string[]): string => {
  return schemas.reduce((accumulator, currentValue) => accumulator + '\n' + currentValue, '')
}

export const waitForMs = (msToWait: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve), msToWait
  })

const corsUrl = (process.env.CORS_URL as string) || '*'
const httpMethod = (process.env.HTTP_METHOD as string) || 'POST'
const Responder = new ResponseHandler({ corsUrl, httpMethod })

export const respond = async <Body>(body: Body, statusCode: number): Promise<ResponseBody> => {
  return Responder.respond(body, statusCode)
}
