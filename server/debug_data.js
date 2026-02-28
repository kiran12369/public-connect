const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config();

const checkDB = async () => {
    try {
        // Connect to the SAME database as the server
        // Note: If the server is using in-memory fallback, this separate process CANNOT see it.
        // We can only check if it is using MongoDB.
        if (!process.env.MONGO_URI) {
            console.log("No MONGO_URI, assuming in-memory DB or local config.");
            // If in-memory, we can't check it from here.
            // We'll rely on hitting the API.
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const count = await Service.countDocuments();
        console.log(`Service Count: ${count}`);

        const services = await Service.find({});
        console.log("Services:", JSON.stringify(services, null, 2));

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error checking DB:", error);
    }
};

// Also try to fetch via HTTP to be sure what the running server returns
const http = require('http');

const fetchFromApi = () => {
    console.log("Fetching from running API...");
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/services',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`API STATUS: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log("API DATA LENGTH:", data.length);
            console.log("API DATA SAMPLE:", data.substring(0, 200));
            try {
                const json = JSON.parse(data);
                console.log("API Array Length:", json.length);
                if (json.length > 0) {
                    console.log("First item category:", json[0].category);
                }
            } catch (e) { console.log("Invalid JSON from API"); }
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    req.end();
}

fetchFromApi();
