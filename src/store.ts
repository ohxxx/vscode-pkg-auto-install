import type { Uri } from 'vscode'

interface IDependency {
  dep: string[]
  devDep: string[]
  peerDep: string[]
}

class DepStore {
  dependencyMap = new Map<Uri, IDependency>()

  constructor() { }

  has(uri: Uri) {
    return this.dependencyMap.has(uri)
  }

  set(uri: Uri, value: IDependency) {
    this.dependencyMap.set(uri, value)
  }

  get(uri: Uri) {
    return this.dependencyMap.get(uri)
  }
}

export default new DepStore()
