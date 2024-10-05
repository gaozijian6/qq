import { MinusOutlined } from '@ant-design/icons'

const Minimize: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '30px',
        cursor: 'pointer',
        zIndex: 1000
      }}
      onClick={() => {
        window.electron.ipcRenderer.invoke('minimize-window')
      }}
    >
      <MinusOutlined style={{ fontSize: '16px', color: '#fff' }} />
    </div>
  )
}

export default Minimize
