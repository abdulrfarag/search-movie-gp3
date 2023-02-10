const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    movieCount: Int
    savedMovies: [Movie]
  }

  type Movie {
    movieId: ID!
    authors: [String]
    description: String
    image: String
    link: String
    title: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  input MovieInput {
    authors: [String]
    description: String!
    movieId: String!
    image: String
    link: String
    title: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveMovie(movieData: MovieInput!): User
    removeMovie(movieId: ID!): User
  }
`;

module.exports = typeDefs;
