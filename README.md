# Bamazon

# API

## /api/products

#### GET

* q | query - A string containing a partial product name to search for

* p | page - What page of results to show.  Default 1

* dpt | department - restrict results to specified department name or number

* sortDirection - [asc | desc] sort results ascending or descending.  Default descending

* sortBy - [popularity | id | name] how to sort results.  Default popularity (only popularity is currently implemented)

* n - number of results to show.  Default 20, Max 50

#### POST

Posting a new product requires authentication. 

```json
{
    "username": string,
    "password": string,
    "department": number,
    "price": number,
    "stock": number,
}
```

#### PUT

```json
{
    "username": string,
    "password": string,
    "id": optional number,
    "stock": optional number,
    "department": optional number
}
```

## /api/orders

#### POST

```json
[
    {
        "id": productId,
        "quantity": number
    },
    {
        "id": productId,
        "quantity": number
    }
    ...
]   
```

## /api/users

#### POST

Passwords are not stored in our database, but as the api is currently not https, please do not use a password that you use elsewhere.

```json
{
    "username": string,
    "password": string,
    "type": ['customer' | 'admin']
}
```

