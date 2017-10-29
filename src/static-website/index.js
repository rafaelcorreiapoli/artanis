import { createBucket, configureBucketWebsite, setBucketPolicy, uploadFakeWebsite, deleteBucket, bucketExists } from '../common/s3'
import spinner from '../common/spinner'

const getBucketName = domain => `${domain}`

export default async ({
  domain,
}) => {
  const bucketName = getBucketName(domain)

  try {
    const exists = await bucketExists(bucketName)
    if (exists) {
      spinner.start(`Deleting bucket ${bucketName}`)
      await deleteBucket(bucketName, { force: true })
      spinner.succeed()
    }


    spinner.start(`Creating bucket ${bucketName}`)
    await createBucket(bucketName)
    spinner.succeed()

    spinner.start(`Setting policy for ${bucketName}`)
    await setBucketPolicy(bucketName)
    spinner.succeed()

    spinner.start(`Configuring website for ${bucketName} - host`)
    await configureBucketWebsite(bucketName)
    spinner.succeed()

    spinner.start(`Uploading test website to ${bucketName}`)
    await uploadFakeWebsite(bucketName)
    spinner.succeed()
  } catch (err) {
    spinner.fail()
    console.log(err)
    throw err
  }
}
