class ElectronWindow {
  static instance: ElectronWindow | null = null
  map = new Map()

  constructor() {
    if (ElectronWindow.instance) {
      return ElectronWindow.instance
    }
    ElectronWindow.instance = this
  }

  add(name, instance) {
    if (this.map.has(name)) {
      return
    }
    this.map.set(name, instance)
  }

  get(name) {
    return this.map.get(name)
  }

  delete(name) {
    this.map.delete(name)
  }

  static getInstance() {
    if (!ElectronWindow.instance) {
      ElectronWindow.instance = new ElectronWindow()
    }
    return ElectronWindow.instance
  }
}

const electronWindow = new ElectronWindow()

export default electronWindow
