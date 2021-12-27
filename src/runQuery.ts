import { graphql, GraphQLSchema } from 'graphql'
import { ResponseBody, bodyParser } from '@caldwell619/common-aws-actions'

import { respond, waitForMs } from './util'

export const runQuery = async <TContext>(event: Event, graphqlOps: GraphQLOps<TContext>): Promise<ResponseBody> => {
  const { schema, resolvers, contextValue } = graphqlOps
  try {
    const { query, variables, operationName } = bodyParser<EventBody>(event.body)
    const result = await graphql({
      schema,
      source: query,
      rootValue: resolvers,
      contextValue,
      variableValues: variables,
      operationName
    })

    if (result.errors) console.error('Errors in resolver', result.errors)

    return respond(result, 200)
  } catch (error) {
    const typedError = error as TypedError
    console.error('Global error caught: ', typedError)
    console.error('error code: ', typedError.code)
    if (typedError.code === 'EAI_AGAIN') {
      await waitForMs(20)
      await runQuery(event, graphqlOps)
    }
    return respond(typedError, typedError.statusCode || 500)
  }
}

interface TypedError {
  code: string
  statusCode: number
}

export interface EventBody {
  query: string
  variables: Record<string, unknown>
  operationName: string
}

export interface Event {
  body: string
  headers: {
    [key: string]: string
  }
}
export interface GraphQLOps<TContext> {
  schema: GraphQLSchema
  resolvers: unknown
  contextValue: TContext
}
