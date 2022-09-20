import { Repository } from "./Repository";

export class ProjectRepository extends Repository {
  getConteinerId(): string {
    return 'projects'
  }
  
}