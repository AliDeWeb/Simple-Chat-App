import { createServer } from 'http';
import path from 'path';
import express, {
  Request,
} from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config({
  path: `.env`,
});

const port =
  Number(process.env.PORT) || 3000;

const app = express();
app.use(
  express.static(
    path.join(process.cwd(), 'public'),
  ),
);
app.get(
  '/',
  (req: Request, res: any) => {
    res.sendFile(
      path.join(
        process.cwd(),
        'public',
        'index.html',
      ),
    );
  },
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
