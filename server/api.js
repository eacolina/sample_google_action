import {
    Meteor
} from 'meteor/meteor';

import {
    RandomData
} from '../imports/api/random_data.js';

// Global API configuration
var Api = new Restivus({
    apiPath: 'api/',
    useDefaultAuth: true,
    prettyJson: true
});

// Exposing a POST API
// Maps to: /api/random.insert/:id
Api.addRoute('random.insert/:id', {
    authRequired: false
}, {
    post: function() {
        RandomData.insert({
            name: 'Method ' + this.urlParams.id,
            createdAt: new Date()
        });
        return "OK";
    },
});
