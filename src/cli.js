#!/usr/bin/env node
import 'babel-polyfill'
import program from 'commander'
import * as mainController from './modules/main/controller'
import * as system from './system'

const cliHandler = (projectName, options) => {
  const {
    tld,
  } = options
  mainController.cliRoutine({ projectName, tld }, system.prod)
}
program
  .version('1.0.0')

program
  .command('new <projectName>')
  .option('-t, --tld [tld]', 'Top level domain', 'com.br')
  .action(cliHandler)

program.parse(process.argv);
