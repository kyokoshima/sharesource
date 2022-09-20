import { Repository } from "./Repository";

export class OrganizationRepository extends Repository {
  getConteinerId(): string {
    return 'organizations'
  }

}