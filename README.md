# Demo-Graphql-Server-with-Express
## Demo Graphql Server for first practising

Small experimental demo / to play with Graphql queries and mutations with integration of MongoDB. 
Alternative locale data holding in the form of JS files.

RUN Demo (development mode) with:
- npm run dev
- Go To GraphiQL: http://localhost:5000/graphql

**Tools / Frameworks**
- nodemon (monitor for any changes in nodejs)
- express
- express-graphql
- graphql
- mongoose


## GraphiQL

In this guide, you’ll be learning to use something called GraphiQL, a tool that helps you structure GraphQL queries correctly. 
Read More: 
- https://github.com/graphql/graphiql/tree/main/packages/graphiql
- https://www.gatsbyjs.com/docs/how-to/querying-data/running-queries-with-graphiql/


## GraphQL Queries & Mutations

These are the GraphQL queries and mutations for the YouTube course.

### Get names of all clients
```
{
  clients {
    name
  }
}
```

### Get a single client name and email
```
{
  client(id: 1) {
    name
    email
  }
}
```

### Get name and status of all projects
```
{
  projects {
    name
    status
  }
}
```

### Get a single project name, description along with the client name and email
```
{
  project(id: 1) {
    name
    description,
    client {
      name
      email
    }
  }
}
```

### Create a new client and return all data
```
mutation {
  addClient(name: "Tony Stark", email: "ironman@gmail.com", phone: "955-365-3376") {
    id
    name
    email
    phone
  }
}
```

### Delete a client and return id
```
mutation {
  deleteClient(id: 1) {
    id
  }
}
```

### Create a new project and return name and description
```
mutation {
  addProject(name: "Mobile App", description: "This is the project description", status: "new", clientId: "1") {
   name
   description
  }
}
```

### Update a project status and return name and status
```
mutation {
  updateProject(status: "completed") {
   name
   status
  }
}
```
