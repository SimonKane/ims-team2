// typedefs
export const typeDefs = /* GraphQL */ `
  type Contact {
    name: String!
    email: String!
    phone: String!
  }

  type Manufacturer {
    id: ID!
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
    products(limit: Int = 10): [Product!]!
    product(id: ID!): Product!
    getLowStock(threshold: Int = 100): LowStockPayload!
    getCriticalStock(threshold: Int = 10): CriticalStockPayload!
    totalStockValue: Float!
    getAllManufacturers: [Manufacturer!]
    totalStockValueByManufacturer: [totalStockValue!]!
  }
  # Payloads för att kunna tweaka return från resolver med ett meddelande
  type CriticalStockPayload {
    items: [Product!]!
    message: String!
  }
  type LowStockPayload {
    items: [Product!]!
    message: String!
  }

  #Type för att returnera snyggt från totala värdet av alla produkter
  type totalStockValue {
    totalStockValue: Float!
    manufacturer: String
  }

  # Inputs
  input ProductInput {
    name: String!
    sku: String!
    description: String!
    price: Float!
    category: String!
    amountInStock: Int!
    manufacturerId: ID!
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
  input updateProductInput {
    description: String
    price: Float
    category: String
    amountInStock: Int
    manufacturerId: ID
  }

  type Mutation {
    addProduct(productInput: ProductInput!): Product!
    updateProduct(id: ID!, updateInput: updateProductInput!): Product!
    deleteProduct(id: ID!): Product!
  }
`;
