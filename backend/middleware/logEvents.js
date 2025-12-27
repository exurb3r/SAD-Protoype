const { format } = require('date-fns');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;


const logMake = async (name, message) => {
    const date = `${format(new Date(), 'yyyy/MM/dd\tHH::mm:ss')}`;
    const messageLog = `At ${date}, ${name} have sent this message: ${message}\n`;

    try{
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', 'messageLog.txt'), messageLog);

        return true;
    } catch (err) {
        console.error(err);

    }
    
}

const logGet = async () => {
    try{
        const logPath = path.join(__dirname, "..", "logs", "messageLog.txt");
        const data = await fsPromises.readFile(logPath, 'utf-8');
        const lines = data.split('\n').filter(Boolean);

        const messages = lines.map(line => {

            const[, rest] = line.split('At ');
            const [dateInfo, messageInfo] = rest.split(', ');

            const name = messageInfo.split(' have sent this message: ')[0];
            const message = messageInfo.split(' have sent this message: ')[1];
        });

           return{messages}



    } catch (err){
        console.error(err);
    }

}


module.exports = { logMake, logGet }