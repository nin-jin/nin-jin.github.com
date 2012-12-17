 document.getElementsByTagName( 'head' )[0].appendChild( document.createElement( 'style' ) ).textContent= "wc_article {display: block;margin: 5% 6%;position: relative;}wc_article_title {display: block;color: #321;font: 40pt/1 'Times', serif;text-align: center;}wc_article_title br {display: none;}wc_article_title a:hover {text-decoration: none;color: #66b;}wc_article_annotation {display: block;color: #666;margin: 0;padding: 20pt 0;border-bottom: 1px dashed #bbb;}wc_article_content {display: block;margin: 20pt 0 0;text-align: left;}wc_aspect {display: block;width: 100%;text-align: center;}wc_binom-center {text-align: center;display: block;float: left;width: 100%;}wc_binom-left {display: table-cell;padding-right: 5%;border-right: 1px solid gray;margin-right: -1px;text-align: left;}wc_binom-right {display: table-cell;padding-left: 5%;border-left: 1px solid gray;text-align: left;}wc_binom {display: table;border-collapse: collapse;border-top: 1px solid gray;border-bottom: 1px solid gray;}wc_button {display: inline-block;position: relative;}wc_button button {white-space: normal;cursor: pointer;overflow: visible;z-index: 0;text-align: center;display: block;position: relative;top: -1px;padding: .2em .4em;font-size: 14px;line-height: 1.2;-moz-box-sizing: border-box;box-sizing: border-box;border: 1px solid #aaa;border-radius: 3px;background: -o-linear-gradient( -90deg, #eee, #ccc );background: -moz-linear-gradient( -90deg, #eee, #ccc );background: -webkit-gradient( linear, left top, left bottom, from( #eee ), to( #ccc ) );-webkit-background-clip: padding-box;box-shadow: 1px 1px 1px #000;box-shadow: 2px 2px 3px rgba( 0, 0, 0, .75 );}wc_button button:hover {background: -o-linear-gradient( -90deg, #fff, #ccc );background: -moz-linear-gradient( -90deg, #fff, #ccc );background: -webkit-gradient( linear, left top, left bottom, from( #fff ), to( #ccc ) );box-shadow: 2px 2px 2px #000;box-shadow: 4px 4px 5px rgba( 0, 0, 0, .5 );}wc_button button:active {box-shadow: 1px 1px 1px #000;}lang_text:after {display: inline;content: attr( title );}lang_text_hidden {display: inline-block;display: none\\9;width: 1px;overflow: hidden;white-space: pre;}lang_css {font-family: 'Courier New', monospace;white-space: pre-wrap;}lang_css_remark {color: #bbb;white-space: pre-wrap;}lang_css_selector {}lang_css_tag {color: #a3a;font-weight: bold;white-space: pre;}lang_css_id {color: red;white-space: pre;}lang_css_class {color: #d66;font-weight: bold;white-space: pre;}lang_css_pseudo {color: #399;white-space: pre;}lang_css_string {color: #393;white-space: pre-wrap;}lang_css_bracket {color: #333;font-weight: bold;white-space: pre;}lang_css_property {color: #339;font-weight: bold;white-space: pre;}lang_css_value {color: black;white-space: pre-wrap;}lang_pcre {font-family: 'Courier New', monospace;white-space: pre-wrap;line-height: 1;}lang_pcre_backslash {color: #aaa;}lang_pcre_spec {color: red;}lang_pcre_control {font-weight: bold;color: #c33;}lang_js {font-family: 'Courier New', monospace;white-space: pre;}lang_js_remark {color: #999;white-space: pre;}lang_js_string {color: #393;white-space: pre;}lang_js_internal {color: #333;}lang_js_external {font-weight: bold;}lang_js_keyword {color: #339;font-weight: bold;}lang_js_number {color: #c30;white-space: pre;}lang_js_regexp {color: #939;white-space: pre;}lang_js_bracket {font-weight: bold;color: #666;white-space: pre;}lang_js_operator {font-weight: bold;color: #066;white-space: pre;}lang_sgml {font-family: 'Courier New', monospace;white-space: pre-wrap;line-height: 1;}lang_sgml_tag {color: #a3a;}lang_sgml_tag-name {font-weight: bold;}lang_sgml_attr-name {color: #a33;}lang_sgml_attr-value {color: #d66;}lang_sgml_comment {color: #888;}lang_sgml_decl {color: #066;}lang_sgml_comment {color: #999;}wc_demo {display: block;border: 1px solid #ccc;max-width: 100%;margin: 2pt 0;}wc_demo_result {display: block;border-bottom: 1px dotted #aaa;overflow: auto;}wc_demo_source {display: block;white-space: pre;overflow: auto;font-size: 11pt;line-height: 1.5;background: #eef;}wc_desktop {display: block;min-width: 100%;min-height: 100%;text-align: center;overflow: hidden;position: relative;background: fixed url( 'data:image/png;base64,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' ) left top no-repeat #bbb;}lang_php {white-space: pre-wrap;font-family: 'Courier New', monospace;}lang_php_dollar {font-weight: bold;color: #66c;}lang_php_variable {color: #66c;}lang_php_string {color: #393;white-space: pre;}lang_php_func {color: #c66;font-weight: bold;white-space: pre;}lang_php_keyword {color: #369;font-weight: bold;}lang_php_number {color: #939;white-space: pre;font-weight: bold;}lang_md {white-space: pre-wrap;line-height: 1.5;}lang_md_embed {display: block;text-align: center;}.wc_lang_md_embed-object {display: block;width: 100%;height: 100%;border: none;box-shadow: 1px 1px 5px rgba( 0, 0, 0, .5 );border-radius: 3px;background: black;overflow: hidden;}lang_md_embed img {max-height: 90%;max-width: 100%;border: none;box-shadow: 1px 1px 5px rgba( 0, 0, 0, .5 );border-radius: 2px;}lang_md_embed img:hover {opacity: .95;box-shadow: 2px 2px 7px black;}lang_md_embed-href {color: #66b;position: absolute;opacity:  0;z-index: -1;font-family: 'Courier New', monospace;font-size: 10pt;}wc_editor[wc_editor_active=\"true\"] lang_md_embed-href {position: static;opacity: 1;}lang_md_embed-marker {color: #666;position: absolute;opacity:  0;z-index: -1;font-family: 'Courier New', monospace;font-size: 10pt;}wc_editor[wc_editor_active=\"true\"] lang_md_embed-marker {position: static;opacity: 1;}lang_md_image {}lang_md_image object {max-width: 100%;}lang_md_image-href {color: #66b;position: absolute;opacity:  0;z-index: -1;font-family: 'Courier New', monospace;}wc_editor[wc_editor_active=\"true\"] lang_md_image-href {position: static;opacity: 1;}lang_md_link {color: blue;font-family: 'Courier New', monospace;}lang_md_link-title {font-family: 'Times', serif;white-space: nowrap;}lang_md_link-href {font-size: 11pt;color: #66b;position: absolute;opacity:  0;z-index: -1;left: -1000em;}wc_editor[wc_editor_active=\"true\"] lang_md_link-href {position: static;opacity: 1;}lang_md_link-marker {font-size: 13pt;color: #999;position: absolute;opacity:  0;z-index: -1;}wc_editor[wc_editor_active=\"true\"] lang_md_link-marker {position: static;opacity: 1;}lang_md_author {color: #006;}lang_md_indent {font-size: 12pt;font-family: 'Courier New', monospace;}lang_md_para {font-family: 'Times', serif;overflow: hidden;}lang_md_header-3 {color: #006;font-size: 16pt;font-family: 'Times', serif;margin-left: -30pt;}lang_md_header-2 {color: #006;font-size: 22pt;font-family: 'Times', serif;margin-left: -30pt;}lang_md_header-1 {color: #006;font-size: 30pt;font-family: 'Times', serif;margin-left: -30pt;}lang_md_header-marker {font-size: 12pt;opacity: 0;font-family: 'Courier New', monospace;color: #666;}wc_editor[wc_editor_active=\"true\"] lang_md_header-marker {opacity: 1;}lang_md_pros {color: #393;font-weight: bold;}lang_md_cons {color: #933;font-weight: bold;}lang_md_disputes {color: #399;font-weight: bold;}lang_md_marker {font-size: 12pt;opacity: 0;font-family: 'Courier New', monospace;color: #666;}wc_editor[wc_editor_active=\"true\"] lang_md_marker {opacity: 1;}lang_md_quote {color: green;}lang_md_quote-marker {color: #060;font-size: 12pt;opacity: 0;font-family: 'Courier New', monospace;}wc_editor[wc_editor_active=\"true\"] lang_md_quote-marker {opacity: 1;}lang_md_quote-inline {color: green;}lang_md_quote-inline-marker {color: #060;}lang_md_math {color: #a30;}lang_md_table {display: table;empty-cells: show;border-left: 1px solid #ccc;border-top: 1px solid #ccc;}wc_editor[wc_editor_active=\"true\"] lang_md_table {display: inline;border: none;}lang_md_table-row {display: table-row;}wc_editor[wc_editor_active=\"true\"] lang_md_table-row {display: inline;}lang_md_table-row-sep {position: absolute;opacity:  0;z-index: -1;font-size: 14pt;font-family: 'Courier New', monospace;}wc_editor[wc_editor_active=\"true\"] lang_md_table-row-sep {position: static;opacity: 1;}lang_md_table-cell {display: table-cell;padding: 0 .25em;border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;}wc_editor[wc_editor_active=\"true\"] lang_md_table-cell {display: inline;border: none;padding: 0;}lang_md_table-marker {position: absolute;opacity:  0;z-index: -1;font-size: 14pt;font-family: 'Courier New', monospace;}wc_editor[wc_editor_active=\"true\"] lang_md_table-marker {position: static;opacity: 1;}lang_md_code {font-family: 'Courier New', monospace;white-space: pre-wrap;line-height: 1.2;font-size: 12pt;}lang_md_code:after {display: block;position: absolute;top: 0;height: 100%;left: 1.75em;border: 1px solid #ddd;content: '';z-index: -1;}lang_md_code-marker {font-size: 12pt;opacity: 0;font-family: 'Courier New', monospace;color: #666;}wc_editor[wc_editor_active=\"true\"] lang_md_code-marker {opacity: 1;}lang_md_code-meta {color: #666;background: #eee;border: 1px solid #ddd;border-radius: 1px;padding: 0 .2em;font-size: 10pt;margin-bottom: .5em;line-height: 2;text-align: top;}lang_md_code-lang {font-weight: bold;color: black;}lang_md_code-content {}lang_md_escaping-marker {color: #999;font-family: 'Courier New', monospace;font-size: 8pt;position: absolute;opacity:  0;z-index: -1;}wc_editor[wc_editor_active=\"true\"] lang_md_escaping-marker {position: static;opacity: 1;}lang_md_emphasis {font-style: italic;}lang_md_emphasis-marker {color: #999;font-family: 'Courier New', monospace;position: absolute;opacity:  0;z-index: -1;font-size: 6pt;}wc_editor[wc_editor_active=\"true\"] lang_md_emphasis-marker {position: static;opacity: 1;}lang_md_strong {font-weight: bold;}lang_md_strong-marker {color: #999;font-family: 'Courier New', monospace;font-size: 8pt;position: absolute;opacity:  0;z-index: -1;}wc_editor[wc_editor_active=\"true\"] lang_md_strong-marker {position: static;opacity: 1;}lang_md_super {vertical-align: super;font-size: .75em;}lang_md_super-marker {color: #999;font-family: 'Courier New', monospace;font-size: 8pt;position: absolute;opacity:  0;z-index: -1;}wc_editor[wc_editor_active=\"true\"] lang_md_super-marker {position: static;opacity: 1;}lang_md_sub {vertical-align: sub;font-size: .75em;}lang_md_sub-marker {color: #999;font-family: 'Courier New', monospace;font-size: 8pt;position: absolute;opacity:  0;z-index: -1;}wc_editor[wc_editor_active=\"true\"] lang_md_sub-marker {position: static;opacity: 1;}lang_md_remark {color: #666;}wc_editor {visibility: hidden;display: block;}wc_editor[wc_editor_hlight] {text-align: left;}[wc_editor_inited=\"true\"] {visibility: visible;}div[wc_editor_content] {padding: 2px 4px;display: block;min-height: 1em;white-space: pre-line;}div[wc_editor_content]:empty:before {content: attr( wc_editor_content );position: absolute;color: gray;font-style: italic;line-height: 1;}div[wc_editor_content] p {margin: 0;padding: 0;}div[wc_editor_content]:focus {outline: none;}wc_editor:hover {outline: 1px dotted #ddd;}wc_editor[wc_editor_active=\"true\"] {outline: 1px dotted #bbb;}wc_error {display: inline-block;text-align: left;overflow: auto;white-space: pre-wrap;word-break: break-all;padding: 4px;font-size: 12px;line-height: 1.15;vertical-align: bottom;font-family: monospace;background: pink;margin: 3pt;border-radius: 2px;border: 1px solid #aaa;box-shadow: 4px 4px 5px rgba( 0, 0, 0, .5 );}wc_footer {width: 100%;display: block;overflow: hidden;padding: 3pt 0;font: 12pt/1 'Times', serif;text-align: center;clear: both;color: #666;position: absolute;bottom: 0;}wc_hlight {display: inline-block;text-align: left;}wc_hontrol {display: block;position: absolute;right: 0;bottom: -10pt;font-size: 8pt;line-height: 1;z-index: 1;}wc_hontrol_clone {margin-right: -1px;border: 1px solid #bbb;background: #ffe;padding: 1pt 2pt;cursor: pointer;}wc_hontrol_clone:hover {background: #ccf;border: 1px solid #99c;}wc_hontrol_delete {margin-right: -1px;border: 1px solid #bbb;background: #ffe;padding: 1pt 2pt;cursor: pointer;}wc_hontrol_delete:hover {background: #fcc;border: 1px solid #c99;}wc_js-bench_list {font-size: 10pt;line-height: 1.2;display: inline-table;vertical-align: top;border-collapse: collapse;margin: 2pt 0;}wc_js-bench_header {display: table-row;cursor: pointer;}wc_js-bench {display: table-row;}wc_js-bench_column {text-align: center;font-family: 'Arial', sans-serif;font-weight: bold;color: #666;display: table-cell;padding: 0 4pt;}wc_js-bench_runner {text-align: right;display: table-cell;color: #060;}wc_js-bench_header:hover wc_js-bench_runner {color: #090;}wc_js-bench_header:active wc_js-bench_runner {color: #000;}wc_js-bench_source {display: table-cell;background-color: #eee;border: 1px solid #999;text-align: left;}wc_js-bench_result {border: 1px solid #999;padding: 2pt 4pt;text-align: right;font-family: 'Courier New', monospace;display: table-cell;vertical-align: top;}wc_js-bench_result.source\\=inner {background-color: #dfd;font-weight: bold;}wc_js-bench_result.source\\=outer {background-color: #edf;}wc_js-bench.wait\\=true wc_js-bench_result {background-color: #eee;}wc_js-test {display: inline-block;font-size: 9pt;font-family: 'Courier New', monospace;border: 1px solid #ddd;line-height: 1.5;white-space: pre;max-width: 100%;vertical-align: top;background: #eee;margin: 2pt 0;position: relative;text-align: left;}wc_js-test[wc_js-test_passed='true'] {background: #cfc;border: 1px solid #ada;}wc_js-test[wc_js-test_passed='false'] {background: #fcc;border: 1px solid #c99;}.wc_js-test_textarea {display: none;}wc_js-test_timeout {display: block;padding: 2pt 4pt;font-size: 8pt;background: #ffc;border-bottom: 1px solid #dda;}wc_js-test_source {display: block;overflow: auto;}wc_js-test_result {border-top: 1px solid #dda;background: #ffc;padding: 2pt 4pt;display: block;}wc_js-test wc_hontrol {display: none;}wc_js-test:hover wc_hontrol {display: block;}a[wc_js-test_summary][wc_js-test_passed] {position: fixed;left: 1em;top: 1em;width: 1em;height: 1em;overflow: hidden;border-radius: .5em;background: gray;}a[wc_js-test_summary][wc_js-test_passed='true'] {background: #cfc;border: 1px solid #ada;}a[wc_js-test_summary][wc_js-test_passed='false'] {background: #fcc;border: 1px solid #c99;}a[wc_link=\"true\"] {text-decoration: none; text-decoration: inherit;color: #66b;cursor: pointer;}a[wc_link=\"true\"]:visited {color: #669;}a[wc_link=\"true\"]:hover {color: #66f;text-decoration: underline;}wc_logo {font: 64px/1 'Times', serif;color: white;text-shadow: 0px 0px 4px gray;position: absolute;left: 0;top: 0;padding: 1%;opacity: .9;}a:hover wc_logo {color: black;text-shadow: 0 0 4px gray;}wc_net-bridge.modified\\=true {outline: 1px dotted red;display: block;}wc_paper {display: block;position: relative;font-color: black;text-align: center;overflow: auto;max-width: 50em;min-width: 10em;margin: 0 auto;border-radius: 2px;border: 1px solid #aaa;background: white;box-shadow: 4px 4px 5px rgba( 0, 0, 0, .5 );}wc_path {display: block;font: 20px/1 'Times', serif;color: #333;text-align: left;padding: .4em .4em;float: left;}wc_path_item {padding: .2em;color: #336;}wc_pop-tool {display: inline-block;min-width: 10em;vertical-align: bottom;position: relative;font-color: black;text-align: center;overflow: hidden;font: 14pt/1 'Times', serif;}wc_pop-tool_panel {display: inline-table;position: relative;box-shadow: 2px 2px 3px rgba( 0, 0, 0, .25 );border-radius: 2px;border: 1px solid #aaa;background: #eee;text-align: left;margin: 1pt 5pt;}wc_pop-tool_panel[ wc_pop-tool_edge = \"top\" ] {top: 21pt;-webkit-transition: top .2s .2s;transition: top .2s .2s;}wc_pop-tool_panel[ wc_pop-tool_edge = \"bottom\" ] {bottom: 23pt;-webkit-transition: bottom .2s .2s;transition: bottom .2s .2s;}wc_pop-tool:focus wc_pop-tool_panel[ wc_pop-tool_edge = \"top\" ] {top: 2pt;}wc_pop-tool:focus wc_pop-tool_panel[ wc_pop-tool_edge = \"bottom\" ] {bottom: 2pt;}wc_pop-tool:hover wc_pop-tool_panel[ wc_pop-tool_edge = \"top\" ] {top: 2pt;-webkit-transition: top .1s .1s;transition: top .1s .1s;}wc_pop-tool:hover wc_pop-tool_panel[ wc_pop-tool_edge = \"bottom\" ] {bottom: 2pt;-webkit-transition: bottom .1s .1s;transition: bottom .1s .1s;}wc_pop-tool_hidden {width: 0;border: none;padding: 0;margin: 0;opacity: 0;position: absolute;z-index: -1;overflow: hidden;}wc_pop-tool_item {display: table-cell;vertical-align: bottom;background: transparent;border-right: 1px solid #aaa;text-align: center;}wc_pop-tool_item:last-child {border-right: none;}wc_pop-tool form {margin: 0;padding: 0;vertical-align: top;}wc_pop-tool input {margin: 0;padding: 4pt;background: transparent;border: none;vertical-align: top;}wc_pop-tool input:focus {background: white;outline: none;}wc_pop-tool a[wc_reset],wc_pop-tool button[wc_reset] {display: block;white-space: nowrap;padding: 3pt 5pt;margin: 0;vertical-align: middle;opacity: .75;color: #66b;cursor: pointer;}wc_pop-tool a[wc_reset]:hover,wc_pop-tool button[wc_reset]:hover {opacity: .99;text-decoration: none;background: -o-linear-gradient( -90deg, white, #eee );background: -moz-linear-gradient( -90deg, white, #eee );background: -webkit-gradient( linear, left top, left bottom, from( white ), to( #eee ) );}wc_preview {display: block;}wc_preview a {display: inline-block;text-decoration: none;border-bottom: 1px dotted blue;line-height: 1;}wc_preview a:hover {text-decoration: none;border-color: red;}wc_preview iframe {display: block;width: 100%;min-height: 300px;height: 100%;margin-top: .4em;}wc_preview.opened\\=false iframe {display: none;}[wc_reset=\"true\"] {color: inherit;font: inherit;text-align: inherit;text-decoration: inherit;cursor: inherit;box-sizing: border-box;margin: 0;padding: 0;top: none;bottom: none;left: none;right: none;position: static;border: none;outline: none;}html[wc_reset=\"true\"] {width: 100%;height: 100%;background: white;color: black;font: 14pt/1.5 'Times', serif;overflow: auto;overflow-y: scroll;}body[wc_reset=\"true\"] {width: 100%;height: 100%;}a[wc_reset=\"true\"],button[wc_reset=\"true\"] {cursor: pointer;}iframe[wc_reset=\"true\"],object[wc_reset=\"true\"] {width: 100%;height: 100%;overflow-x: hidden;}wc_sidebar {display: block;position: fixed;margin: 0 auto;text-align: right;top: 8%;max-height: 90%;left: 0;padding-left: 1pt;}wc_sidebar_panel {display: block;max-height: 100%;box-shadow: 2px 2px 3px rgba( 0, 0, 0, .25 );border-radius: 2px;border: 1px solid #aaa;background: #eee;text-align: left;position: relative;overflow: auto;margin-left: -100%;z-index: 2;-webkit-transition: margin-left .2s .2s;transition: margin-left .2s .2s;}wc_sidebar:hover {z-index: 1;}wc_sidebar:hover wc_sidebar_panel {margin-left: -2pt;-webkit-transition: margin-left .1s .1s;transition: margin-left .1s .1s;}[wc_sidebar_edge=\"left\"] {float: left;}[wc_sidebar_edge=\"right\"] {float: right;}wc_spacer {display: block;margin: 5% 5%;padding: 10px;position: relative;width: auto;}wc_terminal {display: block;position: relative;font-color: black;text-align: left;overflow: auto;min-width: 10em;margin: 0 auto;border-radius: 2px;border: 1px solid #aaa;background: white;box-shadow: 4px 4px 5px rgba( 0, 0, 0, .5 );}wc_terminal_out {white-space: pre-wrap;word-break: break-all;padding: .25em;display: block;min-height: 1em;font: 16px/1.25 monospace;}wc_terminal_in {display: block;}script[type=\"wc_test\"] {display: inline-block;font-size: 9pt;font-family: 'Courier New', monospace;border: 1px solid #ddd;line-height: 1.5;white-space: pre;max-width: 100%;vertical-align: top;background: #eee;margin: 2pt 0;position: relative;text-align: left;}script[type=\"wc_test\"][wc_test_passed='true'] {background: #cfc;border: 1px solid #ada;}script[type=\"wc_test\"][wc_test_passed='false'] {background: #fcc;border: 1px solid #c99;}wc_test_timeout {display: block;padding: 2pt 4pt;font-size: 8pt;background: #ffc;border-bottom: 1px solid #dda;}wc_test_source {display: block;overflow: auto;}wc_test_error {border-top: 1px solid #dda;background: #ffc;display: block;color: #c00;padding: 2pt 4pt;}wc_test_results {border-top: 1px solid #dda;background: #ffc;display: table;width: 100%;}wc_test_results_value {padding: 2pt 4pt;display: table-cell;width: 50%;}wc_test_results_value + wc_test_results_value {border-left: 1px solid #dda;}script[type=\"wc_test\"] wc_hontrol {display: none;}script[type=\"wc_test\"]:hover wc_hontrol {display: block;}a[wc_test_summary][wc_test_passed] {position: fixed;left: 1em;top: 1em;width: 1em;height: 1em;overflow: hidden;border-radius: .5em;background: gray;}a[wc_test_summary][wc_test_passed='true'] {background: #cfc;border: 1px solid #ada;}a[wc_test_summary][wc_test_passed='false'] {background: #fcc;border: 1px solid #c99;}wc_vmenu_root {display: block;font-size: 10pt;font-family: 'Arial', sans-serif;}wc_vmenu_branch {display: block;margin: .5em 0;}wc_vmenu_leaf {display: block;padding: 0 .25em;white-space: nowrap;text-align: left;}a:hover wc_vmenu_leaf {background: white;}a[wc_link_target=\"true\"] wc_vmenu_leaf {color: red;}iframe[ wc_yasearchresult ] {height: 0;}"
new function( window, document ){
with ( this ){
this.$jam= {}
;
$jam.define=
function( ){
var Ghost= function(){}
var global= this
return function( key, value ){
var keyList= key.split( '.' )
var obj= global
while( true ){
key= keyList.shift()
if( !keyList.length ) break
var next= obj[ key ]
if( next ){
obj= next
} else {
obj= obj[ key ]= new Ghost
}
}
if( key in obj ){
var val= obj[ key ]
if(!( val instanceof Ghost )) throw new Error( 'Redeclaration of [' + key + ']' )
for( i in val ){
if( !val.hasOwnProperty( i ) ) continue
if( i in value ) throw new Error( 'Redeclaration of [' + i + ']' )
value[ i ]= val[ i ]
}
}
obj[ key ]= value
return this
}
}.apply( this )
;
$jam.Class=
function( init ){
var klass=
function( ){
if( this instanceof klass ) return this
return klass.create.apply( klass, arguments )
}
klass.constructor= $jam.Class
klass.create=
function( arg ){
if( arguments.length ){
if(( arg === void 0 )||( arg === null )) return arg
if( arg instanceof klass ) return arg
}
var obj= new klass
return constructor.apply( obj, arguments )
}
klass.raw=
function( obj ){
return ( obj )&&( ( obj instanceof klass ) ? obj.$ : obj )
}
var proto= klass.prototype
var constructor= proto.constructor= function( arg ){
this.$= arg
return this
}
init( klass, proto )
constructor= klass.prototype.constructor
klass.prototype.constructor= klass
return klass
}
;
$jam.define
(   '$jam.Poly'
,   function(){
var map= arguments
return function(){
return map[ arguments.length ].apply( this, arguments )
}
}
)
;
$jam.define
(   '$jam.Hash'
,   $jam.Class( function( klass, proto ){
proto.constructor=
$jam.Poly
(   function( ){
this.$= { prefix: ':', obj: {} }
return this
}
,   function( hash ){
this.$= {}
this.$.prefix= hash.prefix || ''
this.$.obj= hash.obj || {}
return this
}
)
proto.key2field= function( key ){
return this.$.prefix + key
}
proto.has= function( key ){
key= this.key2field( key )
return this.$.obj.hasOwnProperty( key )
}
proto.get= function( key ){
key= this.key2field( key )
return this.$.obj[ key ]
}
proto.put= function( key, value ){
key= this.key2field( key )
this.$.obj[ key ]= value
return this
}
})
)
;
$jam.define
(    '$jam.Cached'
,    function( func ){
var cache= $jam.Hash()
return function( key ){
if( cache.has( key ) ) return cache.get( key )
var value= func.apply( this, arguments )
cache.put( key, value )
return value 
}
}
)
;
$jam.define
(   '$jam.schedule'
,   function( timeout, proc ){
var timerID= window.setTimeout( proc, timeout )
return function( ){
window.clearTimeout( timerID )
}
}
)
;
$jam.Obj=
$jam.Class( function( klass, proto ){
proto.has=
function( key ){
return ( key in this.$ )
}
proto.get=
function( key ){
return this.$[ key ]
}
proto.put=
function( key, value ){
this.$[ key ]= value
return this
}
proto.define=
function( key, value ){
if( this.has( key ) ){
throw new Error( 'Redeclaration of [' + key + ']' )
}
this.put( key, value )
return this
}
proto.method=
function( name ){
var obj= this.$
return function( ){
return obj[ name ].apply( obj, arguments )
}
}
proto.init=
function( init ){
init( this.$ )
return this
}
})
;
$jam.define
(   '$jam.Clock'
,   $jam.Class( function( klass, proto ){
proto.constructor=
function( ){
this.$= { latency: 0, stopper: null, active: false }
return this
}
proto.latency=
$jam.Poly
(   function( ){
return this.$.latency
}
,   function( val ){
this.stop()
this.$.latency= Number( val )
return this
}
)
proto.active=
$jam.Poly
(   function( ){
return this.$.active
}
,   function( val ){
if( val ) this.start()
else this.stop()
return this
}
)
proto.handler=
$jam.Poly
(   function( ){
return this.$.handler
}
,   function( proc ){
this.stop()
this.$.handler= proc
return this
}
)
proto.start=
function( ){
if( this.active() ) return this
this.$.stoper=
$jam.schedule
(   this.latency()
,   $jam.Obj( this )
.method( 'tick' )
)
this.$.active= true
return this
}
proto.stop=
function( ){
if( !this.active() ) return this
this.$.stoper()
this.$.active= false
return this
}
proto.tick=
function( ){
var proc= this.$.handler
proc()
if( !this.active() ) return this
this.$.active= false
this.start()
return this
}
})
)
;
$jam.Value= function( val ){
var value= function(){
return val
}
value.toString= function(){
return '$jam.Value: ' + String( val )
}
return value
}
;
$jam.define
(   '$jam.domReady.then'
,   function( proc ){
var checker= function( ){
if( $jam.domReady() ) proc()
else $jam.schedule( 5, checker )
}
checker()
}
);
$jam.define
(   '$jam.domReady'
,   function( ){
var state= document.readyState
if( state === 'loaded' ) return true
if( state === 'complete' ) return true
return false
}
)
;
$jam.define
(   '$jam.select'
,   function( key, map ){
if( !map.hasOwnProperty( key ) ) {
throw new Error( 'Key [' + key + '] not found in map' )
}
return map[ key ]
}
)
;
$jam.define
(   '$jam.support'
,   new function(){
var Support= function( state ){
var sup= $jam.Value( state )
sup.select= function( map ){
return $jam.select( this(), map )
}
return sup
}
var node= document.createElement( 'div' )
this.msie= Support( /*@cc_on!@*/ false )
this.xmlModel= Support( ( window.DOMParser && window.XSLTProcessor ) ? 'w3c' : 'ms' )
}
)
;
$jam.define
(   '$jam.Component'
,   function( tagName, factory ){
if(!( this instanceof $jam.Component )) return new $jam.Component( tagName, factory )
var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()
var nodes= document.getElementsByTagName( tagName )
var elements= []
var checkName=
( tagName === '*' )
?   $jam.Value( true )
:   function checkName_right( el ){
return( el.nodeName.toLowerCase() == tagName )
}
function isAttached( el ){
return typeof el[ fieldName ] === 'object'
}
function attach( el ){
el[ fieldName ]= null
var widget= factory( el )
el[ fieldName ]= widget || null
if( widget ) elements.push( el )
}
function attachIfLoaded( el ){
var cur= el
do {
if( !cur.nextSibling ) continue
attach( el )
break
} while( cur= cur.parentNode )
}
function dropElement( el ){
for( var i= 0; i < elements.length; ++i ){
if( elements[ i ] !== el ) continue
elements.splice( i, 1 )
return
}
}
function detach( nodeList ){
for( var i= 0, len= nodeList.length; i < len; ++i ){
var node= nodeList[ i ]
var widget= node[ fieldName ]
if( widget.destroy ) widget.destroy()
node[ fieldName ]= void 0
dropElement( node )
}
}
function check4attach( nodeList ){
var filtered= []
filtering:
for( var i= 0, len= nodeList.length; i < len; ++i ){
var node= nodeList[ i ]
if( isAttached( node ) ) continue
if( !checkName( node ) ) continue
filtered.push( node )
}
for( var i= 0, len= filtered.length; i < len; ++i ){
attachIfLoaded( filtered[ i ] )
}
}
function check4detach( nodeList ){
var filtered= []
filtering:
for( var i= 0, len= nodeList.length; i < len; ++i ){
var node= nodeList[ i ]
if( !node[ fieldName ] ) continue
var current= node
var doc= current.ownerDocument
while( current= current.parentNode ){
if( current === doc ) continue filtering
}
filtered.push( node )
}
detach( filtered )
}
function tracking( ){
check4attach( nodes )
check4detach( elements )
}
var interval=
window.setInterval( tracking, 50 )
$jam.domReady.then(function whenReady(){
window.clearInterval( interval )
attachIfLoaded= attach
tracking()
})
var docEl= document.documentElement
docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
var node= ev.target
check4attach([ node ])
if( !$jam.support.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
}, false )
docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
var node= ev.target
check4detach([ node ])
if( !$jam.support.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
}, false )
this.tagName= $jam.Value( tagName )
this.factory= $jam.Value( factory )
this.elements=
function elements( ){
return elements.slice( 0 )
}
tracking()
}
)
;
$jam.define
(   '$jam.Concater'
,   function( delim ){
delim= delim || ''
return function( list ){
return list.join( delim )
}
}
)
;
$jam.define
(  '$jam.selection'
,   function( ){
return window.getSelection()
}
)
;
$jam.define
(   '$jam.htmlEntities'
,   {    'nbsp': ' '
,    'amp':  '&'
,    'lt':   '<'
,    'gt':   '>'
,    'quot': '"'
,    'apos': "'"
}
)
;
$jam.define
(   '$jam.htmlDecode'
,   new function(){
var fromCharCode= window.String.fromCharCode
var parseInt= window.parseInt
var replacer= function( str, isHex, numb, name ){
if( name ) return $jam.htmlEntities[ name ] || str
if( isHex ) numb= parseInt( numb, 16 )
return fromCharCode( numb )
}
return function( str ){
return String( str ).replace( /&(?:#(x)?(\d+)|(\w+));/g, replacer )
}
}
)
;
$jam.define
(   '$jam.html2text'
,   function( html ){
return $jam.htmlDecode
(   String( html )
.replace( /<div><br[^>]*>/gi, '\n' )
.replace( /<br[^>]*>/gi, '\n' )
.replace( /<div>/gi, '\n' )
.replace( /<[^<>]+>/g, '' )
)
}
)
;
$jam.define
(   '$jam.htmlEscape'
,   function( str ){
return String( str )
.replace( /&/g, '&amp;' )
.replace( /</g, '&lt;' )
.replace( />/g, '&gt;' )
.replace( /"/g, '&quot;' )
.replace( /'/g, '&apos;' )
}
)
;
$jam.define
(   '$jam.classOf'
,   new function( ){
var toString = {}.toString
return function( val ){
if( val === void 0 ) return 'Undefined'
if( val === null ) return 'Null'
if( val === window ) return 'Global'
return toString.call( val ).replace( /^\[object |\]$/g, '' )
}
}
)
;
$jam.define
(   '$jam.Hiqus'
,   $jam.Class( function( klass, proto ){
proto.constructor=
$jam.Poly
(   function( ){
return klass({ })
}
,   function( hiqus ){
this.$= {}
this.$.splitterChunks= hiqus.splitterChunks || '&'
this.$.splitterPair= hiqus.splitterPair || '='
this.$.splitterKeys= hiqus.splitterKeys || '_'
this.$.data= hiqus.data || {}
return this
}
)
proto.get=
$jam.Poly
(   function( ){
return this.get( [] )
}
,   function( keyList ){
if( $jam.classOf( keyList ) === 'String' ){
keyList= keyList.split( this.splitterKeys )
}
var cur= this.$.data
for( var i= 0; i < keyList.length; ++i ){
var key= keyList[ i ]
cur= cur[ key ]
if( $jam.classOf( cur ) !== 'Object' ) break
}
return cur
}
)
proto.put=
$jam.Poly
(   null
,   function( keyList ){
return this.put( keyList, true )
}
,   function( keyList, value ){
if( $jam.classOf( keyList ) === 'String' ){
var keyListRaw= keyList.split( this.$.splitterKeys )
keyList= []
for( var i= 0; i < keyListRaw.length; ++i ){
if( !keyListRaw[ i ] ) continue
keyList.push( keyListRaw[ i ] )
}
}
var cur= this.$.data
for( var i= 0; i < keyList.length - 1; ++i ){
var key= keyList[ i ]
if( $jam.classOf( cur[ key ] ) === 'Object' ){
cur= cur[ key ]
} else {
cur= cur[ key ]= {}
}
}
if( value === null ) delete cur[ keyList[ i ] ]
else cur[ keyList[ i ] ]= value
return this
}
)
proto.merge=
function( json ){
if( $jam.classOf( json ) === 'String' ){
var chunks= json.split( this.$.splitterChunks )
for( var i= 0; i < chunks.length; ++i ){
var chunk= chunks[i]
if( !chunk ) continue
var pair= chunk.split( this.$.splitterPair )
if( pair.length > 2 ) continue;
var key= pair[ 0 ]
var val= pair[ pair.length - 1 ]
this.put( key, val )
}
} else {
if( json instanceof klass ) json= json.$.data
var merge=
function( from, to ){
for( var key in from ){
if( !from.hasOwnProperty( key ) ) continue
if( from[ key ] === null ){
delete to[ key ]
} else if( typeof from[ key ] === 'object' ){
if( typeof to[ key ] !== 'object' ){
to[ key ]= {}
}
merge( from[ key ], to[ key ] )
} else {
to[ key ]= String( from[ key ] )
}
}
}
merge( json, this.$.data )
}
return this
}
proto.toString=
$jam.Poly
(   function( ){
var chunks=
function( prefix, obj ){
var chunkList= []
for( var key in obj ){
if( !obj.hasOwnProperty( key ) ) continue
var val= obj[ key ]
if( val === null ) continue
if( prefix ) key= prefix + this.$.splitterKeys + key
if( typeof val === 'object' ){
chunkList= chunkList.concat( chunks.call( this, key, val ) )
} else {
if( val === key ) chunkList.push( key )
else chunkList.push( key + this.$.splitterPair + val )
}
}
return chunkList
}
return chunks.call( this, '', this.$.data ).join( this.$.splitterChunks )
}
)
})
)
;
$jam.define
(   '$jam.NodeList'
,   $jam.Class( function( klass, proto ){
proto.get=
function( index ){
var node= this.$[ index ]
return $jam.Node( node )
}
proto.length=
function( ){
return Number( this.$.length )
}
proto.head=
function( ){
return this.get( 0 )
}
proto.tail=
function( ){
return this.get( this.length() - 1 )
}
})
)
;
$jam.define
(   '$jam.raw'
,   function( obj ){
if( !obj ) return obj
var klass= obj.constructor
if( !klass ) return obj
var superClass= klass.constructor
if( superClass !== $jam.Class ) return obj
return klass.raw( obj )
}
)
;
$jam.keyCode=
new function( ){
var codes= []
var keyCode= function( code ){
return codes[ code ] || 'unknown'
}
keyCode.ctrlPause= 3
keyCode.backSpace= 8
keyCode.tab= 9
keyCode.enter= 13
keyCode.shift= 16
keyCode.ctrl= 17
keyCode.alt= 18
keyCode.pause= 19
keyCode.capsLock= 20
keyCode.escape= 27
keyCode.space= 32
keyCode.pageUp= 33
keyCode.pageDown= 34
keyCode.end= 35
keyCode.home= 36
keyCode.left= 37
keyCode.up= 38
keyCode.right= 39
keyCode.down= 40
keyCode.insert= 45
keyCode.delete= 46
for( var code= 48; code <= 57; ++code ){
keyCode[ String.fromCharCode( code ).toLowerCase() ]= code
}
for( var code= 65; code <= 90; ++code ){
keyCode[ String.fromCharCode( code ).toLowerCase() ]= code
}
keyCode.win= 91
keyCode.context= 93
for( var numb= 1; numb <= 12; ++numb ){
keyCode[ 'f' + numb ]= 111 + numb
}
keyCode.numLock= 144
keyCode.scrollLock= 145
keyCode.semicolon= 186
keyCode.plus= 187
keyCode.minus= 189
keyCode.comma= 188
keyCode.period= 190
keyCode.slash= 191
keyCode.tilde= 192
keyCode.openBracket= 219
keyCode.backSlash= 220
keyCode.closeBracket= 221
keyCode.apostrophe= 222
keyCode.backSlashLeft= 226
for( var name in keyCode ){
if( !keyCode.hasOwnProperty( name ) ) continue
codes[ keyCode[ name ] ]= name
}
return keyCode
};
$jam.Event=
$jam.Class( function( klass, proto ){
proto.constructor=
$jam.Poly
(   function( ){
this.$= document.createEvent( 'Event' )
this.$.initEvent( '', true, true )
return this
}
,   function( event ){
this.$= event
return this
}
)
proto.type=
$jam.Poly
(   function( ){
return this.$.type
}
,   function( type ){
this.$.initEvent( type, this.$.bubbles, this.$.cancelable )
return this
}
)
proto.data=
$jam.Poly
(   function( ){
return this.$.extendedData
}
,   function( data ){
this.$.extendedData= data
return this
}
)
proto.keyMeta=
$jam.Poly
(   function( ){
return Boolean( this.$.metaKey || this.$.ctrlKey )
}
)
proto.keyShift=
$jam.Poly
(   function( ){
return Boolean( this.$.shiftKey )
}
)
proto.keyAlt=
$jam.Poly
(   function( ){
return Boolean( this.$.altKey )
}
)
proto.keyAccel=
$jam.Poly
(   function( ){
return this.keyMeta() || this.keyShift() || this.keyAlt()
}
)
proto.keyCode=
$jam.Poly
(   function( ){
var code= this.$.keyCode
var keyCode= new Number( code )
keyCode[ $jam.keyCode( code ) ]= code
return keyCode
}
)
proto.button=
function( ){
return this.$.button
}
proto.target=
function( ){
return this.$.target
}
proto.wheel=
$jam.Poly
(   function( ){
if( this.$.wheelDelta ) return - this.$.wheelDelta / 120 
return this.$.detail / 4
}
,   function( val ){
this.$.wheelDelta= - val * 120
return this
}
)
proto.defaultBehavior=
$jam.Poly
(   function( ){
return Boolean( this.$.defaultPrevented )
}
,   function( val ){
if( val ) this.$.returnValue= !!val
else this.$.preventDefault()
return this
}
)
proto.scream=
function( node ){
$jam.raw( node ).dispatchEvent( this.$ )
return this
}
})
;
$jam.define
(   '$jam.Observer'
,   $jam.Class( function( klass, proto ){
proto.constructor=
function( ){
this.$= {}
return this
}
proto.clone=
function( ){
return klass()
.eventName( this.eventName() )
.node( this.node() )
.handler( this.handler() )
}
proto.eventName=
$jam.Poly
(   function( ){
return this.$.eventName
}
,   function( name ){
this.sleep()
this.$.eventName= String( name )
return this
}
)
proto.node=
$jam.Poly
(   function( ){
return this.$.node
}
,   function( node ){
this.sleep()
this.$.node= $jam.raw( node )
return this
}
)
proto.handler=
$jam.Poly
(   function( ){
return this.$.handler
}
,   function( handler ){
var self= this
this.sleep()
this.$.handler= handler
this.$.internalHandler=
function( event ){
return handler.call( self.node(), $jam.Event( event ) )
}
return this
}
)
proto.listen=
function( ){
if( this.$.active ) return this
this.$.node.addEventListener( this.$.eventName, this.$.internalHandler, false )
this.$.active= true
return this
}
proto.sleep=
function( ){
if( !this.$.active ) return this
this.$.node.removeEventListener( this.$.eventName, this.$.internalHandler, false )
this.$.active= false
return this
}
proto.active=
$jam.Poly
(   function( ){
return Boolean( this.$.active )
}
,   function( val ){
if( val ) this.listen()
else this.sleep()
return this
}
)
})
)
;
$jam.define
(   '$jam.Node'
,   $jam.Class( function( klass, proto ){
klass.Element=
function( name ){
return klass.create( document.createElement( name ) )
}
klass.Text=
function( str ){
return klass.create( document.createTextNode( str ) )
}
klass.Comment=
function( str ){
return klass.create( document.createComment( str ) )
}
klass.Fragment=
function( ){
return klass.create( document.createDocumentFragment() )
}
proto.text=
$jam.Poly
(   function( ){
return $jam.html2text( this.$.innerHTML )
}
,   new function(){
return function( val ){
this.$.textContent= String( val )
return this
}
}
)
proto.html=
$jam.Poly
(   function( ){
var val= this.$.innerHTML
.replace
(   /<\/?[A-Z]+/g
,   function( str ){
return str.toLowerCase()
}
)
return val
}
,   function( val ){
this.$.innerHTML= String( val )
return this
}
)
proto.clear=
function( ){
this.html( '' )
return this
}
proto.name=
function( ){
return this.$.nodeName.toLowerCase()
}
proto.attr=
$jam.Poly
(   null
,   function( name ){
return this.$.getAttribute && this.$.getAttribute( name )
}
,   function( name, val ){
this.$.setAttribute( String( name ), String( val ) )
this.$.className+= ''
return this
}    
)
proto.state=
$jam.Poly
(   function( ){
return this.param( [] )
}
,   function( key ){
return $jam.Hiqus({ splitterChunks: ' ' }).merge( this.$.className || '' ).get( key )
}
,   function( key, value ){
this.$.className= $jam.Hiqus({ splitterChunks: ' ' }).merge( this.$.className ).put( key, value )
return this
}
)
proto.width=
function( ){
if( 'offsetWidth' in this.$ ) return this.$.offsetWidth
if( 'getBoundingClientRect' in this.$ ){
var rect= this.$.getBoundingClientRect()
return rect.right - rect.left
}
return 0
}
proto.height=
function( ){
if( 'offsetHeight' in this.$ ) return this.$.offsetHeight
if( 'getBoundingClientRect' in this.$ ){
var rect= this.$.getBoundingClientRect()
return rect.bottom - rect.top
}
return 0
}
proto.posLeft=
function( ){
if( 'offsetLeft' in this.$ ) return this.$.offsetLeft
var rect= this.$.getBoundingClientRect()
return rect.left
}
proto.posTop=
function( ){
if( 'offsetTop' in this.$ ) return this.$.offsetTop
var rect= this.$.getBoundingClientRect()
return rect.top
}
proto.editable=
$jam.Poly
(   function( ){
var editable= this.$.contentEditable
if( editable == 'inherit' ) return this.parent().editable()
return editable == 'true'
}
,   function( val ){
this.$.contentEditable= val
return this
}
)
proto.ancList=
function( name ){
var filtered= []
var node= this
do {
if( name && node.name().replace( name, '' ) ) continue
filtered.push( node )
} while( node= node.parent() )
return $jam.NodeList( filtered )
}
proto.childList=
function( name ){
var list= this.$.childNodes
var filtered= []
for( var i= this.head(); i; i= i.next() ){
if( name && i.name().replace( name, '' ) ) continue
filtered.push( i )
}
return $jam.NodeList( filtered )
}
proto.descList=
function( name ){
var list= this.$.getElementsByTagName( name )
var filtered= []
for( var i= 0; i < list.length; ++i ){
filtered.push( list[ i ] )
}
return $jam.NodeList( filtered )
}
proto.parent= 
$jam.Poly
(   function( ){
return $jam.Node( this.$.parentNode )
}
,   function( node ){
node= $jam.raw( node )
var parent= this.$.parentNode
if( node ){
if( parent === node ) return this
node.appendChild( this.$ )
} else {
if( !parent ) return this
parent.removeChild( this.$ )
}
return this
}
)
proto.ancestor=
function( name ){
var current= this
while( true ){
if( current.name() === name ) return current
current= current.parent()
if( !current ) return current
}
}
proto.surround=
function( node ){
var node= $jam.raw( node )
var parent= this.$.parentNode
var next= this.$.nextSibling
node.appendChild( this.$ )
parent.insertBefore( node, next )
return this
}
proto.dissolve=
function( ){
for( var head; head= this.head(); ){
this.prev( head )
}
this.parent( null )
return this
}
proto.dissolveTree=
function( ){
var endNode= this.follow()
var curr= this
while( curr ){
curr= curr.delve()
if( !curr ) break;
if( curr.$ === endNode.$ ) break;
if( curr.name() === '#text' ) continue;
var next= curr.delve()
curr.dissolve()
curr= next
}
return this
}
proto.head=
$jam.Poly
(   function(){
return $jam.Node( this.$.firstChild )
}
,   function( node ){
this.$.insertBefore( $jam.raw( node ), this.$.firstChild )
return this
}
)
proto.tail=
$jam.Poly
(   function(){
return $jam.Node( this.$.lastChild )
}
,   function( node ){
this.$.appendChild( $jam.raw( node ) )
return this
}
)
proto.next=
$jam.Poly
(   function(){
return $jam.Node( this.$.nextSibling )
}
,   function( node ){
var parent= this.$.parentNode
var next= this.$.nextSibling
parent.insertBefore( $jam.raw( node ), next ) 
return this
}   
)
proto.delve=
function( ){
return this.head() || this.follow()
}
proto.follow=
function( ){
var node= this
while( true ){
var next= node.next()
if( next ) return next
node= node.parent()
if( !node ) return null
}
}
proto.precede=
function( ){
var node= this
while( true ){
var next= node.prev()
if( next ) return next
node= node.parent()
if( !node ) return null
}
}
proto.prev=
$jam.Poly
(   function(){
return $jam.Node( this.$.previousSibling )
}
,   function( node ){
node= $jam.raw( node )
var parent= this.$.parentNode
parent.insertBefore( node, this.$ ) 
return this
}   
)
proto.inDom=
$jam.Poly
(   function( ){
var doc= node.$.ownerDocument
var node= this
while( true ){
if( node.$ === doc ) return true
node= node.parent()
if( !node ) return false
}
}
)
klass.parse=
new function( ){
var parent= klass.Element( 'div' )
return function( html ){
parent.html( html )
var child= parent.head()
if( !child ) return null
if( !child.next() ) return child
var fragment= $jam.Node.Fragment()
while( child= parent.head() ) fragment.tail( child )
return fragment
}
}
proto.toString=
new function( ){
var parent= klass.Element( 'div' )
return function( ){
parent.clear().tail( this.cloneTree() )
return parent.html()
}
}
proto.clone=
function( ){
return $jam.Node( this.$.cloneNode( false ) )
}
proto.cloneTree=
function( ){
return $jam.Node( this.$.cloneNode( true ) )
}
proto.listen=
function( eventName, handler ){
return $jam.Observer()
.eventName( eventName )
.node( this )
.handler( handler )
.listen()
}
})
)
;
$jam.define
(   '$jam.DomRange'
,   $jam.Class( function( klass, proto ){
proto.constructor=
$jam.Poly
(   function( ){
var sel= $jam.selection()
if( sel.rangeCount ) this.$= sel.getRangeAt( 0 ).cloneRange()
else this.$= document.createRange()
return this
}
,   function( range ){
if( !range ) throw new Error( 'Wrong TextRange object' )
this.$= klass.raw( range )
return this
}
)
proto.select=
function( ){
var sel= $jam.selection()
sel.removeAllRanges()
sel.addRange( this.$ )
return this
}
proto.collapse2end=
function( ){
this.$.collapse( false )
return this
}
proto.collapse2start=
function( ){
this.$.collapse( true )
return this
}
proto.dropContents=
function( ){
this.$.deleteContents()
return this
}
proto.text=
$jam.Poly
(   function( ){
return $jam.html2text( this.html() )
}
,   function( text ){
this.html( $jam.htmlEscape( text ) )
return this
}
)
proto.html=
$jam.Poly
(   function( ){
return $jam.Node( this.$.cloneContents() ).toString()
}
,   function( html ){
var node= html ? $jam.Node.parse( html ).$ : $jam.Node.Text( '' ).$
this.replace( node )
return this
}
)
proto.replace=
function( node ){
node= $jam.raw( node )
this.dropContents()
this.$.insertNode( node )
this.$.selectNode( node )
return this
}
proto.ancestorNode=
function( ){
return this.$.commonAncestorContainer
}
proto.compare=
function( how, range ){
range= $jam.DomRange( range ).$
how= Range[ how.replace( '2', '_to_' ).toUpperCase() ]
return range.compareBoundaryPoints( how, this.$ )
}
proto.hasRange=
function( range ){
range= $jam.DomRange( range )
var isAfterStart= ( this.compare( 'start2start', range ) >= 0 )
var isBeforeEnd= ( this.compare( 'end2end', range ) <= 0 )
return isAfterStart && isBeforeEnd
}
proto.equalize=
function( how, range ){
how= how.split( 2 )
var method= { start: 'setStart', end: 'setEnd' }[ how[ 0 ] ]
range= $jam.DomRange( range ).$
this.$[ method ]( range[ how[1] + 'Container' ], range[ how[1] + 'Offset' ] )
return this
}
proto.move=
function( offset ){
this.collapse2start()
if( offset === 0 ) return this
var current= $jam.Node( this.$.startContainer )
if( this.$.startOffset ){
var temp= current.$.childNodes[ this.$.startOffset - 1 ]
if( temp ){
current= $jam.Node( temp ).follow()
} else {
offset+= this.$.startOffset
}
}
while( current ){
if( current.name() === '#text' ){
var range= $jam.DomRange().aimNode( current )
var length= current.$.nodeValue.length
if( !offset ){
this.equalize( 'start2start', range )
return this
} else if( offset > length ){
offset-= length
} else {
this.$.setStart( current.$, offset )
return this
}
}
if( current.name() === 'br' ){
if( offset > 1 ){
offset-= 1
} else {
var range= $jam.DomRange().aimNode( current )
this.equalize( 'start2end', range )
return this
}
}
current= current.delve()
}
return this
}
proto.clone=
function( ){
return $jam.DomRange( this.$.cloneRange() )
}
proto.aimNodeContent=
function( node ){
this.$.selectNodeContents( $jam.raw( node ) )
return this
}
proto.aimNode=
function( node ){
this.$.selectNode( $jam.raw( node ) )
return this
}
})
)
;
$jam.define
(   '$jam.Lazy'
,   function( gen ){
var proc= function(){
proc= gen.call( this )
return proc.apply( this, arguments )
}
var lazy= function(){
return proc.apply( this, arguments )
}
lazy.gen= $jam.Value( gen )
return lazy
}
)
;
$jam.define
(   '$jam.RegExp'
,   $jam.Class( function( klass, proto ){
proto.constructor=
function( regexp ){
this.$= new RegExp( regexp )
return this
}
klass.escape=
new function( ){
var encodeChar= function( symb ){
return '\\' + symb
}
var specChars = '^({[\\.?+*]})$'
var specRE= RegExp( '[' + specChars.replace( /./g, encodeChar ) + ']', 'g' )
return function( str ){
return String( str ).replace( specRE, encodeChar )
}
}
klass.build=
function( ){
var str= ''
for( var i= 0; i < arguments.length; ++i ){
var chunk= arguments[ i ]
if( i % 2 ) chunk= $jam.RegExp.escape( chunk )
str+= chunk
}
return $jam.RegExp( str )
}
proto.source=
function(){
return this.$.source
}
proto.count=
new function( ){
var offset= /^$/.exec( '' ).length
return function( ){
return RegExp( '^$|' + this.$.source ).exec( '' ).length - offset
}
}
})
)
;
$jam.define
(   '$jam.Lexer'
,   function( lexems ){
if( !lexems ) throw new Error( 'lexems is required' )
var nameList= []
var regexpList= []
var sizeList= []
for( var name in lexems ){
var regexp= $jam.RegExp( lexems[ name ] )
nameList.push( name )
regexpList.push( regexp.source() )
sizeList.push( regexp.count() )
}
var regexp= RegExp( '([\\s\\S]*?)(?:((' + regexpList.join( ')|(' ) + '))|($\n?))', 'gm' )
var count= $jam.RegExp(regexp).count()
return $jam.Class( function( klass, proto ){
proto.constructor=
function( str ){
this.string= String( str )
this.position= 0
return this
}
proto.next=
function(){
regexp.lastIndex= this.position
var found= regexp.exec( this.string )
var prefix= found[1]
if( prefix ){
this.position+= prefix.length
this.name= ''
this.found= prefix
this.chunks= [ prefix ]
return this
} else if( found[ 2 ] ){
this.position+= found[ 2 ].length
var offset= 4
for( var i= 0; i < sizeList.length; ++i ){
var size= sizeList[ i ]
if( found[ offset - 1 ] ){
this.name= nameList[ i ]
this.found= found[2]
this.chunks= found.slice( offset, offset + size )
return this
}
offset+= size + 1
}
throw new Error( 'something wrong' )
} else if( regexp.lastIndex >= this.string.length ){
delete this.name
delete this.found
delete this.chunks
return this
} else {
this.position+= found[count] ? found[count].length : 0
this.name= ''
this.found= found[count]
this.chunks= [ found[count] ]
return this
}
}
})
}
)
;
$jam.define
(   '$jam.Number'
,   $jam.Class( function( klass, proto ){
proto.constructor=
function( numb ){
this.$= Number( numb )
return this
}
proto.valueOf=
function( ){
return this.$
}
})
)
;
$jam.define
(   '$jam.Pipe'
,   new function(){
var simple= function( data ){
return data
}
return function( ){
var list= arguments
var len= list.length
if( len === 1 ) return list[0]
if( len === 0 ) return simple
return function(){
if( !arguments.length ) arguments.length= 1
for( var i= 0; i < len; ++i ) arguments[0]= list[ i ].apply( this, arguments )
return arguments[0]
}
}
}
)
;
$jam.define
(    '$jam.Parser'
,    function( syntaxes ){
var lexems= []
var handlers= []
handlers[ '' ]= syntaxes[ '' ] || $jam.Pipe()
for( var regexp in syntaxes ){
if( !syntaxes.hasOwnProperty( regexp ) ) continue
if( !regexp ) continue
lexems.push( RegExp( regexp ) )
handlers.push( syntaxes[ regexp ] )
}
var lexer= $jam.Lexer( lexems )
return function( str ){
var res= []
for( var i= lexer( str ); i.next().found; ){
var val= handlers[ i.name ].apply( this, i.chunks )
if( val !== void 0 ) res.push( val )
}
return res
}
}
)
;
$jam.define
(   '$jam.String'
,   $jam.Class( function( klass, proto ){
proto.constructor=
function( data ){
this.$= String( $jam.raw( data ) || '' )
return this
}
proto.incIndent=
$jam.Poly
(   function( ){
this.$= this.$.replace( /^/mg, '    ' )
return this
}
)
proto.decIndent=
$jam.Poly
(   function( ){
this.$= this.$.replace( /^    |^\t/mg, '' )
return this
}
)
proto.minimizeIndent=
$jam.Poly
(   function( ){
this.normilizeSpaces()
var minIndent= 1/0
this.$.replace( /^( *)[^ \r\n]/mg, function( str, indent ){
if( indent.length < minIndent ) minIndent= indent.length
})
if( minIndent === 1/0 ) return this
this.$= this.$.replace( RegExp( '^[ ]{0,' + minIndent + '}', 'mg' ), '' )
return this
}
)
proto.normilizeSpaces=
$jam.Poly
(   function( ){
this.$= this.$.replace( /\t/g, '    ' ).replace( /\u00A0/, ' ' )
return this
}
)
proto.trim=
$jam.Poly
(   function( ){
return this.trim( /\s/ )
}
,   function( what ){
this.$= this.$.replace( RegExp( '^(' + what.source + ')+' ), '' )
this.$= this.$.replace( RegExp( '(' + what.source + ')+$' ), '' )
return this
}
)
proto.process=
$jam.Poly
(   null
,   function( proc ){
this.$= proc( this.$ )
return this
}
)
proto.replace=
$jam.Poly
(   null
,   function( from ){
return this.replace( from, '' )
}
,   function( from, to ){
this.$= this.$.replace( from, to )
return this
}
)
proto.mult=
$jam.Poly
(   null
,   function( count ){
this.$= Array( count + 1 ).join( this.$ )
return this
}
)
proto.length=
$jam.Poly
(   function( ){
return this.$.length
}
)
proto.toString=
$jam.Poly
(   function( ){
return this.$
}
)
})
)
;
$jam.define
(   '$jam.TaskQueue'
,   $jam.Class( function( klass, proto ){
proto.constructor=
function( ){
this.$= {}
this.$.queue= []
this.$.clock=
$jam.Clock()
.handler( $jam.Obj( this ).method( 'run' ) )
return this
}
proto.latency=
$jam.Poly
(   function( ){
return this.$.clock.latency()
}
,   function( val ){
this.$.clock.latency( val )
return this
}
)
proto.active=
$jam.Poly
(   function( ){
return this.$.clock.active()
}
,   function( val ){
this.$.clock.active( val )
return this
}
)
proto.run=
function( ){
var proc= this.$.queue.shift()
proc()
if( !this.$.queue.length ) this.active( false )
return this
}
proto.add=
function( task ){
this.$.queue.push( task )
this.active( true )
return this
}
})
)
;
$jam.define
(   '$jam.TemplateFactory'
,   new function( ){
var factory= function( arg ){
if( !arg ) arg= {}
var open= arg.tokens && arg.tokens[0] || '{'
var close= arg.tokens && arg.tokens[1] || '}'
var openEncoded= $jam.RegExp.escape( open )
var closeEncoded= $jam.RegExp.escape( close )
var Selector= arg.Selector || arg.encoder && factory.Selector( arg.encoder ) || factory.Selector()
var parse= $jam.Parser( new function(){
this[ openEncoded + openEncoded ]=
$jam.Value( open )
this[ closeEncoded +closeEncoded ]=
$jam.Value( close )
this[ '(' + openEncoded + '([^' + openEncoded + closeEncoded + ']*)' + closeEncoded + ')' ]=
Selector
})
return $jam.Class( function( klass, proto ){
proto.constructor=
function( str ){
this.struct= parse( str )
this.fill( {} )
return this
}
proto.clone=
function( ){
return klass( this.struct.slice( 0 ) )
}
proto.fill=
function( data ){
for( var i= 0; i < this.struct.length; ++i ){
if( typeof this.struct[ i ] !== 'function' ) continue
this.struct[ i ]= this.struct[ i ]( data )
}
return this
}
proto.toString=
function( ){
return this.struct.join( '' )
}
})
}
factory.Selector=
$jam.Poly
(   $jam.Lazy( function( ){
return $jam.Value( factory.Selector( $jam.Pipe() ) )
})
,   function( proc ){
return function( str, key ){
var selector= function( data ){
if( key in data ){
return proc( data[ key ] )
} else {
return selector
}
}
selector.toString= $jam.Value( str )
return selector
}
}
)
return factory
}
)
;
$jam.define
(    '$jam.Throttler'
,    function( latency, func ){
var self
var arg
var stop
return function(){
self= this
arg= arguments
if( stop ) return
stop= $jam.schedule( latency, function(){
stop= null
func.apply( self, arg )
})
}
}
)
;
$jam.define
(   '$jam.Transformer'
,   function( map ){
var Selector= function( str, key ){
var keyList= key.split( ':' )
var fieldName= keyList.shift()
var selector= function( data ){
var value= ( fieldName === '.' ) ? data : data[ fieldName ]
if( value ) return selector
}
selector.toString= $jam.Value( str )
return selector
}
var Template= $jam.TemplateFactory({ Selector: Selector })
for( var key in map ) map[ key ]= Template( map[ key ] )
return 
}
)
;
$jam.define
(   '$jam.Tree'
,   $jam.Class( function( klass, proto ){
proto.constructor=
function( data ){
this.$= data || []
return this
}
klass.Parser=
function( syntax ){
if( !syntax ) syntax= {}
var lineSep= syntax.lineSep || ';'
var valSep= syntax.valSep || '='
var oneIndent= syntax.oneIndent || '+'
var keySep= syntax.keySep || '_'
var lineParser= $jam.RegExp.build( '^((?:', oneIndent, ')*)(.*?)(?:', valSep, '(.*))?$' ).$
var parser=
function( str ){
var lineList= str.split( lineSep )
var data= []
var stack= [ data ]
for( var i= 0; i < lineList.length; ++i ){
var line= lineParser.exec( lineList[ i ] )
var indentCount= line[1].length / oneIndent.length
stack= stack.slice( stack.length - indentCount - 1 )
var path= line[2]
var val= line[3]
var keyList= path.split( keySep )
var keyEnd= keyList.pop()
var cur= stack[0]
if( keyEnd ){
keyList.push( keyEnd )
} else {
stack.unshift( val= [] )
}
while( keyList.length ){
var key= keyList.pop()
val= [{ name: key, content: val }]
}
cur.push( val[0] )
}
return $jam.Tree( data )
}
return parser
}
})
);
$jam.define
(   '$jam.body'
,   function( ){
return document.body
}
)
;
$jam.currentScript= function( ){
var script= document.currentScript
if( !script ){
var scriptList= document.getElementsByTagName( 'script' )
script= scriptList[ scriptList.length - 1 ]
}
for( var parent; parent= script.parentScript; script= parent );
return script
};
$jam.define
(   '$jam.domx'
,   $jam.Class( function( klass, proto ){
proto.constructor=
function( dom ){
if( dom.toDOMNode ) dom= dom.toDOMNode()
this.$= dom
return this
}
proto.toDOMDocument=
function( ){
return this.$.ownerDocument || this.$
}
proto.toDOMNode=
function( ){
return this.$
}
proto.toString=
$jam.support.xmlModel.select(
{   'w3c': function( ){
var serializer= new XMLSerializer
var text= serializer.serializeToString( this.$ )
return text
}
,   'ms': function( ){
return $jam.String( this.$.xml ).trim().$
}
})
proto.transform=
$jam.support.xmlModel.select(
{   'w3c': function( stylesheet ){
var proc= new XSLTProcessor
proc.importStylesheet( $jam.raw( stylesheet ) )
var doc= proc.transformToDocument( this.$ )
return $jam.domx( doc )
}
,   'ms': function( stylesheet ){
var text= this.$.transformNode( $jam.raw( stylesheet ) )
return $jam.domx.parse( text )
}
})
proto.select=
function( xpath ){
result= this.toDOMDocument().evaluate( xpath, this.toDOMNode(), null, null, null ).iterateNext()
return $jam.domx( result )
}
klass.parse=
$jam.support.xmlModel.select(
{   'w3c': function( str ){
var parser= new DOMParser
var doc= parser.parseFromString( str, 'application/xml' )
return $jam.domx( doc )
}
,   'ms': function( str ){
var doc= new ActiveXObject( 'MSXML2.DOMDocument' )
doc.async= false
doc.loadXML( str )
return $jam.domx( doc )
}
})
})
)
;
this.$jin_makeId= function( prefix ){
prefix= prefix || ''
return prefix + Math.random().toString( 32 ).substring( 2 )
};
this.$jin_thread= function( proc ){
return function( ){
var self= this
var args= arguments
var res
var id= $jin_makeId( '$jin_thread' )
var launcher= function( event ){
res= proc.apply( self, args )
}
window.addEventListener( id, launcher, false )
var event= document.createEvent( 'Event' )
event.initEvent( id, false, false )
window.dispatchEvent( event )
window.removeEventListener( id, launcher, false )
return res
}
}
;
$jam.define
(   '$jam.eval'
,   $jin_thread(function( source ){
return window.eval( source )
})
)
;
$jam.define
(   '$jam.eventClone'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( !event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 ) return
$jam.Event().type( '$jam.eventClone' ).scream( event.target() )
}
$jam.Node( document.documentElement )
.listen( 'keyup', handler )
}
)
;
$jam.define
(   '$jam.eventCommit'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 && event.keyCode() != 'S'.charCodeAt( 0 ) ) return
event.defaultBehavior( false )
$jam.Event().type( '$jam.eventCommit' ).scream( event.target() )
}
$jam.Node( document.documentElement )
.listen( 'keydown', handler )
this.toString= $jam.Value( '$jam.eventCommit' )
}
)
;
$jam.define
(   '$jam.eventDelete'
,   new function( ){
var handler=
function( event ){
if( !event.keyShift() ) return
if( event.keyMeta() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 46 ) return
if( !window.confirm( 'Are you sure to delee this?' ) ) return
$jam.Event().type( '$jam.eventDelete' ).scream( event.target() )
}
$jam.Node( document.documentElement )
.listen( 'keyup', handler )
}
)
;
$jam.define
(   '$jam.eventEdit'
,   new function(){
var scream=
$jam.Throttler
(   50
,   function( target ){
$jam.Event().type( '$jam.eventEdit' ).scream( target )
}
)
var node=
$jam.Node( document.documentElement )
node.listen( 'keyup', function( event ){
if( event.keyCode() >= 16 && event.keyCode() <= 18 ) return
if( event.keyCode() >= 33 && event.keyCode() <= 40 ) return
scream( event.target() )
} )
var handler= function( event ){
scream( event.target() )
}
node.listen( 'cut', handler )
node.listen( 'paste', handler )
node.listen( 'drop', handler )
}
)
;
$jam.define
(   '$jam.eventScroll'
,   new function(){
var handler=
function( event ){
$jam.Event()
.type( '$jam.eventScroll' )
.wheel( event.wheel() )
.scream( event.target() )
}
var docEl= $jam.Node( document.documentElement )
docEl.listen( 'mousewheel', handler )
docEl.listen( 'DOMMouseScroll', handler )
}
)
;
$jam.define
(   '$jam.eventURIChanged'
,   new function(){
var lastURI= document.location.href
var refresh=
function( ){
var newURI= document.location.href
if( lastURI === newURI ) return
lastURI= newURI
$jam.Event().type( '$jam.eventURIChanged' ).scream( document )
}
window.setInterval( refresh, 20)
}
)
;
$jam.http= $jam.Class( function( klass, proto ){
proto.constructor= function( uri ){
this.$= { uri: uri }
return this
}
proto.request= function( method, data ){
var channel= new XMLHttpRequest
channel.open( method, this.$.uri, false )
if( data && !( data instanceof String ) && !( data instanceof FormData ) ){
var chunks= []
for( var key in data ){
if( !data.hasOwnProperty( key ) )
continue
chunks.push( encodeURIComponent( key ) + '=' + encodeURIComponent( data[ key ] ) )
}
data= chunks.join( '&' )
channel.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' )
channel.setRequestHeader( 'Accept', 'application/xhtml+xml, */*' )
}
channel.send( data )
if( channel.responseXML ) return $jam.domx( channel.responseXML )
return channel.responseText
}
proto.get= function( ){
return this.request( 'get' )
}
proto.post= function( data ){
return this.request( 'post', data )
}
proto.put= function( data ){
return this.request( 'put', data )
}
})
;
$jam.define
(   '$jam.log'
,   new function(){
var console= window.console
if( !console || !console.log ){
return function(){
alert( [].slice.call( arguments ) )
}
}
return function(){
Function.prototype.apply.call( console.log, console, arguments )
}
}
)
;
$jam.define
(   '$jam.uriEscape'
,   window.encodeURIComponent
)
;
$jam.Component
(   'wc_aspect'
,   function( nodeRoot ){
return new function( ){
var update= function( ){
nodeRoot= $jam.Node( nodeRoot )
var ratio= parseFloat( nodeRoot.attr( 'wc_aspect_ratio' ) )
nodeRoot.$.style.height= Math.min( nodeRoot.width() * ratio, window.innerHeight * .9 ) + 'px'
}
update()
window.addEventListener( 'resize', update )
this.destroy= function( ){
window.removeEventListener( 'resize', update )
}
}
}
)
;
this.$lang=
function( name ){
return $lang[ name ] || $lang.text
}
$lang.text= function( text ){
return $jam.htmlEscape( text )
}
$lang.text.html2text= $jam.html2text
;
$lang.Wrapper=
function( name ){
var prefix= '<' + name + '>'
var postfix= '</' + name + '>'
return function( content ){
return prefix + content + postfix
}
}
;
$lang.Parser=
function( map ){
if( !map[ '' ] ) map[ '' ]= $lang.text
return $jam.Pipe
(   $jam.Parser( map )
,   $jam.Concater()
)
}
;
$lang.css=
new function(){
var css=
function( str ){
return css.root( css.stylesheet( str ) )
}
css.html2text= $jam.html2text
css.root= $lang.Wrapper( 'lang_css' )
css.remark= $lang.Wrapper( 'lang_css_remark' )
css.string= $lang.Wrapper( 'lang_css_string' )
css.bracket= $lang.Wrapper( 'lang_css_bracket' )
css.selector= $lang.Wrapper( 'lang_css_selector' )
css.tag= $lang.Wrapper( 'lang_css_tag' )
css.id= $lang.Wrapper( 'lang_css_id' )
css.klass= $lang.Wrapper( 'lang_css_class' )
css.pseudo= $lang.Wrapper( 'lang_css_pseudo' )
css.property= $lang.Wrapper( 'lang_css_property' )
css.value= $lang.Wrapper( 'lang_css_value' )
css.stylesheet=
$lang.Parser( new function( ){
this[ /(\/\*[\s\S]*?\*\/)/.source ]=
$jam.Pipe( $lang.text, css.remark )
this[ /(\*|(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.Pipe( $lang.text, css.tag )
this[ /(#(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.Pipe( $lang.text, css.id )
this[ /(\.(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.Pipe( $lang.text, css.klass )
this[ /(::?(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.Pipe( $lang.text, css.pseudo )
this[ /\{([\s\S]+?)\}/.source ]=
new function( ){
var openBracket= css.bracket( '{' )
var closeBracket= css.bracket( '}' )
return function( style ){
style= css.style( style )
return openBracket + style + closeBracket
}
}             
})
css.style=
$lang.Parser( new function( ){
this[ /(\/\*[\s\S]*?\*\/)/.source ]=
$jam.Pipe( $lang.text, css.remark )
this[ /([\w-]+\s*:)/.source  ]=
$jam.Pipe( $lang.text, css.property )
this[ /([^:]+?(?:;|$))/.source ]=
$jam.Pipe( $lang.text, css.value )
})
return css
}
;
$lang.pcre=
new function(){
var pcre=
function( str ){
return pcre.root( pcre.content( str ) )
}
pcre.html2text= $jam.html2text
pcre.root= $lang.Wrapper( 'lang_pcre' )
pcre.backslash= $lang.Wrapper( 'lang_pcre_backslash' )
pcre.control= $lang.Wrapper( 'lang_pcre_control' )
pcre.spec= $lang.Wrapper( 'lang_pcre_spec' )
pcre.text= $lang.Wrapper( 'lang_pcre_text' )
pcre.content=
$lang.Parser( new function(){
this[ /\\([\s\S])/.source ]=
new function( ){
var backslash= pcre.backslash( '\\' )
return function( symbol ){
return backslash + pcre.spec( $lang.text( symbol ) )
}
}
this[ /([(){}\[\]$*+?^])/.source ]=
$jam.Pipe( $lang.text, pcre.control )
})
return pcre
}
;
$lang.js=
new function(){
var js=
function( str ){
return js.root( js.content( str ) )
}
js.html2text= $jam.html2text
js.root= $lang.Wrapper( 'lang_js' )
js.remark= $lang.Wrapper( 'lang_js_remark' )
js.string= $lang.Wrapper( 'lang_js_string' )
js.internal= $lang.Wrapper( 'lang_js_internal' )
js.external= $lang.Wrapper( 'lang_js_external' )
js.keyword= $lang.Wrapper( 'lang_js_keyword' )
js.number= $lang.Wrapper( 'lang_js_number' )
js.regexp= $lang.Wrapper( 'lang_js_regexp' )
js.bracket= $lang.Wrapper( 'lang_js_bracket' )
js.operator= $lang.Wrapper( 'lang_js_operator' )
js.content=
$lang.Parser( new function(){
this[ /(\/\*[\s\S]*?\*\/)/.source ]=
$jam.Pipe( $lang.text, js.remark )
this[ /(\/\/[^\n]*)/.source ]=
$jam.Pipe( $lang.text, js.remark )
this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
$jam.Pipe( $lang.text, js.string )
this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
$jam.Pipe( $lang.text, js.string )
this[ /(\/(?:[^\n\/\\]*(?:\\\\|\\[^\\]))*[^\n\/\\]*\/[mig]*)/.source ]=
$jam.Pipe( $lang.pcre, js.regexp )
this[ /\b(_[\w$]*)\b/.source ]=
$jam.Pipe( $lang.text, js.internal )
this[ /(\$[\w$]*)(?![\w$])/.source ]=
$jam.Pipe( $lang.text, js.external )
this[ /\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|void|try|catch|null|typeof|instanceof|return|delete|window|document|let|each|yield)\b/.source ]=
$jam.Pipe( $lang.text, js.keyword )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.Pipe( $lang.text, js.number )
this[ /([(){}\[\]])/.source ]=
$jam.Pipe( $lang.text, js.bracket )
this[ /(\+{1,2}|-{1,2}|\*|\/|&{1,2}|\|{1,2}|={1,2}|%|\^|!)/.source ]=
$jam.Pipe( $lang.text, js.operator )
})
return js
}
;
$lang.sgml=
new function(){
var sgml=
function( str ){
return sgml.root( sgml.content( str ) )
}
sgml.html2text= $jam.html2text
sgml.root= $lang.Wrapper( 'lang_sgml' )
sgml.tag= $lang.Wrapper( 'lang_sgml_tag' )
sgml.tagBracket= $lang.Wrapper( 'lang_sgml_tag-bracket' )
sgml.tagName= $lang.Wrapper( 'lang_sgml_tag-name' )
sgml.attrName= $lang.Wrapper( 'lang_sgml_attr-name' )
sgml.attrValue= $lang.Wrapper( 'lang_sgml_attr-value' )
sgml.comment= $lang.Wrapper( 'lang_sgml_comment' )
sgml.decl= $lang.Wrapper( 'lang_sgml_decl' )
sgml.tag=
$jam.Pipe
(   $lang.Parser( new function(){
this[ /^(<\/?)([a-zA-Z][\w:-]*)/.source ]=
function( bracket, tagName ){
return sgml.tagBracket( $lang.text( bracket ) ) + sgml.tagName( tagName )
} 
this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(")([\s\S]*?)(")/.source ]=
this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(')([\s\S]*?)(')/.source ]=
function( prefix, name, sep, open, value, close ){
name= sgml.attrName( name )
value= sgml.attrValue( open + $lang.css.style( value ) + close )
return prefix + name + sep + value
}
this[ /(\s)([oO][nN]\w+)(\s*=\s*)(")([\s\S]*?)(")/.source ]=
this[ /(\s)([oO][nN]\w+)(\s*=\s*)(')([\s\S]*?)(')/.source ]=
function( prefix, name, sep, open, value, close ){
name= sgml.attrName( name )
value= sgml.attrValue( open + $lang.js( value ) + close )
return prefix + name + sep + value
}
this[ /(\s)([a-zA-Z][\w:-]+)(\s*=\s*)("[\s\S]*?")/.source ]=
this[ /(\s)([a-zA-Z][\w:-]+)(\s*=\s*)('[\s\S]*?')/.source ]=
function( prefix, name, sep, value ){
name= sgml.attrName( $lang.text( name ) )
value= sgml.attrValue( $lang.text( value ) )
return prefix + name + sep + value
}
})
,   $lang.Wrapper( 'lang_sgml_tag' )
)
sgml.content=
$lang.Parser( new function(){
this[ /(<!--[\s\S]*?-->)/.source ]=
$jam.Pipe( $lang.text, sgml.comment )
this[ /(<![\s\S]*?>)/.source ]=
$jam.Pipe( $lang.text, sgml.decl )
this[ /(<[sS][tT][yY][lL][eE][^>]*>)([\s\S]+?)(<\/[sS][tT][yY][lL][eE]>)/.source ]=
function( prefix, content, postfix ){
prefix= $lang.sgml.tag( prefix )
postfix= $lang.sgml.tag( postfix )
content= $lang.css( content )
return prefix + content + postfix
}
this[ /(<[sS][cC][rR][iI][pP][tT][^>]*>)([\s\S]+?)(<\/[sS][cC][rR][iI][pP][tT]>)/.source ]=
function( prefix, content, postfix ){
prefix= $lang.sgml.tag( prefix )
postfix= $lang.sgml.tag( postfix )
content= $lang.js( content )
return prefix + content + postfix
}
this[ /(<[^>]+>)/.source ]=
sgml.tag
})
return sgml
}
;
$jam.Component
(   'wc_demo'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.Node( nodeRoot )
var source= $jam.String( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeResult=
$jam.Node.Element( 'wc_demo_result' )
.parent( nodeRoot )
var nodeSource0=
$jam.Node.Element( 'wc_demo_source' )
.parent( nodeRoot )
var nodeSource=
$jam.Node.parse( '<wc_editor wc_editor_hlight="sgml" />' )
.text( source )
.parent( nodeSource0 )
var exec= $jin_thread( function( ){
var source= $jam.String( nodeSource.text() ).minimizeIndent().trim( /[\n\r]/ )
nodeResult.html( source )
var scripts= nodeResult.descList( 'script' )
for( var i= 0; i < scripts.length; ++i ){
var script= $jam.Node( scripts[i] )
$jam.eval( script.text() )
}
return true
})
exec()
var onCommit=
nodeSource.listen( '$jam.eventCommit', exec )
this.destroy=
function( ){
onCommit.sleep()
}
}
}
)
;
$lang.html= $lang.sgml;
$lang.htm= $lang.html;
$lang.jsm= $lang.js;
$lang.php=
new function( ){
var php=
function( str ){
return php.root( php.content( str ) )
}
php.html2text= $jam.html2text
php.root= $lang.Wrapper( 'lang_php' )
php.dollar= $lang.Wrapper( 'lang_php_dollar' )
php.variable= $lang.Wrapper( 'lang_php_variable' )
php.string= $lang.Wrapper( 'lang_php_string' )
php.number= $lang.Wrapper( 'lang_php_number' )
php.func= $lang.Wrapper( 'lang_php_func' )
php.keyword= $lang.Wrapper( 'lang_php_keyword' )
php.content=
$lang.Parser( new function(){
this[ /\b(true|false|null|NULL|__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|for|foreach|function|global|gotoif|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|__CLASS__|__DIR__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|__NAMESPACE__|__TRAIT__)\b/.source ]=
$jam.Pipe( $lang.text, php.keyword )
this[ /(\$)(\w+)\b/.source ]=
function( dollar, variable ){
dollar= $lang.php.dollar( dollar )
variable= $lang.php.variable( variable )
return dollar + variable
}
this[ /(\w+)(?=\s*\()/.source ]=
php.func
this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
$jam.Pipe( $lang.text, php.string )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.Pipe( $lang.text, php.number )
})
return php
}
;
$jam.define
(    '$lang.tags'
,    new function(){
var tags=
function( str ){
return tags.root( tags.content( str ) )
}
tags.html2text= $jam.html2text
tags.root= $lang.Wrapper( 'lang_tags' )
tags.item= $lang.Wrapper( 'lang_tags_item' )
tags.content=
$lang.Parser( new function(){
this[ /^(\s*?)([^\n\r]+)(\s*?)$/.source ]=
function( open, text, close ){
return open + '<a href="?gist/list/' + $jam.htmlEscape( text ) + '">' + tags.item( text ) + '</a>' + close
}
})
return tags
}
) 
;
$lang.xml= $lang.sgml;
$lang.xbl= $lang.xml;
$lang.xsl= $lang.xml;
$lang.xs= $lang.xsl;
$lang.xul= $lang.sgml;
$lang.md=
new function(){
var md=
function( str ){
return md.root( md.content( str ) )
}
md.html2text= function( text ){
return $jam.html2text
(   text
.replace( /<h1[^>]*>/gi, '\n!!! ' )
.replace( /<h2[^>]*>/gi, '\n!!  ' )
.replace( /<h[3-7][^>]*>/gi, '\n!   ' )
.replace( /<\/?code[^>]*>/gi, '' )
.replace( /<pre[^>]*>([\s\S]+?)<\/pre>/gi, function( str, code ){
console.log( code )
return '\n#   text\n    ' + code.replace( /[\r\n]+$/, '' ).replace( /\n/g, '\n    ' )  + '\n'
})
.replace( /<a wc_link="true"[^>]*>/gi, '' )
.replace( /<a[^>]* href="([^">]+)"[^>]*>([\s\S]*?)<\/a>/gi, function( str, link, text ){
if( !text ) return str
if( text === link ) text= ''
return '[' + text + '\\' + link + ']'
})
.replace( /<li[^>]*>/gi, '\n    • ' )
.replace( /<p[^>]*>/gi, '\n    ' )
.replace( /<\/(h[1-6]|p|li)>/gi, '\n' )
)
}
md.root= $lang.Wrapper( 'lang_md' )
md.header1= $lang.Wrapper( 'lang_md_header-1' )
md.header2= $lang.Wrapper( 'lang_md_header-2' )
md.header3= $lang.Wrapper( 'lang_md_header-3' )
md.header4= $lang.Wrapper( 'lang_md_header-4' )
md.header5= $lang.Wrapper( 'lang_md_header-5' )
md.header6= $lang.Wrapper( 'lang_md_header-6' )
md.headerMarker= $lang.Wrapper( 'lang_md_header-marker' )
md.pros= $lang.Wrapper( 'lang_md_pros' )
md.cons= $lang.Wrapper( 'lang_md_cons' )
md.disputes= $lang.Wrapper( 'lang_md_disputes' )
md.marker= $lang.Wrapper( 'lang_md_marker' )
md.quote= $lang.Wrapper( 'lang_md_quote' )
md.quoteMarker= $lang.Wrapper( 'lang_md_quote-marker' )
md.quoteInline= $lang.Wrapper( 'lang_md_quote-inline' )
md.quoteInlineMarker= $lang.Wrapper( 'lang_md_quote-inline-marker' )
md.image= $lang.Wrapper( 'lang_md_image' )
md.imageHref= $lang.Wrapper( 'lang_md_image-href' )
md.embed= $lang.Wrapper( 'lang_md_embed' )
md.embedHref= $lang.Wrapper( 'lang_md_embed-href' )
md.link= $lang.Wrapper( 'lang_md_link' )
md.linkMarker= $lang.Wrapper( 'lang_md_link-marker' )
md.linkTitle= $lang.Wrapper( 'lang_md_link-title' )
md.linkHref= $lang.Wrapper( 'lang_md_link-href' )
md.author= $lang.Wrapper( 'lang_md_author' )
md.indent= $lang.Wrapper( 'lang_md_indent' )
md.escapingMarker= $lang.Wrapper( 'lang_md_escaping-marker' )
md.emphasis= $lang.Wrapper( 'lang_md_emphasis' )
md.emphasisMarker= $lang.Wrapper( 'lang_md_emphasis-marker' )
md.strong= $lang.Wrapper( 'lang_md_strong' )
md.strongMarker= $lang.Wrapper( 'lang_md_strong-marker' )
md.super= $lang.Wrapper( 'lang_md_super' )
md.superMarker= $lang.Wrapper( 'lang_md_super-marker' )
md.sub= $lang.Wrapper( 'lang_md_sub' )
md.subMarker= $lang.Wrapper( 'lang_md_sub-marker' )
md.math= $lang.Wrapper( 'lang_md_math' )
md.remark= $lang.Wrapper( 'lang_md_remark' )
md.table= $lang.Wrapper( 'lang_md_table' )
md.tableRow= $lang.Wrapper( 'lang_md_table-row' )
md.tableCell= $lang.Wrapper( 'lang_md_table-cell' )
md.tableMarker= $lang.Wrapper( 'lang_md_table-marker' )
md.code= $lang.Wrapper( 'lang_md_code' )
md.codeMarker= $lang.Wrapper( 'lang_md_code-marker' )
md.codeLang= $lang.Wrapper( 'lang_md_code-lang' )
md.codePath= $lang.Wrapper( 'lang_md_code-path' )
md.codeMeta= $lang.Wrapper( 'lang_md_code-meta' )
md.codeContent= $lang.Wrapper( 'lang_md_code-content' )
md.html= $lang.Wrapper( 'lang_md_html' )
md.htmlTag= $lang.Wrapper( 'lang_md_html-tag' )
md.htmlContent= $lang.Wrapper( 'lang_md_html-content' )
md.para= $lang.Wrapper( 'lang_md_para' )
md.inline=
$lang.Parser( new function(){
this[ /^(\s+)/.source ]=
md.indent
this[ /([0-9∅‰∞∀∃∫√×±≤+−≥≠<>%])/.source ]=
md.math
this[ /(`)(.+?)(`)/.source ]=
function( open, text, close ){
return md.escapingMarker( open ) + text + md.escapingMarker( close )
}
this[ /(\*\*|\/\/|\^\^|__|\[\[|\]\]|``|\\\\)/.source ]=
function( symbol ){
return md.escapingMarker( symbol[0] ) + symbol[1]
}
this[ /(\[)(.*?)(\\)((?:https?|ftps?|mailto|magnet):[^\0]*?|[^:]*?(?:[\/\?].*?)?)(\])/.source ]=
function( open, title, middle, href, close ){
var uri= href
open= md.linkMarker( open )
middle= md.linkMarker( middle )
close= md.linkMarker( close )
href= title ? md.linkHref( href ) : md.linkTitle( href )
title= md.linkTitle( md.inline( title ) )
return md.link( '<a wc_link="true" href="' + $jam.htmlEscape( uri ) + '">' + open + title + middle + href + close + '</a>' )
}
this[ /([^\s"({[]\/)/.source ]=
$lang.text
this[ /(\/)([^\/\s](?:[\s\S]*?[^\/\s])?)(\/)(?=[\s,.:;!?")}\]]|$)/.source ]=
function( open, content, close ){
open = md.emphasisMarker( open )
close = md.emphasisMarker( close )
content= md.inline( content )
return md.emphasis( open + content + close )
}
this[ /([^\s"({[]\*)/.source ]=
$lang.text            
this[ /(\*)([^\*\s](?:[\s\S]*?[^\*\s])?)(\*)(?=[\s,.:;!?")}\]]|$)/.source ]=
function( open, content, close ){
open = md.strongMarker( open )
close = md.strongMarker( close )
content= md.inline( content )
return md.strong( open + content + close )
}
this[ /(\^)([^\^\s](?:[\s\S]*?[^\^\s])?)(\^)(?=[\s,.:;!?")}\]√_]|$)/.source ]=
function( open, content, close ){
open = md.superMarker( open )
close = md.superMarker( close )
content= md.inline( content )
return md.super( open + content + close )
}
this[ /(_)([^_\s](?:[\s\S]*?[^_\s])?)(_)(?=[\s,.:;!?")}\]\^]|$)/.source ]=
function( open, content, close ){
open = md.subMarker( open )
close = md.subMarker( close )
content= md.inline( content )
return md.sub( open + content + close )
}
this[ /(")([^"\s](?:[\s\S]*?[^"\s])?)(")(?=[\s,.:;!?)}\]]|$)/.source ]=
this[ /(«)([\s\S]*?)(»)/.source ]=
function( open, content, close ){
open = md.quoteInlineMarker( open )
close = md.quoteInlineMarker( close )
content= md.inline( content )
return md.quoteInline( open + content + close )
}
this[ /(\()([\s\S]+?)(\))/.source ]=
function( open, content, close ){
content= md.inline( content )
return md.remark( open + content + close )
}
})
md.content=
$lang.Parser( new function(){
this[ /^(!!! )(.*?)$/.source ]=
function( marker, content ){
return md.header1( md.headerMarker( marker ) + md.inline( content ) )
}
this[ /^(!!  )(.*?)$/.source ]=
function( marker, content ){
return md.header2( md.headerMarker( marker ) + md.inline( content ) )
}
this[ /^(!   )(.*?)$/.source ]=
function( marker, content ){
return md.header3( md.headerMarker( marker ) + md.inline( content ) )
}
this[ /^(\+   )(.*?)$/.source ]=
function( marker, content ){
return md.pros( md.marker( marker ) + md.inline( content ) )
}
this[ /^(−   )(.*?)$/.source ]=
function( marker, content ){
return md.cons( md.marker( marker ) + md.inline( content ) )
}
this[ /^(±   )(.*?)$/.source ]=
function( marker, content ){
return md.disputes( md.marker( marker ) + md.inline( content ) )
}
this[ /^(>   )(.*?)$/.source ]=
function( marker, content ){
marker = md.quoteMarker( marker )
content= md.inline( content )
return md.quote( marker + content )
}
this[ /^(http:\/\/www\.youtube\.com\/watch\?v=)(\w+)(.*$\n?)/.source ]=
this[ /^(http:\/\/youtu.be\/)(\w+)(.*$\n?)/.source ]=
function( prefix, id, close ){
var href= md.embedHref( prefix + id + close )
var uri= 'http://www.youtube.com/embed/' + id
var embed= md.embed( '<wc_aspect wc_aspect_ratio=".75"><iframe class="wc_lang_md_embed-object" src="' + uri + '" allowfullscreen></iframe></wc_aspect>' )
return href + embed
}
this[ /^((?:[\?\/\.]|https?:|ftps?:|data:).*?)(?:(\\)((?:[\?\/\.]|https?:|ftps?:|data:).*?))?$(\n?)/.source ]=
function( src, middle, link, close ){
var prolog= md.embedHref( src + ( middle || '' ) + ( link || '' ) + close )
var embed= md.embed( '<a wc_link="true" href="' + $jam.htmlEscape( link || src ) + '"><img src="' + $jam.htmlEscape( src ) + '" /></a>' )
return prolog + embed
}
this[ /((?:\n--(?:\n[| ] [^\n]*)*)+)/.source ]=
function( content ){
var rows= content.split( /\n--/g )
rows.shift()
for( var r= 0; r < rows.length; ++r ){
var row= rows[ r ]
var cells= row.split( /\n\| /g )
cells.shift()
for( var c= 0; c < cells.length; ++c ){
var cell= cells[ c ]
cell= cell.replace( /\n  /g, '\n' )
cell= md.inline( cell )
cell= cell.replace( /\n/g, '\n' + md.tableMarker( '  ' ) )
cell= md.tableMarker( '\n| ' ) + cell 
cells[ c ]= md.tableCell( cell )
}
row= cells.join( '' )
var rowSep= '<lang_md_table-row-sep><wc_lang-md_table-cell colspan="300">\n--</wc_lang-md_table-cell></lang_md_table-row-sep>'
rows[ r ]= rowSep + md.tableRow( row )
}
content= rows.join( '' )
return md.table( content )
}
this[ /^(#   )([^\n\r]*[\. ])?([\w-]+)((?:\n    [^\n]*)*)(?=\n|$)/.source ]=
function( marker, path, lang, content ){
content= content.replace( /\n    /g, '\n' )
content= $lang( lang )( content )
content= content.replace( /\n/g, '\n' + md.indent( '    ' ) )
content= md.codeContent( content )
marker= md.codeMarker( marker )
path= path ? md.codePath( path ) : ''
lang= md.codeLang( lang )
return md.code( marker + md.codeMeta( path + lang ) + content )
}
this[ /^(    .*)$/.source ]=
function( content ){
return md.para( md.inline( content ) )
}
})
return md
} 
;
var DISQUS= DISQUS || new function( ){
this.settings= {}
this.extend= function( target, source ){
for( var key in source ) target[ key ]= source[ key ]
}
}
$jam.Component( 'wc_disqus', function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
var script= $jam.Node.Element( 'script' ).attr( 'src', '//nin-jin.disqus.com/thread.js?url=' + $jam.uriEscape( '//' + document.location.host + document.location.pathname ) )
script.listen( 'load', function( ){
console.log( DISQUS.jsonData )
var thread= nodeRoot.html( $lang.md( '  0 *a* b' ) )
var postList= DISQUS.jsonData.posts
var userList= DISQUS.jsonData.users
for( var id in postList ){
var post= postList[ id ]
var user= userList[ post.user_key ]
var message= $jam.Node.Element( 'wc_disqus_message' )
$jam.Node.Element( 'wc_disqus_author' ).text( user.display_name ).parent( message )
$jam.Node.Element( 'wc_disqus_content' ).text( post.raw_message ).parent( message )
message.parent( nodeRoot )
}
} )
nodeRoot.head( script )
} );
$jam.Component
(   'wc_editor'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.Node( nodeRoot )
var source= $jam.htmlEscape( nodeRoot.text() ).replace( /\r?\n/g, '<br />' )
var hint= nodeRoot.attr( 'wc_editor_hint' ) || ''
nodeRoot.clear()
var nodeSource= $jam.Node.Element( 'div' ).attr( 'wc_editor_content', hint )
.html( source )
.parent( nodeRoot )
var sourceLast= ''
var update= function( addon, replace ){
addon= addon || ''
var hlighter= $lang ( nodeRoot.attr( 'wc_editor_hlight' ) )
var source= replace || $jam.html2text( nodeSource.html() )
if( !addon && source === sourceLast ) return
sourceLast= source
var nodeRange= $jam.DomRange().aimNodeContent( nodeSource )
var startPoint= $jam.DomRange().collapse2start()
var endPoint= $jam.DomRange().collapse2end()
var hasStart= nodeRange.hasRange( startPoint )
var hasEnd= nodeRange.hasRange( endPoint )
if( hasStart ){
var metRange= $jam.DomRange()
.equalize( 'end2start', startPoint )
.equalize( 'start2start', nodeRange )
var offsetStart= metRange.text().length
}
if( hasEnd ){
var metRange= $jam.DomRange()
.equalize( 'end2start', endPoint )
.equalize( 'start2start', nodeRange )
var offsetEnd= metRange.text().length
}
var offsetCut= offsetEnd || source.length
source= source.substring( 0, offsetCut ) + addon + source.substring( offsetCut )
if( offsetStart >= offsetCut ) offsetStart= offsetStart + addon.length
if( offsetEnd >= offsetCut ) offsetEnd= offsetEnd + addon.length
source=
$jam.String( source )
.process( hlighter )
.replace( /  /g, '\u00A0 ' )
.replace( /  /g, ' \u00A0' )
.replace( /$/, '\n' )
.replace( /\n/g, '<br/>' )
.$
nodeSource.html( source )
var selRange= $jam.DomRange()
if( hasStart ){
var startRange= nodeRange.clone().move( offsetStart )
selRange.equalize( 'start2start', startRange )
}
if( hasEnd ){
selRange.equalize( 'end2start', nodeRange.clone().move( offsetEnd ) )
}
if( hasEnd || hasEnd ){
selRange.select()
}
}
var onEdit=
nodeRoot.listen( '$jam.eventEdit', $jam.Throttler( 100, function(){ update() } ) )
var onEnter=
nodeRoot.listen( 'keypress', function( event ){
event= $jam.Event( event )
if( !event.keyCode().enter ) return
if( event.keyAccel() ) return
event.defaultBehavior( false )
$jam.DomRange().html( '<br/>' ).collapse2end().select()
})
var onAltSymbol=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.Event( event )
if( !event.keyAlt() ) return
if( event.keyShift() ){
var symbolSet= new function( ){
this[ '0' ]= '∅' // пустое множество
this[ '5' ]= '‰' // промилле
this[ '8' ]= '∞' // бесконечность
this[ 'a' ]= '∀' // всеобщность
this[ 'e' ]= '∃' // существование
this[ 's' ]= '∫' // интегралл
this[ 'v' ]= '√' // корень
this[ 'x' ]= '×' // умножение
this[ 'plus' ]= '±' // плюс-минус
this[ 'comma' ]= '≤' // не больше
this[ 'minus' ]= '−' // минус
this[ 'period' ]= '≥' // не меньше
this[ 'openBracket' ]= '{'
this[ 'closeBracket' ]= '}'
}
} else {
var symbolSet= new function( ){
this[ '0' ]= '°' // градус
this[ '3' ]= '#'
this[ '4' ]= '$'
this[ 'c' ]= '©' // копирайт
this[ 'o' ]= '•' // маркер списка
this[ 's' ]= '§' // параграф
this[ 'v' ]= '✓' // выполнено
this[ 'x' ]= '✗' // провалено
this[ 'plus' ]= '≠' // не равно
this[ 'comma' ]= '«' // открывающая кавычка
this[ 'minus' ]= '–' // среднее тире
this[ 'period' ]= '»' // закрывающая кавычка
this[ 'tilde' ]= '\u0301' // ударение
this[ 'openBracket' ]= '['
this[ 'backSlash' ]= '|'
this[ 'closeBracket' ]= ']'
}
}
var symbol= symbolSet[ $jam.keyCode( event.keyCode() ) ]
if( !symbol ) return
event.defaultBehavior( false )
$jam.DomRange().text( symbol ).collapse2end().select()
})
var onTab=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.Event( event )
if( !event.keyCode().tab ) return
if( event.keyAccel() ) return
event.defaultBehavior( false )
$jam.DomRange().text( '    ' ).collapse2end().select()
})
var onLeave=
nodeSource.listen( 'blur', function( event ){
})
var onPaste=
nodeSource.listen( 'paste', function( event ){
$jam.schedule( 0, function( ){
var hlighter= $lang ( nodeRoot.attr( 'wc_editor_hlight' ) )
var source= hlighter.html2text( nodeSource.html() )
update( '', source )
})
})
var onActivate=
nodeRoot.listen( 'mousedown', function( event ){
event= $jam.Event( event )
if( event.keyAccel() ) return
if( $jam.Node( event.target() ).ancList( 'a' ).length() ) return
nodeRoot.attr( 'wc_editor_active', true )
nodeSource.editable( true )
})
var onDeactivate=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.Event( event )
if( !event.keyCode().escape ) return
nodeSource.editable( false )
nodeRoot.attr( 'wc_editor_active', false )
event.defaultBehavior( false )
})
var onDragEnter=
nodeRoot.listen( 'dragenter', function( event ){
event.defaultBehavior( false )
})
var onDragOver=
nodeRoot.listen( 'dragover', function( event ){
event.defaultBehavior( false )
})
var onDragLeave=
nodeRoot.listen( 'dragleave', function( event ){
event.defaultBehavior( false )
})
var onDrop=
nodeRoot.listen( 'drop', function( event ){
event.defaultBehavior( false )
function upload( file ){
var form = new FormData()
form.append( 'file', file )
var resource= '?image=' + Math.random()
var result= $jam.http( resource ).post( form )
var src= $jam.domx.parse( result ).select(' // * [ @so_uri = "' + resource + '" ] / @hyoo_image_maximal ').$.value
var link= $jam.domx.parse( result ).select(' // * [ @so_uri = "' + resource + '" ] / @hyoo_image_original ').$.value
update( '\n./' + src + '\\./' + link + '\n' )
}
var files= event.$.dataTransfer.files
for( var i= 0; i < files.length; ++i ){
upload( files[ i ] )
}
})
this.destroy= function( ){
onEdit.sleep()
onLeave.sleep()
}
update()
nodeRoot.attr( 'wc_editor_inited', true )
if( nodeRoot.attr( 'wc_editor_active' ) == 'true' )
nodeSource.editable( true )
}
}
)
;
$jam.Component
(   'wc_field'
,   function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
var nodeInput=
$jam.Node.Element( 'input' )
.attr( 'type', 'hidden' )
.attr( 'name', nodeRoot.attr( 'wc_field_name' ) )
.parent( nodeRoot )
nodeRoot.listen
(   '$jam.eventEdit'
,   sync
)
var onEdit=
nodeRoot.listen
(   '$jam.eventEdit'
,   sync
)
function sync( ){
var text= $jam.html2text( nodeRoot.html() ).replace( /[\n\r]+/g, '' )
nodeInput.$.value= text
}
sync()
return new function( ){
this.destroy= function(){
onEdit.sleep()
nodeInput.parent( null )
}
}
}
)
;
$jam.Component
(   'form'
,   new function( ){
var currentScript= $jam.currentScript()
return function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
if( !nodeRoot.attr( 'wc_form' ) ) return null
var nodeResult= nodeRoot.descList( 'wc_form_result' ).head()
var onCommit= nodeRoot.listen
(   $jam.eventCommit
,   send
)
var onSubmit= nodeRoot.listen
(   'submit'
,   send
)
var onClick= nodeRoot.listen
(   'click'
,   function( event ){
if( event.target().type !== 'submit' )
return
send( event )
}
)
function send( event ){
event.defaultBehavior( false )
console.log(event.$)
var method= nodeRoot.attr( 'method' ) || 'get'
if( nodeResult ){
nodeResult.text( '' )
} else if( method == 'get' ){
nodeRoot.$.submit()
return 
}
var nodes= nodeRoot.$.elements
var data= {}
if( event.target().name && event.target().value )
data[ event.target().name ]= event.target().value
for( var i= 0; i < nodes.length; ++i ){
var node= nodes[ i ]
data[ node.name ]= node.value
}
var response= $jam.http( nodeRoot.$.action ).request( method, data )
var location= response.$.evaluate( '//so_relocation', response.$, null, XPathResult.STRING_TYPE, null ).stringValue
if( location ) document.location= location
var templates= $jam.domx.parse( $jam.http( currentScript.src.replace( /[^\/]*$/, 'release.xsl' ) ).get() )
response= response.select(' / * / * ').transform( templates )
if( nodeResult ) nodeResult.html( response )
}
return new function(){
this.destroy= function( ){
onSubmit.sleep()
}
}
}
}
);
$jam.Component
(   'wc_hlight'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.Node( nodeRoot )
var hlight= $lang( nodeRoot.attr( 'wc_hlight_lang' ) )
var source= $jam.String( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.html( hlight( source ) )
}
}
)
;
$jam.Component
(   'wc_js-bench_list'
,   new function( ){
return function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
var nodeHeader=
$jam.Node.parse( '<wc_js-bench_header title="ctrl + enter" />' )
.tail( $jam.Node.parse( '<wc_js-bench_runner>Run ►' ) )
.tail( $jam.Node.parse( '<wc_js-bench_column>inner (µs)' ) )
.tail( $jam.Node.parse( '<wc_js-bench_column>outer (µs)' ) )
nodeRoot.head( nodeHeader )
var refresh=
function( ){
var benchList= nodeRoot.childList( 'wc_js-bench' )
for( var i= 0; i < benchList.length(); ++i ){
$jam.Event()
.type( '$jam.eventCommit' )
.scream( benchList.get( i ) )
}
}
var onClick=
nodeHeader.listen( 'click', refresh )
return new function( ){
this.destroy=
function( ){
onClick.sleep()
}
}
}
}
)
$jam.Component
(   'wc_js-bench'
,   new function( ){
var queue=
$jam.TaskQueue()
.latency( 100 )
var parser= /^([\s\S]*?)_bench\.begin\(\)([\s\S]*)_bench\.end\(\)([\s\S]*)$/
return function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
var source= $jam.String( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.clear()
var nodeSource=
$jam.Node.parse( '<wc_js-bench_source><wc_editor wc_editor_hlight="js">' + $jam.htmlEscape( source ) )
.parent( nodeRoot )
var nodeInner=
$jam.Node.parse( '<wc_js-bench_result class=" source=inner " />' )
.parent( nodeRoot )
var nodeOuter=
$jam.Node.parse( '<wc_js-bench_result class=" source=outer " />' )
.parent( nodeRoot )
nodeRoot.surround( $jam.Node.Fragment() ) // for chrome 12
var calc= $jin_thread( function( source ){
var startCompile= new Date
var proc= new Function( '', source )
var endCompile= new Date
var startExec= new Date
proc()
var endExec= new Date
return new function( ){
this.compile= endCompile.getTime() - startCompile.getTime()
this.exec= endExec.getTime() - startExec.getTime()
}
})
var format= function( time ){
return time.toFixed( 3 )
}
var run=
function( ){
var source= nodeSource.text()
var matches= parser.exec( source )
if( matches ){
var prefix= matches[1] + ';'
var sourceInner= matches[2] + ';'
var postfix= matches[3] + ';'
} else {
var prefix= ''
var sourceInner= source + ';'
var postfix= ''
}
var count= 1
var sourceOuter= prefix + postfix
if( sourceOuter ){
do {
sourceOuter+= sourceOuter
var time= calc( sourceOuter )
if( !time ) break
var timeOuter= time
count*= 2
if( timeOuter.compile > 256 ) break
if( timeOuter.exec > 256 ) break
} while( true )
if( !timeOuter ) timeOuter= {}
timeOuter.compile= timeOuter.compile * 1000 / count
timeOuter.exec= timeOuter.exec * 1000 / count
} else {
timeOuter= { compile: 0, exec: 0 }
}
nodeOuter
.text( format( timeOuter.exec ) )
.attr( 'title', 'compile: ' + format( timeOuter.compile ) )
var count= 1
do {
sourceInner+= sourceInner
var time= calc( prefix + sourceInner + postfix )
if( !time ) break
var timeInner= time
count*= 2
if( timeInner.compile > 256 ) break
if( timeInner.exec > 256 ) break
} while( true )
if( !timeInner ) timeInner= {}
timeInner.compile= ( timeInner.compile * 1000 - timeOuter.compile ) / count
timeInner.exec= ( timeInner.exec * 1000 - timeOuter.exec ) / count
nodeInner
.text( format( timeInner.exec ) )
.attr( 'title', 'compile: ' + format( timeInner.compile ) )
nodeRoot.state( 'wait', 'false' )
}
var schedule=
function( ){
if( nodeRoot.state( 'wait' ) === 'true' ) return 
queue.add( run )
nodeRoot.state( 'wait', 'true' )
}
var clone=
function( ){
var node=
$jam.Node.Element( 'wc_js-bench' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var onCommit=
nodeRoot.listen( '$jam.eventCommit', schedule )
var onClone=
nodeRoot.listen( '$jam.eventClone', clone )
return new function( ){
this.destroy=
function( ){
onCommit.sleep()
onClone.sleep()
}
}
}
}
)
;
void function( ){
var nodeSummary= $jam.Lazy( function( ){
return $jam.Value( $jam.Node.parse( '<a wc_js-test_summary="true" />' ).parent( $jam.body() ) )
} )
var refreshSummary= $jam.Throttler( 50, function( ){
var nodes= $jam.Node( document ).descList( 'wc_js-test' )
for( var i= 0; i < nodes.length(); ++i ){
var node= nodes.get( i )
switch( node.attr( 'wc_js-test_passed' ) ){
case 'true':
break
case 'false':
nodeSummary().attr( 'wc_js-test_passed', 'false' )
while( node && !node.attr( 'id' ) ) node= node.parent()
if( node ) nodeSummary().attr( 'href', '#' + node.attr( 'id' ) )
case 'wait':
return
}
}
nodeSummary().attr( 'wc_js-test_passed', 'true' )
nodeSummary().attr( 'href', '' )
} )
$jam.Component
(   'wc_js-test'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.Node( nodeRoot )
var exec= $jin_thread( function( ){
var source= nodeSource.text()
var proc= new Function( '_test', source )
proc( _test )
return true
})
var source= $jam.String( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeSource0= $jam.Node.Element( 'wc_js-test_source' ).parent( nodeRoot )
var nodeSource= $jam.Node.parse( '<wc_editor wc_editor_hlight="js" />' ).text( source ).parent( nodeSource0 )
var nodeControls= $jam.Node.Element( 'wc_hontrol' ).parent( nodeRoot )
var nodeClone= $jam.Node.parse( '<wc_hontrol_clone title="ctrl+shift+enter">clone' ).parent( nodeControls )
var nodeDelete= $jam.Node.parse( '<wc_hontrol_delete>delete' ).parent( nodeControls )
var _test= {}
var checkDone= function( ){
refreshSummary()
if( passed() === 'wait' ) return
passed( false )
throw new Error( 'Test already done' )
}
_test.ok=
$jam.Poly
(   function( ){
checkDone()
if( passed() === 'wait' ) passed( true )
}
,   function( val ){
checkDone()
passed( Boolean( val ) )
printValue( val )
if( !val ) throw new Error( 'Result is empty' )
}
,   function( a, b ){
checkDone()
passed( a === b )
printValue( a )
if( a !== b ){
printValue( b )
throw new Error( 'Results is not equal' )
}
}
,   function( a, b, c ){
checkDone()
passed(( a === b )&&( a === c ))
printValue( a )
if(( a !== b )||( a !== c )){
printValue( b )
printValue( c )
throw new Error( 'Results is not equal' )
}
}
)
_test.not=
$jam.Poly
(   function( ){
checkDone()
passed( false )
throw new Error( 'Test fails' )
}
,   function( val ){
checkDone()
printValue( val )
passed( !val )
if( val ) throw new Error( 'Result is not empty' )
}
,   function( a, b ){
checkDone()
printValue( a )
printValue( b )
passed( a !== b )
if( a == b ) throw new Error( 'Results is equal' )
}
)
var stop
var noMoreWait= function( ){
if( passed() !== 'wait' ) return
refreshSummary()
passed( false )
print( 'Timeout!' )
stop= null
throw new Error( 'Timeout!' )
}
_test.deadline=
$jam.Poly
(   null
,   function( ms ){
if( stop ) throw new Error( 'Deadline redeclaration' )
stop= $jam.schedule( ms, noMoreWait )
}
)
var passed=
$jam.Poly
(   function( ){
return nodeRoot.attr( 'wc_js-test_passed' )
}
,   function( val ){
nodeRoot.attr( 'wc_js-test_passed', val )
}
)
var print=
function( val ){
var node= $jam.Node.Element( 'wc_js-test_result' )
node.text( val )
nodeRoot.tail( node )
}
var printValue=
function( val ){
if( typeof val === 'function' ){
if( !val.hasOwnProperty( 'toString' ) ){
print( 'Function: [object Function]' )
return
}
}
print( $jam.classOf( val ) + ': ' + val )
}
var run=
function( ){
var results= nodeRoot.childList( 'wc_js-test_result' )
for( var i= 0; i < results.length(); ++i ){
results.get(i).parent( null )
}
passed( 'wait' )
stop= null
if( !exec() ) passed( false )
if(( !stop )&&( passed() === 'wait' )) passed( false )
refreshSummary()
}
var clone=
function( ){
run()
var node=
$jam.Node.Element( 'wc_js-test' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var del=
function( ){
nodeRoot.parent( null )
}
run()
var onCommit=
nodeRoot.listen( '$jam.eventCommit', run )
var onClone=
nodeRoot.listen( '$jam.eventClone', clone )
var onClone=
nodeRoot.listen( '$jam.eventDelete', del )
var onCloneClick=
nodeClone.listen( 'click', function( event ){
$jam.Event().type( '$jam.eventClone' ).scream( event.target() )
})
var onDeleteClick=
nodeDelete.listen( 'click', function( event ){
$jam.Event().type( '$jam.eventDelete' ).scream( event.target() )
})
this.destroy=
function( ){
onCommit.sleep()
onClone.sleep()
onCloneClick.sleep()
onDeleteClick.sleep()
if( stop ) stop()
_test.ok= _test.not= $jam.Value()
refreshSummary()
}
}
}
)
}();
$jam.Component
(   'wc_net-bridge'
,   function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
nodeRoot.listen
(   '$jam.eventEdit'
,   function( ){
var text= $jam.html2text( nodeRoot.html() )
nodeRoot.state( 'modified', text !== textLast )
}
)
nodeRoot.listen
(   '$jam.eventEdit'
,   $jam.Throttler
(   5000
,   save
)
)
nodeRoot.listen
(   '$jam.eventCommit'
,   save
)
var textLast= $jam.html2text( nodeRoot.html() )
function save( ){
var text= $jam.html2text( nodeRoot.html() )
if( text === textLast ) return
var xhr= new XMLHttpRequest
xhr.open( 'POST' , nodeRoot.attr( 'wc_net-bridge_resource' ) )
xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' )
xhr.send( nodeRoot.attr( 'wc_net-bridge_field' ) + '=' + encodeURIComponent( text ) )
textLast= text
nodeRoot.state( 'modified', false )
}
return new function( ){
}
}
)
;
$jam.Component
(   'wc_preview'
,   function( nodeRoot ){
nodeRoot=
$jam.Node( nodeRoot )
var nodeLink=
nodeRoot.childList( 'a' ).get( 0 )
var nodeFrame=
nodeRoot.childList( 'iframe' ).get( 0 )
if( !nodeFrame ) nodeFrame= $jam.Node.Element( 'iframe' ).parent( nodeRoot )
nodeFrame.attr( 'src', nodeLink.attr( 'href' ) )
var opened=
$jam.Poly
(   function(){
return nodeRoot.state( 'opened' ) != 'false'
}
,   function( val ){
nodeRoot.state( 'opened', val )
return opened
}
)
nodeLink.listen( 'click', function( event ){
if( event.button() !== 0 ) return
opened( !opened() )
event.defaultBehavior( false )
})
}
)
;
this.$jin_method= function( func ){
if( typeof func !== 'function' )
return func
var method= function( ){
var args= [].slice.call( arguments )
args.unshift( this )
return func.apply( null, args )
}
method.call= func
return method
}
;
this.$jin_class= function( scheme ){
var factory= function( ){
if( this instanceof factory ) return
return factory.make.apply( factory, arguments )
}
var proto= factory.prototype
factory.scheme= scheme
factory.make= function( ){
var obj= new this
obj.init.apply( obj, arguments )
return obj
}
proto.init= function( obj ){ }
proto.destroy= function( obj ){
for( var key in obj ){
if( !obj.hasOwnProperty( key ) )
continue
delete obj[ key ]
}
}
scheme( factory, proto )
for( var key in proto ){
if( !proto.hasOwnProperty( key ) )
continue
proto[ key ]= $jin_method( proto[ key ] )
}
return factory
}
;
this.$jin_test= $jin_class( function( $jin_test, test ){
test.passed= null
test.timeout= null
test.onDone= null
test.timer= null
test.asserts= null
test.results= null
test.errors= null
test.init= function( test, code, onDone ){
test.asserts= []
test.results= []
test.errors= []
test.onDone= onDone || function(){}
var complete= false
test.callback( function( ){
if( typeof code === 'string' )
code= new Function( 'test', code )
if( !code ) return
code( test )
complete= true
} ).call( )
if( !complete ) test.passed= false
if( test.timeout != null ){
if( test.passed == null ){
test.timer= setTimeout( function( ){
test.asserts.push( false )
test.errors.push( new Error( 'timeout(' + test.timeout + ')' ) )
test.done()
}, test.timeout )
}
} else {
test.done()
}
}
var AND= function( a, b ){ return a && b }
test.done= function( test ){
test.timer= clearTimeout( test.timer )
if( test.passed == null )
test.passed= test.asserts.reduce( AND, true )
test.onDone.call( null, test )
}
var compare= function( a, b ){
return Number.isNaN( a )
? Number.isNaN( b )
: ( a === b )
}
test.ok= function( test, value ){
switch( arguments.length ){
case 1:
var passed= true
break
case 2:
var passed= !!value
break
default:
for( var i= 2; i < arguments.length; ++i ){
var passed= compare( arguments[ i ], arguments[ i - 1 ] )
if( !passed ) break;
}
}
test.asserts.push( passed )
test.results.push( [].slice.call( arguments, 1 ) )
return test
}
test.not= function( test, value ){
switch( arguments.length ){
case 1:
var passed= false
break
case 2:
var passed= !value
break
default:
for( var i= 2; i < arguments.length; ++i ){
var passed= !compare( arguments[ i ], arguments[ i - 1 ] )
if( !passed ) break;
}
}
test.asserts.push( passed )
test.results.push( [].slice.call( arguments, 1 ) )
return test
}
test.callback= function( test, func ){
return $jin_thread( function( ){
try {
return func.apply( this, arguments )
} catch( error ){
test.errors.push( error )
throw error
}
} )
}
var destroy= test.destroy
test.destroy= function( test ){
test.timer= clearTimeout( test.timer )
destroy( test )
}
} );
void function( ){
var nodeSummary= $jam.Lazy( function( ){
return $jam.Value( $jam.Node.parse( '<a wc_test_summary="true" />' ).parent( $jam.body() ) )
} )
var refreshSummary= $jam.Throttler( 50, function( ){
var nodes= $jam.Node( document ).descList( 'script' )
for( var i= 0; i < nodes.length(); ++i ){
var node= nodes.get( i )
switch( node.attr( 'wc_test_passed' ) ){
case 'true':
break
case 'false':
nodeSummary().attr( 'wc_test_passed', 'false' )
while( node && !node.attr( 'id' ) ) node= node.parent()
if( node ) nodeSummary().attr( 'href', node.attr( 'id' ) )
case 'wait':
return
}
}
nodeSummary().attr( 'wc_test_passed', 'true' )
nodeSummary().attr( 'href', '' )
} )
$jam.Component
(   'script'
,   function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
if( nodeRoot.attr( 'type' ) !== 'wc_test' ) return null
return new function( ){
var source= $jam.String( nodeRoot.html() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeSource0= $jam.Node.Element( 'wc_test_source' ).parent( nodeRoot )
var nodeSource= $jam.Node.parse( '<wc_editor wc_editor_hlight="js" />' ).text( source ).parent( nodeSource0 )
var nodeLogs= $jam.Node.Element( 'wc_test_logs' ).parent( nodeRoot )
var nodeControls= $jam.Node.Element( 'wc_hontrol' ).parent( nodeRoot )
var nodeClone= $jam.Node.parse( '<wc_hontrol_clone title="ctrl+shift+enter">clone' ).parent( nodeControls )
var nodeDelete= $jam.Node.parse( '<wc_hontrol_delete>delete' ).parent( nodeControls )
var checkDone= function( ){
refreshSummary()
if( passed() === 'wait' ) return
passed( false )
throw new Error( 'Test already done' )
}
var stop
var passed=
$jam.Poly
(   function( ){
return nodeRoot.attr( 'wc_test_passed' )
}
,   function( val ){
nodeRoot.attr( 'wc_test_passed', val )
}
)
var printError=
function( val ){
var node= $jam.Node.Element( 'wc_test_error' )
node.text( val )
nodeLogs.tail( node )
}
var dumpValue=
function( val ){
if( typeof val === 'function' ){
if( !val.hasOwnProperty( 'toString' ) ){
return 'Function: [object Function]'
}
}
return $jam.classOf( val ) + ': ' + val
}
var printResults=
function( list ){
var node= $jam.Node.Element( 'wc_test_results' )
for( var j= 0; j < list.length; ++j ){
var val= $jam.Node.Element( 'wc_test_results_value' )
val.text( dumpValue( list[ j ] ) )
node.tail( val )
}
nodeLogs.tail( node )
}
var run=
function( ){
nodeLogs.clear()
passed( 'wait' )
$jin_test( nodeSource.text(), update )
}
var update=
function( test ){
passed( test.passed )
for( var i= 0; i < test.results.length; ++i ){
printResults( test.results[ i ] )
}
for( var i= 0; i < test.errors.length; ++i ){
printError( test.errors[ i ] )
}
refreshSummary()
}
var clone=
function( ){
run()
var node=
$jam.Node.Element( 'script' ).attr( 'type', 'wc_test' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var del=
function( ){
nodeRoot.parent( null )
}
run()
var onCommit=
nodeRoot.listen( '$jam.eventCommit', run )
var onClone=
nodeRoot.listen( '$jam.eventClone', clone )
var onClone=
nodeRoot.listen( '$jam.eventDelete', del )
var onCloneClick=
nodeClone.listen( 'click', function( event ){
$jam.Event().type( '$jam.eventClone' ).scream( event.target() )
})
var onDeleteClick=
nodeDelete.listen( 'click', function( event ){
$jam.Event().type( '$jam.eventDelete' ).scream( event.target() )
})
this.destroy=
function( ){
onCommit.sleep()
onClone.sleep()
onCloneClick.sleep()
onDeleteClick.sleep()
if( stop ) stop()
refreshSummary()
}
}
}
)
}();
$jam.Component
(   'iframe'
,   function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
if( !nodeRoot.attr( 'wc_yasearchresult' ) )
return null
return new function( ){
var observer=
$jam.Observer()
.node( document )
.eventName( '$jam.eventURIChanged' )
.handler( function(){
if( update() )
window.history.replaceState( null, null, document.location.search )
})
.listen()
function update( ){
var data= document.location.hash.substring(1)
var height= parseInt( data )
if( data != height )
return false
nodeRoot.$.style.height= height + 'px'
return true
}
update()
this.destroy= function(){
observer.sleep()
}
}
}
)
var scripts= document.getElementsByTagName( 'script' )
var currentScript= document.currentScript || scripts[ scripts.length - 1 ]
if( currentScript.src ) eval( currentScript.innerHTML )
}
}( this.window, this.document )