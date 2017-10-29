import AWS from 'aws-sdk'

AWS.config.setPromisesDependency(null);
AWS.config.apiVersions = {
  acm: '2015-12-08',
}
export default AWS
