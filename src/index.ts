import { createServer } from 'http';
import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config({
  path: `${__dirname}/.env`,
});

const port =
  Number(process.env.PORT) || 3000;

const app = express();
app.use(
  express.static(`${__dirname}/public`),
);
const httpServer = createServer(app);

const io = new Server(httpServer);

httpServer.listen(port, () => {
  console.log(
    'Listening on port: ' + port,
  );
});

// Socket.io
io.on('connection', (socket) => {
  console.log(socket.id + ' connected');

  socket.on('newMessage', (data) => {
    const date = new Date();
    io.emit(
      'newMessage',
      Object.assign(data, {
        time: `${String(date.getHours()).length === 2 ? date.getHours() : '0' + date.getHours()}:${String(date.getMinutes()).length === 2 ? date.getMinutes() : '0' + date.getMinutes()}`,
      }),
    );
  });
});
