import moment from 'moment';
import simpleGit from 'simple-git';
import random from 'random';
import jsonfile from 'jsonfile';

const FILE_PATH = './data.json';
const git = simpleGit();

const makeCommit = async (n) => {
    if (n === 0 ) console.log('committing');
    if (n === 0) return git.push();
    const x = random.int(0, 54);
    const y = random.int(0, 6);
    const DATE = moment().subtract(2, 'y').add(1, 'd')
                         .add(x, 'w').add(y, 'd').format();
    const data = {
        date: DATE
    };
   
    console.log(n);
    await jsonfile.writeFile(FILE_PATH, data);
    await git.add([FILE_PATH]);
    await git.commit(DATE, {'--date': DATE });
    makeCommit(n - 1); 
}


makeCommit(500);
