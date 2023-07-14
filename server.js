const express = require('express');
const mongoose = require('mongoose');


const connectDB=async()=>{
    try{
        mongoose.set("strictQuery", false);

        await mongoose.connect("mongodb://127.0.0.1:27017/--YourDBNameHere--");
        console.log("Connected to MongoDB");
    }
    catch(e){
        console.log(e);
        process.exit(1);
    }
}
connectDB();


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('newUsers', userSchema);

const app = express();
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password,User.find({username:username}));
    try {
        const user = await User.findOne({ username: username, password: password });
        console.log(user);
        if (user) res.send('Login successful');
        else res.send('invalid username or password');
    } catch (err) {
        console.error(err);
        res.send('Error occurred');
    }
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        await User.create({ username, password });
        res.send('Signup successful');
    } catch (err) {
        console.error(err);
        res.send('Error occurred');
    }
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
