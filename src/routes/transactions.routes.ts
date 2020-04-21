import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (_, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  const transactions = await repository.find({ relations: ['category'] });
  const balance = {
    income: 0,
    outcome: 0,
    total: 0,
  };
  transactions.forEach(transaction => {
    if (transaction.type === 'outcome') {
      balance.outcome += transaction.value;
      balance.total -= transaction.value;
    } else {
      balance.income += transaction.value;
      balance.total += transaction.value;
    }
  });
  response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const transaction = { title, value, type, category };
  const savedTransaction = await new CreateTransactionService().execute(
    transaction,
  );
  response.json(savedTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  const { id } = request.params;
  const deleted = await repository.delete(id);
  response.json(deleted);
});

// transactionsRouter.post('/import', async (request, response) => {
//   // TODO
// });

export default transactionsRouter;
