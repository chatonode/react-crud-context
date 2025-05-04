# `react-crud-context`

[![npm](https://img.shields.io/npm/v/react-crud-context)](https://www.npmjs.com/package/react-crud-context)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Zero-boilerplate CRUD state management** for React with full type safety. Perfect for apps that need direct control over API operations without caching magic.

Get type-safe CRUD operations in 3 steps:

```tsx
// 1. Create your custom context with your API operations
const { CrudProvider: UserProvider, useCrud: useUser } = createCrudContext({
  loadUsers: () => api.get('/users'), // 🟢 Types auto-inferred!
  createUser: (payload) => api.post('/users', payload),
});
```

```tsx
// 2. Wrap your component with provider
function App() {
  return (
    <UserProvider>
      <UserDashboard />
    </UserProvider>
  );
}
```

```tsx
// 3. Use anywhere in the component
function UserDashboard() {
  const { state, actions } = useUser()

  useEffect(() => {
    const handleFetchAll() = async () => {
      await actions.loadUsers() // Auto-manages loading/error states
    }

    handleFetchAll()
  }, [])

  const handleCreate = async () => {
    await actions.createUser({ name: 'John', email: 'johnexample.com' })
    if (state.createUser.error) {
      // ❌ Handle errors
    }
  }

  return (
    <div>
      {state.loadUsers.loading ? (
        <div>⏳ Loading users...</div>
      ) : (
        state.loadUsers.data?.map(user => (
          <div key={user.id}>👤 {user.name}</div>
        ))
      )}
    </div>
  )
}
```

---

## Features

- **Instant Setup** - Create CRUD context in less than 10 lines 💨
- **Type Safety** - Auto-inferred types from your API 🔒
- **Tiny Bundle** - 1.5kb (min+gzip) 📦
- **React Native Ready** - Works out of the box 📱

---

## Installation

```bash
npm install react-crud-context
```

**Requirements**:

- React 18+
- TypeScript 4.9+

---

## Core Usage

### 1. Create Context

Define your API operations directly:

```tsx
// context/UserContext.ts
import { createCrudContext } from 'react-crud-context';

export const { CrudProvider: UserProvider, useCrud: useUser } =
  createCrudContext({
    // Your API operations
    loadUsers: () => fetch('/users').then((res) => res.json()),
    createUser: (user) =>
      fetch('/users', {
        method: 'POST',
        body: JSON.stringify(user),
      }),
  });
```

### 2. Access State & Actions

```tsx
const { state, actions } = useUser();

// Read state
state.loadUsers.loading; // boolean
state.loadUsers.data; // User[] | null
state.loadUsers.error; // Error | null

// Trigger actions
await actions.loadUsers();
await actions.createUser(newUser);
```

---

## Advanced Type Safety

For full-stack type contracts, use the `CrudService` type:

```ts
// services/userService.ts
import type { CrudService } from 'react-crud-context/service';

type User = { id: string; name: string };

// Define strict API contracts
export const userService: Pick<CrudService<User>, 'GET_ALL' | 'POST'> = {
  GET_ALL: () => fetch('/users').then(handleResponse),
  POST: (payload) =>
    fetch('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
```

```tsx
// context/UserContext.ts
export const { CrudProvider, useCrud } = createCrudContext({
  // Reuse in context creation
  loadUsers: userService.GET_ALL,
  createUser: userService.POST,
});
```

### Generic Parameters (Optional)

```ts
CrudService<
  Entity,                                 // Your data model type (e.g., User)
  ID,                                     // ID type of your data model
  CreatePayload = Omit<Entity, 'id'>,     // Create request shape
  UpdatePayload = Partial<CreatePayload>  // Update request shape
>
```

---

## Real-World Patterns

### Form Submission

```tsx
const UserForm = () => {
  const { state, actions } = useUser();
  const [name, setName] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actions.createUser({ name });
    !state.createUser.error && setName('');
  };

  return (
    <form onSubmit={submit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button disabled={state.createUser.loading}>
        {state.createUser.loading ? 'Saving...' : 'Submit'}
      </button>
      {state.createUser.error && <p>Error creating user</p>}
    </form>
  );
};
```

### Mixed Operations

```ts
// Combine CRUD with custom endpoints
createCrudContext({
  // Standard CRUD
  loadPosts: () => api.get('/posts'),

  // Custom operation
  searchPosts: (query: string) =>
    api.get(`/posts/search?q=${encodeURIComponent(query)}`),
});
```

---

## FAQ

### ❓ How does this compare to react-query?

**Focus** - react-crud-context manages **local state** for API operations, while react-query focuses on **server state** with caching. Use together or standalone!

### ❓ Can I use numeric IDs or UUIDs?

The library **infers types directly from your service functions**:

```tsx
// TypeScript automatically knows id is number
createCrudContext({
  getUser: (id: number) => api.get<User>(`/users/${id}`),
  //          ^? (id: number) => Promise<User>
});
```

> **Recommended**: Use [`CrudService` generics](#generic-parameters-optional) for strict contracts.

### ❓ How to handle pagination?

```ts
createCrudContext({
  loadUsers: (page: number) => api.get(`/users?page=${page}`),
});
```

---

## License

React Crud Context is [MIT licensed](./LICENSE).
