import React from 'react';
import { CloseOutlined } from '@ant-design/icons';

interface CloseProps {
  targetWindow: string
}

const Close: React.FC<CloseProps> = ({ targetWindow }) => {
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
        window.electron.ipcRenderer.invoke('close-window', targetWindow)
      }}
    >
      <CloseOutlined style={{ fontSize: '16px', color: '#fff' }} />
    </div>
  );
};

export default Close;