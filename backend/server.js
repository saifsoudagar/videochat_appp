// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const cosineSimilarity = require('./utils/cosineSimilarity');

const app = express();
const server = http.createServer(app);

// Allowed origins (adjust as needed)
const allowedOrigins = [
    process.env.CLIENT_URL, // e.g., "https://your-frontend-domain.com"
    "http://localhost:5173" // for local testing
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

// Authentication routes (if any)
app.use('/api/auth', authRoutes);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST']
    }
});

// Waiting queue for matching – store objects { socketId, interests }
let waitingQueue = [];
const SIMILARITY_THRESHOLD = 0.5;

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle interest-based matching
    socket.on('find-match', (data) => {
        const { userId, interests } = data;
        console.log(`User ${userId} (${socket.id}) requested a match with interests:`, interests);

        if (!Array.isArray(interests) || interests.length === 0) {
            console.error('No interests provided by user:', userId);
            socket.emit('match-error', { error: 'No interests provided.' });
            return;
        }

        let matchedSocket = null;
        let candidateIndex = -1;
        let maxSimilarity = 0;

        waitingQueue.forEach((entry, index) => {
            const sim = cosineSimilarity(interests, entry.interests);
            console.log(`Similarity between ${socket.id} and ${entry.socketId}: ${sim}`);
            if (sim >= SIMILARITY_THRESHOLD && sim > maxSimilarity) {
                maxSimilarity = sim;
                matchedSocket = entry.socketId;
                candidateIndex = index;
            }
        });

        if (matchedSocket) {
            waitingQueue.splice(candidateIndex, 1);
            console.log(`Matched ${socket.id} with ${matchedSocket} (similarity: ${maxSimilarity})`);
            // Notify both clients about the match
            io.to(socket.id).emit('match-found', { partnerSocketId: matchedSocket });
            io.to(matchedSocket).emit('match-found', { partnerSocketId: socket.id });
        } else {
            waitingQueue.push({ socketId: socket.id, interests });
            console.log(`No match available. User ${socket.id} added to waiting queue.`);
        }
    });

    // Relay WebRTC signaling data for video chat
    socket.on('signal', (data) => {
        console.log(`Relaying signal from ${socket.id} to ${data.target}`);
        io.to(data.target).emit('signal', { from: socket.id, signal: data.signal });
    });

    // Relay chat messages
    socket.on('send-message', (data) => {
        // data: { target, message }
        console.log(`Message from ${socket.id} to ${data.target}: ${data.message}`);
        if (data.target) {
            io.to(data.target).emit('receive-message', { from: socket.id, message: data.message });
        } else {
            console.error(`No target provided for message from ${socket.id}`);
        }
    });

    // When a user leaves the chat, remove them from the waiting queue.
    socket.on('leave-chat', () => {
        waitingQueue = waitingQueue.filter((entry) => entry.socketId !== socket.id);
        console.log(`User ${socket.id} left chat.`);
    });

    // Remove disconnected users from the waiting queue
    socket.on('disconnect', () => {
        waitingQueue = waitingQueue.filter((entry) => entry.socketId !== socket.id);
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});