const tinify = require('tinify')
const program = require('commander')
const chalk = require('chalk').default
const path = require('path')
const isDir = require('is-directory')
const fs = require('fs')
const {key, extnames, skips} = require('../lib/config')

let totalCount = 0 
let successCount = 0
let failCount = 0

program.version(require('../package').version)
.usage('<filename or directory> [output filename or directory]')
.command('config', 'add or remove config')

function help () {
  program.parse(process.argv)
  if (program.args.length < 2) return program.help()
}
help()


// get path
let source = toPath(program.args[0])
let target = toPath(program.args[1])

if (key) {
  tinify.key = key
  findFiles(source)
} else {
  console.log(chalk.redBright('Please set api key!'))
}

function findFiles(root) {
  try {
    if (!isDir.sync(root)) { // not directory
      if (extnames.indexOf(path.extname(root)) >= 0) { // filter extnames
        totalCount++;
        const targetDir = target ? (isDir.sync(target) ? path.join(target, path.basename(root)) : root) : root
        tinify.fromFile(root).toFile(targetDir).then(() => { // compress image
          console.log(chalk.greenBright(`${path.basename(root)} Succeed`))
          successCount++
          console.log(`${chalk.blueBright(`Total ${totalCount}`)}, ${chalk.greenBright(`${successCount} Succeed`)}, ${chalk.redBright(`${failCount} Failed`)}`, )
        }, (err) => {
          console.log(chalk.redBright(`${path.basename(root)} Failed`), err.message) // failed
          failCount++
          console.log(`${chalk.blueBright(`Total ${totalCount}`)}, ${chalk.greenBright(`${successCount} Succeed`)}, ${chalk.redBright(`${failCount} Failed`)}`, )
        })
      }
    } else {
      let dirs = fs.readdirSync(root, 'utf8')
      dirs.filter((dir) => skips.indexOf(dir) === -1).forEach((dir) => { // skip specify dir
        findFiles(path.join(root, dir))
      })
    }
  } catch (err) {
    console.log(chalk.redBright(err))
  }
}

function toPath (pathname) { // convert path to absolute path
  pathname && isDir.sync(pathname) && !path.isAbsolute(pathname) && (pathname = path.join(process.cwd(), pathname))
  return pathname
}
