import { getBucketName } from './logic'
import * as aws from './diplomat/aws'

export const setupBucket = async ({ domain }, { spinner, s3 }) => {
  const bucketName = getBucketName(domain)

  try {
    const exists = await aws.bucketExists(bucketName, { s3 })
    if (exists) {
      spinner.start(`Deleting bucket ${bucketName}`)
      await aws.deleteBucket(bucketName, { force: true }, { s3 })
      spinner.succeed()
    }


    spinner.start(`Creating bucket ${bucketName}`)
    await aws.createBucket(bucketName, { s3 })
    spinner.succeed()

    spinner.start(`Setting policy for ${bucketName}`)
    await aws.setBucketPolicy(bucketName, { s3 })
    spinner.succeed()

    spinner.start(`Configuring website for ${bucketName} - host`)
    await aws.configureBucketWebsite(bucketName, { s3 })
    spinner.succeed()

    spinner.start(`Uploading test website to ${bucketName}`)
    await aws.uploadFakeWebsite(bucketName, { s3 })
    spinner.succeed()
  } catch (err) {
    spinner.fail()
    console.log(err)
    throw err
  }
}
