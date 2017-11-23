#!/usr/bin/env node


require('commander').version(require('../package').version)
.usage('<command> <options>')
.command('config', 'add or remove config')
.command('compress', 'compress images')
