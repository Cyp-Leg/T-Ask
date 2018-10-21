const Alexa = require('alexa-sdk');
const Task = require('./models/Task');
const Habit = require('./models/Habit');
const config = require('./config');

const welcomeHandlers = require('./handlers/welcomeHandlers');

const APP_ID = "amzn1.ask.skill.f570c511-dd4c-4579-b892-6f09ebe4ab0a";

const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const handlers = {
    LaunchRequest: function () {
        this.handler.state = config.WELCOME_STATE
        this.emitWithState('Welcome');
    },
    'HabitIntent': function () {
        var habit = this.event.request.intent.slots.habit.value
        let that = this;
        if(habit){
            Habit.addHabit(habit)
            .then(function (response) {
                that.response.speak("L'habitude : " + habit + " a bien été ajoutée !");
                that.emit(':responseReady');
            })
            .catch(function (error) {
                that.response.speak("L'habitude : " + habit + " n'a pas été ajoutée...");
                that.emit(':responseReady');
            });
        }
        else{
            this.response.speak("No habit");
            this.emit(':responseReady');
        }
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
