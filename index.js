const express = require('express');
const path = require('path')
const { Client } = require('pg')
const {v4} = require("uuid");
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
app.use(express.json())
app.use('/public', express.static('public'));
app.use('/dist', express.static('dist'));

app.get('/',  function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.post('/api/activities', async function(req, res) {
  //var data = await client.query(`INSERT INTO map.activities(id, lat, "long", name) VALUES ('${v4()}',${req.body.lat}, ${req.body.lng}, 'Auto Generated');`);
  res.send();
});

app.post('/api/activities/clicked', async function(req, res) {
  console.log(req.body);
  let userId = req.body.userId;
  let activityId = req.body.activityId;
  let clickType = req.body.clickType;
  let date = new Date();
  var data = await client.query(`INSERT INTO map.activity_clicked( user_id, date, type, activity_id, id) VALUES ('${userId}', '${date.toJSON()}', ${clickType}, '${activityId}', '${v4()}');`);
  res.send(data);
});


app.get('/api/activities/redirect/:activityId/:userId', async function(req, res) {

  var data = await client.query(`SELECT * FROM map.activities a WHERE a.id='${req.params.activityId}'`);
  let date = new Date();
  await client.query(`INSERT INTO map.activity_clicked( user_id, date, type, activity_id, id) VALUES ('${req.params.userId}', '${date.toJSON()}', 1, '${req.params.activityId}', '${v4()}');`);
  res.redirect(data.rows[0].url);
});



app.get('/api/activities/:userId', async function(req, res) {
  console.log(req.params.userId)
  var data = await client.query(`SELECT a.*, count(ac) FROM map.activities a
  left outer join map.activity_clicked ac on ac.activity_id=a.id AND ac.user_id='${req.params.userId}'
  group by a.id`)
  res.send(
      {
          data : data.rows
      }
  );
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));