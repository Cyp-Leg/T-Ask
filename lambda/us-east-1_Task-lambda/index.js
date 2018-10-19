'use strict';
const Alexa = require('alexa-sdk');
var https = require('https');
const querystring = require('querystring');

const APP_ID = "amzn1.ask.skill.f658c1a8-de0a-44dd-9a3d-6ceb6d41df1c";

const SKILL_NAME = 'T-Ask';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

function PostCode(handler, task) {
    // Build the post string from an object
    var post_data = querystring.stringify({
        'text': task,
        'type': 'todo'
    });
  
    // An object of options to indicate where to post to
    var post_options = {
        hostname: 'habitica.com',
        path: '/api/v3/tasks/user',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-api-user': '5480fd21-608d-41c5-8ec2-7fd555a823cf',
            'x-api-key': "dac194db-cd04-446e-a748-9218150b05bc"
        }
    };
  
    // Set up the request
    var post_req = https.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            handler.response.speak("La tache : " + task + " a bien été ajoutée !");
            handler.emit(':responseReady');
        });
    });
    // post the data
    post_req.write(post_data);
    post_req.end();
  
  }

const handlers = {
    'LaunchRequest': function () {
        this.response.speak("Que voulez vous faire ?").listen("Je n'ai pas compris. Réessayez ?");
        this.emit(':responseReady');
    },
    'TaskIntent': function () {
        var task = this.event.request.intent.slots.task.value
        if(task){
            PostCode(this, task);
        }
        else{
            this.response.speak("No tasks");
        }
        
        this.emit(':responseReady');
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
