# GraphQL Test Queries

## ✅ Working Login Mutation

```graphql
mutation Login {
  login(email: "test@example.com", password: "test123") {
    user {
      id
      name
      email
      bio
      followersCount
      followingCount
      postsCount
      createdAt
      updatedAt
    }
    token
  }
}
```

## ✅ Working Register Mutation

```graphql
mutation Register {
  register(name: "New User", email: "new@example.com", password: "password123") {
    user {
      id
      name
      email
    }
    token
  }
}
```

## ✅ Test Query

```graphql
query Me {
  me {
    user {
      id
      name
      email
      bio
      followersCount
      followingCount
      postsCount
    }
    token
  }
}
```

## ✅ Get All Users

```graphql
query Users {
  users {
    id
    name
    email
    bio
    followersCount
    followingCount
    postsCount
  }
}
```

## 🎯 Test Steps

1. **Open:** http://localhost:3001/graphql
2. **Copy** và **paste** query trên
3. **Click "Run" button**
4. **Check results**

## 🔑 Test Credentials

- **Email:** test@example.com
- **Password:** test123

- **Email:** user2@example.com  
- **Password:** password123

## 🚀 Frontend Connection

Sau khi GraphQL hoạt động, test từ frontend:

1. **Mở:** http://localhost:3000/simple-app
2. **Login** với credentials trên
3. **Check** Redux state và redirect
