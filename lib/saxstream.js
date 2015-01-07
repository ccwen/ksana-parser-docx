/* construct a tag stack and text */

var setupParser=function(parser,options,session) {
  var obj=null;
  parser.onerror = function (e) {
    if (options.onerror) options.onerror(e);
  };
  parser.ontext = function (t) {
    session.text+=t;
  };
  parser.onopentag = function (node) {
    session.tagstack.push(node);
    if(options.onopentag) options.onopentag(node,session);
  };
  parser.onclosetag =function(nodename) {
    if(options.onclosetag) options.onclosetag(nodename,session);
    session.tagstack.pop();
  }
  parser.onend = function () {
    if (options.onend) {
      options.onend.apply(options.context,[session]);
    }
  };
}

var createSAXStream=function(options) {
  var strict = true; // set to false for html-mode
  var session={tagstack:[],text:"",output:[],instrText:"",filename:options.filename};
  var saxStream = require("sax").createStream(strict, options);
  setupParser(saxStream._parser,options,session);
  saxStream.on("error", function (e) {
    console.error("error!", e);
    this._parser.error = null;
    this._parser.resume();
  });

  return saxStream;
}
module.exports=createSAXStream;
