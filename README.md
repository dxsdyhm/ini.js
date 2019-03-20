<h1>ini.js</h1>
an easy middleware-convertor, converting INI-files to a JSON-object, <br/>
edit it as you normally would edit a native JavaScript object, <br/>
and then write it back to INI. <br/>
<img src="resources/example1.png" /> <br/>
<hr/>
This can help you integrate old INI-configuration files to your newer NodeJS programs, <br/>
or even a helping tool to convert old INI-files to a newer JSON format. <br/>
<hr/>
Supports back and forth convention. <br/>
Supports UTF-8 content. <br/>
<hr/>
Additional (optional) methods added, <br/>
including argument handling, file read/write (JSON too) to make things easier/faster.
<hr/>
<h3>No support for commented-lines (with <code>;</code>) since JSONs do not have native support for 'non-data' storing.. feel free to fork and implement one...</h3>