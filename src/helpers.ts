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
  const terminal = window.terminals.find(terminal => terminal.name === 'auto install')

  if (terminal) {
    terminal.sendText(command)
  }
  else {
    const terminal = window.createTerminal({ name: 'auto install', cwd })
    terminal.show()
    terminal.sendText(command)
  }
}

export const isEqual = (a: unknown, b: unknown) => {
  return JSON.stringify(a) === JSON.stringify(b)
}
