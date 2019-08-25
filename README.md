# Bamazon

# API

## /api/products

#### GET

* q | query - A string containing a partial product name to search for

* p | page - What page of results to show.  Default 1

* dpt | department - restrict results to specified department name or number

* sortDirection - [asc | desc] sort results ascending or descending.  Default descending

* sortBy - [popularity | id | name] how to sort results

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

