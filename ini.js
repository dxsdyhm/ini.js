(function(){"use strict";

String.prototype.trim = function(){return this.replace(/(^\s+|\s+$)/gm, "");};    //normalize String's trim method.


function natural_compare(a, b) {
  var ax = []
     ,bx = []
     ,result
     ;

  a = ("string" === typeof a) ? a : "";
  b = ("string" === typeof b) ? b : "";

  if(true  === /^\s*\/\//.test(a) && false === /^\s*\/\//.test(b)) return -1;
  if(false === /^\s*\/\//.test(a) && true  === /^\s*\/\//.test(b)) return  1;
  //if both starting with '//' handle it just like a standard-natural-sort.

  if("undefined" !== typeof natural_compare.extractor){
    a = natural_compare.extractor(a);
    b = natural_compare.extractor(b);
  }

  a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
  b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });

  while(ax.length > 0 && bx.length > 0){  //simple compare.
    var an, bn, nn;
    an = ax.shift();
    bn = bx.shift();
    nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
    if(0 === nn) continue;
    
    result = nn;
    return result;
  }

 result = ax.length - bx.length;
 return result;
}


function get_filename_from_first_argument(){
  const ARGS    = process.argv
                         .filter(function(s){return false === /node\.exe/i.test(s) && false === /index\.js/i.test(s) && false === /ini\.js/i.test(s);})
                         .map(function(s){return s.replace(/\"/gm,"");})
       ,PATH    = require("path")
       ,RESOLVE = function (path){ //normalize to Unix-slash (will work on Windows too).
                    path = path.replace(/\\+/g,"/");
                    path = PATH.resolve(path); 
                    path = path.replace(/\\+/g,"/");
                    path = path.replace(/\/\/+/g,"/");
                    path = path.replace(/\/+$/g,"");
                    return path;
                  }
  return RESOLVE(ARGS[0]);
}


function read_content_from_file(filename){
  const FS = require("fs");
  return FS.readFileSync(filename,{encoding: "utf8"})
}




function get_name_for_output_file(filename, different_extension, different_name){ //gives you a fully-qualified name of an output file, using the same name with '_mod' suffix added to the name of the file (same extension), you can specify (optional) different extension (for example ".json")
  const PATH    = require("path")
       ,PARTS = PATH.parse(filename)
       ,RESOLVE = function (path){ //normalize to Unix-slash (will work on Windows too).
                    path = path.replace(/\\+/g,"/");
                    path = PATH.resolve(path); 
                    path = path.replace(/\\+/g,"/");
                    path = path.replace(/\/\/+/g,"/");
                    path = path.replace(/\/+$/g,"");
                    return path;
                  }
       ;
  different_extension = "string" === typeof different_extension ? ("." + different_extension.replace(/^\.+/g,"")) : PARTS.ext;  //normalize to the current-filename extension (no-change) or a new one, normalize to have '.' on the start.
  different_name      = "string" === typeof different_name      ? different_name                                  : PARTS.name; //use originalname_mod.originalext by default unless specified otherwise.

  filename =  PARTS.dir + "/" + different_name + different_extension;
  filename = RESOLVE(filename);
  return filename;
}


function write_content_to_file(filename, content){
  const FS = require("fs");
  FS.writeFileSync(filename, content, {flag:"w", encoding:"utf8"}); //explicit overwrite.
}




function ini_string__to__json(content){ //convert an entire INI-file content to a workable-JSON, excluding empty-lines, excluding comments.
  const LINES   = content.replace(/[\r\n]+/gm, "\n")
                         .split("\n")
                         .map(function(s){return s.trim();})                      //trim start/end whitespace.
                         .filter(function(s){return s.length > 2})                //filter-out (near)empty lines.
                         .filter(function(s){return (false === /^\;/.test(s)) })  //not an inline comment-line.
       ,RESULT  = {}
       ;

  var  last = undefined;


  LINES.forEach(function(item, index){
    var tmp;

    if(true === /^\[(.+)\]$/.test(item)){               // '[example]' will add an [] item to the result (preserving an already existing item - if exists..), and will 'save'/link to the last entry.
      item = item.match(/^\[(.+)\]$/)[1];
      RESULT[item] = ("undefined" === typeof RESULT[item]) ? {} : RESULT[item];
      last = RESULT[item];
    }
    else if(true === /^(.+)\=(.*)$/.test(item)){
      item = item.split("=");
      item = [item[0].trim(), item.slice(1).join("=").trim()];   //make sure only the first '=' is a 'splitter', the 2nd-... is part of the sentence.
      
      if("undefined" === typeof last){ //in-case there was no category in the INI-file, we add a new-one named '[Generic]' it means nothing since the INI-file is 'key=value' based, the '[category]' for only for human-readibility.
        RESULT["Generic"] = ("undefined" === typeof RESULT["Generic"]) ? {} : RESULT["Generic"];
        last = RESULT["Generic"];
      }

      last[ item[0] ] = (item[1] || "");
    }
  });

  return RESULT;
}


function json_object_to_beautified_string(json){
  return JSON.stringify(json, null, 2)
             .replace(/,\n /gm, "\n ,").replace(/ *(,(\ +))/gm, "$2,") //comma-first.
             ;
}


function json_object_to_ini_string(content){
  const RESULT = [];

  Object.keys(content).sort(natural_compare).forEach(function(category){
    RESULT.push("[" + category + "]");
    
    Object.keys(content[category]).sort(natural_compare).forEach(function(key){
      var value = content[category][key];
      RESULT.push(key + "=" + value);
    });
    
    RESULT.push("");
  });

  return RESULT.join("\r\n");
}

module.exports.natural_compare                  = natural_compare;
module.exports.get_filename_from_first_argument = get_filename_from_first_argument;
module.exports.read_content_from_file           = read_content_from_file;
module.exports.ini_string__to__json             = ini_string__to__json;
module.exports.json_object_to_beautified_string = json_object_to_beautified_string;
module.exports.json_object_to_ini_string        = json_object_to_ini_string;
module.exports.get_name_for_output_file         = get_name_for_output_file;
module.exports.write_content_to_file            = write_content_to_file;


}());