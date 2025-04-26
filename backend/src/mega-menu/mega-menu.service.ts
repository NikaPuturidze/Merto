import { Injectable, OnModuleInit } from '@nestjs/common'
import { Db, MongoClient } from 'mongodb'

@Injectable()
export class MegaMenuService implements OnModuleInit {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(process.env.DATABASE_URL!)
  }

  async onModuleInit() {
    try {
      await this.client.connect()
      this.db = this.client.db('Merto')
    } catch (err) {
      throw new Error('MongoDB connection failed', err as Error)
    }
  }

  async getMegaMenu(acceptLanguage: string) {
    const data = await this.db.collection('mega-menu').findOne({}, { projection: { [acceptLanguage]: 1, _id: 0 } })

    return data?.[acceptLanguage]
  }
}
