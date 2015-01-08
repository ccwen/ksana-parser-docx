var docx2kdb=require("../index");
console.time("convert");
docx2kdb.convertToXML("../sample/sample.docx",{},function(output){
	//console.log(session.pcount);
	console.log(output.join(""));
	console.timeEnd("convert");	
});
