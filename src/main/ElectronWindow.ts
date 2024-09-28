class ElectronWindow {
  static instance: ElectronWindow | null = null
  map = {}

  constructor() {
    if (ElectronWindow.instance) {
      return ElectronWindow.instance
    }
    ElectronWindow.instance = this
  }

  add(name, instance) {
    if (this.map[name]) {
      return
    }
    this.map[name] = instance
  }

  get(name) {
    return this.map[name]
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
