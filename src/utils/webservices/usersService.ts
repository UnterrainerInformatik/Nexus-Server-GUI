import { BaseService } from '@/utils/webservices/interfaces/BaseService'

export class UsersService extends BaseService {
  private static instanceField: UsersService

  constructor () {
    super('uinf', 'users')
  }

  public static getInstance () {
    if (!this.instanceField) {
      this.instanceField || (this.instanceField = new UsersService())
    }
    return this.instanceField
  }

  public async getByUserName (userName: string): Promise<any> {
    return this.getList({ size: 1, additionalQueryParams: `&userName=${encodeURIComponent(userName)}` }).then((response) => {
      if (response.entries.length === 0) {
        return null
      }
      return response.entries[0]
    })
  }
}

export const singleton = UsersService.getInstance()
