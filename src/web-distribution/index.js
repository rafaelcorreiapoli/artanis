import ora from 'ora'
import { createDistribution } from '../common/cloudfront'
import spinner from '../common/spinner'
import { getCertificateStatusForDomainWithRetries } from '../common/acm'

const infoSpinner = ora()

const isCertificateReady = certificateStatus => certificateStatus === 'SUCCESS'

export default async ({
  domain,
  certificateArn,
}) => {
  try {
    spinner.start(`Checking certificate status ${domain}...`)
    const certificateStatus = await getCertificateStatusForDomainWithRetries({
      certificateArn,
      domain,
      spinner,
    })

    const certificateReady = isCertificateReady(certificateStatus)

    if (certificateReady) {
      spinner.succeed('Certificate is ready!')
    } else {
      spinner.warn(`Certificate is ${certificateStatus}`)
    }

    spinner.start(`Creating distribution for ${domain}`)
    const cloudfrontDomain = await createDistribution({
      domain,
      certificateArn: certificateReady ? certificateArn : '',
    })
    spinner.succeed()
    return cloudfrontDomain
  } catch (err) {
    spinner.fail()
    console.log(err)
  }
}
