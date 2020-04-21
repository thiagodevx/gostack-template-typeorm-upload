// import AppError from '../errors/AppError';

import {
  getCustomRepository,
  TransactionRepository,
  getRepository,
} from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute(transactionDTO: TransactionDTO): Promise<Transaction> {
    const repository: TransactionsRepository = getCustomRepository(
      TransactionsRepository,
    );
    const categoryTitle = transactionDTO.category;
    const category = await this.getCategoryFromName(categoryTitle);
    return repository.save(
      repository.create({
        category_id: category.id,
        title: transactionDTO.title,
        type: transactionDTO.type,
        value: transactionDTO.value,
        category,
      }),
    );
  }

  private async getCategoryFromName(categoryName: string): Promise<Category> {
    const categoryRepository = getRepository(Category);
    const category = await categoryRepository.findOne({
      where: { title: categoryName },
    });
    if (category) return category;

    const newCategory = categoryRepository.create({ title: categoryName });
    return categoryRepository.save(newCategory);
  }
}

export default CreateTransactionService;
