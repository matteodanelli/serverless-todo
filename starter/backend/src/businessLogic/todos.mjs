import { createLogger } from '../utils/logger.mjs'
import * as uuid from 'uuid'
import {
  getAll,
  create,
  deleteT,
  update,
  updateAttach
} from '../dataLayer/todosAccess.mjs'
import {
  getUploadUrl,
  getAttachmentUrl
} from '../fileStorage/attachmentUtils.mjs'

const logger = createLogger('businessLogic/todos.mjs')

export const getAllTodos = async (userId) => {
  return getAll(userId)
}

export const createTodo = async (createTodoRequest, userId) => {
  logger.info('Create action', { key: userId })
  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const newTodo = {
    userId,
    todoId,
    createdAt,
    done: false,
    dueDate: createTodoRequest.dueDate,
    attachmentUrl: '',
    name: createTodoRequest.name
  }
  return await create(newTodo)
}

export const updateTodo = async (todoId, updateTodoRequest, userId) => {
  logger.info('Update action', { key: todoId })
  return await update({
    todoId,
    userId,
    ...updateTodoRequest
  })
}

export const deleteTodo = async (todoId, userId) => {
  logger.info('Delete action', { key: todoId })
  return await deleteT({
    todoId,
    userId
  })
}

export const getTodoFileUploadUrl = async (todoId, userId) => {
  logger.info('Get upload url action', { key: `${todoId} - ${userId}` })

  // const fileId = uuid.v4()
  const uploadUrl = await getUploadUrl(todoId)
  const attachmentUrl = await getAttachmentUrl(todoId)
  await updateAttach({
    userId,
    todoId,
    attachmentUrl
  })

  return uploadUrl
}
