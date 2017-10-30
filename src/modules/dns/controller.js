import * as diplomat from './diplomat/aws'

export const setupDns = async ({ domain, cloudFrontDomain }, { ui: { spinner }, route53 }) => {
  try {
    spinner.start(`Creating hosted zone ${domain}`)
    const hostedZoneId = await diplomat.createHostedZone({ domain }, { route53 })
    spinner.succeed()

    spinner.start(`Configuring records for ${domain}`)
    await diplomat.setRecords({
      hostedZoneId,
      domain,
      cloudFrontDomain,
    }, { route53 })
    spinner.succeed()
  } catch (err) {
    spinner.fail()
    console.log(err)
    throw err
  }
}
