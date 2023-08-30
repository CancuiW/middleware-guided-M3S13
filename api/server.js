const express = require('express'); // importing a CommonJS module
const morgan= require('morgan');
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

//custom middleware
function customMorgan(req,res,next){
  console.log(`you made a ${req.method} request`);
  next();
}

server.use(express.json());

//morgan is a function that takes configuration, because the middleware is configurable
// output in the terminal in every server operation -----> GET / 304 3.835 ms - -
//304----'not modified'
server.use(morgan('dev'));
server.use(customMorgan);
//compare the sequence of 'server.use(morgan('dev'))'and 'server.use(customMorgan);',
//since the speed of retun 'server.use(customMorgan);'is faster then 'server.use(morgan('dev'))'
//so, you made a GET request 在前
//    GET / 304 4.068 ms - - 在后

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  res.send(`
    <h2>Hubs API</h2>
    <p>Welcome to the Hubs API</p>
  `);
});

server.use('*', (req, res) => {
  // catch all 404 errors middleware
  res.status(404).json({ message: `${req.method} ${req.baseUrl} not found!` });
});

module.exports = server;
