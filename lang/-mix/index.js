;if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}
;$jam.EU= function( val ){
var value= function(){
return val
}
value.toString= function(){
return '$jam.EU: ' + String( val )
}
return value
}
;$jam.EV= $jam.EU( this )
;$jam.EW=
new function( ){
var Ghost= function(){}
return function( key, value ){
var keyList= key.split( '.' )
var obj= $jam.EV()
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
}
;$jam.EW
(   '$jam.EX'
,   function( str ){
return String( str )
.replace( /&/g, '&amp;' )
.replace( /</g, '&lt;' )
.replace( />/g, '&gt;' )
.replace( /"/g, '&quot;' )
.replace( /'/g, '&apos;' )
}
)
;this.$lang=
function( name ){
return $lang[ name ] || $lang.A
}
$lang.A= $jam.EX
;$jam.EW
(   '$jam.EY'
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
;$jam.EZ=
function( init ){
var klass=
function( ){
if( this instanceof klass ) return this
return klass.create.apply( klass, arguments )
}
klass.constructor= $jam.EZ
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
;$jam.EW
(   '$jam.FA'
,   $jam.EZ( function( klass, proto ){
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
if( i % 2 ) chunk= $jam.FA.escape( chunk )
str+= chunk
}
return $jam.FA( str )
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
;$jam.EW
(   '$jam.FB'
,   function( lexems ){
if( !lexems ) throw new Error( 'lexems is required' )
var nameList= []
var regexpList= []
var sizeList= []
for( var name in lexems ){
var regexp= $jam.FA( lexems[ name ] )
nameList.push( name )
regexpList.push( regexp.source() )
sizeList.push( regexp.count() )
}
var regexp= RegExp( '([\\s\\S]*?)(?:((' + regexpList.join( ')|(' ) + '))|($\n?))', 'gm' )
var count= $jam.FA(regexp).count()
return $jam.EZ( function( klass, proto ){
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
//console.log(found,regexp,this.string,count)
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
;$jam.EW
(    '$jam.FC'
,    function( syntaxes ){
var lexems= []
var handlers= []
handlers[ '' ]= syntaxes[ '' ] || $jam.EY()
for( var regexp in syntaxes ){
if( !syntaxes.hasOwnProperty( regexp ) ) continue
if( !regexp ) continue
lexems.push( RegExp( regexp ) )
handlers.push( syntaxes[ regexp ] )
}
var lexer= $jam.FB( lexems )
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
;$jam.EW
(   '$jam.FD'
,   function( delim ){
delim= delim || ''
return function( list ){
return list.join( delim )
}
}
)
;$lang.FE=
function( map ){
if( !map[ '' ] ) map[ '' ]= $lang.A
return $jam.EY
(   $jam.FC( map )
,   $jam.FD()
)
}
;$lang.FF=
function( name ){
var prefix= '<' + name + '>'
var postfix= '</' + name + '>'
return function( content ){
return prefix + content + postfix
}
}
;$lang.C=
new function(){
var css=
function( str ){
return css.root( css.stylesheet( str ) )
}
css.root= $lang.FF( 'lang:C' )
css.remark= $lang.FF( 'lang:D' )
css.string= $lang.FF( 'lang:J' )
css.bracket= $lang.FF( 'lang:K' )
css.selector= $lang.FF( 'lang:E' )
css.tag= $lang.FF( 'lang:F' )
css.id= $lang.FF( 'lang:G' )
css.klass= $lang.FF( 'lang:H' )
css.pseudo= $lang.FF( 'lang:I' )
css.property= $lang.FF( 'lang:L' )
css.value= $lang.FF( 'lang:M' )
css.stylesheet=
$lang.FE( new function( ){
this[ /(\/\*[\s\S]*?\*\/)/.source ]=
$jam.EY( $lang.A, css.remark )
this[ /(\*|(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.EY( $lang.A, css.tag )
this[ /(#(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.EY( $lang.A, css.id )
this[ /(\.(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.EY( $lang.A, css.klass )
this[ /(::?(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.EY( $lang.A, css.pseudo )
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
$lang.FE( new function( ){
this[ /(\/\*[\s\S]*?\*\/)/.source ]=
$jam.EY( $lang.A, css.remark )
this[ /([\w-]+\s*:)/.source  ]=
$jam.EY( $lang.A, css.property )
this[ /([^:]+?(?:;|$))/.source ]=
$jam.EY( $lang.A, css.value )
})
return css
}
;$lang.N=
new function(){
var pcre=
function( str ){
return pcre.root( pcre.content( str ) )
}
pcre.root= $lang.FF( 'lang:N' )
pcre.backslash= $lang.FF( 'lang:O' )
pcre.control= $lang.FF( 'lang:Q' )
pcre.spec= $lang.FF( 'lang:P' )
pcre.text= $lang.FF( 'lang:CF' )
pcre.content=
$lang.FE( new function(){
this[ /\\([\s\S])/.source ]=
new function( ){
var backslash= pcre.backslash( '\\' )
return function( symbol ){
return backslash + pcre.spec( $lang.A( symbol ) )
}
}
this[ /([(){}\[\]$*+?^])/.source ]=
$jam.EY( $lang.A, pcre.control )
})
return pcre
}
;$lang.R=
new function(){
var js=
function( str ){
return js.root( js.content( str ) )
}
js.root= $lang.FF( 'lang:R' )
js.remark= $lang.FF( 'lang:S' )
js.string= $lang.FF( 'lang:T' )
js.internal= $lang.FF( 'lang:U' )
js.external= $lang.FF( 'lang:V' )
js.keyword= $lang.FF( 'lang:W' )
js.number= $lang.FF( 'lang:X' )
js.regexp= $lang.FF( 'lang:Y' )
js.bracket= $lang.FF( 'lang:Z' )
js.operator= $lang.FF( 'lang:AA' )
js.content=
$lang.FE( new function(){
this[ /(\/\*[\s\S]*?\*\/)/.source ]=
$jam.EY( $lang.A, js.remark )
this[ /(\/\/[^\n]*)/.source ]=
$jam.EY( $lang.A, js.remark )
this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
$jam.EY( $lang.A, js.string )
this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
$jam.EY( $lang.A, js.string )
this[ /(\/(?:[^\n\/\\]*(?:\\\\|\\[^\\]))*[^\n\/\\]*\/[mig]*)/.source ]=
$jam.EY( $lang.N, js.regexp )
this[ /\b(_[\w$]*)\b/.source ]=
$jam.EY( $lang.A, js.internal )
this[ /(\$[\w$]*)(?![\w$])/.source ]=
$jam.EY( $lang.A, js.external )
this[ /\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|void|try|catch|null|typeof|instanceof|return|delete|window|document|let|each|yield)\b/.source ]=
$jam.EY( $lang.A, js.keyword )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.EY( $lang.A, js.number )
this[ /([(){}\[\]])/.source ]=
$jam.EY( $lang.A, js.bracket )
this[ /(\+{1,2}|-{1,2}|\*|\/|&{1,2}|\|{1,2}|={1,2}|%|\^|!)/.source ]=
$jam.EY( $lang.A, js.operator )
})
return js
}
;$lang.CG=
new function( ){
var php=
function( str ){
return php.root( php.content( str ) )
}
php.root= $lang.FF( 'lang:CG' )
php.dollar= $lang.FF( 'lang:AB' )
php.variable= $lang.FF( 'lang:AC' )
php.string= $lang.FF( 'lang:AD' )
php.number= $lang.FF( 'lang:AG' )
php.func= $lang.FF( 'lang:AE' )
php.keyword= $lang.FF( 'lang:AF' )
php.content=
$lang.FE( new function(){
this[ /\b(__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|for|foreach|function|global|gotoif|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|__CLASS__|__DIR__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|__NAMESPACE__|__TRAIT__)\b/.source ]=
$jam.EY( $lang.A, php.keyword )
this[ /(\$)(\w+)\b/.source ]=
function( dollar, variable ){
dollar= $lang.CG.dollar( dollar )
variable= $lang.CG.variable( variable )
return dollar + variable
}
this[ /(\w+)(?=\s*\()/.source ]=
php.func
this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
$jam.EY( $lang.A, php.string )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.EY( $lang.A, php.number )
})
return php
}
;$lang.AH=
new function(){
var sgml=
function( str ){
return sgml.root( sgml.content( str ) )
}
sgml.root= $lang.FF( 'lang:AH' )
sgml.tag= $lang.FF( 'lang:AI' )
sgml.tagBracket= $lang.FF( 'lang:CH' )
sgml.tagName= $lang.FF( 'lang:AJ' )
sgml.attrName= $lang.FF( 'lang:AK' )
sgml.attrValue= $lang.FF( 'lang:AL' )
sgml.comment= $lang.FF( 'lang:AM' )
sgml.decl= $lang.FF( 'lang:AN' )
sgml.tag=
$jam.EY
(   $lang.FE( new function(){
this[ /^(<\/?)([a-zA-Z][\w:-]*)/.source ]=
function( bracket, tagName ){
return sgml.tagBracket( $lang.A( bracket ) ) + sgml.tagName( tagName )
} 
this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(")([\s\S]*?)(")/.source ]=
this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(')([\s\S]*?)(')/.source ]=
function( prefix, name, sep, open, value, close ){
name= sgml.attrName( name )
value= sgml.attrValue( open + $lang.C.style( value ) + close )
return prefix + name + sep + value
}
this[ /(\s)([oO][nN]\w+)(\s*=\s*)(")([\s\S]*?)(")/.source ]=
this[ /(\s)([oO][nN]\w+)(\s*=\s*)(')([\s\S]*?)(')/.source ]=
function( prefix, name, sep, open, value, close ){
name= sgml.attrName( name )
value= sgml.attrValue( open + $lang.R( value ) + close )
return prefix + name + sep + value
}
this[ /(\s)([a-zA-Z][\w:-]+)(\s*=\s*)("[\s\S]*?")/.source ]=
this[ /(\s)([a-zA-Z][\w:-]+)(\s*=\s*)('[\s\S]*?')/.source ]=
function( prefix, name, sep, value ){
name= sgml.attrName( name )
value= sgml.attrValue( value )
return prefix + name + sep + value
}
})
,   $lang.FF( 'lang:AI' )
)
sgml.content=
$lang.FE( new function(){
this[ /(<!--[\s\S]*?-->)/.source ]=
$jam.EY( $lang.A, sgml.comment )
this[ /(<![\s\S]*?>)/.source ]=
$jam.EY( $lang.A, sgml.decl )
this[ /(<[sS][tT][yY][lL][eE][^>]*>)([\s\S]+?)(<\/[sS][tT][yY][lL][eE]>)/.source ]=
function( prefix, content, postfix ){
prefix= $lang.AH.tag( prefix )
postfix= $lang.AH.tag( postfix )
content= $lang.C( content )
return prefix + content + postfix
}
this[ /(<[sS][cC][rR][iI][pP][tT][^>]*>)([\s\S]+?)(<\/[sS][cC][rR][iI][pP][tT]>)/.source ]=
function( prefix, content, postfix ){
prefix= $lang.AH.tag( prefix )
postfix= $lang.AH.tag( postfix )
content= $lang.R( content )
return prefix + content + postfix
}
this[ /(<[^>]+>)/.source ]=
sgml.tag
})
return sgml
}
;$jam.EW
(    '$lang.CI'
,    new function(){
var tags=
function( str ){
return tags.root( tags.content( str ) )
}
tags.root= $lang.FF( 'lang:CI' )
tags.item= $lang.FF( 'lang:CJ' )
tags.content=
$lang.FE( new function(){
this[ /^(\s*?)([^\n\r]+)(\s*?)$/.source ]=
function( open, text, close ){
return open + '<a href="?gist/list/' + $jam.EX( text ) + '">' + tags.item( text ) + '</a>' + close
}
})
return tags
}
) 
;$lang.AO=
new function(){
var md=
function( str ){
return md.root( md.content( str ) )
}
md.root= $lang.FF( 'lang:AO' )
md.header1= $lang.FF( 'lang:BF' )
md.header2= $lang.FF( 'lang:BE' )
md.header3= $lang.FF( 'lang:BD' )
md.header4= $lang.FF( 'lang:CK' )
md.header5= $lang.FF( 'lang:CL' )
md.header6= $lang.FF( 'lang:CM' )
md.headerMarker= $lang.FF( 'lang:BG' )
md.quote= $lang.FF( 'lang:BH' )
md.quoteMarker= $lang.FF( 'lang:BI' )
md.quoteInline= $lang.FF( 'lang:BJ' )
md.quoteInlineMarker= $lang.FF( 'lang:BK' )
md.image= $lang.FF( 'lang:AU' )
md.imageHref= $lang.FF( 'lang:AV' )
md.embed= $lang.FF( 'lang:AP' )
md.embedHref= $lang.FF( 'lang:AQ' )
md.link= $lang.FF( 'lang:AW' )
md.linkMarker= $lang.FF( 'lang:AZ' )
md.linkTitle= $lang.FF( 'lang:AX' )
md.linkHref= $lang.FF( 'lang:AY' )
md.author= $lang.FF( 'lang:BA' )
md.indent= $lang.FF( 'lang:BB' )
md.escapingMarker= $lang.FF( 'lang:BV' )
md.emphasis= $lang.FF( 'lang:BW' )
md.emphasisMarker= $lang.FF( 'lang:BX' )
md.strong= $lang.FF( 'lang:BY' )
md.strongMarker= $lang.FF( 'lang:BZ' )
md.super= $lang.FF( 'lang:CA' )
md.superMarker= $lang.FF( 'lang:CB' )
md.sub= $lang.FF( 'lang:CC' )
md.subMarker= $lang.FF( 'lang:CD' )
md.math= $lang.FF( 'lang:BL' )
md.remark= $lang.FF( 'lang:CE' )
md.table= $lang.FF( 'lang:BM' )
md.tableRow= $lang.FF( 'lang:BN' )
md.tableCell= $lang.FF( 'lang:BP' )
md.tableMarker= $lang.FF( 'lang:BQ' )
md.code= $lang.FF( 'lang:BR' )
md.codeMarker= $lang.FF( 'lang:BS' )
md.codeLang= $lang.FF( 'lang:BT' )
md.codeContent= $lang.FF( 'lang:BU' )
md.html= $lang.FF( 'lang:CN' )
md.htmlTag= $lang.FF( 'lang:CO' )
md.htmlContent= $lang.FF( 'lang:CP' )
md.para= $lang.FF( 'lang:BC' )
md.inline=
$lang.FE( new function(){
// indentation
// ^\s+
this[ /^(\s+)/.source ]=
md.indent
// math
//  123 
this[ /([0-9∅‰∞∀∃∫√×±≤+−≥≠<>%])/.source ]=
md.math
// escaping
// ** // ^^ __ [[ ]]
this[ /(\*\*|\/\/|\^\^|__|\[\[|\]\]|\\\\)/.source ]=
function( symbol ){
return md.escapingMarker( symbol[0] ) + symbol[1]
}
// hyper link
// \\title\http://example.org/\
this[ /(\\)(.*?)(\\)((?:(?:https?|ftps?|mailto|magnet):[^\0]*?|[^:]*?(?:[\/\?].*?)?))(\\)/.source ]=
function( open, title, middle, href, close ){
var uri= href
open= md.linkMarker( open )
middle= md.linkMarker( middle )
close= md.linkMarker( close )
href= title ? md.linkHref( href ) : md.linkTitle( href )
title= md.linkTitle( md.inline( title ) )
return md.link( '<a href="' + $jam.EX( uri ) + '">' + open + title + middle + href + close + '</a>' )
}
// image
// [url]
this[ /(\[)([^\[\]]+)(\])/.source ]=
function( open, href, close ){
return md.image( md.imageHref( open + href + close ) + '<a href="' + $jam.EX( href ) + '"><object data="' + $jam.EX( href ) + '"></object></a>' )
}
// emphasis
// /some text/
this[ /([^\s"({[]\/)/.source ]=
$lang.A
this[ /(\/)([^\/\s](?:[\s\S]*?[^\/\s])?)(\/)(?=[\s,.:;!?")}\]]|$)/.source ]=
function( open, content, close ){
open = md.emphasisMarker( open )
close = md.emphasisMarker( close )
content= md.inline( content )
return md.emphasis( open + content + close )
}
// strong
// *some text*
this[ /([^\s"({[]\*)/.source ]=
$lang.A            
this[ /(\*)([^\*\s](?:[\s\S]*?[^\*\s])?)(\*)(?=[\s,.:;!?")}\]]|$)/.source ]=
function( open, content, close ){
open = md.strongMarker( open )
close = md.strongMarker( close )
content= md.inline( content )
return md.strong( open + content + close )
}
// ^super text^
this[ /(\^)([^\^\s](?:[\s\S]*?[^\^\s])?)(\^)(?=[\s,.:;!?")}\]√_]|$)/.source ]=
function( open, content, close ){
open = md.superMarker( open )
close = md.superMarker( close )
content= md.inline( content )
return md.super( open + content + close )
}
// _sub text_
this[ /(_)([^_\s](?:[\s\S]*?[^_\s])?)(_)(?=[\s,.:;!?")}\]\^]|$)/.source ]=
function( open, content, close ){
open = md.subMarker( open )
close = md.subMarker( close )
content= md.inline( content )
return md.sub( open + content + close )
}
// "inline quote"
// «inline quote»
this[ /(")([^"\s](?:[\s\S]*?[^"\s])?)(")(?=[\s,.:;!?)}\]]|$)/.source ]=
this[ /(«)([\s\S]*?)(»)/.source ]=
function( open, content, close ){
open = md.quoteInlineMarker( open )
close = md.quoteInlineMarker( close )
content= md.inline( content )
return md.quoteInline( open + content + close )
}
// remark
// (some text)
this[ /(\()([\s\S]+?)(\))/.source ]=
function( open, content, close ){
content= md.inline( content )
return md.remark( open + content + close )
}
})
md.content=
$lang.FE( new function(){
// header
// !!! Title
this[ /^(!!! )(.*?)$/.source ]=
function( marker, content ){
return md.header1( md.headerMarker( marker ) + md.inline( content ) )
}
// !!  Title
this[ /^(!!  )(.*?)$/.source ]=
function( marker, content ){
return md.header2( md.headerMarker( marker ) + md.inline( content ) )
}
// !   Title
this[ /^(!   )(.*?)$/.source ]=
function( marker, content ){
return md.header3( md.headerMarker( marker ) + md.inline( content ) )
}
// block quote
// >   content
this[ /^(>   )(.*?)$/.source ]=
function( marker, content ){
marker = md.quoteMarker( marker )
content= md.inline( content )
return md.quote( marker + content )
}
// video
// http://www.youtube.com/watch?v=IGfTPIVb0jQ
// http://youtu.be/IGfTPIVb0jQ
this[ /^(http:\/\/www\.youtube\.com\/watch\?v=)(\w+)(.*$\n?)/.source ]=
this[ /^(http:\/\/youtu.be\/)(\w+)(.*$\n?)/.source ]=
function( prefix, id, close ){
var href= md.embedHref( prefix + id + close )
var uri= 'http://www.youtube.com/embed/' + id
var embed= md.embed( '<wc:CQ wc:CR=".75"><iframe class="wc_lang_md_embed-object" src="' + uri + '" allowfullscreen></iframe></wc:CQ>' )
return href + embed
}
// image
// http://gif1.ru/gifs/267.gif
this[ /^((?:[\?\/\.]|https?:|ftps?:).*?)$(\n?)/.source ]=
function( url, close ){
var href= md.embedHref( url + close )
url= url.replace( /\xAD/g, '' )
var embed= md.embed( '<a href="' + $jam.EX( url ) + '"><image src="' + $jam.EX( url ) + '" /></a>' )
return href + embed
}
// table
// --
// | cell 11 | cell 12
// --
// | cell 21 | cell 22
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
var rowSep= '<lang:BO><wc:CS colspan="300">\n--</wc:CS></lang:BO>'
rows[ r ]= rowSep + md.tableRow( row )
}
content= rows.join( '' )
return md.table( content )
}
// source code
// #lang
//     some code
this[ /^(\$)([\w-]+)((?:\n    [^\n]*)*)(?=\n|$)/.source ]=
function( marker, lang, content ){
content= content.replace( /\n    /g, '\n' )
content= $lang( lang )( content )
content= content.replace( /\n/g, '\n' + md.indent( '    ' ) )
content= md.codeContent( content )
marker= md.codeMarker( marker )
lang= md.codeLang( lang )
return md.code( marker + lang + content )
}
// simple paragraph
this[ /^(    .*)$/.source ]=
function( content ){
return md.para( md.inline( content ) )
}
})
return md
} 
