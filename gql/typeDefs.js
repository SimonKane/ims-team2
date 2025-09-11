// typedefs
export const typeDefs = /* GraphQL */ `

type Contact {
    name: String!
    email: String!
    phone: String!
}

type Manufacturer { 
    name: String!
    country: String!
    website: String!
    description: String!
    address: String!
    contact: Contact!
}

type Product {
    id: ID!
    name: String!
    sku: String!
    description: String!
    price: Float!
    category: String!
    manufacturer: Manufacturer!
    amountInStock: Int!
    createdAt: String!
    updatedAt: String!
}

type Query {  
    products: [Product!]!
    product(id: ID!): Product


   //Fetch all unique manufacturers, contacts? 
}

input ProductInput {
  name: String!
  sku: String!
  description: String!
  price: Float!
  category: String!
  amountInStock: Int!
}

input ContactInput {
    name: String!
    email: String!
    phone: String!
}

input manufacturerInput {
    name: String!
    country: String!
    website: String!
    description: String!
    address: String!
    contact: ContactInput!
}

type mutation {
    addProduct(productInput: ProductInput!, manufacturerInput: manufacturerInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
}


`;