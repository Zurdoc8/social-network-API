const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

//app.use('/api', require('./routes'))

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-network-API', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('debug', true);
app.use(require('./routes'));

app.listen(PORT, () => {
    console.log('Now running on port ${PORT}!');
});