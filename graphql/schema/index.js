/* ----------------------------------------------------
Node.js / schema for GraphQL

Updated: 03/11/2020
Author: Daria Vodzinskaia
Website: www.dariacode.dev
-------------------------------------------------------  */

const {buildSchema} = require('graphql');

module.exports = buildSchema(` 
type Task {
    _id: ID! 
    title: String!
    priority: Float!
    date: String
    complete: Boolean!
    start: String
    end: String
    intervalK: Float
    intervalN: String
    creator: User!
} 

type User {
    _id: ID!
    email: String!
    password: String
    createdTasks: [Task!]
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

type Sending {
    _id: ID!
    task: Task!
    user: User!
    createdAt: String!
    updatedAt: String!
}

input TaskInput {
    title: String!
    priority: Float!
    date: String
    complete: Boolean!
    start: String
    end: String
    intervalK: Float
    intervalN: String
}

input UpdateTaskInput {
    title: String
    priority: Float
    date: String
}

input UserInput {
    email: String!
    password: String!
}

type RootQuery {
    tasks: [Task!]!
    sendings: [Sending!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createTask(taskInput: TaskInput): Task
    createUser(userInput: UserInput): User
    sendTask(taskId: ID!): Sending!
    cancelSending(sendingId: ID!): Task!
    updateTask(taskId: ID!, taskInput: UpdateTaskInput): Task!
    completeTask(taskId: ID!): Task!
    deleteTask(taskId: ID!): Task!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
