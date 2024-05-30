const moment = require('moment');
const simpleGit = require('simple-git')();
const random = require('random');
const jsonfile = require('jsonfile'); // Added missing import
const FILE_PATH = './data.json';

const makeCommit = n => {
    if(n == 0) return simpleGit.push();
    const x = random.int(0, 54);
    const y = random.int(0, 6);
    const DATE = moment().subtract(1, 'y').add(1, 'd')
                         .add(x, 'w').add(y, 'd').format();
    const data = {
        date: DATE
    };

    console.log(DATE);
    jsonfile.writeFile(FILE_PATH, data, () => {
        simpleGit.add([FILE_PATH]).commit(DATE, {'--date': DATE }).then(() => {
            return makeCommit(n - 1); // Added return to recursive call
        });
    });
}

makeCommit(500);