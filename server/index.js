const colors = require('colors');
const cors = require('cors');

const express = require('express');
require('dotenv').config();

const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const ClientSchema = require('./schema/Clients');
const ProjectSchema = require('./schema/Project');

/**
 * Der Port, auf dem der Server laufen soll.
 * Wenn die Umgebungsvariable PORT vorhanden ist, wird dieser Wert verwendet.
 * Andernfalls wird der Standardwert 5000 verwendet.
 */
const PORT = process.env.PORT || 5000;

/**
 * Die URL des Servers.
 * Wenn die Umgebungsvariable URL vorhanden ist, wird dieser Wert verwendet.
 * Andernfalls wird der Standardwert 'http://localhost' verwendet.
 */
const URL = process.env.URL || 'http://localhost';

/**
 * Connect to database
 */
const connectDB = require('./config/db');
connectDB();


/**
 * Kombinieren der beiden Schemas
 */ 

const projectQueryConfig = ClientSchema.queries.toConfig();
const clientQueryConfig = ProjectSchema.queries.toConfig();

const projectMutationConfig = ClientSchema.mutations.toConfig();
const clientMutationConfig = ProjectSchema.mutations.toConfig();

const combinedSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Queries',
    fields: {
      ...projectQueryConfig.fields,
      ...clientQueryConfig.fields,
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutations',
    fields: {
      ...projectMutationConfig.fields,
      ...clientMutationConfig.fields,
    }
  })
});


/**
 *  Definiere eine individuelle CORS-Konfiguration
 */
const corsOptions = {
  origin: `${URL}:${PORT}`, // Erlaubte Domain / Origin-URL
  methods: ['GET', 'POST'], // Erlaubte HTTP-Methoden
  allowedHeaders: ['Content-Type', 'Authorization'], // Erlaubte Header
};

/**
 * Konfiguriert und startet einen Express-Server für eine GraphQL-API
 */
const app = express();
app.use(cors(corsOptions));
app.use(
  '/graphql',
  graphqlHTTP({
    schema: combinedSchema,
    graphiql: process.env.NODE_ENV === 'development', //Achtung: Nur im development. https://www.gatsbyjs.com/docs/how-to/querying-data/running-queries-with-graphiql/
  })
);
app.listen(PORT, console.log(`\n#\t Server running on port ${PORT} \n#\t Go To GraphiQL: http://localhost:${PORT}/graphql \n`));
