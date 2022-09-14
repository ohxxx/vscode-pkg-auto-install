import path from 'path'
import { workspace } from 'vscode'
import type { ExtensionContext } from 'vscode'
import { executeInstallCommand, getAgent, isPackage } from './helpers'

export const activate = (_: ExtensionContext) => {
  workspace.onDidSaveTextDocument((doc) => {
    const isPkg = isPackage(doc)
    if (isPkg) {
      const cwd = path.dirname(doc.fileName)
      const agent = getAgent(cwd)
      executeInstallCommand(agent, cwd)
    }
  })
}

export const deactivate = () => { }
