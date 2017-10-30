import AWS from './aws'
import { sleep } from '../common/utils'

const acm = new AWS.ACM({
  region: 'us-east-1',
});


export const requestCertficate = ({
  domainName,
  alternativeNames,
}) => acm.requestCertificate({
  DomainName: domainName,
  SubjectAlternativeNames: alternativeNames,
}).promise()


export const getCertificateStatusForDomain = ({
  certificateArn,
  domain,
}) => acm.describeCertificate({
  CertificateArn: certificateArn,
}).promise().then((data) => {
  const domainOptions = data.Certificate.DomainValidationOptions.find(options => options.DomainName === domain)
  if (!domainOptions) throw new Error(`Domain information for ${domain} not found`)
  if (!domainOptions.ValidationStatus) {
    throw new Error(`No ValidationStatus available from ${domain}`)
  }
  return domainOptions.ValidationStatus
})

export const getCertificateStatusForDomainWithRetries = async ({
  maxRetries = 10,
  retries = 0,
  spinner,
  ...args
}) => {
  try {
    const certificateStatusForDomain = await getCertificateStatusForDomain(args)
    return certificateStatusForDomain
  } catch (err) {
    spinner.text = `[${retries}/${maxRetries}]`

    if (retries >= maxRetries) {
      throw new Error(err)
    }
    await sleep(5000)
    return getCertificateStatusForDomainWithRetries({
      maxRetries,
      retries: retries + 1,
      spinner,
      ...args,
    })
  }
}
