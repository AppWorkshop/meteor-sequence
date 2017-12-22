import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import { check, Match } from 'meteor/check';
let incrementer = require('number-sequence');

const sequence = {
  name: 'sequence',
  SequenceCollection: new Mongo.Collection("Sequences"),

  /**
   * Create a new sequence in the Sequences collection.
   * @param {String} sequenceName the name of the new sequence in the database. Must be unique.
   * @param {Object} configObj containing properties numsys (String), padChar (String) and length (integer). See node number-sequence docs.
   * @param {String} initialValue the initial value for the sequence, as a string. Must be valid in the sequence.
   * @returns {Promise} a promise which resolves to the database ID of the new sequence config.
   */
  newSequence: function (sequenceName, configObj, initialValue = "") {
    check(sequenceName, String);
    check(configObj, {
      numsys: String,
      padChar: String,
      length: Number,
      prefix: Match.Optional(String),
      suffix: Match.Optional(String)
    });

    // check if sequence exists already (by name); if it does then throw an error.
    const found = this.SequenceCollection.findOne({sequenceName: sequenceName});
    if (found) {
      throw new Meteor.Error(`can't create sequence ${sequenceName}; sequence already exists`);
    }

    return new Promise((resolve, reject) => {
      let insertObj = {
        "sequenceName": sequenceName,
        "config": configObj,
        "value": initialValue
      };

      if (!configObj.prefix) {
        insertObj.config.prefix = "";
      }
      if (!configObj.suffix) {
        insertObj.config.suffix = "";
      }
      // insert new sequence into database.
      this.SequenceCollection.insert(insertObj, (error, newID) => {
        if (error) {
          reject(error);
        } else {
          resolve(newID);
        }
      });
    });
  },

  /**
   * Gets the next value in the sequence and updates the database accordingly.
   * @param {String} sequenceName the name of the sequence config in the database
   * @returns {Promise} a promise which resolves to the next number in the sequence.
   */
  getAndUpdateNextNumberInSequence: function(sequenceName) {
    // find the sequence by name.
    let thisSequence = this.SequenceCollection.findOne({sequenceName: sequenceName});
    if (!thisSequence) {
      throw new Meteor.Error(`can't find sequence ${sequenceName}.`);
    }

    let c = thisSequence.config;

    return new Promise((resolve, reject) => {
      let newVal = incrementer.padAndIncrement(c.numsys, thisSequence.value , c.length, c.padChar);
      this.SequenceCollection.update(thisSequence._id, {$set: {value: newVal}}, (error, numUpdated) => {
        if (error) {
          reject(error);
        } else {
          resolve(`${c.prefix}${newVal}${c.suffix}`);
        }
      });
    });
  },
  /**
   * Returns the number of possible values for an existing sequence definition.
   * @param sequenceName the name of the sequence in the database
   * @returns {Number} the number of possible values for the sequence
   */
  calculateNumberOfPossibleValues: function(sequenceName) {
    check(sequenceName, String);

    // check if sequence exists already (by name); if it does then throw an error.
    const thisSequence = this.SequenceCollection.findOne({name: sequenceName});
    if (thisSequence) {
      throw new Meteor.Error(`can't find sequence ${sequenceName}.`);
    }

    let c = thisSequence.config;

    return incrementer.calculateNumberOfValues(c.numsys,c.length);
  }


};

Meteor.startup(function () {
  // ensure that sequenceName is indexed properly.
  sequence.SequenceCollection._ensureIndex({"sequenceName": 1});
});

export default sequence;