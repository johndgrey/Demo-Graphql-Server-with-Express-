
// MongoDB Models
const Project = require('../models/Project');
const Client = require('../models/Client');

// Simple Test Data
const { clients, projects } = require('../sampleData');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql');

/*
/* Anfang:  Typ Definitionen 
*/
// Project Type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: { // Beziehung zu Client
      type: ClientType,
      resolve(parent, args) {
        // return Client.findById(parent.clientId); // MongoDB Funkionen 
        return clients.find((client) => client.id === parent.clientId); // Werte aus der Datei (sampleDate.js)
      },
    },
  }),
});

// Client Type
const ClientType = new GraphQLObjectType({ // Object Erstellen für GraphQl
  name: 'Client',
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
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    client: {
        type: ClientType,
        args: {id: {type: GraphQLID}},
        resolve(parent, args) {
          // return Client.findById(args.id); // Mongo
          return clients.find((client) => client.id === args.id);
        }
    }, 
    clients: {
        type: new GraphQLList(ClientType),
        resolve(parent, args) {
          // return Client.find();
          return clients;
        }
    },
    projects: {
      type: new GraphQLList(ProjectType), // Ausgabe als Liste vom Typ Projekt
      resolve(parent, args) {
        // return Project.find();
        return projects;
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) { // Rückgabe
        // return Project.findById(args.id);
        return projects.find((project) => project.id === args.id);
      },
    }
  },
});

/**
 * 
 * Mutations
 * 
 */ 

const mutation = new GraphQLObjectType({
  name: 'Mutation',
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

    // Add a project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
          defaultValue: 'Not Started',
        },
        clientId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });

        return project.save();
      },
    },

    // Delete a project
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Project.findByIdAndRemove(args.id);
      },
    },

    // Update a project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        clientId: { type: new GraphQLNonNull(GraphQLID) },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
        },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
              clientId: args.clientId,
            },
          },
          { new: true } // Wenn keins vorhanden, wird ein neues Project Objekt erstellt
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});