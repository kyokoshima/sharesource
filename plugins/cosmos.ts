import { Inject, NuxtApp } from '@nuxt/types/app'
import { CosmosClient } from '@azure/cosmos'

declare module '@nuxt/types' {
  interface NuxtApp {
    $cosmos: any
  }
}

export default ({ app }: { app: NuxtApp }, inject: Inject) => {
  const conenctionString = app.$config.COSMOS_CONNECTION_STRING || ''
  const databaseId = 'sharesource'
  // console.log('Load cosmos')
  // console.log(`Connection string ${conenctionString}`)
  const cosmos = {
    getDatabase: async () => {
      const client = new CosmosClient(conenctionString)

      const { database } = await client.databases.createIfNotExists({
        id: databaseId,
      })
      // console.log(database)
      return database
    },
    getContainer: async (containerId: string) => {
      const db = await cosmos.getDatabase()
      let container
      try {
        const containerResponse = await db.containers.createIfNotExists({
          id: containerId,
        })
        container = containerResponse.container
      } catch (error) {
        console.log(error)
      }
      return container
    },
    existBy: async (containerId: string, column: string, value: string) => {
      const query = `c.${column} = '${value}'`
      const result = await cosmos.query(containerId, query)
      return result.length > 0
    },
    existsByName: async (containerId: string, name: string) => {
      return await cosmos.existBy(containerId, 'name', name)
    },
    query: async (containerId: string, where: string) => {
      // const q = `select * from c where c.name = '${name}'`
      const q = `select * from c where ${where}`
      const container = await cosmos.getContainer(containerId)
      const { resources } = await container!.items.query(q).fetchNext()
      return resources
    },
    findAll: async (containerId: string) => {
      const q = 'select * from c'
      const container = await cosmos.getContainer(containerId)
      const { resources } = await container!.items.query(q).fetchAll()
      return resources
    },
    findBy: async (containerId: string, column: string, condition: string) => {
      let result = []
      const q = `select * from c where c.${column} = '${condition}'`
      const container = await cosmos.getContainer(containerId)
      try {
        const { resources } = await container!.items.query(q).fetchAll()

        result = resources
      } catch (error) {
        // In case of 404
        console.log(error)
      }
      return result
    },
    create: async <T>(containerId: string, item: T) => {
      const container = await cosmos.getContainer(containerId)
      try {
        console.log('create')
        const r = await container!.items.create(item)
        console.log(r)
        return r
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    delete: async (containerId: string, id: string) => {
      const container = await cosmos.getContainer(containerId)
      const r = await container?.item(id).delete()
      return r
    },
    upsert: async <T>(containerId: string, item: T) => {
      const container = await cosmos.getContainer(containerId)
      const r = await container?.items.upsert(item)
      return r
    },
  }
  // async getDatabase () => {
  //   const client = new CosmosClient (conenctionString)

  //   const { database } = await client.databases.createIfNotExists({ id: databaseId })
  //   // console.log(database)
  //   return database
  // },
  // async getContainer ( containerId : string ) : Promise<Container> {
  //   const database : Database  = await this.getDatabase();
  //     const { container } = await database.containers.createIfNotExists({
  //       id: containerId
  //     })
  //     return container
  // },
  inject('cosmos', cosmos)
}
