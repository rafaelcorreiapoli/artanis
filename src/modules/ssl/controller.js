import * as diplomat from './diplomat/aws'

export const setupSsl = async ({
  domain,
}, { acm, ui: { spinner } }) => {
  try {
    spinner.start(`Requesting certificate for ${domain}`)
    const response = await diplomat.requestCertficate({
      domainName: domain,
      alternativeNames: [`*.${domain}`],
    }, { acm })
    spinner.succeed()

    return response.CertificateArn
  } catch (err) {
    spinner.fail()
    console.log(err)
    throw err
  }
}
