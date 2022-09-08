import path from 'path'
import fs from 'fs'
import { window, workspace } from 'vscode'
import type { ExtensionContext } from 'vscode'

const AGENTS = ['npm', 'yarn', 'pnpm', 'bun'] as const

type TAGENTS = typeof AGENTS[number]

const LOCKS: Record<TAGENTS, string> = {
  npm: 'package-lock.json',
  yarn: 'yarn.lock',
  pnpm: 'pnpm-lock.yaml',
  bun: 'bun.lockb',
}

export const activate = (_: ExtensionContext) => {
  /**
   * 实现思路：
   *  1、触发条件文件保存并且当前文件是 package.json
   *  2、获取当前的 agent
   *  3、打开终端，执行 [agent] install
   *
   * TODOs:
   *  1、精确到修改内容 dependencies、devDependencies 中被修改了才触发 install 命令
   *  2、支持 install 中额外配置
   *  3、（???）删除终端执行命令模式，直接在后台运行更新
   */
  workspace.onDidSaveTextDocument((doc) => {
    const filePath = doc.fileName
    const fileName = path.basename(filePath)
    if (
      fileName === 'package.json'
      && !filePath.includes('node_modules')
    ) {
      const cwd = path.dirname(doc.fileName)
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
  })
}

export const deactivate = () => { }
