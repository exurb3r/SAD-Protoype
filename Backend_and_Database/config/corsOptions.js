const corsOptions = {
    origin: [
    'http://localhost:5173',
    'http://192.168.1.17:5173'
    ],

    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
};

module.exports = corsOptions;
