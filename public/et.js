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
            editButton.addEventListener("click", () => handleEditExpense(index));

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
        .then(response => response.json())
        .then(data => {
            console.log('Expense added successfully:', data);

            // Fetch and render the updated list of expenses from the server
            fetch('/expenses')
                .then(response => response.json())
                .then(data => {
                    renderExpenses(data);
                })
                .catch(err => {
                    console.error('Error fetching expenses:', err);
                });
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

function handleEditExpense(index) {
    console.log('Edit button clicked for index:', index);

    // Fetch the specific expense to edit from the server
    fetch(`/expenses/${index}`)
        .then(response => response.json())
        .then(data => {
            amountInput.value = data.amount !== undefined ? data.amount : "";
            descriptionInput.value = data.description !== undefined ? data.description : "";

            editIndex = index;
        })
        .catch(err => {
            console.error('Error fetching expense:', err);
        });
}


// Handle form submission for both adding and editing expenses
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
            method: 'PUT', // Use PUT method to update
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedExpense),
        })
            .then(response => {
                if (response.status === 200) {
                    // Update the expense in the frontend
                    renderExpenses(expenses); // Re-render expenses from data, no need for expenses array
                } else {
                    console.error('Error updating expense:', response.statusText);
                }
            })
            .catch(err => {
                console.error('Error:', err);
            });

        editIndex = null;
    } else {
        addExpense(amount, description);
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
