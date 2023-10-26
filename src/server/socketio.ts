import { randomUUID } from 'node:crypto';

import { type Server } from 'socket.io';

export interface ServerToClientEvents {
  participantJoined: (participant: Participant) => void;
  participantLeft: (participantId: Participant['id']) => void;
  participantList: (participants: Participant[]) => void;
  messageAdded: (message: Message) => void;
  roomList: (rooms: string[]) => void;
}

export interface ClientToServerEvents {
  joinRoom: (roomName: string) => void;
  leaveRoom: (roomName: string) => void;
  changePseudo: (pseudo: Participant['pseudo']) => void;
  createMessage: (payload: {
    text: Message['text'];
    roomName?: string;
  }) => void;
}

interface InterServerEvents {}

interface SocketData {}

export type IoServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type Participant = {
  id: string;
  pseudo: string;
};

export type Message = {
  authorId: string;
  text: string;
  createdAt: number;
};

let participants: Participant[] = [];

const rooms: string[] = [];

/**
 *
 */
function handleSocketIo(io: IoServer) {
  io.on('connection', (socket) => {
    const id = randomUUID();
    const participant: Participant = {
      id,
      pseudo: `Anonymous-${id.split('-')[0]}`,
    };

    participants.push(participant);

    // Lorsque l'utilisateur rejoint
    // - on lui envoi la liste actuelle des participants
    socket.emit('participantList', participants);
    socket.emit('roomList', rooms);

    // - On envoi aux autres socket connectés (.broadcast = les autres sauf moi)
    socket.broadcast.emit('participantJoined', participant);

    socket.on('joinRoom', async (roomName) => {
      if (!rooms.includes(roomName)) {
        rooms.push(roomName);
        io.emit('roomList', rooms);
      }

      await socket.join(roomName);
    });

    // Lorsque l'utilisateur créé un message
    socket.on('createMessage', ({ text, roomName }) => {
      const message: Message = {
        text,
        authorId: participant.id,
        createdAt: Date.now(),
      };

      // On envoi le message à tous les sockets connectés y compris moi
      const to = roomName ? io.to(roomName) : io;
      to.emit('messageAdded', message);
    });

    socket.on('disconnect', () => {
      // Lorsque l'utilisateur se déconnecte, on averti les autres
      socket.broadcast.emit('participantLeft', participant.id);
      participants = participants.filter((p) => p.id !== participant.id);
    });
  });
}

export default handleSocketIo;
