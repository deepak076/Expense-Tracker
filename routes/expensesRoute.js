// routes/expensesRoute.js

const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expensesController');

// Create a new expense
router.post('/expenses', expensesController.createExpense);

// Get all expenses
router.get('/expenses', expensesController.getAllExpenses);

// Delete an expense by ID
router.delete('/expenses/:id', expensesController.deleteExpenseById);

router.put('/expenses/:id', expensesController.updateExpenseById);

module.exports = router;
