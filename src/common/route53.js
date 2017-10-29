import AWS from './aws'
import path from 'path'

const route53 = new AWS.Route53()
export default route53

const extractHostedZoneIdOnly = hostedZoneId => path.basename(hostedZoneId)

export const createHostedZone = ({
  domain,
}) => route53.createHostedZone({
  CallerReference: new Date().toISOString(), /* required */
  Name: domain,
}).promise()
  .then(data => extractHostedZoneIdOnly(data.HostedZone.Id))

export const setRecords = ({
  hostedZoneId,
  domain,
  cloudfrontDomain,
}) => route53.changeResourceRecordSets({
  HostedZoneId: hostedZoneId,
  ChangeBatch: {
    Changes: [
      {
        Action: 'CREATE',
        ResourceRecordSet: {
          AliasTarget: {
            DNSName: cloudfrontDomain,
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
            DNSName: cloudfrontDomain,
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
            DNSName: cloudfrontDomain,
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
            DNSName: cloudfrontDomain,
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
