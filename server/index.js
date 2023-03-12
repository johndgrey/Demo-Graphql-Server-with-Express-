const express = require('express');
const colors = require('colors');
const cors = require('cors');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

const app = express();

/**
 * Connect to database
 */
// connectDB();

app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development', //Achtung: Nur im development. https://www.gatsbyjs.com/docs/how-to/querying-data/running-queries-with-graphiql/
  })
);

app.listen(port, console.log(`\n#\t Server running on port ${port} \n#\t Go To GraphiQL: http://localhost:${port}/graphql \n`));