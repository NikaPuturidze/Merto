import { Injectable, OnModuleInit } from '@nestjs/common'
import { MongoClient, Db } from 'mongodb'

@Injectable()
export class FilterService implements OnModuleInit {
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

  public async getFilter(categoryId: number, page = 1, size = 28) {
    const MAX_SIZE = 56
    const safePage = Math.max(1, page)
    const safeSize = Math.min(Math.max(1, size), MAX_SIZE)

    const skip = (safePage - 1) * safeSize

    try {
      const [specifications, priceRange] = await Promise.all([
        this.db
          .collection('productsKA')
          .aggregate([
            { $match: { categoryId: categoryId } },
            {
              $unwind: {
                path: '$specificationGroup',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: '$specificationGroup.specifications',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                'specificationGroup.specifications.specificationLinkedUrl': { $ne: null },
              },
            },
            {
              $group: {
                _id: '$specificationGroup.specifications.specificationName',
                id: { $first: '$specificationGroup.specifications.id' },
                category1: { $first: '$categoryName' },
                category2: { $first: '$subCategoryName' },
                values: {
                  $addToSet: {
                    id: '$specificationGroup.specifications.specificationMeaningId',
                    value: '$specificationGroup.specifications.specificationMeaning',
                  },
                },
              },
            },
            {
              $addFields: {
                categoryName: { $concat: ['$category2', '-', '$category1'] },
              },
            },
            {
              $project: {
                _id: 0,
                name: '$_id',
                id: 1,
                category1: 1,
                category2: 1,
                categoryName: 1,
                values: 1,
              },
            },
            { $skip: skip },
            { $limit: safeSize },
          ])
          .toArray(),

        this.db
          .collection('productsKA')
          .aggregate([
            {
              $match: {
                categoryId: categoryId,
              },
            },
            {
              $group: {
                _id: null,
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
              },
            },
          ])
          .toArray(),
      ])

      let minPrice: number | null = null
      let maxPrice: number | null = null

      if (specifications.length === 0) {
        return {
          httpStatusCode: 404,
          success: false,
          errors: [`Category with ID ${categoryId} not found`],
        }
      } else {
        minPrice = priceRange.length > 0 ? priceRange[0].minPrice : 0
        maxPrice = priceRange.length > 0 ? priceRange[0].maxPrice : 0
      }

      return {
        specifications,
        minPrice,
        maxPrice,
        httpStatusCode: 200,
        success: true,
      }
    } catch (error) {
      return {
        httpStatusCode: 500,
        success: false,
        errors: [(error as Error).message] as string[],
      }
    }
  }
}
