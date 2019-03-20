(function(){"use strict";

String.prototype.trim = function(){return this.replace(/(^\s+|\s+$)/gm, "");};    //normalize String's trim method.


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




function get_name_for_output_file(filename, different_extension){ //gives you a fully-qualified name of an output file, using the same name with '_mod' suffix added to the name of the file (same extension), you can specify (optional) different extension (for example ".json")
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
  different_extension = "string" === typeof different_extension ? ("." + different_extension.replace(/^\.+/g,"")) : PARTS.ext; //normalize to the current-filename extension (no-change) or a new one, normalize to have '.' on the start.

  filename =  PARTS.dir + "/" + PARTS.name + "_mod" + different_extension;
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
      RESULT[item] = ("undefined" === typeof RESULT[item]) ? [] : RESULT[item];
      last = RESULT[item];
    }
    else if(true === /^(.+)\=(.*)$/.test(item)){
      item = item.split("=");
      tmp = {};
      tmp[ item[0].trim() ] = item.slice(1).join("=").trim();   //make sure only the first '=' is a 'splitter', the 2nd-... is part of the sentence.
      
      if(undefined === last){ //in-case there was no category in the INI-file, we add a new-one named '[Generic]' it means nothing since the INI-file is 'key=value' based, the '[category]' for only for human-readibility.
        RESULT["Generic"] = ("undefined" === typeof RESULT["Generic"]) ? [] : RESULT["Generic"];
        last = RESULT[item];
      }

      last.push(tmp);
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

  Object.keys(content).forEach(function(category){
    RESULT.push("[" + category + "]");
    
    content[category].forEach(function(item){
      var key   = Object.keys(item).shift()
         ,value = item[key]
         ;
      var key = Object.keys(item).shift();
      RESULT.push(key + " = " + value);
    });
    
    RESULT.push("");
  });

  return RESULT.join("\r\n");
}

module.exports.get_filename_from_first_argument = get_filename_from_first_argument;
module.exports.read_content_from_file           = read_content_from_file;
module.exports.ini_string__to__json             = ini_string__to__json;
module.exports.json_object_to_beautified_string = json_object_to_beautified_string;
module.exports.json_object_to_ini_string        = json_object_to_ini_string;
module.exports.get_name_for_output_file         = get_name_for_output_file;
module.exports.write_content_to_file            = write_content_to_file;
/*
*/

}());