import express from 'express';

import { engine } from 'express-handlebars';
import assistantOpenAI from './services/assistant.openAI.js';


const app = express();

// App configuration
app.engine('hbs', engine({
    extname: 'hbs',
}));
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('./public'));
app.use(express.urlencoded({
    extended: true
}))


// ROUTING

// Route home
app.get('/', function (req, res) {
    res.render('home', {
        title: 'Cooking Assistant',
    });
});

// Render chat view
async function renderChat(req, res) {
    const messages = await assistantOpenAI.getRecentMessages();
    const userInput = messages[0].content;
    const assistantOutput = messages[1].content;
    res.render('chat', {
        title: 'Cooking Assistant - Chat',
        style: '/chat.css',
        userMessage: userInput,
        assistantMessage: assistantOutput
    });
}

// Route get
app.get('/c', renderChat);

// Route post
app.post('/c', async function (req, res) {
    console.log("\nRequest body:\n", req.body);
    const ret = await assistantOpenAI.addNewUserInput(req.body.userInput);
    renderChat(req, res); 
});


// Listen for access from user
app.listen(3030, function () {
    console.log("Start server on http://localhost:3030/c");
});
