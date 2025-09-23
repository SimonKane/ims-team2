## Queries:

```
query Products($limit: Int) {
  products {
    id
    name
    sku
    description
    price
    category
    manufacturer {
      id
      name
      country
      website
      description
      address
      contact {
        name
        email
        phone
      }
    }
    amountInStock
  }
}
Variables:
{
   "limit": <Int, default är 10. Skicka inte med varaibeln om du vill använda defaultvärdet.>
}
```

```
query Product($productId: ID!) {
  product(id: $productId) {
    id
    name
    sku
    description
    price
    category
    manufacturer {
      id
      name
      country
      website
      description
      address
      contact {
        name
        email
        phone
      }
    }
    amountInStock
  }
}
//
Variables:
{
  "productId": <String, ObjectID>
}
```

```
query GetLowStock($threshold: Int) {
  getLowStock(threshold: $threshold) {
    items {
      id
      name
      amountInStock
    }
  }
}
//
Variables:
{
   "threshold": <Int, default är 100. Skicka inte med varaibeln om du vill använda defaultvärdet.>
}
```

```
query GetCriticalStock($threshold: Int) {
  getCriticalStock(threshold: $threshold) {
    items {
      id
      name
      amountInStock
    }
  }
}
//
Variables:
{
   "threshold": <Int, default är 10. Skicka inte med varaibeln om du vill använda defaultvärdet.>
}
```

```
query TotalStockValue {
  totalStockValue
}
```

```
query GetAllManufacturers {
  getAllManufacturers {
    id
    name
    country
    website
    description
    address
    contact {
      name
      email
      phone
    }
  }
}
```

```
query TotalStockValueByManufacturer {
  totalStockValueByManufacturer {
    manufacturer
    totalStockValue
  }
}
```

## Mutations:

```
mutation AddProduct($productInput: ProductInput!) {
  addProduct(productInput: $productInput) {
    id
    name
    sku
    description
    price
    category
    amountInStock
    createdAt
  }
}
//
Variables:
{
  "productInput": {
    "name": <String>,
    "sku": <String>,
    "description": <String>,
    "price": <Int>,
    "category": <String>,
    "amountInStock": <Int>,
    "manufacturerId": <String, skicka med ObjectID från en befintlig manufacturer.>
  }
}
```

```
mutation UpdateProduct($updateProductId: ID!, $updateInput: updateProductInput!) {
  updateProduct(id: $updateProductId, updateInput: $updateInput) {
    id
    name
    sku
    description
    price
    category
    amountInStock
    updatedAt
  }
}
//
Variables:
{
    "updateProductId": "68d2743038aed017299dfd7f",
    "updateInput": {
    "name": <String>,
    "sku": <String>,
    "description": <String>,
    "price": <Int>,
    "category": <String>,
    "amountInStock": <Int>,
  }
}
```

```
mutation DeleteProduct($deleteProductId: ID!) {
  deleteProduct(id: $deleteProductId) {
    id
    name
    sku
    description
    price
    category
    amountInStock
    createdAt
    updatedAt
  }
}
//
Variables:
{
  "deleteProductId": <String, skicka med ObjectID från en befintlig product.>
}
```
