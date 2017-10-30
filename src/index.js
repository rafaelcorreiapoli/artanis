import message from './modules/ui/message'
import cdnFactory from './modules/cdn'
import dnsFactory from './modules/dns'
import sslFactory from './modules/ssl'
import staticWebsiteFactory from './modules/static-website'

export default async ({ projectName, tdl }, system) => {
  await message('Artanis', 'bright_blue')

  const cdn = cdnFactory(system)
  const dns = dnsFactory(system)
  const ssl = sslFactory(system)
  const staticWebsite = staticWebsiteFactory(system)

  const domain = `${projectName}.${tdl}`
  console.log(`Setting up project for ${domain}`)

  try {
    await staticWebsite({
      domain,
    })
    const certificateArn = await ssl({
      domain,
    })
    const cloudfrontDomain = await cdn({
      domain,
      certificateArn,
    })
    await dnsRecords({
      domain,
      cloudfrontDomain,
    })
  } catch (err) {
    process.exit(1)
  }
}
