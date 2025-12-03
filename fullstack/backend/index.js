const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// MongoDB connection URL
const MONGODB_URI = 'mongodb://localhost:27017/studentdb';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Middleware
app.use(cors()); // Allow frontend to access API
app.use(express.json()); // Parse JSON requests
app.use(bodyParser.json()); // Alternative JSON parser
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API server!' });
});

// Sample API route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working correctly!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


const Student = require('./models/Student');
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

// Lấy thông tin một học sinh theo ID (HTTP GET)
app.get('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(400).json({ error: error.message });
    }
});


// Tạo API thêm học sinh (HTTP POST)

app.post('/api/students', async (req, res) => {
    try {
        const { name, age, class: studentClass, gender } = req.body;
        const student = await Student.create({ name, age, class: studentClass, gender });
        res.status(201).json(student);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: 'Failed to create student' });
    }
});

// Tạo API cập nhật học sinh (HTTP PUT)
app.put('/api/students/:id', async (req, res) => {
    try {
        const { name, age, class: studentClass, gender } = req.body;
        const updatedData = { name, age, class: studentClass, gender };

        const updatedStu = await Student.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedStu) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json(updatedStu);
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(400).json({ error: err.message });
    }
});


//Tạo API xóa học sinh (HTTP DELETE)
app.delete('/api/students/:id', async (req, res) => {
    try {
        const deletedStu = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStu) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json(deletedStu);
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(400).json({ error: err.message });
    }
});