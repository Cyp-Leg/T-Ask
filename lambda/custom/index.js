const Alexa = require('alexa-sdk');
const config = require('./config');
let apiSettings = require('ApiSettings');

const welcomeHandlers = require('./handlers/welcomeHandlers');
const loginHandlers = require('./handlers/loginHandlers');
const handlers = require('./handlers/handlers');

const APP_ID = apiSettings.appId;

const firstHandlers = Object.assign({
    LaunchRequest: function () {
        if(apiSettings.user && apiSettings.key){
            this.handler.state = config.WELCOME_STATE
            this.emitWithState('Welcome');
        }
        else {
            this.handler.state = config.LOGIN_STATE
            this.emitWithState('Welcome')
        }
    }
}, handlers);

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(firstHandlers, welcomeHandlers, loginHandlers);
    alexa.execute();
};
