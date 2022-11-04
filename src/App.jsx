import React, { useState, useEffect, useMemo } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

const socket = io.connect('http://localhost:8080');

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [waterLevel, setWaterLevel] = useState(null);
  const [request, setRequest] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('Water_Level', function (data) {
      setWaterLevel(data.WaterLevel);
      setTimeout(() => {  sendRequest()}, 4000);
      console.log(data)
    });


    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('Water_Level');
    };
  }, []);

  const sendRequest = async () => {
    try {
      await axios.post('http://localhost:8080/waterSokect',
        {
          'status': 'Water_Level'
        }).then(
          res => {
            setRequest(res.data.status)
            console.log(res.data)
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

  const waterLevelValue = useMemo(() => {
    if (waterLevel !== null) return `${waterLevel}`;
    return '--';
  }, [waterLevel])

  const requestValue = useMemo(() => {
    if (request !== null) return `${request}`;
    return '--';
  }, [request])

  return (
    <div className='card'>
      <p className='title'>Sensor de nível de água</p>

      <p>Status da conexão:</p>
      <p className='connected-value'>{connectedValue}</p>

      <p>Nível da água:</p>
      <p className='info-value'>{waterLevelValue}</p>

      <p>Status da requisição:</p>
      <p className='info-value'>{requestValue}</p>

      <button onClick={sendRequest}>Atualizar</button>
    </div>
  );
}

export default App;