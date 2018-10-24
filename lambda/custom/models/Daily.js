const querystring = require('querystring');
const axios = require('axios');
const apiSettings = require('ApiSettings')

class Daily {

    constructor(){
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-api-user': apiSettings.user,
            'x-api-key': apiSettings.key
        }
    }

    addDaily(daily) {
        let data = querystring.stringify({
            text: daily,
            type: 'daily'
        });
        return axios.post('https://habitica.com/api/v3/tasks/user', data, {
            headers: this.headers
        });
    }

    deleteDaily(dailyId) {
        return axios.delete('https://habitica.com/api/v3/tasks/'+ dailyId, {
            headers: this.headers
        });
    }

    getDailys() {
        return axios.get("https://habitica.com/api/v3/tasks/user?type=dailys", {
            headers: this.headers
        });
    }
}

module.exports = new Daily();
