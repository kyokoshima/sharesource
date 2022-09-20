import { OrganizationRepository } from "../repositories/organizationRepository"
import { MemberRepository } from '../repositories/memberRepository';
import { ProjectRepository } from '../repositories/projectRepository';

export type Repositories = {
  organization: typeof OrganizationRepository
  member: typeof MemberRepository
  project: typeof ProjectRepository
}

const repositories : Repositories = {
  organization: OrganizationRepository,
  member: MemberRepository,
  project: ProjectRepository
}

export const cosmosRepositoryFactory = {
  
  get: (key : keyof Repositories) => {
    return repositories[key]
  }
}