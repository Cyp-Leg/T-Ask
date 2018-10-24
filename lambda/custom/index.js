const Alexa = require('alexa-sdk');
const config = require('./config');
const apiSettings = require('ApiSettings');

const welcomeHandlers = require('./handlers/welcomeHandlers');

const APP_ID = apiSettings.appId;

const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const handlers = {
    LaunchRequest: function () {
        this.handler.state = config.WELCOME_STATE
        this.emitWithState('Welcome');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    Unhandled: function() {
        this.response.speak("Pas compris").listen("Pas compris");
        this.emit(":responseReady");
      }
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, welcomeHandlers);
    alexa.execute();
};
