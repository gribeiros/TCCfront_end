import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

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

  return (
    <div>
      <p>Connected: {'' + isConnected}</p>
      <p>Water Level: {'' + waterLevel}</p>
      <p>Request: {'' + request}</p>
      <button onClick={sendRequest}>Send ping</button>
    </div>
  );
}

export default App;