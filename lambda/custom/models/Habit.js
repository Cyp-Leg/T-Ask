const querystring = require('querystring');
const axios = require('axios');
const apiSettings = require('ApiSettings')

class Habit {

    constructor(){
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-api-user': apiSettings.user,
            'x-api-key': apiSettings.key
        } 
    }

    addHabit(habit) {
        let data = querystring.stringify({
            text: habit,
            type: 'habit'
        });
        return axios.post('https://habitica.com/api/v3/tasks/user', data, {
            headers: this.headers
        });
    }

    getHabits() {
        return axios.get("https://habitica.com/api/v3/tasks/user?type=habits", {
            headers: this.headers
        });
    }
}

module.exports = new Habit();