import { getCustomRepository, getRepository } from 'typeorm'
import Transaction from '../models/Transaction'
import Category from '../models/Category'
import TransactionsRepository from '../repositories/TransactionsRepository'
import AppError from '../errors/AppError'

export interface TransactionDTO {
  title: string
  value: number
  type: 'income' | 'outcome'
  category: string
}
class CreateTransactionService {
  public async execute(transactionDTO: TransactionDTO): Promise<Transaction> {
    const repository: TransactionsRepository = getCustomRepository(TransactionsRepository)
    const balance = await repository.getBalance()
    if (transactionDTO.type === 'outcome') {
      if (transactionDTO.value > balance.total) {
        throw new AppError('invalid value', 400)
      }
    }
    const categoryTitle = transactionDTO.category

    const category = await this.getCategoryFromName(categoryTitle)
    return repository.save(
      repository.create({
        category_id: category.id,
        title: transactionDTO.title,
        type: transactionDTO.type,
        value: transactionDTO.value,
        category
      })
    )
  }

  public async import(transactionsDTO: TransactionDTO[]): Promise<Transaction[]> {
    const categoryRepository = getRepository(Category)
    const transactionRepository = getCustomRepository(TransactionsRepository)
    const categories = transactionsDTO.map(transactionDTO => transactionDTO.category)
    const uniqueCategories = categories.reduce((acumulator: string[], category) => {
      if (!acumulator.includes(category)) acumulator.push(category)
      return acumulator
    }, [])
    const createdCategories = uniqueCategories.map(category => categoryRepository.create({ title: category }))
    const savedCategories = await categoryRepository.save(createdCategories)

    const transactions = transactionsDTO.map(transactionDTO => {
      const category = savedCategories.find(category => category.title === transactionDTO.category)
      if (!category) throw Error('something went wrong with categories')

      return transactionRepository.create({
        category_id: category.id,
        title: transactionDTO.title,
        type: transactionDTO.type,
        value: transactionDTO.value,
        category
      })
    })
    return transactionRepository.save(transactions)
  }

  private async getCategoryFromName(categoryName: string): Promise<Category> {
    const categoryRepository = getRepository(Category)
    const category = await categoryRepository.findOne({
      where: { title: categoryName }
    })
    if (category) return category

    const newCategory = categoryRepository.create({ title: categoryName })
    return categoryRepository.save(newCategory)
  }
}

export default CreateTransactionService
