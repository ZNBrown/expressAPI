const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
let items = [
    {id: 1, activity: "Call Bob for a catch up", priority: "medium", dueDate: "05/10/2021", status: "To do"},
    {id: 2, activity: "Make birthday cake", priority: "low", dueDate: "06/10/2021", status: "Done"},
    {id: 3, activity: "Meet with team to prepare presentation", priority: "high", dueDate: "06/10/2021", status: "In progress"}
];

// READ
app.get('/', (req, res) => {
    res.json({message: "Here is your To Do List"})
});

app.get('/list', (req, res) => {
    res.json({ all: items })
});

app.get('/list/:lid', (req, res) => {
    // console.log(request.params);
    let requestedId = parseInt(req.params.lid);
    let selectedItem;
    // = items.find((item) => {item.id === requestedId});
    for (const item of items) {
        if (item.id === requestedId)
        {
            selectedItem = item;
        }
    }
    res.json(selectedItem);
});

// CREATE
app.post('/list', (req, res) => {
    let newId = items.length + 1;
    console.log(req.body);
    let newItem = { id: newId, ...req.body }
    console.log(newItem);

    items.push(newItem);
    res.status(201).json({ message: `Of ${newItem.priority} importance, ${newItem.activity} due on ${newItem.dueDate} has been added to your To Do List` })
});

module.exports = app;