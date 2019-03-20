"use strict";
/*
------------------------
FILE.INI            ---- input example.
  [Category]
  key1 = value1
  key2 = value2
------------------------
FILE.JSON           ---- result-json example.
  {
    "Category":[
                {"key1": "value1"}
               ,{"key2": "value2"}
               ]
  }
------------------------
Main Methods:
  - ini_string__to__json        will convert the INI-string to an object.
  - json_object_to_ini_string   will convert the object to an INI-string.

Optional Metods:
  - get_filename_from_first_argument    extracts the fully-qualified path for a filename from the first argument.
  - read_content_from_file              use the operation-system to read a UTF-8 textual-content from the file-location provided.
  - get_name_for_output_file            suggests a fully qualified name for an output file, you can override the extension.
  - write_content_to_file               use the operation-system to write a UTF-8 textual-content to a file.
  - json_object_to_beautified_string    converts an object (JSON) to string (beautified).
*/


const ini = require("./ini.js");      //or ini.min.js

var filename = ini.get_filename_from_first_argument()
   ,content  = ini.read_content_from_file(filename)     //raw INI (forced UTF-8)
   ;

content = ini.ini_string__to__json(content);                  //INI to JSON-object.

//work with the JSON-object as you normally do in JavaScript.
//  JSON's first-layer (category) is an array of single key:value objects.


content["My New Category"] = [];
content["My New Category"].push( {"Hello": "World!"} );
content["My New Category"].push( {"New": "Content"}  );



//-------------------------------------------------------write the JSON to file (debug? or helpful tool to migrate an old-INI file to JSON?..)
ini.write_content_to_file(
  ini.get_name_for_output_file(filename,".json")    //is just a suggestion you may use your own file-name.
 ,ini.json_object_to_beautified_string(content)     //JSON stringify (with beautify-output -- optional- you can use any stringification mehtod you like)
);

//-------------------------------------------------------JSON-to-INI, write to file. This will overwrite file. Be carful.
ini.write_content_to_file(
  ini.get_name_for_output_file(filename)            //is just a suggestion you may use your own file-name.
 ,ini.json_object_to_ini_string(content)
);        
