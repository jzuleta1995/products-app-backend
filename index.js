const express = require('express');
const connectDB = require('./src/app/config/db');
const cors = require('cors');
const bodyParser = require('body-parser');

//Server configuration
const app = express();

app.use(express.json({ extended: true }));
app.use(bodyParser.urlencoded({extended: true}));

const PORT = process.env.PORT || 4000;

//Connect to database
connectDB();

//Routes configuration
app.use(cors({origin: '*'}));

app.use('/api/auth', require('./src/app/routes/auth'));
app.use('/api/users', require('./src/app/routes/users'));
app.use('/api/products', require('./src/app/routes/products'));
// serving static files
app.use('/api/uploads', express.static('./src/app/uploads'));

app.listen(PORT, () => {
    console.log(`The server is working in the port ${PORT}`);
});
