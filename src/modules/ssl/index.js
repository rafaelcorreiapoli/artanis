import { requestCertficate } from '../common/acm'
import spinner from '../common/spinner'


export default async ({
  domain,
}) => {
  try {
    spinner.start(`Requesting certificate for ${domain}`)
    const response = await requestCertficate({
      domainName: domain,
      alternativeNames: [`*.${domain}`],
    })
    spinner.succeed()

    return response.CertificateArn
    console.log(response)
  } catch (err) {
    spinner.fail()
    console.log(err)
  }
}
