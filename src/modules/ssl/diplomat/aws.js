import { sleep } from '../../../common/utils'

export const requestCertficate = ({ domainName, alternativeNames }, { acm }) => acm.requestCertificate({
  DomainName: domainName,
  SubjectAlternativeNames: alternativeNames,
}).promise()


export const getCertificateStatusForDomain = ({
  certificateArn,
  domain,
}, { acm }) => acm.describeCertificate({
  CertificateArn: certificateArn,
}).promise().then((data) => {
  const domainOptions = data.Certificate.DomainValidationOptions.find(options => options.DomainName === domain)
  if (!domainOptions) throw new Error(`Domain information for ${domain} not found`)
  if (!domainOptions.ValidationStatus) {
    throw new Error('NoValidationStatusAvailable')
  }
  return domainOptions.ValidationStatus
})

export const getCertificateStatusForDomainWithRetries = async ({
  maxRetries = 10,
  retries = 0,
  spinner,
  ...args
}, { acm }) => {
  try {
    const certificateStatusForDomain = await getCertificateStatusForDomain(args, { acm })
    return certificateStatusForDomain
  } catch (err) {
    if (retries < maxRetries && err.message === 'NoValidationStatusAvailable') {
      await sleep(5000)
      return getCertificateStatusForDomainWithRetries({
        maxRetries,
        retries: retries + 1,
        spinner,
        ...args,
      }, { acm })
    }

    throw new Error(err)
  }
}
