import * as staticWebsiteController from '../static-website/controller'
import * as logic from './logic'

export const cliRoutine = async ({ projectName, tld }, { s3, ui }) => {
  ui.doomMessage('Artanis')
  // const domain = logic.getDomain(projectName, tld)
  // await staticWebsiteController.setupBucket(domain, { s3, ui })
}
