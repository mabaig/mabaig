var expressModule = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var newrelic = require('newrelic');

// Build the schema, using GraphQL schema language
var schema = buildSchema(`
  type StatusObject {
    id: ID!
    statusCode: String!
    statusName: String!
  }
  type Query {
    simpleSearch: String

    searchQuerySimple(name: String, status: String): String!

    searchQueryToReturnObject(name: String, status: String): [StatusObject!]!
  }
`);

//  Resolver function for each endpoint
var root = {
  simpleSearch: () => {
    return 'Hello world!';
  },
  searchQuerySimple: (params) => {
    console.log(params);
    return 'Response =>  Name:' + params.name + ', Status:' + params.status;
  },
  searchQueryToReturnObject: (params) => {
    console.log(params);
    let statusObjArr = [{ statusCode: params.status.toUpperCase(), statusName: params.status }];
    console.log(statusObjArr);
    return statusObjArr;
  }
};

var app = expressModule();
newrelic.instrumentLoadedModule(
  'express',    // the module's name, as a string
  expressModule // the module instance
);
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
