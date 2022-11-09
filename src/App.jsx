import React, { useState, useEffect, useMemo, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

const socket = io.connect('http://localhost:8080');

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [arduinoWaterLevel, setArduinoWaterLevel] = useState(null);
  const [arduinoFlowLevel, setArduinoFlowLevel] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('arduinoStatus', (data) => {
      setArduinoWaterLevel(data.status.waterLevel);
      setArduinoFlowLevel(data.status.flowLevel);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('arduinoStatus');
    };
  }, []);

  const sendRequest = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/update-status');
      setArduinoWaterLevel(data.status.waterLevel);
      setArduinoFlowLevel(data.status.flowLevel);
      console.log('SEND ' + JSON.stringify(data.status));
    } catch (error) {
      console.error(error);
    }
  }

  const connected = useMemo(() => {
    if (isConnected) return 'Conectado';
    return 'Não conectado';
  }, [isConnected])

  const waterLevel = useMemo(() => {
    if (arduinoWaterLevel) return `${arduinoWaterLevel}`;
    return '--';
  }, [arduinoWaterLevel])

  const flowLevel = useMemo(() => {
    if (arduinoFlowLevel) return `${arduinoFlowLevel}`;
    return '--';
  }, [arduinoFlowLevel])

  return (
    <div className='card'>
      <p className='title'>Sensor de nível de água</p>

      <p>Status da conexão:</p>
      <p className='connected-value'>{connected}</p>

      <p>Nível da água:</p>
      <p className='info-value'>{waterLevel}</p>

      <p>Fluxo e água:</p>
      <p className='info-value'>{flowLevel}</p>

      <button onClick={sendRequest}>Atualizar</button>
    </div>
  );
}

export default App;