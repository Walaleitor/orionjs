import serializeSchema from './serializeSchema'
import getBasicResultQuery from './getBasicResultQuery'
import Model from '../../Model'
import resolver from '../../resolvers/resolver'

export default new Model({
  name: 'ResolverParams',
  schema: {},
  resolvers: {
    name: resolver({
      returns: String,
      resolve: async function({name, resolver}) {
        return name
      }
    }),
    params: resolver({
      returns: 'blackbox',
      resolve: async function({resolver}) {
        return await serializeSchema(resolver.params)
      }
    }),
    result: resolver({
      returns: String,
      resolve: async function({resolver}) {
        return resolver.returns.name
      }
    }),
    basicResultQuery: resolver({
      returns: String,
      resolve: async function({resolver}) {
        return await getBasicResultQuery({type: resolver.returns.schema})
      }
    })
  }
})
