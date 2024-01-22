import { updateTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('http/updateTodos.js')

export const handler = async (event) => {
  logger.info('Processing event: ', event)
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updatedTodo = await updateTodo(todoId, JSON.parse(event.body), userId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      updatedTodo
    })
  }
}
