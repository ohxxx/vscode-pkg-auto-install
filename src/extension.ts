import path from 'path'
import { window, workspace } from 'vscode'
import type { ExtensionContext, Uri } from 'vscode'
import depStore from './store'
import { executeInstallCommand, getAgent, getPackageJson, isEqual, isPackage } from './helpers'

export const activate = (_: ExtensionContext) => {
  window.onDidChangeActiveTextEditor((editor) => {
    if (isPackage(editor?.document)) {
      const doc = editor?.document
      const uri = (doc?.uri ?? '') as Uri
      const cwd = path.dirname(doc?.fileName || '')

      const packageJson = getPackageJson(cwd)
      const curDep = packageJson?.dependencies
      const curDevDep = packageJson?.devDependencies

      if (!depStore.has(uri))
        depStore.set(uri, { dep: curDep, devDep: curDevDep })
    }
  })

  workspace.onDidSaveTextDocument((doc) => {
    if (isPackage(doc)) {
      const cwd = path.dirname(doc.fileName)
      const agent = getAgent(cwd)

      const packageJson = getPackageJson(cwd)
      const curDep = packageJson?.dependencies
      const curDevDep = packageJson?.devDependencies

      const uri = (doc?.uri ?? '') as Uri
      if (depStore.has(uri)) {
        const { dep, devDep } = depStore.get(uri) || { dep: [], devDep: [] }

        if (!isEqual(dep, curDep) || !isEqual(devDep, curDevDep)) {
          executeInstallCommand(agent, cwd)
          depStore.set(uri, { dep: curDep, devDep: curDevDep })
        }
      }
      else {
        executeInstallCommand(agent, cwd)
        depStore.set(uri, { dep: curDep, devDep: curDevDep })
      }
    }
  })
}

export const deactivate = () => { }
