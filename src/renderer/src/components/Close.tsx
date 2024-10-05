import React from 'react';
import { CloseOutlined } from '@ant-design/icons';

interface CloseProps {
  isExit?: boolean
}

const Close: React.FC<CloseProps> = ({ isExit = false }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
        zIndex: 1000
      }}
      onClick={() => {
        if (isExit) {
          window.electron.ipcRenderer.invoke('exit-app')
        } else {
          window.electron.ipcRenderer.invoke('hide-window')
        }
      }}
    >
      <CloseOutlined style={{ fontSize: '16px', color: '#fff' }} />
    </div>
  );
};

export default Close;