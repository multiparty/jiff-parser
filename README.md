# Jiffify!

Jiffify! is a transpiler that takes Javascript code and returns with primitives from the secure multi-party computation library Jiff (https://multiparty.org/jiff/docs/jsdoc/).

## Running Jiffify!
First compile using Babel:
```./node_modules/.bin/babel app/src/ -d app/dist```
Then run the server:
```node index.js```


#### Dependencies
- Babel
- CodeMirror
- Polynomial

