import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';
import Transaction from '../models/Transaction';

const transactionsRouter = Router();

transactionsRouter.get('/', async (_, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  const transactions = await repository.find();
  response.json(transactions);
});

// transactionsRouter.post('/', async (request, response) => {
//   const { title, value, type, category } = request.body;
//   const transaction: Transaction = { title, value, type, category };
//   new CreateTransactionService();
//   // TODO
// });

// transactionsRouter.delete('/:id', async (request, response) => {
//   // TODO
// });

// transactionsRouter.post('/import', async (request, response) => {
//   // TODO
// });

export default transactionsRouter;
