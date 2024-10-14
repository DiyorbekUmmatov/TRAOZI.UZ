// server.js

const express = require('express');
const SerialPort = require('serialport');
const cors = require('cors');

const app = express();
const port = 3000; // Sizning server portingiz

app.use(cors()); // CORS muammolarini hal qilish uchun
app.use(express.json());

// RS-232 portini ochish (o'zingizning portingizni va baudrate ni almashtiring)
const serialPort = new SerialPort({
    path: 'COM3', // COM portini moslashtiring
    baudRate: 9600,
});

// O'qish parserini o'rnating
const parser = serialPort.pipe(new SerialPort.parsers.Readline({ delimiter: '\n' }));

let currentWeight = 0; // Hozirgi og'irlikni saqlash

// Ma'lumot olinganda ishlaydigan funksiya
parser.on('data', (data) => {
    console.log(`Olingan ma'lumot: ${data}`);
    currentWeight = data; // Olingan ma'lumotni saqlang
});

// Ma'lumotlarni yuborish uchun endpoint
app.get('/data', (req, res) => {
    const weightData = { weight: currentWeight }; // Olingan ma'lumotni qaytarish
    res.json(weightData);
});

// Serverni ishga tushirish
app.listen(port, () => {
    console.log(`Server http://localhost:${port} da ishlayapti`);
});
