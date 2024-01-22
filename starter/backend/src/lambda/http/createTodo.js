import { createTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('http/createTodos.js')

export const handler = async (event) => {
  logger.info('Processing event: ', event)
  const newTodoBody = JSON.parse(event.body)
  const userId = getUserId(event)
  const newTodo = await createTodo(newTodoBody, userId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newTodo
    })
  }
}
