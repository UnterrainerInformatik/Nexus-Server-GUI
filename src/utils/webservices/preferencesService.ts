import { BaseService } from '@/utils/webservices/interfaces/BaseService'

export class PreferencesService extends BaseService {
  private static instanceField: PreferencesService

  constructor () {
    super('uinf', 'preferences')
  }

  public static getInstance () {
    if (!this.instanceField) {
      this.instanceField || (this.instanceField = new PreferencesService())
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

  public async upsertByUserName (userName: string, dataProvider: () => object): Promise<any> {
    return this.getByUserName(userName).then((entity) => {
      if (entity != null) {
        entity = Object.assign(entity, dataProvider())
        console.log(entity)
        return this.put(entity.id, () => entity)
      }
      return this.post(dataProvider)
    })
  }
}

export const singleton = PreferencesService.getInstance()
