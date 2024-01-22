import { getTodoFileUploadUrl } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('http/generateUploadUrl.js')

export const handler = async (event) => {
  logger.info('Processing event: ', event)
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const uploadUrl = await getTodoFileUploadUrl(todoId, userId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}
