const mongoose = require('mongoose')
require('dotenv/config')
mongoose.connect(process.env.MONGODB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('MONGODB CONNECTED....')
)