const { logMake, logGet } = require('../middleware/logEvents');

const noteFetcher = async (req, res) => {
    const data = await logGet();
    res.send(data);
    
}

const noteAdder = async (req, res) => {
    const {name, message} = req.body;
    const confirmation = await logMake(name, message);
    if (confirmation) {
        res.send("Notes Saved Successfully");
    } else {
        res.send("Failed to save");
    }

}
const noteDeleter = async (req, res) => {
    res.send('Deleting Notes');
}

const noteEditor = async (req, res) => {
    res.send('Editing Notes');
}
module.exports = { noteFetcher, noteAdder, noteDeleter, noteEditor };