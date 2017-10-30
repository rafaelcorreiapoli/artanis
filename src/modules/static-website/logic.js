export const getBucketName = domain => `${domain}`

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
