const express = require('express');
const path = require('path')
const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5433,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

const app = express();
app.use('/public', express.static('public'));
app.use('/dist', express.static('dist'));

app.get('/',  function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

  app.get('/api/activities', async function(req, res) {
    var data = await client.query("SELECT * FROM map.activities")
    res.send(
        {
            data : data.rows
        }
    );
  });

app.listen(3000, () => console.log('Example app is listening on port 3000.'));