#!/usr/bin/env node
import 'babel-polyfill'
import program from 'commander'
import util from 'util'
import art from 'ascii-art'
import staticWebsite from './static-website'
import cdn from './web-distribution'
import certificate from './certificate'
import dnsRecords from './domain'
import spinner from './common/spinner'

const doomMessage = (message, color) => new Promise((resolve, reject) => art.font(message, 'Doom', color, (err, data) => {
  if (err) return reject(err)
  resolve(data)
}))

const list = val => val.split(',')

program
  .version('0.1.0')
  .option('-s, --service <items>', 'The datasets to generate', list)
  .parse(process.argv);


const displayWelcomeMessage = async () => {
  try {
    const welcomeMessage = await doomMessage('Artanis', 'bright_blue')
    console.log(welcomeMessage)
  } catch (err) {
    console.log(err)
  }
}
const main = async () => {
  await displayWelcomeMessage()

  const domain = 'papito-loko-1337.com.br'

  try {
    await staticWebsite({
      domain,
    })
    const certificateArn = await certificate({
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

main()
