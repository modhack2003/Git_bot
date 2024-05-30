import express from 'express';
import bodyParser from 'body-parser';
import moment from 'moment';
import simpleGit from 'simple-git';
import random from 'random';
import jsonfile from 'jsonfile';

const FILE_PATH = './data.json';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const makeCommit = async (n, year, username, token) => {
    const git = simpleGit().env({
        GIT_AUTHOR_NAME: username,
        GIT_AUTHOR_EMAIL: `${username}@users.noreply.github.com`,
        GIT_COMMITTER_NAME: username,
        GIT_COMMITTER_EMAIL: `${username}@users.noreply.github.com`,
        GIT_ASKPASS: 'echo',
        GIT_ASKPASS_PASSWORD: token,
    });

    if (n === 0) return git.push();
    const x = random.int(0, 54);
    const y = random.int(0, 6);
    const DATE = moment().subtract(1, 'y').add(1, 'd')
                         .add(x, 'w').add(y, 'd').format();
    const data = {
        date: DATE
    };

    console.log(DATE);
    await jsonfile.writeFile(FILE_PATH, data);
    await git.add([FILE_PATH]);
    await git.commit(DATE, {'--date': DATE });
    makeCommit(n - 1, year, username, token); // Continue with the next commit
};

app.post('/start-commit', (req, res) => {
    const n = parseInt(req.body.commitCount, 10);
    const year = parseInt(req.body.commitYear, 10);
    const username = req.body.username;
    const token = req.body.token;

    if (isNaN(n) || n <= 0 || isNaN(year) || !username || !token) {
        return res.status(400).send('Invalid input');
    }
    makeCommit(n, year, username, token);
    res.send(`Started making ${n} commits for the year ${year}`);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});