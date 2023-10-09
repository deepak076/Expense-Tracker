// controllers/expensesController.js

const db = require('../util/db'); // Import your MySQL connection

// Create a new expense
exports.createExpense = (req, res) => {
    const { amount, description } = req.body;
    
    if (!amount || !description) {
        return res.status(400).json({ error: 'Amount and description are required.' });
    }

    db.query('INSERT INTO expense (Amount, Description) VALUES (?, ?)', [amount, description], (err, result) => {
        if (err) {
            console.error('Error creating expense', err);
            return res.status(500).json({ error: 'An error occurred while adding the expense.' });
        }
        res.status(201).json({ id: result.insertId });
    });
};

// Get all expenses
exports.getAllExpenses = (req, res) => {
    db.query('SELECT * FROM expense', (err, result) => {
        if (err) {
            console.error('Error fetching expenses', err);
            return res.status(500).json({ error: 'An error occurred while retrieving expenses.' });
        }
        res.json(result);
    });
};

// Delete an expense by ID
exports.deleteExpenseById = (req, res) => {
    const expenseId = req.params.id;

    db.query('DELETE FROM expense WHERE id = ?', [expenseId], (err, result) => {
        if (err) {
            console.error('Error deleting expense', err);
            return res.status(500).json({ error: 'An error occurred while deleting the expense.' });
        }
        res.status(200).json({ message: 'Expense deleted successfully.' });
    });
};

// Update an expense by ID
exports.updateExpenseById = (req, res) => {
    const expenseId = req.params.id;
    const { amount, description } = req.body;

    if (!amount || !description) {
        return res.status(400).json({ error: 'Amount and description are required.' });
    }

    db.query('UPDATE expense SET Amount = ?, Description = ? WHERE id = ?', [amount, description, expenseId], (err, result) => {
        if (err) {
            console.error('Error updating expense', err);
            return res.status(500).json({ error: 'An error occurred while updating the expense.' });
        }
        res.status(200).json({ message: 'Expense updated successfully.' });
    });
};
