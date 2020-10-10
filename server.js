const express = require('express');
const expressGraphQL = require('express-graphql');
const app = express();
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

const books = [
    { id: 1, name: 'test', authorId: 1 },
    { id: 2, name: 'test2', authorId: 2 }
]

const authors = [
    { id: 1, name: 'test' },
    { id: 2, name: 'test2' }
]

// better to use functions for fields so that they don't get called before being defined
const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({ // better to return a function than an object because BookType needs to be before AuthorType and AuthorType needs to be before BookType
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: { 
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            } 
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: { 
            type: new GraphQLList(BookType),
            resolve: (author) => books.filter(book => book.authorId === author.id) 
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A book',
            args: { // we specify what arguments we take in for our resolve
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id) 
        },
        author: {
            type: AuthorType,
            description: 'An Author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parents, args) => authors.find(author => author.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType), // we wrap this around BookType because its a list
            description: 'List of Books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of Authors',
            resolve: () => authors
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
                books.push(book)
                return book
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema, schema,
    graphiql: true
}))

app.listen(4000)
console.log('Listening...')