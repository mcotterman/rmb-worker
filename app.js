require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const RmbSerial = require('./modules/serial');

const showError = (err, req, res, next) => {
    res.status(err.status || 500).send(JSON.stringify({code: err.status || 500, message: err.message || "an unknown error has occured"}));
    console.log(`${err.status || 500} - ${err.message}`);
}

// Development logging
if(process.env.NODE_ENV === 'development') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
}

//Lame temporary authentication method
app.use((req,res,next) => {
    if(req.headers.authorization && req.headers.authorization == process.env.NODE_RMBWORKER_KEY) {
        console.log('Authenticated');
        return next();
    }
    const error = new Error('Unauthorized');
    error.status = 403;
    showError(error, req, res, next);
});

app.use(bodyParser.json());


const PORT = process.env.PORT || 4001;

app.get('/rmb', (req, res, next) => {
    res.send(JSON.stringify({message: 'online'}));
})

app.post('/rmb', (req, res, next) => {

    if(req.body.data && req.body.data.length < 20) {
        RmbSerial.sendRaw(req.body.data);
        return res.send(JSON.stringify({status: "sent", data: req.body.data}));
    }

    const error = new Error(`data parameter is required and must be less than 20 characters. (${JSON.stringify(req.body)})`);
    error.status = 500;
    next(error);
});

app.use(showError);

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT} as a worker`);
});