#!/usr/bin/env node
import 'babel-polyfill'
import program from 'commander'
import * as mainController from './modules/main/controller'
import * as system from './system'

// import util from 'util'
// import art from 'ascii-art'
// import staticWebsite from './static-website'
// import cdn from './web-distribution'
// import certificate from './certificate'
// import dnsRecords from './domain'
// import spinner from './common/spinner'
// import components from './components'
// import message from './modules/ui/message'
//
// const main = async (projectName, { tdl }) => {
//   await message('Artanis', 'bright_blue')
//
//   const domain = `${projectName}.${tdl}`
//   console.log(`Setting up project for ${domain}`)
//
//   try {
//     await staticWebsite({
//       domain,
//     })
//     const certificateArn = await certificate({
//       domain,
//     })
//     const cloudfrontDomain = await cdn({
//       domain,
//       certificateArn,
//     })
//     await dnsRecords({
//       domain,
//       cloudfrontDomain,
//     })
//   } catch (err) {
//     process.exit(1)
//   }
// }

const cliHandler = (projectName, options) => {
  const {
    tld,
  } = options
  mainController.cliRoutine({ projectName, tld }, system.prod)
}
program
  .version('0.1.0')

program
  .command('new <projectName>')
  .option('-t, --tdl [tdl]', 'Top level domain', 'com.br')
  .action(cliHandler)

program.parse(process.argv);
