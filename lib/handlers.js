var session={pcount:0};
/*
var onP=function(obj,stack) {
	session.pcount++;
	var inlink=false;
	var t="",pstyle="",linktext="",instrtext="";
	obj.child.map(function(o,idx){
		if (typeof o=="string") {
			var txt=o.replace(/>/g,"").replace(/</g,"");	
			if (inlink) {
				linktext+=txt;
			} else {
				t+=txt;
			}
		}
		if (typeof o=="object") {
			if ( o.name=="w:pStyle") {
				pstyle=o.attributes['w:val'];
			}
			else if (o.name=="w:hyperlink") {
				inlink=true;
			}else if (o.name=="w:instrText") {
				instrtext+=obj.child[idx+1]; //consumed
				obj.child[idx+1]="";
			}

			if (o[0]=="w:hyperlink") {
				inlink=false;
				t+="<a>"+linktext+"</a>";
				linktext="";
			} else if (o[0]=="w:instrText") {
				console.log("w:instrtext",instrtext);
				instrtext="";
			}
		} 
	});
	if (pstyle) {
		//console.log("<H"+pstyle+">"+t+"</H"+pstyle+">");
	} else {
		//console.log(t);
	}
	//console.log(t);
	//console.log(obj);
}
*/
var level=0, inhyperlink=false;
var onopentag=function(node,session) {
	if (node.name=="w:pStyle") {
		level=parseInt(node.attributes["w:val"]);
	}else if (node.name=="w:bookmarkStart") {
		var aname=escapexmltext(node.attributes["w:name"]);
		session.output.push('<a n="'+aname+'"/>')
	}else if (node.name=="w:hyperlink") {

		if (node.attributes["r:id"]) {
			if (inhyperlink) {
				session.output.pop();//discard the outer hyperlink
				session.output.push('<a href="'+node.attributes["r:id"]+'">');
			} else {
				session.output.push(session.text);
				session.text="";
				session.output.push('<a href="'+node.attributes["r:id"]+'">');
				inhyperlink=true;				
			}
		}
	}
}
var escapexmltext=function(t) {
	return t.replace(/&/g,'&amp;').replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
var parseHyperlink=function(hyperlink) {
	var filename="",anchor="";
	var i=0;
	if (hyperlink[i]=='"') {
		i++;
		while (i<hyperlink.length&&hyperlink[i]!='"'){
			filename+=hyperlink[i];
			i++;
		}
	} 
	i++;
	if (hyperlink[i]=="\\") {
		i+=4;		
		while (i<hyperlink.length&&hyperlink[i]!='"'){
			anchor+=hyperlink[i];
			i++;
		}

	}
	var backslash=filename.lastIndexOf("\\");
	if (backslash>-1) {
		filename=filename.substr(backslash+1);
	}
	var hyperlink=filename;
	if (anchor) hyperlink=filename+"#"+anchor;

	return {length:i,hyperlink:"{{"+hyperlink+"}}" };
}
var dohyperlink=function(t) {
	if (t.indexOf("HYPERLINK")==-1) return t;

	var out="",start=0;
	return t.replace(/HYPERLINK/g,function(m,idx){
		out+=t.substr(start,idx);
		var res=parseHyperlink(t.substr(idx+10));

		start+=res.length;
		//console.log(res.hyperlink+":"+idx+"<br>")
		return res.hyperlink;
	});
	return out;
}
var onclosetag=function(nodename,session) {
	var node=session.tagstack[session.tagstack.length-1];
	if (nodename=="w:p") {
		var t=escapexmltext(session.text);
		if (level) {
			session.output.push("\n<H"+level+">"+t+"</H"+level+">\n");
			level=0;
		} else {
			session.output.push(t);
		}
		session.text="";
	} else if (nodename=="w:hyperlink" && inhyperlink)  {
		/*
		var t=escapexmltext(session.text);
		t=dohyperlink(t);

		session.output.push(t+"</a>");
		session.text="";
		inhyperlink=false;
		*/
	} else if (nodename=="w:instrText") {
		//session.instrText+=session.text;
		//session.text="";
	} else if (nodename=="w:fldChar") {
		/*
		if (node.attributes["w:fldCharType"]=="end" && session.instrText) {
			var t=session.instrText;
			t=dohyperlink(t);
			session.output.push(t);
			session.instrText="";
		}
		*/
	}
}

module.exports={onopentag:onopentag,onclosetag:onclosetag};