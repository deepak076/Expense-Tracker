// /public/et.js
const appContainer = document.getElementById("expenseList");
const expenseForm = document.getElementById("expenseForm");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");

let editIndex = null;

function renderExpenses(data) {
    appContainer.innerHTML = "";

    if (!data || data.length === 0) {
        appContainer.innerHTML = '<li class="list-group-item text-center">No expenses found</li>';
    } else {
        data.forEach((expense, index) => {
            const amountText = expense.Amount !== undefined ? `Rs.${expense.Amount.toFixed(2)}` : 'N/A';
            const descriptionText = expense.Description !== undefined ? expense.Description : 'N/A';

            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `<b>Amount:</b> ${amountText}   <b>Description:</b> ${descriptionText}`;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "btn btn-danger";
            deleteButton.addEventListener("click", () => handleDeleteExpense(expense.id)); // Pass the expense ID

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "btn btn-primary";

            // Set the data-id attribute to the database ID
            editButton.setAttribute("data-id", expense.id);

            // Pass the data-id attribute value to handleEditExpense
            editButton.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                handleEditExpense(id);
            });

            li.appendChild(deleteButton);
            li.appendChild(editButton);

            appContainer.appendChild(li);
        });
    }
}

function addExpense(amount, description) {
    const newExpense = { amount, description };
    console.log('Sending data to server:', newExpense);
    fetch('/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
    })
        .then(response => {
            if (response.status === 201) {
                // Successfully added expense, return the added expense data
                return response.json();
            } else {
                console.error('Error adding expense:', response.statusText);
                throw new Error('Failed to add expense');
            }
        })
        .then(data => {
            console.log('Expense added successfully:', data);

            // Append the newly added expense to the current list of expenses
            expenses.push(data); // Assuming 'expenses' is an array that stores all expenses
            renderExpenses(expenses); // Render the updated list of expenses

            // Clear the input fields
            amountInput.value = "";
            descriptionInput.value = "";
        })
        .catch(err => {
            console.error('Error:', err);
        });
}

function handleDeleteExpense(id) {
    fetch(`/expenses/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.status === 200) {
                // Refresh expenses from the server after successful delete
                fetch('/expenses')
                    .then(response => response.json())
                    .then(data => {
                        renderExpenses(data);
                    })
                    .catch(err => {
                        console.error('Error:', err);
                    });
            } else {
                console.error('Error deleting expense:', response.statusText);
            }
        })
        .catch(err => {
            console.error('Error:', err);
        });
}

function handleEditExpense(id) {
    console.log('Edit button clicked for ID:', id);

    // Fetch the specific expense to edit from the server using the correct ID
    fetch(`/expenses/${id}`)
        .then(response => response.json())
        .then(data => {
            amountInput.value = data.amount !== undefined ? data.amount : "";
            descriptionInput.value = data.description !== undefined ? data.description : "";

            editIndex = id; // Use the correct ID
        })
        .catch(err => {
            console.error('Error fetching expense:', err);
        });
}

function handleForm(event) {
    event.preventDefault();
    const amount = parseFloat(amountInput.value);
    const description = descriptionInput.value.trim();

    if (isNaN(amount) || amount <= 0 || description === "") {
        alert("Please enter a valid input.");
        return;
    }

    if (editIndex !== null) {
        const updatedExpense = { amount, description };
        fetch(`/expenses/${editIndex}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedExpense),
        })
            .then(response => {
                if (response.status === 200) {
                    // Successfully updated expense, no need to maintain 'expenses' array
                    renderExpenses(); // Fetch and render expenses from the server
                } else {
                    console.error('Error updating expense:', response.statusText);
                }
            })
            .catch(err => {
                console.error('Error:', err);
            });

        editIndex = null;
    } else {
        const newExpense = { amount, description };
        console.log('Sending data to server:', newExpense);
        fetch('/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newExpense),
        })
            .then(response => {
                if (response.status === 201) {
                    // Successfully added expense, no need to maintain 'expenses' array
                    renderExpenses(); // Fetch and render expenses from the server
                } else {
                    console.error('Error adding expense:', response.statusText);
                }
            })
            .catch(err => {
                console.error('Error:', err);
            });
    }

    amountInput.value = "";
    descriptionInput.value = "";
}


expenseForm.addEventListener("submit", handleForm);
document.getElementById("cancelBtn").addEventListener("click", () => {
    editIndex = null;
    amountInput.value = "";
    descriptionInput.value = "";
});

window.addEventListener('load', () => {
    fetch('/expenses')
        .then(response => response.json())
        .then(data => {
            renderExpenses(data); // Call renderExpenses with the fetched data
        })
        .catch(err => {
            console.error('Error:', err);
        });
});
