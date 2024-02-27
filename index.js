const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoute = require('./src/routes/auth.route');
const adminRoute = require('./src/routes/admin.route');
const PORT = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute)
app.get('/', (req, res)=>{
    res.send('working')
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})