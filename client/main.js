import {
    RandomData
} from '../imports/api/random_data.js';
import {
    Mongo
} from 'meteor/mongo';

var moment = require('moment');

Template.main.onCreated(function mainOnCreated() {});

Template.main.helpers({
    counter() {
        return Template.instance().counter.get();
    },
    randomData() {
        return RandomData.find({}, {
            sort: {
                createdAt: -1
            }
        });
    },
    formatDate(date) {
        return moment(date).fromNow();
    }
});

Template.main.events({
    'click button' (event, instance) {
        var id = Math.floor(1000 + Math.random() * 9000);
        Meteor.call('random.insert', id);
    }
});
