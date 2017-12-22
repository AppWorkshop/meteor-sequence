/**
 * To run the tests, invoke from the package directory: meteor test-packages ./ --driver-package meteortesting:mocha
 */
import StubCollections from 'meteor/hwillson:stub-collections';
import sequence from 'meteor/juto:sequence';

let assert = require('assert');


describe('juto:sequence', function () {


  before(function () {
    console.log("stubbing the sequence collection");
    StubCollections.stub(sequence.SequenceCollection);
  });

  after(function () {
    console.log("restoring the sequence collection");
    StubCollections.restore();
  });

  beforeEach(function () {
    // runs before each test in this block
  });

  afterEach(function () {
    // runs after each test in this block
  });


  it('create a new sequence', function (done) {
    sequence.newSequence("testSequenceOne", {
      numsys: "0123456789",
      padChar: "0",
      length: 2
    }).then(function (id) {
      assert(id, 'no ID returned');
      done();
    });
  });

  it('get next sequence val', function (done) {
    // console.log(JSON.stringify(sequence.SequenceCollection.findOne()));
    sequence.getAndUpdateNextNumberInSequence("testSequenceOne")
      .then(function (nextInSequence) {
        assert(nextInSequence, 'no sequence value returned');
        assert.equal(nextInSequence, '01');
        done()
      });
  });

  it('get next sequence val (again)', function (done) {
    sequence.getAndUpdateNextNumberInSequence("testSequenceOne")
      .then(function (nextInSequence) {
        assert.equal(nextInSequence, '02');
        done();
      })
  });

  it('Try a non-numeric sequence', function (done) {
    return sequence.newSequence("testSequenceTwo", {
      numsys: "ABCDEF",
      padChar: " ",
      length: 8
    }, "EEEEEEEF")
      .then(function (id) {
        assert(id, 'no ID returned');
        done();
      });
  });



  it('get next sequence val (again, non-numeric)', function (done) {
    sequence.getAndUpdateNextNumberInSequence("testSequenceTwo")
      .then(function (nextInSequence) {
        assert.equal(nextInSequence, 'EEEEEEFA');
        done();
      })
  });

  it('Non-numeric sequence with prefix and suffix', function (done) {
    return sequence.newSequence("testSequenceThree", {
      numsys: "ABCDEF",
      padChar: " ",
      length: 8,
      prefix: "FOO-",
      suffix: "-BAR"
    }, "EEEEEEEF")
      .then(function (id) {
        assert(id, 'no ID returned');
        done();
      })
      .catch(function(error) {
        assert.ifError(error);
        done();
      });

  });

  it('get next sequence val (again, non-numeric)', function (done) {
    sequence.getAndUpdateNextNumberInSequence("testSequenceThree")
      .then(function (nextInSequence) {
        assert.equal(nextInSequence, 'FOO-EEEEEEFA-BAR');
        done();
      })
      .catch(function(error) {
        assert.ifError(error);
        done();
      });
  });


});

