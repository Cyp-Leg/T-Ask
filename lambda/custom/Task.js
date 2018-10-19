const querystring = require('querystring');
const axios = require('axios');

class Task {
    static addTask(task) {
        let data = querystring.stringify({
            text: task,
            type: 'todo'
        });
        return axios.post('https://habitica.com/api/v3/tasks/user', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-user': '5480fd21-608d-41c5-8ec2-7fd555a823cf',
                'x-api-key': "dac194db-cd04-446e-a748-9218150b05bc"
            }
        });
    }
}

module.exports = Task;