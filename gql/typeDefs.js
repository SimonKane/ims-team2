// typedefs
export const typeDefs = `  #graphql
type Contact {
  id: ID!
  name: String!
  email: String!
  phone: String!
  createdAt: String!
  updatedAt: String!
}

type Manufacturer { 
  id: ID!
  name: String!
  country: String!
  website: String!
  description: String!
  address: String!
  contact: Contact!        # <- obligatorisk
  createdAt: String!
  updatedAt: String!
}

type Product {
  id: ID!
  name: String!
  sku: String!
  description: String!
  price: Float!
  category: String!
  manufacturer: Manufacturer!  # <- obligatorisk
  amountInStock: Int!
  createdAt: String!
  updatedAt: String!
}

type Query {  
  products: [Product!]!
  product(id: ID!): Product
  # ev. fler queries...
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

input ManufacturerInput {
  name: String!
  country: String!
  website: String!
  description: String!
  address: String!
  contact: ContactInput!
}

type Mutation {
    addProduct(productInput: ProductInput!, manufacturerInput: ManufacturerInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  
    addManufacturer(input: ManufacturerInput!): Manufacturer!
  }
`;