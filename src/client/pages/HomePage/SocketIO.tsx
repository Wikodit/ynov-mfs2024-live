import { useEffect, useState } from 'react';
import { type Socket, io } from 'socket.io-client';

import {
  type ClientToServerEvents,
  type Message,
  type Participant,
  type ServerToClientEvents,
} from '../../../server/socketio';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

export const SocketIO: React.FC = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [inputValue, setInputValue] = useState('');
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  // const [roomMessage, setRoomMessages] = useState<Message[]>([]);

  useEffect(() => {
    /**
     *
     */
    function onConnect() {
      setIsConnected(true);
    }

    /**
     *
     */
    function onDisconnect() {
      setIsConnected(false);
    }

    /**
     *
     */
    const onParticipantJoined: ServerToClientEvents['participantJoined'] = (
      participant,
    ) => {
      console.log('onParticipantJoined', participant, participants);
      setParticipants((previousParticipants) => [
        ...previousParticipants,
        participant,
      ]);
    };

    const onParticipantLeft: ServerToClientEvents['participantLeft'] = (
      participantId,
    ) => {
      setParticipants((previousParticipants) =>
        previousParticipants.filter((p) => p.id !== participantId),
      );
    };

    const onParticipantList: ServerToClientEvents['participantList'] = (
      participantList,
    ) => {
      console.log('participantList', participantList);
      setParticipants(participantList);
    };

    const onRoomList: ServerToClientEvents['roomList'] = (roomList) =>
      setRooms(roomList);

    const onMessageAdded: ServerToClientEvents['messageAdded'] = (message) => {
      setMessages((previousMessages) => [...previousMessages, message]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('participantJoined', onParticipantJoined);
    socket.on('participantLeft', onParticipantLeft);
    socket.on('participantList', onParticipantList);
    socket.on('roomList', onRoomList);
    socket.on('messageAdded', onMessageAdded);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('participantJoined', onParticipantJoined);
      socket.off('participantLeft', onParticipantLeft);
      socket.off('participantList', onParticipantList);
      socket.off('roomList', onRoomList);
      socket.off('messageAdded', onMessageAdded);
    };
  }, []);

  const sendMessage = (roomName?: string) => {
    socket.emit('createMessage', { text: inputValue, roomName });
    setInputValue('');
  };

  const onRoomChange = (roomName: string | null) => {
    if (currentRoom !== null) socket.emit('leaveRoom', currentRoom);
    if (roomName !== null) socket.emit('joinRoom', roomName);
    setCurrentRoom(roomName);
  };

  return (
    <div>
      <h2>SocketIO</h2>
      <p>{isConnected ? 'Connected' : 'Disconnected'}</p>
      <h3>Participants</h3>
      <ul>
        {participants.map((participant) => (
          <li>{participant.pseudo}</li>
        ))}
      </ul>
      <h3>Messages Globaux</h3>
      <ul>
        {messages.map((message) => (
          <li>
            {message.authorId}: {message.text}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={inputValue}
        onChange={(event) => setInputValue(event.currentTarget.value)}
      />
      <button onClick={() => sendMessage()}>Envoyer</button>
      ---
      <h3>Messages Room</h3>
      <select
        onChange={(event) => {
          onRoomChange(event.target.value);
        }}
      >
        {rooms.map((room) => (
          <option value={room} selected={room === currentRoom}>
            {room}
          </option>
        ))}
      </select>
      <ul>
        {messages.map((message) => (
          <li>
            {message.authorId}: {message.text}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={inputValue}
        onChange={(event) => setInputValue(event.currentTarget.value)}
      />
      <button onClick={() => sendMessage()}>Envoyer</button>
    </div>
  );
};

export default SocketIO;
