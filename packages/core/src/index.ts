#!/usr/bin/env node
import {Command, Argument} from 'commander'
import start from './start'
import build from './build'
import colors from 'colors/safe'
import test from './test'
import './handleErrors'
import version from './version'
import 'dotenv/config'
import generate from './generate'

const program = new Command()

const run = function (action) {
  return async function (...args) {
    try {
      await action(...args)
    } catch (e) {
      console.error(colors.red('Error: ' + e.message))
    }
  }
}

program
  .command('start')
  .description('Run the Orionjs app')
  .option('--shell', 'Opens a shell in Chrome developer tools')
  .option('--clean', 'Build the typescript project from scratch')
  .action(run(start))

program.command('test').allowUnknownOption().description('Deprecated command').action(run(test))

program
  .command('build')
  .description('Compiles an Orionjs app and exports it to a simple nodejs app')
  .option('-o, --output [output]', 'Output directory')
  .action(run(build))

program
  .command('generate')
  .alias('g')
  .addArgument(
    new Argument('<resources>', 'resource for orionsjs').choices([
      //infra
      'resolver',
      'echoes',
      'jobs',
      'http',
      //application
      'service',
      //domain
      'collections',
      'repo',
      'model'
    ])
  )
  .option('-t, --type [type]', 'description')
  .action((params, option) => {
    generate('params', 'option')
  })

program.version(version, '-v --version')

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
