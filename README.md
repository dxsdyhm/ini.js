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

<hr/>
<h2>Real-World Example</h2>
Do you know <a href="https://www.audacityteam.org/">Audacity</a>? This (open-source) audio-editor can be adjust with the additional of <a href="https://en.wikipedia.org/wiki/FFmpeg">FFMPEG</a> and <a href="https://en.wikipedia.org/wiki/LAME">LAME</a> to open almost any media-file. It can <a href="https://manual.audacityteam.org/man/portable_audacity.html">made portable as well</a>, by moving the <code>audacity.cfg</code> configuration file from a Windows-user-directory to the same folder as the <code>audacity.exe</code> is in. <br/>
But the cfg (really just an INI file) needs several fully-qualified paths to several plugin-binaries used with Adacity, so in this project: https://github.com/eladkarako/mods/tree/store/Audacity <br/>
I've created a wrapping around the main exe, that first edits the INI paths to the current folder where Audacity is in (works well when placed on disk-on-key for example), <br/>
<strong>for that I'm using ini.js: https://github.com/eladkarako/mods/blob/store/Audacity/resources/index.js#L2 </strong> <br/>
