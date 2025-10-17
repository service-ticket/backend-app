const express = require('express');
const cors = require('cors');
const feriasRoouterAdmin = require('./routes/routesFeriasAdmin/routesferiasAdmin')
const feriasRouter = require('./routes/routesFeriaStore/routesFeria')
const asccesAdminRouter = require('./routes/routesFeriasAdmin/routesAdminAccess')

const orderUserRouter = require('./routes/routerUser/routerUser')

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));


app.use(express.json());
//admin
app.use('/api', feriasRoouterAdmin);
app.use('/api', asccesAdminRouter);

//store
app.use('/api', feriasRouter);

//user

app.use('/api', orderUserRouter)

module.exports = app;