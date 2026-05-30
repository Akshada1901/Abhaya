const express = require('express');
const path = require('path');
const app = express();

// Serve all static files (CSS, JS, Images) from the current folder
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Server is running! Check it out at http://localhost:3000');
});