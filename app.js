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

app.get('/expenses', (req,res) =>{
    db.query('SELECT * FROM expense', (err, result) =>{
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'An error occurred while retrieving expenses.' });
        }
        res.json(result);
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