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
    let requestedId = parseInt(req.params.lid);
    let selectedItem;
    //selectedItem = items.find((item) => {item.id === requestedId});
    //we dont know why this didnt work so made our own
    let recieved = 0;
    for (const item of items) {
        if (item.id === requestedId)
        {
            selectedItem = item;
            recieved = 1;
        }
    }
    if (recieved) {
    res.json(selectedItem);
    }
    else
    {
        res.status(404).json({});
    }
});

// CREATE
app.post('/list', (req, res) => {
    let newId = items.length + 1;
    let newItem = { id: newId, ...req.body }
    items.push(newItem);
    res.status(201).json({ message: `Of ${newItem.priority} importance, ${newItem.activity} due on ${newItem.dueDate} has been added to your To Do List` })
});


//UPDATE
app.put('/list/:lid', (req, res) => {
    try {
        let requestedId = parseInt(req.params.lid);
        let recieved = req.body;
        let selectedItem = items.findIndex(({id}) => id === requestedId);
        if (selectedItem === -1){ throw new Error(`item with ${selectedItem} not found, requested id: ${requestedId}, ${JSON.stringify(items.map(i => i.id))}`) }
        items[selectedItem] = {id: requestedId, ...req.body};
        res.status(200).json({ message: `Item updated: now reads ${recieved.priority} importance, ${recieved.activity} due on ${recieved.dueDate}.` })
    }
    catch (error) {
        res.status(404).json({ message: error.message});
    }
});


// DELETE
app.delete('/list/:lid', (req, res) =>{
    let deleteId = parseInt(req.params.lid);
    let i = 0;
    let j = 0;
    for (const item of items) {
        i++;
        if (item.id === deleteId)
        {
            items.splice(i-1, 1);
            j = 1;
        }
    }
    if (j === 0)
    {
        res.status(404).json({ message: `Item with ID: ${deleteId} not found.`})
    }
    else
    {
        res.status(201).json({ message: `Item with ID: ${deleteId} deleted.`})
    }


})

module.exports = app;