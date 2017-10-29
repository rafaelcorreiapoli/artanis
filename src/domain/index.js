import { createHostedZone, setRecords } from '../common/route53'
import spinner from '../common/spinner'

export default async ({
  domain,
  cloudfrontDomain,
}) => {
  try {
    spinner.start(`Creating hosted zone ${domain}`)
    const hostedZoneId = await createHostedZone({ domain })
    spinner.succeed()

    spinner.start(`Configuring records for ${domain}`)
    await setRecords({
      hostedZoneId,
      domain,
      cloudfrontDomain,
    })
    spinner.succeed()
  } catch (err) {
    spinner.fail()
    console.log(err)
  }
}
