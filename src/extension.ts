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
      const curPeerDep = packageJson?.peerDependencies

      if (!depStore.has(uri))
        depStore.set(uri, { dep: curDep, devDep: curDevDep, peerDep: curPeerDep })
    }
  })

  workspace.onDidSaveTextDocument((doc) => {
    if (isPackage(doc)) {
      const cwd = path.dirname(doc.fileName)
      const agent = getAgent(cwd)

      const packageJson = getPackageJson(cwd)
      const curDep = packageJson?.dependencies
      const curDevDep = packageJson?.devDependencies
      const curPeerDep = packageJson?.peerDependencies

      const uri = (doc?.uri ?? '') as Uri

      const executeUpdate = () => {
        executeInstallCommand(agent, cwd)
        depStore.set(uri, { dep: curDep, devDep: curDevDep, peerDep: curPeerDep })
      }

      if (depStore.has(uri)) {
        const { dep, devDep, peerDep } = depStore.get(uri)
          || { dep: [], devDep: [], peerDep: [] }

        if (
          !isEqual(dep, curDep)
          || !isEqual(devDep, curDevDep)
          || !isEqual(peerDep, curPeerDep)
        )
          executeUpdate()
      }
      else {
        executeUpdate()
      }
    }
  })
}

export const deactivate = () => { }
