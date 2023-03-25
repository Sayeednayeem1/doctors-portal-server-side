const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// todo middleware
app.use(cors());
app.use(express.json());



app.get('/', async (req, res) => {
    res.send('Doctors Portal is running');
});
app.listen(port, () => {
    console.log(`doctors portal is running on port: ${port}`,);
})