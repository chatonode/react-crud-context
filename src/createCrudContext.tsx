import React, {
  type ReactNode,
  type Dispatch,
  useReducer,
  createContext,
  useContext,
} from 'react'

/**
 * Generic type for any asynchronous function
 */
type AsyncFunction<Args extends any[] = any[], Return = any> = (
  ...args: Args
) => Promise<Return>

/**
 * Type definition for a record of async operations
 */
type AsyncOperations = Record<string, AsyncFunction>

/**
 * Type for the state of a single operation "slice"
 */
type OpState<R> = {
  loading: boolean
  data: R | null
  error: Error | null
}

/**
 * Maps each operation key to its return type and state
 */
type StateMap<Ops extends AsyncOperations> = {
  [K in keyof Ops]: OpState<Awaited<ReturnType<Ops[K]>>>
}

/**
 * Actions scoped to each operation key with proper payload types
 */
type Action<Ops extends AsyncOperations> =
  | { type: 'start'; op: keyof Ops }
  | {
      type: 'success'
      op: keyof Ops
      payload: Awaited<ReturnType<Ops[keyof Ops]>>
    }
  | { type: 'failure'; op: keyof Ops; error: Error }

/**
 * Context return type (for better intellisense)
 */
type CrudContextType<Ops extends AsyncOperations> = {
  state: StateMap<Ops>
  actions: {
    [K in keyof Ops]: (...args: Parameters<Ops[K]>) => Promise<void>
  }
}

/** Single reducer that updates only the slice for action.op */
function reducer<Ops extends AsyncOperations>(
  state: StateMap<Ops>,
  action: Action<Ops>
): StateMap<Ops> {
  const slice = state[action.op]
  switch (action.type) {
    case 'start':
      const startState = {
        ...state,
        [action.op]: { ...slice, loading: true, error: null },
      }
      // logState<StateMap<Ops>, Ops>(startState, action.op, action.type)
      return startState
    case 'success':
      const successState = {
        ...state,
        [action.op]: { loading: false, data: action.payload, error: null },
      }
      // logState<StateMap<Ops>, Ops>(successState, action.op, action.type)
      return successState
    case 'failure':
      const failureState = {
        ...state,
        [action.op]: { ...slice, loading: false, error: action.error },
      }
      // logState<StateMap<Ops>, Ops>(failureState, action.op, action.type)
      return failureState
    default:
      return state
  }
}

export function createCrudContext<Ops extends AsyncOperations>(ops: Ops) {
  type SM = StateMap<Ops>
  const initialState = (Object.keys(ops) as (keyof Ops)[]).reduce(
    (acc, key) => {
      acc[key] = { loading: false, data: null, error: null }
      return acc
    },
    {} as SM
  )

  const Ctx = createContext<CrudContextType<Ops> | null>(null)

  function CrudProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer<Ops>, initialState)

    // wrap each op so it dispatches start/success/failure with its own key
    function wrap<K extends keyof Ops>(key: K, fn: Ops[K]) {
      return async (...args: Parameters<Ops[K]>): Promise<void> => {
        dispatch({ type: 'start', op: key })
        try {
          const result = await fn(...args)
          dispatch({ type: 'success', op: key, payload: result })
        } catch (error) {
          dispatch({
            type: 'failure',
            op: key,
            error: error as Error, // instanceof Error ? error : new Error(String(error)),
          })
        }
      }
    }

    const actions = (Object.keys(ops) as (keyof Ops)[]).reduce((acc, key) => {
      acc[key] = wrap(key, ops[key])
      return acc
    }, {} as CrudContextType<Ops>['actions'])

    return <Ctx.Provider value={{ state, actions }}>{children}</Ctx.Provider>
  }

  function useCrud(): CrudContextType<Ops> {
    const ctx = useContext(Ctx)
    if (!ctx) throw new Error('useCrud must be used within its Provider')
    return ctx
  }

  return { CrudProvider, useCrud }
}

/**
 * Logs the state of a specific operation with emojis and better formatting
 */
function logState<S extends StateMap<Ops>, Ops extends AsyncOperations>(
  state: S,
  op: keyof Ops,
  type: string
) {
  // Emojis based on action type
  const typeEmoji =
    type === 'start'
      ? '🔄'
      : type === 'success'
      ? '✅'
      : type === 'failure'
      ? '❌'
      : '📝'

  // Status indicator based on current state
  const statusEmoji = state[op].loading
    ? '⏳'
    : state[op].error
    ? '🚨'
    : state[op].data
    ? '📦'
    : '🔍'

  console.debug(
    `*** ${typeEmoji} ${String(op)} | ${type.toUpperCase()} ${statusEmoji} ***`
  )
  console.info(`State:`)
  console.info(`\n${JSON.stringify(state[op], null, 2)}`)
  console.debug('*************************')
}
