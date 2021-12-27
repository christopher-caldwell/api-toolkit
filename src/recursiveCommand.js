const path = require('path')
const fs = require('fs')
const childProcess = require('child_process')

const executeCommand = (pathToExecuteCommand, commandToExec) => {
  childProcess.execSync(commandToExec, {
    cwd: pathToExecuteCommand,
    env: process.env,
    stdio: 'inherit'
  })
}

const listSubFolders = targetFolder => {
  return fs
    .readdirSync(targetFolder)
    .filter(subFolder => fs.statSync(path.join(targetFolder, subFolder)).isDirectory())
    .filter(subFolder => subFolder !== 'node_modules' && subFolder[0] !== '.')
    .map(subFolder => path.join(targetFolder, subFolder))
}

const runCommandRecursive = (rootPath, targetFolder, commandToExecute, continueOnError) => {
  const hasPackageJson = fs.existsSync(path.join(targetFolder, 'package.json'))

  if (hasPackageJson) {
    console.log('\x1b[0m', '===================================================================')
    console.log('\x1b[0m', `Performing "${commandToExecute}" inside ${path.relative(rootPath, targetFolder)}/`)
    console.log('\x1b[0m', '===================================================================')
    try {
      executeCommand(targetFolder, commandToExecute)
    } catch (error) {
      console.error('in the catch')
      if (!continueOnError) throw error
    }
  }
  const subFolders = listSubFolders(targetFolder)
  subFolders.forEach(subFolder => {
    runCommandRecursive(rootPath, subFolder, commandToExecute)
  })
}

/** Parses command line arguments given in `--name='value'` format.
 * @returns `{name: 'value'}`
 */
const parseArgs = () => {
  const argumentos = {}
  process.argv.slice(2).forEach(element => {
    const matches = element.match('--([a-zA-Z0-9]+)=(.*)')
    if (matches) {
      argumentos[matches[1]] = matches[2].replace(/^['"]/, '').replace(/['"]$/, '')
    }
  })
  return argumentos
}
/**
 * Executes a command in every folder that has a package.json file.
 * @param commandToExec
 * @param relativePathFromCallingLocation This is the path relative to where in the file tree this will be executed
 */
const main = async () => {
  const { filePath = '.', command = 'yarn', continueOnError = false } = parseArgs()
  console.log('continueOnError', continueOnError)
  const rootPath = path.resolve(process.cwd(), filePath)
  runCommandRecursive(rootPath, rootPath, command, continueOnError)
}

main()
