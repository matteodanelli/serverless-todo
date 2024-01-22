import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'

const s3Client = AWSXRay.captureAWSv3Client(new S3Client())
const bucketName = process.env.ATTACHMENTS_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10)

export const getUploadUrl = async (fileId) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileId
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })
  return url
}

export const getAttachmentUrl = async (id) => {
  return `https://${bucketName}.s3.amazonaws.com/${id}`
}
