const express = require('express');

const app = express();

require('./routes/app.routes')(app);

app.listen(process.env.PORT, () => console.log(`HTTP Server up. Now go to http://localhost/ in your browser.`))