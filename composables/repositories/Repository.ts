// import { Cosmos } from './Repository';


export abstract class Repository {
  app;
  constructor(app : any) {
    this.app = app
  }

  abstract getConteinerId() : string;
  findAll = async () => {
    // Cosmos.getContainer('organizations')
    const result = await this.app.$cosmos.findAll(this.getConteinerId())
    return result;
  }

  findBy = async (column : string, condition : string) => {
    const result = await this.app.$cosmos.findBy(this.getConteinerId(), column, condition)
    return result;
  }

  create =  async (name : string) => {
    const item = {name}
    console.log(item)
    const r = await this.app.$cosmos.create(this.getConteinerId(), item)
    return r
  }

  existsByName = async (name : string) => {
    return await this.app.$cosmos.existsByName(this.getConteinerId(), name)
  }

  existsBy = async (column : string, value : string) =>{
    return await this.app.$cosmos.existsBy(this.getConteinerId(), column, value)
  }

  delete = async (id : string) => {
    const r = await this.app.$cosmos.delete(this.getConteinerId(), id)
    console.log(r)
    return r
  }

  upsert = async<T> (item : T) => {
    const r = await this.app.$cosmos.upsert(this.getConteinerId(), item)
    console.log(r)
    return r
  }
}