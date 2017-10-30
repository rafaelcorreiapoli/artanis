import { extractHostedZoneIdOnly } from '../logic'

export const createHostedZone = ({
  domain,
}, { route53 }) => route53.createHostedZone({
  CallerReference: new Date().toISOString(), /* required */
  Name: domain,
}).promise()
  .then(data => extractHostedZoneIdOnly(data.HostedZone.Id))

export const setRecords = ({
  hostedZoneId,
  domain,
  cloudFrontDomain,
}, { route53 }) => route53.changeResourceRecordSets({
  HostedZoneId: hostedZoneId,
  ChangeBatch: {
    Changes: [
      {
        Action: 'CREATE',
        ResourceRecordSet: {
          AliasTarget: {
            DNSName: cloudFrontDomain,
            EvaluateTargetHealth: false,
            HostedZoneId: 'Z2FDTNDATAQYW2',
          },
          Name: domain,
          Type: 'A',
        },
      },
      {
        Action: 'CREATE',
        ResourceRecordSet: {
          AliasTarget: {
            DNSName: cloudFrontDomain,
            EvaluateTargetHealth: false,
            HostedZoneId: 'Z2FDTNDATAQYW2',
          },
          Name: domain,
          Type: 'AAAA',
        },
      },
      {
        Action: 'CREATE',
        ResourceRecordSet: {
          AliasTarget: {
            DNSName: cloudFrontDomain,
            EvaluateTargetHealth: false,
            HostedZoneId: 'Z2FDTNDATAQYW2',
          },
          Name: `www.${domain}`,
          Type: 'A',
        },
      },
      {
        Action: 'CREATE',
        ResourceRecordSet: {
          AliasTarget: {
            DNSName: cloudFrontDomain,
            EvaluateTargetHealth: false,
            HostedZoneId: 'Z2FDTNDATAQYW2',
          },
          Name: `www.${domain}`,
          Type: 'AAAA',
        },
      },
    ],
  },
}).promise()
