import { getBucketName } from './logic'
import * as aws from './diplomat/aws'
import fakeWebsite from '../../resources/fake-website'

export const setupBucket = async ({ domain }, { ui, s3 }) => {
  const bucketName = getBucketName(domain)

  try {
    const exists = await aws.bucketExists(bucketName, { s3 })
    if (exists) {
      ui.spinner.start(`Deleting bucket ${bucketName}`)
      await aws.deleteBucket(bucketName, true, { s3 })
      ui.spinner.succeed()
    }


    ui.spinner.start(`Creating bucket ${bucketName}`)
    await aws.createBucket(bucketName, { s3 })
    ui.spinner.succeed()

    ui.spinner.start(`Setting policy for ${bucketName}`)
    await aws.setBucketPolicy(bucketName, { s3 })
    ui.spinner.succeed()

    ui.spinner.start(`Configuring website for ${bucketName} - host`)
    await aws.configureBucketWebsite(bucketName, { s3 })
    ui.spinner.succeed()

    ui.spinner.start(`Uploading test website to ${bucketName}`)
    await aws.uploadFakeWebsite(bucketName, fakeWebsite, { s3 })
    ui.spinner.succeed()
  } catch (err) {
    ui.spinner.fail()
    console.log(err)
    throw err
  }
}
