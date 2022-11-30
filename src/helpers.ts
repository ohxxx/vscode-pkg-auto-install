import path from 'path'
import fs from 'fs'
import type { TextDocument } from 'vscode'
import { window } from 'vscode'
import { AGENTS, LOCKS } from './constants'
import type { TAGENTS } from './types'

export const getPackageJson = (cwd: string) => {
  const packageJsonPath = path.join(cwd, 'package.json')
  if (fs.existsSync(packageJsonPath))
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  return null
}

export const isPackage = (doc?: TextDocument) => {
  if (!doc)
    return false
  const filePath = doc.fileName
  const fileName = path.basename(filePath)
  return fileName === 'package.json' && !filePath.includes('node_modules')
}

export const getAgent = (cwd: string) => {
  let agent: TAGENTS = 'npm'

  const packageJson = getPackageJson(cwd)
  if (packageJson.packageManager && AGENTS.includes(packageJson.packageManager as TAGENTS)) {
    agent = packageJson.packageManager
  }
  else {
    const lockName = AGENTS.find(agent => fs.existsSync(path.join(cwd, LOCKS[agent])))
    if (lockName)
      agent = lockName
  }

  return agent
}

export const executeInstallCommand = (agent: TAGENTS, cwd: string) => {
  const command = `cd ${cwd} && ${agent} install`
  window.withProgress({
    location: 15,
    title: 'Installing dependencies...',
    cancellable: false,
  }, () => {
    return new Promise<void>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const child = require('child_process').exec(command, (error: Error) => {
        if (error) {
          window.showErrorMessage(`Failed to install dependencies: ${error.message}`)
          reject(error)
        }
        else {
          window.showInformationMessage('Successfully installed dependencies')
          resolve()
        }
      })
      child.stdout.on('data', (data: string) => {
        console.warn(data)
      })
    })
  })
}

export const isEqual = (a: unknown, b: unknown) => {
  return JSON.stringify(a) === JSON.stringify(b)
}
