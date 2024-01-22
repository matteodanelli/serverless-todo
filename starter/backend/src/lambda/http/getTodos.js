import { getAllTodos } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('http/getTodos.js')

export const handler = async (event) => {
  logger.info('Processing event: ', event)
  const userId = getUserId(event)
  const items = await getAllTodos(userId)
  logger.info('Retrieved items', { key: items })
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}
