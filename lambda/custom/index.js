const Alexa = require('alexa-sdk');
const config = require('./config');
const apiSettings = require('ApiSettings');

const welcomeHandlers = require('./handlers/welcomeHandlers');
const handlers = require('./handlers/handlers');

const APP_ID = apiSettings.appId;

const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const firstHandlers = Object.assign({
    LaunchRequest: function () {
        this.handler.state = config.WELCOME_STATE
        this.emitWithState('Welcome');
    }
}, handlers);

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(firstHandlers, welcomeHandlers);
    alexa.execute();
};
