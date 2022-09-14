import path from 'path'
import fs from 'fs'
import type { TextDocument } from 'vscode'
import { window } from 'vscode'
import { AGENTS, LOCKS } from './constants'
import type { TAGENTS } from './types'

export const isPackage = (doc: TextDocument) => {
  const filePath = doc.fileName
  const fileName = path.basename(filePath)
  return fileName === 'package.json' && !filePath.includes('node_modules')
}

export const getAgent = (cwd: string) => {
  let agent: TAGENTS = 'npm'

  const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8'))

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
  const command = `${agent} install`
  const terminals = window.terminals.find(terminal => terminal.name === 'auto install')

  if (terminals) {
    terminals.sendText(command)
  }
  else {
    const terminal = window.createTerminal({ name: 'auto install', cwd })
    terminal.show()
    terminal.sendText(command)
  }
}
