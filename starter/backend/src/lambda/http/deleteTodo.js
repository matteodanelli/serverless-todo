import { deleteTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('http/deleteTodos.js')

export const handler = async (event) => {
  logger.info('Processing event: ', event)
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  await deleteTodo(todoId, userId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  }
}
