
// MongoDB Models
const Client = require('../models/Client');

// Simple Test Data
// const { clients, projects } = require('../sampleData');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

/*
/* Anfang:  Typ Definitionen 
*/
// Client Type
const ClientType = new GraphQLObjectType({ // Object Erstellen für GraphQl
  name: 'ClientType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});
/*
/* ENDE:  Typ Definitionen 
*/

/**
 * 
 * Queries / Abfragen
 * 
 */
const ClientRootQuery = new GraphQLObjectType({
  name: 'ClientRootQuery',
  fields: {
    client: {
        type: ClientType,
        args: {id: {type: GraphQLID}},
        resolve(parent, args) {
          return Client.findById(args.id); // Mongo
          //return clients.find((client) => client.id === args.id);
        }
    }, 

    clients: {
        type: new GraphQLList(ClientType),
        resolve(parent, args) {
          return Client.find();
          //return clients;
        }
    }
  },
});


/**
 * 
 * Mutations
 * 
 */ 

const ClientRootMutation = new GraphQLObjectType({
  name: 'ClientRootMutation',
  fields: {
    // Add a client
    addClient: {
      type: ClientType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLString }, // are nullable by default
        phone: { type: GraphQLString }, // are nullable by default
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });

        return client.save();
      },
    },

    // Delete a client
    deleteClient: {
      type: ClientType,args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        Project.find({ clientId: args.id }).then((projects) => {
          projects.forEach((project) => {
            project.deleteOne();
          });
        });

        return Client.findByIdAndRemove(args.id);
      },
    },
  },
});

const ClientSchema = {
  queries: ClientRootQuery,
  mutations: ClientRootMutation,
};

module.exports = ClientSchema