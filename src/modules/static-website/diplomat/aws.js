import { generatePolicy } from '../logic'


export const createBucket = (name, { s3 }) => s3.createBucket({
  ACL: 'public-read',
  Bucket: name,
}).promise()


export const emptyBucket = async (bucketName, { s3 }) => {
  const response = await s3.listObjects({
    Bucket: bucketName,
  }).promise()

  const objects = response.Contents

  objects.map(o => s3.deleteObject({
    Bucket: bucketName,
    Key: o.Key,
  }).promise())

  return Promise.all(objects)
}

export const bucketExists = async (bucketName, { s3 }) => {
  try {
    await s3.listObjects({
      Bucket: bucketName,
    }).promise()
    return true
  } catch (err) {
    return false
  }
}

export const deleteBucket = async (bucketName, { force } = { force: false }, { s3 }) => {
  if (force) {
    await emptyBucket(bucketName)
  }
  return s3.deleteBucket({
    Bucket: bucketName,
  }).promise()
}

export const setBucketPolicy = (bucketName, { s3 }) => s3.putBucketPolicy({
  Bucket: bucketName,
  Policy: generatePolicy(bucketName),
}).promise()

export const configureBucketWebsite = async (bucketName, { s3 }) => s3.putBucketWebsite({
  Bucket: bucketName,
  ContentMD5: '',
  WebsiteConfiguration: {
    ErrorDocument: {
      Key: 'index.html',
    },
    IndexDocument: {
      Suffix: 'index.html',
    },
  },
}).promise()

export const configureBucketRedirectWebsite = async (bucketName, destBucketName, { s3 }) => s3.putBucketWebsite({
  Bucket: bucketName,
  WebsiteConfiguration: {
    RedirectAllRequestsTo: {
      HostName: destBucketName,
      Protocol: 'https',
    },
  },
}).promise()


export const uploadFakeWebsite = async (bucketName, fakeWebsite, { s3 }) => s3.putObject({
  Body: fakeWebsite,
  Bucket: bucketName,
  ContentType: 'text/html',
  Key: 'index.html',
  ServerSideEncryption: 'AES256',
}).promise()
