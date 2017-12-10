'use strict';

var expect = require('chai').expect;
var jiffify = require('../app/src/run');

describe('#successCases', function(){
  // it('Ternary if statement', function() {
  //   var code = 'function f(a,b){ var a = !(a>b) ? a : b; return a;}';
  //   var result = jiffify.parseCode(code);

  //   var output = 'function f(a, b) {var a = !a.gt(b) ? a : b; return a;})';
  //   expect(result.ast.error).to.equal(undefined);
  //   // expect(result.code.trim()).to.equal(output);
    
  //   // check cost
  // });

  it('Boolean', function() {
    var code = 'function f(a) {var x = true}';
    var result = jiffify.parseCode(code);
    expect(result.code.includes(1)).to.equal(true);

    code = 'function f(a) {var y = 1; if (y===true) {var x = true}}';    
    result = jiffify.parseCode(code);
    expect(result.code).to.equal('function f(a) {\n  var y = 1;if (y.eq(1)) {\n    var x = 1;\n  }\n}');
   
  });

  it('Reduce', function() {
    var code = 'var a = [b,c,d,f,g]; var e = a.reduce("add")';
    var result = jiffify.parseCode(code);
    expect(result.code).to.equal('var a = [b, c, d, f, g];var e = b.add(c).add(d).add(f).add(g);');
    // console.log(result.costs);
  });

  it('Bitwise XOR', function() {
    var code = 'function f(a) {return a ^ 1;}';
    var result = jiffify.parseCode(code);
    expect(result.code).to.equal('function f(a) {\n  return a.xor_bit(1);\n}');

    // TODO: make sure it works with constant on other side
  });


  it('Handling out of order constant', function() {

    var code = 'function f(a,b) { var c = 7 - a + b; return c}';
    var result = jiffify.parseCode(code);
    expect(result.code).to.equal('function f(a, b) {\n  var c = a.mult(-1).add(7).add(b);return c;\n}');
  });

  it ('Cost of operations with constants', function() {
    var code = 'function f(a) {return 7 * a}';
    var result = jiffify.parseCode(code);
    expect(result.costs['f']).to.equal(0);
  });

});

describe('#errorCases', function() {
  it('For statement', function() {
    var code = 'function f(a) { for (var i = 0; i < 10; i++) { var v = i;}}';

    var result = jiffify.parseCode(code);
    expect(result.ast.error.length).to.equal(1);
    expect(result.ast.error[0].text).to.equal('ForStatements are not supported');
  });

  it ('Overwriting secret share', function() {
    var code = 'function f(a,b) {var b = true;}';
    var result = jiffify.parseCode(code);
    expect(result.ast.error.length).to.equal(1);
    expect(result.ast.error[0].name).to.equal("Overwriting");

    code = 'function f(a,b) {b = true;}';
    result = jiffify.parseCode(code);
    expect(result.ast.error.length).to.equal(1);
    expect(result.ast.error[0].name).to.equal("Overwriting");


  });

  it ('Leaking conditional', function() {
    var code = 'function f(a) {if(1) {return a;}}';
    var result = jiffify.parseCode(code);
    expect(result.ast.error.length).to.equal(1);
    expect(result.ast.error[0].name).to.equal("Leakage");

    code = 'function f(a) {if(a) {return 1;}}';
    expect(result.ast.error.length).to.equal(1);
    expect(result.ast.error[0].name).to.equal("Leakage");
    
  });

  it('Certain bitwise operators not supported (and, or)', function() {
    var code = 'function f(a,b) { return a & b; }';
    var result = jiffify.parseCode(code);
    expect(result.ast.error.length).to.equal(1);
    expect(result.ast.error[0].name).to.equal('Unsupported operator');
    
    code = 'function f(a,b) { return a | b; }';
    result = jiffify.parseCode(code);
    expect(result.ast.error.length).to.equal(1);
    expect(result.ast.error[0].name).to.equal('Unsupported operator');
  });
});
