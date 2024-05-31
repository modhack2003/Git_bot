const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const simpleGit = require('simple-git')();
const jsonfile = require('jsonfile');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = './data.json';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

// Custom random number generator
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/start-commit', (req, res) => {
    const { commitCount, commitYear, username, token } = req.body;

    simpleGit.addConfig('user.name', username);
    simpleGit.addConfig('user.email', `${username}@users.noreply.github.com`);
    simpleGit.addConfig('hub.token', token);

    const makeCommit = n => {
        if (n == 0) return simpleGit.push();
        const x = getRandomInt(0, 54);
        const y = getRandomInt(0, 6);
        const DATE = moment().year(commitYear).startOf('year').add(x, 'w').add(y, 'd').format();
        const data = { date: DATE };

        jsonfile.writeFile(FILE_PATH, data, () => {
            simpleGit.add([FILE_PATH]).commit(DATE, { '--date': DATE }).then(() => {
                return makeCommit(n - 1);
            });
        });
    };

    makeCommit(commitCount);
    res.send('Commits started!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});