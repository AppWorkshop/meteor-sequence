# sequence

Define custom 'number' sequences in a collection, using the nodejs [number-sequence](https://www.npmjs.com/package/number-sequence) 
library, with optional prefix and suffix.

### Introduction

This meteor library lets you define and use a your own sequence, which might be useful for order numbers, customer numbers etc.

Think 'autonumber' or 'auto_increment', but more flexible (albeit less efficient, of course).

You can define a sequence like 00129QXZ, LONDON-ORDER-ABC123*-DRAFT, or PREFIX-00123-SUFFIX, or a simple 'numeric' 
sequence (although this library is overkill if that's all you need).

***Note:*** Be certain to make the sequence length larger than you are likely to need; Otherwise it will 'roll over' and you 
are likely to be left with duplicates. 

### Installation

```
meteor npm install number-sequence --save
meteor add juto:sequence
```

### Usage

See examples below. You need to provide:
 
* a number system, which is a set of 'digit' characters (as a string) in increasing order of significance, from left to right.
* a numeric length, which is the number of 'digits' you will be maintaining in the sequence.
* a padding character, to left-pad shorter sequences to the value you specified in the length parameter.
* (optional) a string prefix to prepend to the sequence before returning.
* (optional) a string suffix to append to the sequence before returning. 

#### Example 1 : Two digits, decimal (base 10)

```js
import sequence from 'meteor/juto:sequence'; 

// define a new 2-digit sequence and give it a name
sequence.newSequence(
  "twoDigitBaseTen", // sequence name (must be unique). 
  {
    numsys: "0123456789", // the 'digits' to be used in the sequence
    padChar: "0", // the character to left-pad with if the value is not long enough. 
    length: 2 // the number of characters in the sequence; the sequence will 'wrap around' if it runs out of values.
  },
  "00" // the initial value of the sequence
).then(function (id) {
  console.log(`created a new sequence with id ${id}`);
});

const numValues = sequence.calculateNumberOfPossibleValues("twoDigitBaseTen"); // 100 possible values, since we have 2 digits.

// get the next value in the sequence
sequence.getAndUpdateNextNumberInSequence("twoDigitBaseTen")
.then(function (nextInSequence) {
  console.log(nextInSequence); // 01
});

// get the next value in the sequence
sequence.getAndUpdateNextNumberInSequence("twoDigitBaseTen")
.then(function (nextInSequence) {
  console.log(nextInSequence); // 02
});

```

#### Example 2 : Two digits, hexadecimal (base 16)

Note that this time we're setting the initial value to 'EF' so that the next value should be 'F0'

```js
// define a new 2-digit sequence and give it a name
sequence.newSequence(
  "hex", // sequence name (must be unique). 
  {
    numsys: "0123456789ABCDEF", // the 'digits' to be used in the sequence
    padChar: "0", // the character to left-pad with if the value is not long enough. 
    length: 2 // the number of characters in the sequence; the sequence will 'wrap around' if it runs out of values.
  },
  "EF" // the initial value of the sequence
).then(function (id) {
  console.log(`created a new sequence with id ${id}`);
});

const numValues = sequence.calculateNumberOfPossibleValues("hex"); // 256 possible values, since we have 2 digits.

// get the next value in the sequence
sequence.getAndUpdateNextNumberInSequence("hex")
.then(function (nextInSequence) {
  console.log(nextInSequence); // F0
});

// get the next value in the sequence
sequence.getAndUpdateNextNumberInSequence("hex")
.then(function (nextInSequence) {
  console.log(nextInSequence); // F1
});
```

#### Example 3 : Two digits, hexadecimal, with prefix and suffix (base 16)

Note that this time we're setting the initial value to 'EF' so that the next value should be 'F0'

```js
// define a new 2-digit sequence and give it a name
sequence.newSequence(
  "hex", // sequence name (must be unique). 
  {
    numsys: "0123456789ABCDEF", // the 'digits' to be used in the sequence
    padChar: "0", // the character to left-pad with if the value is not long enough. 
    length: 2, // the number of characters in the sequence; the sequence will 'wrap around' if it runs out of values.
    prefix: "PRE-",
    suffix: "-SUFF"
  },
  "EF" // the initial value of the sequence
).then(function (id) {
  console.log(`created a new sequence with id ${id}`);
});

const numValues = sequence.calculateNumberOfPossibleValues("hexWithPrefixSuffix"); // 256 possible values, since we have 2 digits.

// get the next value in the sequence
sequence.getAndUpdateNextNumberInSequence("hexWithPrefixSuffix")
.then(function (nextInSequence) {
  console.log(nextInSequence); // PRE-F0-SUFF
});

// get the next value in the sequence
sequence.getAndUpdateNextNumberInSequence("hexWithPrefixSuffix")
.then(function (nextInSequence) {
  console.log(nextInSequence); // PRE-F1-SUFF
});
```

