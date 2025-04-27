import { Injectable, OnModuleInit } from '@nestjs/common'
import { Db, MongoClient } from 'mongodb'
require('dotenv').config()

@Injectable()
export class CatalogService implements OnModuleInit {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(process.env.DATABASE_URL!)
  }

  async onModuleInit() {
    try {
      await this.client.connect()
      this.db = this.client.db('Merto')
      await this.db.collection('productsKA').createIndex({ categoryId: 1 })
    } catch (err) {
      throw new Error('MongoDB connection failed', err as Error)
    }
  }

  async getCatalog(catId: string, page = 1, size = 28) {
    const MAX_SIZE = 56
    const safePage = Math.max(1, page)
    const safeSize = Math.min(Math.max(1, size), MAX_SIZE)

    const skip = (safePage - 1) * safeSize

    const [items, total] = await Promise.all([
      this.db
        .collection('productsKA')
        .find({ categoryId: Number(catId) }, { projection: { _id: 0 } })
        .skip(skip)
        .limit(safeSize)
        .toArray(),
      this.db.collection('productsKA').countDocuments({ categoryId: Number(catId) }),
    ])

    return {
      items,
      page: safePage,
      size: safeSize,
      total,
      totalPages: Math.ceil(total / safeSize),
    }
  }
}
