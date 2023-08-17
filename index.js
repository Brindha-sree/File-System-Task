const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000; // You can change the port as per your preference

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// POST route to create and save the file with the current timestamp as content
app.post('/api/createFile', (req, res) => {
  const currentDate = new Date();
  const timestamp = currentDate.toISOString();
  const fileName = `${timestamp}.txt`;

  const fileContent = `This file was created at: ${timestamp}`;

  fs.writeFile(path.join(__dirname, fileName), fileContent, (err) => {
    if (err) {
      console.error('Error creating file:', err);
      return res.status(500).json({ error: 'Failed to create file.' });
    }

    console.log('File created successfully:', fileName);
    return res.download(path.join(__dirname, fileName), (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Delete the file after sending it to the client
      fs.unlink(path.join(__dirname, fileName), (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
