const express = require('express');
const expressGraphQL = require('express-graphql');
const app = express();
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require('graphql');

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'HelloWorld', // cant have a space here
        fields: () => ({
            message: { 
                type: GraphQLString,
                resolve: () => 'Hello World'
            }
        })
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType), // we wrap this around BookType because its a list
            description: 'List of Books',
            resolve: () => books
        }
    })
})

app.use('/graphql', expressGraphQL({
    schema, schema,
    graphiql: true
}))

app.listen(4000)
console.log('Listening...')