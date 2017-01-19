var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE'
};

var name = "myApp";

var welcomeMessage = "Welcome to " + name + " voice service. You can ask me to help you control an expirement. If you are not sure, say help.";

var welcomeRepromt = "You can ask me to help you control an expirement. If you are not sure, say help.";

var overview = "myApp voice service on alexa allows PerkinElmer clients to manage their expirements by voice commands.";

var HelpMessage = "Here are some things you  can say: ask my app to run method number one, or say: ask my app to take me to detail 1. Try it!";

var moreInformation = "See your Alexa app for more information.";

var tryAgainMessage = "please try again.";

var notNumberErrorMessage = "The method number specified is invalid, " + tryAgainMessage;

var goodbyeMessage = "OK, talk to you later!";

//var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + name + "?";

var newline = "\n";

var output = "";

var alexa;

var newSessionHandlers = {
    'LaunchRequest': function() {
        this.handler.state = states.SEARCHMODE;

        output = welcomeMessage;

        this.emit(':ask', output, welcomeRepromt);
    },
    'getOverview': function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'runMethod': function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('runMethod');
    },
    'showHome': function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('showHome');
    },
    'showDetailOne': function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('showDetailOne');
    },
    'showDetailTwo': function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('showDetailTwo');
    },
    'Unhandled': function() {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', goodbyeMessage);
    },
    'SessionEndedRequest': function() {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    }
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'AMAZON.HelpIntent': function() {

        output = HelpMessage;

        this.emit(':ask', output, HelpMessage);
    },

    'getOverview': function() {

        output = overview;

        this.emit(':tellWithCard', output, name, overview);
    },

    'AMAZON.YesIntent': function() {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

    'AMAZON.NoIntent': function() {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', goodbyeMessage);
    },
    'runMethod': function() {
        var methodId = parseInt(this.event.request.intent.slots.methodId.value);
        postMethod(methodId, function(response) {
            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            } else {
                output = "Method " + methodId + " has started successfully";
            }
            alexa.emit(':tell', output);
        });
    },

    'showHome': function() {
        postHome(function(response) {
            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            } else {
                output = "OK, taking you to home page.";
            }
            alexa.emit(':tell', output);
        });
    },

    'showDetailOne': function() {
        postDetailOne(function(response) {
            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            } else {
                output = "OK, taking you to detail one.";
            }
            alexa.emit(':tell', output);
        });
    },
    'showDetailTwo': function() {
        postDetailTwo(function(response) {
            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            } else {
                output = "OK, taking you to detail two.";
            }
            alexa.emit(':tell', output);
        });
    },

    'AMAZON.RepeatIntent': function() {
        this.emit(':ask', output, HelpMessage);
    },

    'SessionEndedRequest': function() {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },

    'Unhandled': function() {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function(event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
function postMethod(id, callback) {
    if (Number.isInteger(id)) {
        var options = {
            host: 'aalhaimi.herokuapp.com',
            path: '/api/random.insert/' + id,
            method: 'POST',
            'Content-Type': 'application/json'
        };

        var req = http.request(options, (res) => {

            var body = '';

            res.on('data', (d) => {
                body += d;
            });

            res.on('end', function() {
                callback(body);
            });

        });
        var postData = '{response":"OK"}';
        req.write(postData);
        req.end();

        req.on('error', (e) => {
            console.error(e);
        });
    } else {
        alexa.emit(':ask', notNumberErrorMessage);
    }
}

// Create a web request and handle the response.
function postHome(callback) {

    var options = {
        host: 'aalhaimi.herokuapp.com',
        path: '/api/home.view',
        method: 'POST',
        'Content-Type': 'application/json'
    };

    var req = http.request(options, (res) => {

        var body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', function() {
            callback(body);
        });

    });
    var postData = '{"response":"OK"}';
    req.write(postData);
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}


// Create a web request and handle the response.
function postDetailOne(callback) {

    var options = {
        host: 'aalhaimi.herokuapp.com',
        path: '/api/detail.view1',
        method: 'POST',
        'Content-Type': 'application/json'
    };

    var req = http.request(options, (res) => {

        var body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', function() {
            callback(body);
        });

    });
    var postData = '{"response":"OK"}';
    req.write(postData);
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

// Create a web request and handle the response.
function postDetailTwo(callback) {

    var options = {
        host: 'aalhaimi.herokuapp.com',
        path: '/api/detail.view2',
        method: 'POST',
        'Content-Type': 'application/json'
    };

    var req = http.request(options, (res) => {

        var body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', function() {
            callback(body);
        });

    });
    var postData = '{"response":"OK"}';
    req.write(postData);
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

String.prototype.trunc =
    function(n) {
        return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
    };
