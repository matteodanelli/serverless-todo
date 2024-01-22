import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { createLogger } from '../utils/logger.mjs'
import AWSXRay from 'aws-xray-sdk-core'

const logger = createLogger('auth')
const dbClient = DynamoDBDocument.from(
  AWSXRay.captureAWSv3Client(new DynamoDB())
)
const todoTable = process.env.TODO_TABLE

export const getAll = async (userId) => {
  logger.info('Reading all todos of user', { key: userId })
  const all = await dbClient.query({
    TableName: todoTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  })
  return all.Items
}

export const create = async (todo) => {
  logger.info('Create a todo', { key: todo })
  await dbClient.put({
    TableName: todoTable,
    Item: todo
  })
  return todo
}

export const deleteT = async (todo) => {
  logger.info('Delete a todo', { key: todo })
  const deleted = await dbClient.delete({
    TableName: todoTable,
    Key: {
      userId: todo.userId,
      todoId: todo.todoId
    },
    ReturnValues: 'ALL_OLD'
  })
  return deleted
}

export const update = async (todo) => {
  logger.info('Update a todo', { key: todo })
  const updated = await dbClient.update({
    TableName: todoTable,
    Key: {
      userId: todo.userId,
      todoId: todo.todoId
    },
    UpdateExpression:
      'set #task_name = :name, \
                      dueDate = :dueDate, \
                      done = :done',
    ConditionExpression:
      '(#task_name <> :name) or \
                      (dueDate <> :dueDate) or \
                      (done <> :done)',
    ExpressionAttributeValues: {
      ':name': todo.name,
      ':dueDate': todo.dueDate,
      ':done': todo.done
    },
    ExpressionAttributeNames: {
      '#task_name': 'name'
    },
    ReturnValues: 'UPDATED_NEW'
  })
  return updated
}

export const updateAttach = async (attachment) => {
  logger.info('Update attachment', { key: attachment })
  const updated = await dbClient.update({
    TableName: todoTable,
    Key: {
      userId: attachment.userId,
      todoId: attachment.todoId
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachment.attachmentUrl
    },
    ReturnValues: 'UPDATED_NEW'
  })

  return updated
}
