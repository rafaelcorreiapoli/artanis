export const createDistribution = ({
  domain,
  certificateArn,
}, { cloudFront }) => {
  const certificateOptions =
    certificateArn ?
      {
        ViewerCertificate: {
          ACMCertificateArn: certificateArn,
          CertificateSource: 'cloudfront',
          CloudFrontDefaultCertificate: false,
          MinimumProtocolVersion: 'TLSv1.1_2016',
          SSLSupportMethod: 'sni-only',
        },
      }
      : {}

  return cloudFront.createDistribution({
    DistributionConfig: { /* required */
      CallerReference: new Date().toISOString(), /* required */
      Comment: `${domain} CDN`, /* required */
      Aliases: {
        Quantity: 2, /* required */
        Items: [
          `${domain}`,
          `www.${domain}`,
        ],
      },
      DefaultCacheBehavior: { /* required */
        ForwardedValues: { /* required */
          Cookies: { /* required */
            Forward: 'none',
          },
          QueryString: true,
        },
        MinTTL: 0, /* required */
        TargetOriginId: `S3-${domain}`, /* required */
        TrustedSigners: { /* required */
          Enabled: false, /* required */
          Quantity: 0, /* required */
        },
        ViewerProtocolPolicy: 'redirect-to-https',
        Compress: true,
      },
      Enabled: true,
      Origins: { /* required */
        Quantity: 1, /* required */
        Items: [
          {
            DomainName: `${domain}.s3.amazonaws.com`, /* required */
            Id: `S3-${domain}`, /* required */
            S3OriginConfig: {
              OriginAccessIdentity: '',
            },
          },
        ],
      },
      CustomErrorResponses: {
        Quantity: 2, /* required */
        Items: [
          {
            ErrorCode: 404, /* required */
            ErrorCachingMinTTL: 0,
            ResponseCode: '200',
            ResponsePagePath: '/index.html',
          },
          {
            ErrorCode: 403, /* required */
            ErrorCachingMinTTL: 0,
            ResponseCode: '200',
            ResponsePagePath: '/index.html',
          },
        ],
      },
      DefaultRootObject: 'index.html',
      PriceClass: 'PriceClass_All',
      ...certificateOptions,
    },
  }).promise()
    .then(data => data.Distribution.DomainName)
}
