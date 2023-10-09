//app,js
const express = require('express');
const db = require('./util/db');
const bodyParser = require('body-parser');
const expensesRoute = require('./routes/expensesRoute'); // Import your expense routes

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

// Use the expense routes
app.use('/', expensesRoute);

app.get('/expenses/:id', (req, res) => {
    const expenseId = parseInt(req.params.id);

    // Use your database query to fetch the expense by ID
    db.query('SELECT * FROM expense WHERE id = ?', [expenseId], (err, results) => {
        if (err) {
            console.error('Error fetching expense', err);
            return res.status(500).json({ error: 'An error occurred while fetching the expense.' });
        }

        if (results.length === 0) {
            // Expense not found, return a 404 response with an appropriate error message
            return res.status(404).json({ error: 'Expense not found' });
        }

        const expense = results[0]; // Assuming there's only one result
        res.json(expense);
    });
});



app.post('/expenses', (req,res) =>{
    const {amount, description} = req.body;

    if (!amount || !description) {
        return res.status(400).json({ error: 'Both amount and description are required.' });
    }

    db.query('INSERT INTO expense (Amount, Description) VALUES (?, ?)', [amount,description], (err, result) => {
        if(err){
            console.error('Error inserting expense', err);
            return res.status(500).json({ error: 'An error occurred while adding the expense.' });
        }
        res.status(201).json({id : result.insertId});
    });
});


app.delete('/expenses/:id', (req, res) => {
    const expenseId = req.params.id;

    db.query('DELETE FROM expense WHERE id = ?', [expenseId], (err, result) => {
        if (err) {
            console.error('Error deleting expense', err);
            return res.status(500).json({ error: 'An error occurred while deleting the expense.' });
        }
        res.status(200).json({ message: 'Expense deleted successfully.' });
    });
});

app.listen(port, ()=>{
    console.log('Server is running on port 3000');
});