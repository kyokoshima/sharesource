import { Inject, NuxtApp } from '@nuxt/types/app'
import { cosmosRepositoryFactory, Repositories } from '../composables/factories/cosmosRepositoryFactory';

export default ({app}: {app:NuxtApp} , inject : Inject) => {
  const repositories = (name : keyof Repositories) => {
    return new (cosmosRepositoryFactory.get(name))(app)
  }
  inject('repositories', repositories)
}