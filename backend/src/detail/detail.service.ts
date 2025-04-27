import { Injectable, OnModuleInit } from '@nestjs/common'
import { MongoClient, Db } from 'mongodb'

@Injectable()
export class DetailService implements OnModuleInit {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(this.getEnvVar('DATABASE_URL'))
  }

  private getEnvVar(key: string): string {
    if (process.env[key]) {
      return process.env[key]
    } else {
      throw new Error(`Env ${key} is not defined`)
    }
  }

  async onModuleInit() {
    try {
      await this.client.connect()
      this.db = this.client.db('Merto')
    } catch (err) {
      throw new Error('MongoDB connection failed', err as Error)
    }
  }

  public async getProductDetails(productId: number) {
    try {
      const product = await this.db
        .collection('productsKA')
        .findOne({ id: Number(productId) }, { projection: { _id: 0 } })
      return product
    } catch (err) {
      throw new Error('Failed to fetch products', err as Error)
    }
  }
}
