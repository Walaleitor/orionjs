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
  .description(
    'Create a resource for Orionjs, It can be a service, model, repo, collectrion, resolver, job, echoes, http.'
  )
  .alias('g')
  .addArgument(
    new Argument('<resources>', 'resource for orionsjs').choices([
      //infra
      'resolver',
      'echoes',
      'job',
      'http',
      //application
      'service',
      //domain
      'collections',
      'repo',
      'model'
    ])
  )
  .addArgument(
    new Argument('<resources>', 'resource for orionsjs').choices([
      //infra
      'resolver',
      'echoes',
      'job',
      'http',
      //application
      'service',
      //domain
      'collections',
      'repo',
      'model'
    ])
  )
  .addArgument(
    new Argument('<resources>', 'resource for orionsjs').choices([
      //infra
      'resolver',
      'echoes',
      'job',
      'http',
      //application
      'service',
      //domain
      'collections',
      'repo',
      'model'
    ])
  )
  .option('-t, --type [type]', 'type of resource')
  .option('-p, --path [path]', 'path where you want to create the resource')
  .action((params, option) => {
    console.log('%cindex.ts line:62 params', 'color: #007acc;', params)
    console.log('%cindex.ts line:62 option', 'color: #007acc;', option)
    // generate('params', 'option')
  })

program.version(version, '-v --version')

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
