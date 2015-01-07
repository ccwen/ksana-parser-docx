var docx2kdb=require("../lib/index");
console.time("convert");
docx2kdb.convertToXML("../sample/sample.docx",{},function(session){
	//console.log(session.pcount);
	console.log(session.output.join(""));
	console.timeEnd("convert");	
});
