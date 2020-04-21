import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (_, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  const transactions = await repository.find();
  response.json(transactions);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const transaction = { title, value, type, category };
  const savedTransaction = await new CreateTransactionService().execute(
    transaction,
  );
  response.json(savedTransaction);
});

// transactionsRouter.delete('/:id', async (request, response) => {
//   // TODO
// });

// transactionsRouter.post('/import', async (request, response) => {
//   // TODO
// });

export default transactionsRouter;
