import { Router } from 'express'
import fs from 'fs'
import multer from 'multer'
import csv from 'csv-parse'
import { getCustomRepository, getRepository } from 'typeorm'
import TransactionsRepository from '../repositories/TransactionsRepository'
import CreateTransactionService, { TransactionDTO } from '../services/CreateTransactionService'
import multerConfiguration from '../config/multerConfiguration'
import Category from '../models/Category'

const upload = multer(multerConfiguration)
const transactionsRouter = Router()

transactionsRouter.get('/', async (_, response) => {
  const repository = getCustomRepository(TransactionsRepository)
  const transactions = await repository.find({ relations: ['category'] })
  const balance = await repository.getBalance()
  response.json({ transactions, balance })
})

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body
  const transaction = { title, value, type, category }
  const savedTransaction = await new CreateTransactionService().execute(transaction)
  response.json(savedTransaction)
})

transactionsRouter.delete('/:id', async (request, response) => {
  const repository = getCustomRepository(TransactionsRepository)
  const { id } = request.params
  const deleted = await repository.delete(id)
  response.json(deleted)
})

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const csvFile = request.file
  const informacoesCSV: string[][] = []
  fs.createReadStream(csvFile.path)
    .pipe(csv())
    .on('data', data => informacoesCSV.push(data))
    .on('end', async () => {
      const [, ...dados] = [...informacoesCSV]
      const transactions: TransactionDTO[] = []
      dados.forEach(async dado => {
        const title = dado[0].trim()
        const type = dado[1].trim() as 'income' | 'outcome'
        const value = parseFloat(dado[2].trim())
        const category = dado[3].trim()
        const transaction = { title, type, value, category }
        transactions.push(transaction)
      })
      const savedTransactions = await new CreateTransactionService().import(transactions)
      const randomRepo = getRepository(Category)
      const randomfind = await randomRepo.find()
      console.log(randomfind)
      response.json({ transactions: savedTransactions })
    })
})

export default transactionsRouter
