import { Injectable, OnModuleInit } from '@nestjs/common'
import { MongoClient, Db } from 'mongodb'

@Injectable()
export class FilterService implements OnModuleInit {
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

  async getFilter(acceptLanguage: string, categoryId: string) {
    const supportedLanguages = ['en', 'ka', 'ru']
    const language = supportedLanguages.includes(acceptLanguage) ? acceptLanguage : 'en'

    try {
      const data = await this.db
        .collection('filter')
        .findOne({ category: categoryId }, { projection: { [language]: 1, _id: 0 } })

      if (!data) {
        throw new Error(`Category with ID "${categoryId}" not found in the database.`)
      }

      const filterData = data[language]
      if (!filterData) {
        throw new Error(`No data found for category ID "${categoryId}" in language "${language}".`)
      }

      return filterData
    } catch (error) {
      console.error('Error retrieving filter data:', error.message)
      throw new Error('Error retrieving filter data.')
    }
  }
}
