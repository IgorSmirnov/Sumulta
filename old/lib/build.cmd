#! /bin/sh
java -jar /www/compiler.jar --charset UTF-8 --js lib.js --js_output_file ../lib.min.js
rem #cat ajax.js dom.js api.js js.js > ../lib.js
rem java -jar ~/closure/compiler.jar --js ../geom/*.js --js_output_file ../geom.js