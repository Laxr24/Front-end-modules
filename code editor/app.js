import Yace from "yace";

import hljs from "highlight.js/lib/core";
// see all languages https://unpkg.com/browse/highlight.js@10.1.1/lib/languages/
// import javascript from "highlight.js/lib/languages/javascript";
import php from "highlight.js/lib/languages/php";
// import json from "highlight.js/lib/languages/json";

import "./app.css";
import "highlight.js/styles/docco.css";

//Plugins
import tab from "yace/dist/plugins/tab.js";
import history from "yace/dist/plugins/history.js";
import cutLine from "yace/dist/plugins/cutLine.js";
import preserveIndent from "yace/dist/plugins/preserveIndent.js";

const plugins = [
    history(), // suuport ctrl+z ctrl+shift+z when use plugins. should be first
    tab(), // indent with two space
    cutLine(), // cmd + x for cutting line
    preserveIndent() // preserve last line indent
  ];

hljs.registerLanguage("php", php);
// hljs.registerLanguage("javascript", javascript);
// hljs.registerLanguage("json", json);

function highlighter(value) {
  return hljs.highlight("php", value).value;
}

const editor = new Yace("#editor", {
  value: "<?php \necho 'Hello friend';\n$val = 'Hallo w this new new temporals are the best of all in the sense of your new essensav of the new dodo mon adkf';\necho $val;\n?>",
  styles: {
    fontSize: "18px"
  },
  highlighter: highlighter,
  plugins,
  lineNumbers: true

});

editor.textarea.spellcheck = false;


var btn = document.getElementById("save")


editor.onUpdate(value => {
//   console.log(value);
});


// Get the value from the editor
btn.onclick = ()=>{
    alert(editor.value);
    console.log(editor.value);
}



