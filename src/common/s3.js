import AWS from './aws'
import fakeWebsite from '../resources/fake-website'

const s3 = new AWS.S3({ region: 'sa-east-1' });

// export default ({ s3 }) => {
//   const generatePolicy = bucketName => JSON.stringify({
//     Version: '2012-10-17',
//     Statement: [
//       {
//         Sid: 'PublicReadGetObject',
//         Effect: 'Allow',
//         Principal: '*',
//         Action: 's3:GetObject',
//         Resource: `arn:aws:s3:::${bucketName}/*`,
//       },
//     ],
//   })
//
//   const createBucket = name => s3.createBucket({
//     ACL: 'public-read',
//     Bucket: name,
//   }).promise()
//
//   const emptyBucket = async (bucketName) => {
//     const response = await s3.listObjects({
//       Bucket: bucketName,
//     }).promise()
//
//     const objects = response.Contents
//
//     objects.map(o => s3.deleteObject({
//       Bucket: bucketName,
//       Key: o.Key,
//     }).promise())
//
//     return Promise.all(objects)
//   }
//
//   const bucketExists = async (bucketName) => {
//     try {
//       await s3.listObjects({
//         Bucket: bucketName,
//       }).promise()
//       return true
//     } catch (err) {
//       return false
//     }
//   }
//
//   const deleteBucket = async (bucketName, { force } = { force: false }) => {
//     if (force) {
//       await emptyBucket(bucketName)
//     }
//     return s3.deleteBucket({
//       Bucket: bucketName,
//     }).promise()
//   }
//
//   const setBucketPolicy = bucketName => s3.putBucketPolicy({
//     Bucket: bucketName,
//     Policy: generatePolicy(bucketName),
//   }).promise()
//
//   const configureBucketWebsite = async bucketName => s3.putBucketWebsite({
//     Bucket: bucketName,
//     ContentMD5: '',
//     WebsiteConfiguration: {
//       ErrorDocument: {
//         Key: 'index.html',
//       },
//       IndexDocument: {
//         Suffix: 'index.html',
//       },
//     },
//   }).promise()
//
//   const configureBucketRedirectWebsite = async (bucketName, destBucketName) => s3.putBucketWebsite({
//     Bucket: bucketName,
//     WebsiteConfiguration: {
//       RedirectAllRequestsTo: {
//         HostName: destBucketName,
//         Protocol: 'https',
//       },
//     },
//   }).promise()
//
//
//   const uploadFakeWebsite = async bucketName => s3.putObject({
//     Body: fakeWebsite,
//     Bucket: bucketName,
//     ContentType: 'text/html',
//     Key: 'index.html',
//     ServerSideEncryption: 'AES256',
//   }).promise()
//
//   return {
//     generatePolicy,
//     createBucket,
//     emptyBucket,
//     bucketExists,
//     deleteBucket,
//     setBucketPolicy,
//     configureBucketWebsite,
//     configureBucketRedirectWebsite,
//     uploadFakeWebsite,
//   }
// }
