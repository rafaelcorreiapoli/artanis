import AWS from './aws'
import fakeWebsite from '../resources/fake-website'

const s3 = new AWS.S3({ region: 'sa-east-1' });
export default s3


export const generatePolicy = bucketName => JSON.stringify({
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'PublicReadGetObject',
      Effect: 'Allow',
      Principal: '*',
      Action: 's3:GetObject',
      Resource: `arn:aws:s3:::${bucketName}/*`,
    },
  ],
})

export const createBucket = name => s3.createBucket({
  ACL: 'public-read',
  Bucket: name,
  // CreateBucketConfiguration: {
  //   LocationConstraint: location,
  // },
}).promise()

export const emptyBucket = async (bucketName) => {
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

export const bucketExists = async (bucketName) => {
  try {
    await s3.listObjects({
      Bucket: bucketName,
    }).promise()
    return true
  } catch (err) {
    return false
  }
}

export const deleteBucket = async (bucketName, { force } = { force: false }) => {
  if (force) {
    await emptyBucket(bucketName)
  }
  return s3.deleteBucket({
    Bucket: bucketName,
  }).promise()
}

export const setBucketPolicy = bucketName => s3.putBucketPolicy({
  Bucket: bucketName,
  Policy: generatePolicy(bucketName),
}).promise()

export const configureBucketWebsite = async bucketName => s3.putBucketWebsite({
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

export const configureBucketRedirectWebsite = async (bucketName, destBucketName) => s3.putBucketWebsite({
  Bucket: bucketName,
  WebsiteConfiguration: {
    RedirectAllRequestsTo: {
      HostName: destBucketName,
      Protocol: 'https',
    },
  },
}).promise()


export const uploadFakeWebsite = async bucketName => s3.putObject({
  Body: fakeWebsite,
  Bucket: bucketName,
  ContentType: 'text/html',
  Key: 'index.html',
  ServerSideEncryption: 'AES256',
}).promise()
