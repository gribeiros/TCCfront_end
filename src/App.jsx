import React, { useState, useEffect, useMemo } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

const socket = io.connect('http://localhost:8080');

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [arduinoStatus, setArduinoStatus] = useState({});

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('arduinoStatus', async (data) => {
      await setArduinoStatus(data.status);
    });


    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('arduinoStatus');
    };
  }, []);

  const sendRequest = async () => {
    try {
      await axios.get('http://localhost:8080/update-status').then(
        function (response) {
          setArduinoStatus(response.data.status)
          console.log('SEND ' + JSON.stringify(response.data.status))
        }
      )
    } catch (error) {
      console.error(error);
    }
  }

  const connectedValue = useMemo(() => {
    if (isConnected) return 'Conectado';
    return 'Não conectado';
  }, [isConnected])

  const arduinoStatusValue = useMemo(() => {
    if (arduinoStatus) return `${arduinoStatus}`;
    return '--';
  }, [arduinoStatus])

  return (
    <div className='card'>
      <p className='title'>Sensor de nível de água</p>

      <p>Status da conexão:</p>
      <p className='connected-value'>{connectedValue}</p>

      <p>Nível da água:</p>
      <p className='info-value'>{arduinoStatus.waterLevel}</p>

      <p>Fluxo e água:</p>
      <p className='info-value'>{arduinoStatus.flowLevel}</p>

      <button onClick={sendRequest}>Atualizar</button>
    </div>
  );
}

export default App;