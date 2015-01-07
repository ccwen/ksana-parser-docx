var unzip=require("unzip");
var openDocX2stream=function(fn,stream) {
 require("fs").createReadStream(fn)
  .pipe(unzip.Parse())
  .on('entry', function (entry) {
    var filename = entry.path;
    var type = entry.type; // 'Directory' or 'File'
    var size = entry.size;
    //console.log(filename);
    if (filename === "word/document.xml") {
       entry.pipe(stream);
    } else {
      entry.autodrain();
    }
  });

}
module.exports={openDocX2stream:openDocX2stream}