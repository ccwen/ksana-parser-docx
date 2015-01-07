
var SAXStream=require("./saxstream");
var DocXReader=require("./docxreader");

var convertToXML=function(fn,opts, cb ) {
	var options=opts.handlers || require("./handlers");	
	if (typeof opts=="function") {
		cb=opts;
		opts={};
	}
	options.filename=fn;
	options.onend=cb;
	options.context=this;
	var saxstream=new SAXStream(options);
    DocXReader.openDocX2stream(fn,saxstream);
};	
module.exports={convertToXML:convertToXML};