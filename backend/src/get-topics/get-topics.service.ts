import { Injectable, OnModuleInit } from '@nestjs/common'
import { Db, MongoClient } from 'mongodb'
require('dotenv').config()

@Injectable()
export class GetTopicsService implements OnModuleInit {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(process.env.DATABASE_URL!)
  }

  async onModuleInit() {
    try {
      await this.client.connect()
      this.db = this.client.db('Merto')
      console.log(await this.db.collection('English').findOne())
    } catch (err) {
      throw new Error('MongoDB connection failed', err as Error)
    }
  }
}
