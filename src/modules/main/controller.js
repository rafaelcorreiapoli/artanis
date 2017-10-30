import * as staticWebsiteController from '../static-website/controller'
import * as cdnController from '../cdn/controller'
import * as dnsController from '../dns/controller'
import * as sslController from '../ssl/controller'

import * as logic from './logic'

export const cliRoutine = async ({ projectName, tld }, system) => {
  await system.ui.doomMessage('Artanis')
  const domain = logic.getDomain(projectName, tld)

  try {
    const certificateArn = await sslController.setupSsl({ domain }, system)
    await staticWebsiteController.setupBucket({ domain }, system)
    const cloudFrontDomain = await cdnController.setupDistribution({ domain, certificateArn }, system)
    await dnsController.setupDns({ domain, cloudFrontDomain }, system)
  } catch (err) {
    process.exit(1)
  }
}
