const express = require('express');
const expressGraphQL = require('express-graphql');
const app = express();
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
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

app.use('/graphql', expressGraphQL({
    schema, schema,
    graphiql: true
}))

app.listen(4000)
console.log('Listening...')