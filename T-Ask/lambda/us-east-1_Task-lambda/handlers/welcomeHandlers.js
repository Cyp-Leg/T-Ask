const Alexa = require("alexa-sdk");
const config = require("../config");
const handlers = require("./handlers");

const welcomeHandlers = Alexa.CreateStateHandler(config.WELCOME_STATE, Object.assign({    

    Welcome() {
        this.response.speak("Bienvenue sur Habitica, que voulez-vous faire ?").listen();
        this.emit(":responseReady");
    }
}, handlers));
    
module.exports = welcomeHandlers;
