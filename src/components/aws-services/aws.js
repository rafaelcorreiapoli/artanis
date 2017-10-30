import AWS from 'aws-sdk'

AWS.config.setPromisesDependency(null);
AWS.config.apiVersions = {
  acm: '2015-12-08',
  cloudFront: '2017-03-25',
}
export default AWS
