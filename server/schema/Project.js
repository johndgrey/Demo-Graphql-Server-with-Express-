
// MongoDB Models
const Project = require('../models/Project');
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
  GraphQLEnumType,
} = require('graphql');

/*
/* Anfang:  Typ Definitionen 
*/

// Client Type
const ClientRelationType = new GraphQLObjectType({ // Object Erstellen für GraphQl
  name: 'ClientRelationType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

// Project Type
const ProjectType = new GraphQLObjectType({
  name: 'ProjectType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: { // Beziehung zu Client
      type: ClientRelationType,
      resolve(parent, args) {
        return Client.findById(parent.clientId); // MongoDB Funkionen 
        // return clients.find((client) => client.id === parent.clientId); // Werte aus der Datei (sampleDate.js)
      },
    },
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
const ProjectRootQuery = new GraphQLObjectType({
  name: 'ProjectRootQuery',
  fields: {
    projects: {
      type: new GraphQLList(ProjectType), // Ausgabe als Liste vom Typ Projekt
      resolve(parent, args) {
        return Project.find();
        //return projects;
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) { // Rückgabe
        return Project.findById(args.id);
        // return projects.find((project) => project.id === args.id);
      },
    }
  },
});

/**
 * 
 * Mutations
 * 
 */ 

const ProjectRootMutation = new GraphQLObjectType({
  name: 'ProjectRootMutation',
  fields: {
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

const ProjectSchema = {
  queries: ProjectRootQuery,
  mutations: ProjectRootMutation,
};

module.exports = ProjectSchema