import { Repository } from './Repository';
export class MemberRepository extends Repository {
  getConteinerId(): string {
    return 'members'
  }

  async existsByEmail(email : string) : Promise<boolean> {
    return await this.existsBy('email', email)
  }
}