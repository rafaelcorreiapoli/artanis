import { getCertificateStatusForDomainWithRetries } from '../ssl/diplomat/aws'
import * as diplomat from './diplomat/aws'
import * as logic from './logic'


export const setupDistribution = async ({
  domain,
  certificateArn,
}, { acm, cloudFront, ui }) => {
  try {
    let certificateReady
    if (certificateArn) {
      ui.spinner.start(`Checking certificate status ${domain}...`)
      const certificateStatus = await getCertificateStatusForDomainWithRetries({
        certificateArn,
        domain,
      }, { acm })

      certificateReady = logic.isCertificateReady(certificateStatus)

      if (certificateReady) {
        ui.spinner.succeed('Certificate is ready!')
      } else {
        ui.spinner.warn(`Certificate is ${certificateStatus}`)
      }
    }

    ui.spinner.start(`Creating distribution for ${domain}`)
    const cloudfrontDomain = await diplomat.createDistribution({
      domain,
      certificateArn: certificateReady ? certificateArn : '',
    }, { cloudFront })
    ui.spinner.succeed()

    return cloudfrontDomain
  } catch (err) {
    ui.spinner.fail()
    console.log(err)
    throw err
  }
}
