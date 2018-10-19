'use strict';
const Alexa = require('alexa-sdk');
const Task = require('Task');
const APP_ID = "amzn1.ask.skill.f658c1a8-de0a-44dd-9a3d-6ceb6d41df1c";

const SKILL_NAME = 'T-Ask';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';


const handlers = {
    'LaunchRequest': function () {
        this.response.speak("Que voulez vous faire ?").listen("Je n'ai pas compris. Réessayez ?");
        this.emit(':responseReady');
    },
    'TaskIntent': function () {
        var task = this.event.request.intent.slots.task.value
        let that = this;
        if(task){
            Task.addTask(task)
            .then(function (response) {
                that.response.speak("La tache : " + task + " a bien été ajoutée !");
                that.emit(':responseReady');
            })
            .catch(function (error) {
                that.response.speak("La tache : " + task + " n'a pas été ajoutée...");
                that.emit(':responseReady');
            });
        }
        else{
            this.response.speak("No tasks");
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
    }
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
