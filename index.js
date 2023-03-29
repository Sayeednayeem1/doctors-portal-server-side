const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

// todo middleware
app.use(cors());
app.use(express.json());


// todo mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qk4n58g.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// todo mongodb functionalities
async function run() {
    try {
        // todo database collections
        const appointmentOptionCollection = client.db('doctorsPortalCollection').collection('appointmentOptions');

        // todo booking collection
        const bookingsCollection = client.db('doctorsPortalCollection').collection('bookings');

        // todo get the collection data
        app.get('/appointmentOptions', async (req, res) => {
            const date = req.query.date;
            // todo available option query
            const query = {};
            const options = await appointmentOptionCollection.find(query).toArray();
            // todo bookings query
            const bookingQuery = { appointmentDate: date };
            const alreadyBooked = await bookingsCollection.find(bookingQuery).toArray();
            options.forEach(option => {
                const optionBooked = alreadyBooked.filter(book => book.treatment === option.name);
                const bookedSlot = optionBooked.map(book => book.slot);
                const remainingSlots = option.slots.filter(slot => !bookedSlot.includes(slot));
                option.slots = remainingSlots;
            })
            res.send(options);
        });

        // todo api naming conventions
        //  todo bookings
        // todo app.get('/bookings')
        // todo app.get('/bookings/:id')
        // todo app.post('/bookings')
        // todo app.patch('/bookings/:id')
        // todo app.delete('/bookings/:id')

        // todo bookings collection post data are here
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })

    }
    finally {

    }

}
run().catch(console.log);




app.get('/', async (req, res) => {
    res.send('Doctors Portal is running');
});
app.listen(port, () => {
    console.log(`doctors portal is running on port: ${port}`,);
})