const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const simpleGit = require('simple-git')();
const jsonfile = require('jsonfile');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = "./data.json";

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/start-commit', async (req, res) => {
    const { commitCount, commitYear, username, token } = req.body;

    simpleGit.addConfig('user.name', username);
    simpleGit.addConfig('user.email', `${username}@users.noreply.github.com`);
    simpleGit.addConfig('hub.token', token);

    const makeCommitsAndPush = async (n) => {
        for (let i = 0; i < n; i++) {
            console.log(`Committing ${i + 1} of ${commitCount}`);
            const x = getRandomInt(0, 54);
            const y = getRandomInt(0, 6);
            const DATE = moment().year(commitYear).startOf('year').add(x, 'w').add(y, 'd').format();
            console.log(`Commit date: ${DATE}`);
            const data = { date: DATE };

            await new Promise((resolve, reject) => {
                jsonfile.writeFile(FILE_PATH, data, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            await simpleGit.add([FILE_PATH]);
            await simpleGit.commit(DATE, { '--date': DATE });
        }

        try {
            await simpleGit.push();
            console.log('Push successful!');
        } catch (error) {
            console.error('Push failed:', error);
        }
    };

    makeCommitsAndPush(commitCount);
    res.send('Commits and push started!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
