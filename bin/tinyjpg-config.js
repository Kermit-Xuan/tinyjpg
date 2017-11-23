#!/usr/bin/env node


const chalk = require('chalk').default
const fs = require('fs')
const path = require('path')
const programer = require('commander')
const config = require('../lib/config')

programer
.usage('<action> <key> <value>')
.parse(process.argv)

programer.on('--help', () => {
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # add a ignore folder'))
  console.log('    $ tinyjpg config add ignore <foldername>')
  console.log()
  console.log(chalk.gray('    # remove a ignore folder'))
  console.log('    $ tinyjpg config remove ignore <foldername>')
  console.log()
  console.log(chalk.gray('    # get config list'))
  console.log('    $ tinyjpg config list')
  console.log()
  console.log(chalk.gray('    # set API KEY of Tinypng'))
  console.log('    $ tinyjpg config add key <api key>')
  console.log()
  console.log(chalk.gray('    # remove API KEY of Tinypng'))
  console.log('    $ tinyjpg config remove key')
  console.log()
  console.log('    Get API KEY:', chalk.blueBright('https://tinyjpg.com/developers'))
})

// help
programer.args.length < 1 && programer.help()

const action = programer.args[0]
const prop = programer.args[1]
const val = programer.args[2]

// set config
updateConfig(action)

function updateConfig (action) {
  switch(action) {
    case 'add': {
      setConfig(prop, val)
      break;
    }
    case 'remove': {
      removeConfig(prop, val)
      break;
    }
    case 'list': {
      for(let prop in config) {
        console.log(`${chalk.redBright(prop)}: ${chalk.blueBright(config[prop])}`)
        console.log()
      }
      return;
    }
    default: {
      programer.help()
    }
  }
  const configStr = JSON.stringify(config)
  fs.writeFileSync(path.join(__dirname, '../lib/config.json'), configStr)
}

function setConfig (prop, val) {  // set config
  switch(prop) {
    case 'key': {
      val ? (config.key = val) : programer.help()
      break;
    }
    case 'ignore': {
      val ? config.skips.push(val) : programer.help()
      break;
    }
    default: programer.help()
  }
  console.log(chalk.greenBright('Succeed'))
}

function removeConfig (prop, val) { // remove config
  switch(prop) {
    case 'key': {
      config.key = ''
      break;
    }
    case 'ignore': {
      const {skips} = config
      skips.splice(skips.indexOf(val), 1)
      break;
    }
    default: programer.help()
  }
  console.log(chalk.greenBright('Succeed'))
}
