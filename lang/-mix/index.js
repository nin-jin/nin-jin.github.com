;// jam/jam/jam.jam.js
if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}

;// jam/Value/jam+Value.jam.js
$jam.Value= function( val ){
    var value= function(){
        return val
    }
    value.toString= function(){
        return '$jam.Value: ' + String( val )
    }
    return value
}

;// jam/glob/jam+glob.jam.js
$jam.glob= $jam.Value( this )

;// jam/define/jam+define.jam.js
$jam.define=
new function( ){

    var Ghost= function(){}
    
    return function( key, value ){
        var keyList= key.split( '.' )
        
        var obj= $jam.glob()
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

;// jam/htmlEscape/jam+htmlEscape.jam.js
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

;// lang/lang/lang.jam.js
this.$lang=
function( name ){
    return $lang[ name ] || $lang.text
}

$lang.text= $jam.htmlEscape
;// jam/Pipe/jam+Pipe.jam.js
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

;// jam/Class/jam+Class.jam.js
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

;// jam/RegExp/jam+RegExp.jam.js
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

;// jam/Lexer/jam+Lexer.jam.js
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

;// jam/Parser/jam+Parser.jam.js
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

;// jam/Concater/jam+Concater.jam.js
$jam.define
(   '$jam.Concater'
,   function( delim ){
        delim= delim || ''
        return function( list ){
            return list.join( delim )
        }
    }
)

;// lang/Parser/lang_Parser.jam.js
$lang.Parser=
function( map ){
    if( !map[ '' ] ) map[ '' ]= $lang.text
    return $jam.Pipe
    (   $jam.Parser( map )
    ,   $jam.Concater()
    )
}

;// lang/Wrapper/lang_Wrapper.jam.js
$lang.Wrapper=
function( name ){
    var prefix= '<' + name + '>'
    var postfix= '</' + name + '>'
    return function( content ){
        return prefix + content + postfix
    }
}

;// lang/css/lang_css.jam.js
$lang.css=
new function(){
    
    var css=
    function( str ){
        return css.root( css.stylesheet( str ) )
    }
    
    css.root= $lang.Wrapper( 'lang:css' )
    css.remark= $lang.Wrapper( 'lang:css_remark' )
    css.string= $lang.Wrapper( 'lang:css_string' )
    css.bracket= $lang.Wrapper( 'lang:css_bracket' )
    css.selector= $lang.Wrapper( 'lang:css_selector' )
    css.tag= $lang.Wrapper( 'lang:css_tag' )
    css.id= $lang.Wrapper( 'lang:css_id' )
    css.klass= $lang.Wrapper( 'lang:css_class' )
    css.pseudo= $lang.Wrapper( 'lang:css_pseudo' )
    css.property= $lang.Wrapper( 'lang:css_property' )
    css.value= $lang.Wrapper( 'lang:css_value' )
    
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

;// lang/pcre/lang_pcre.jam.js
$lang.pcre=
new function(){

    var pcre=
    function( str ){
        return pcre.root( pcre.content( str ) )
    }

    pcre.root= $lang.Wrapper( 'lang:pcre' )
    pcre.backslash= $lang.Wrapper( 'lang:pcre_backslash' )
    pcre.control= $lang.Wrapper( 'lang:pcre_control' )
    pcre.spec= $lang.Wrapper( 'lang:pcre_spec' )
    pcre.text= $lang.Wrapper( 'lang:pcre_text' )
    
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

;// lang/js/lang_js.jam.js
$lang.js=
new function(){

    var js=
    function( str ){
        return js.root( js.content( str ) )
    }

    js.root= $lang.Wrapper( 'lang:js' )
    js.remark= $lang.Wrapper( 'lang:js_remark' )
    js.string= $lang.Wrapper( 'lang:js_string' )
    js.internal= $lang.Wrapper( 'lang:js_internal' )
    js.external= $lang.Wrapper( 'lang:js_external' )
    js.keyword= $lang.Wrapper( 'lang:js_keyword' )
    js.number= $lang.Wrapper( 'lang:js_number' )
    js.regexp= $lang.Wrapper( 'lang:js_regexp' )
    js.bracket= $lang.Wrapper( 'lang:js_bracket' )
    js.operator= $lang.Wrapper( 'lang:js_operator' )
         
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

;// lang/php/lang_php.jam.js
$lang.php=
new function( ){

    var php=
    function( str ){
        return php.root( php.content( str ) )
    }

    php.root= $lang.Wrapper( 'lang:php' )
    php.dollar= $lang.Wrapper( 'lang:php_dollar' )
    php.variable= $lang.Wrapper( 'lang:php_variable' )
    php.string= $lang.Wrapper( 'lang:php_string' )
    php.number= $lang.Wrapper( 'lang:php_number' )
    php.func= $lang.Wrapper( 'lang:php_func' )
    php.keyword= $lang.Wrapper( 'lang:php_keyword' )
    
    php.content=
    $lang.Parser( new function(){
        
        this[ /\b(__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|for|foreach|function|global|gotoif|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|__CLASS__|__DIR__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|__NAMESPACE__|__TRAIT__)\b/.source ]=
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

;// lang/sgml/lang_sgml.jam.js
$lang.sgml=
new function(){

    var sgml=
    function( str ){
        return sgml.root( sgml.content( str ) )
    }

    sgml.root= $lang.Wrapper( 'lang:sgml' )
    sgml.tag= $lang.Wrapper( 'lang:sgml_tag' )
    sgml.tagBracket= $lang.Wrapper( 'lang:sgml_tag-bracket' )
    sgml.tagName= $lang.Wrapper( 'lang:sgml_tag-name' )
    sgml.attrName= $lang.Wrapper( 'lang:sgml_attr-name' )
    sgml.attrValue= $lang.Wrapper( 'lang:sgml_attr-value' )
    sgml.comment= $lang.Wrapper( 'lang:sgml_comment' )
    sgml.decl= $lang.Wrapper( 'lang:sgml_decl' )
    
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
                name= sgml.attrName( name )
                value= sgml.attrValue( value )
                return prefix + name + sep + value
            }
        
        })
    ,   $lang.Wrapper( 'lang:sgml_tag' )
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

;// lang/tags/lang_tags.jam.js
$jam.define
(    '$lang.tags'
,    new function(){
        
        var tags=
        function( str ){
            return tags.root( tags.content( str ) )
        }
        
        tags.root= $lang.Wrapper( 'lang:tags' )
        tags.item= $lang.Wrapper( 'lang:tags_item' )
        
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

;// lang/md/lang_md.jam.js
$lang.md=
new function(){

    var md=
    function( str ){
        return md.root( md.content( str ) )
    }

    md.root= $lang.Wrapper( 'lang:md' )

    md.header1= $lang.Wrapper( 'lang:md_header-1' )
    md.header2= $lang.Wrapper( 'lang:md_header-2' )
    md.header3= $lang.Wrapper( 'lang:md_header-3' )
    md.header4= $lang.Wrapper( 'lang:md_header-4' )
    md.header5= $lang.Wrapper( 'lang:md_header-5' )
    md.header6= $lang.Wrapper( 'lang:md_header-6' )
    md.headerMarker= $lang.Wrapper( 'lang:md_header-marker' )

    md.quote= $lang.Wrapper( 'lang:md_quote' )
    md.quoteMarker= $lang.Wrapper( 'lang:md_quote-marker' )

    md.quoteInline= $lang.Wrapper( 'lang:md_quote-inline' )
    md.quoteInlineMarker= $lang.Wrapper( 'lang:md_quote-inline-marker' )

    md.image= $lang.Wrapper( 'lang:md_image' )
    md.imageHref= $lang.Wrapper( 'lang:md_image-href' )

    md.embed= $lang.Wrapper( 'lang:md_embed' )
    md.embedHref= $lang.Wrapper( 'lang:md_embed-href' )

    md.link= $lang.Wrapper( 'lang:md_link' )
    md.linkMarker= $lang.Wrapper( 'lang:md_link-marker' )
    md.linkTitle= $lang.Wrapper( 'lang:md_link-title' )
    md.linkHref= $lang.Wrapper( 'lang:md_link-href' )

    md.author= $lang.Wrapper( 'lang:md_author' )
    md.indent= $lang.Wrapper( 'lang:md_indent' )

    md.escapingMarker= $lang.Wrapper( 'lang:md_escaping-marker' )

    md.emphasis= $lang.Wrapper( 'lang:md_emphasis' )
    md.emphasisMarker= $lang.Wrapper( 'lang:md_emphasis-marker' )

    md.strong= $lang.Wrapper( 'lang:md_strong' )
    md.strongMarker= $lang.Wrapper( 'lang:md_strong-marker' )

    md.super= $lang.Wrapper( 'lang:md_super' )
    md.superMarker= $lang.Wrapper( 'lang:md_super-marker' )

    md.sub= $lang.Wrapper( 'lang:md_sub' )
    md.subMarker= $lang.Wrapper( 'lang:md_sub-marker' )

    md.math= $lang.Wrapper( 'lang:md_math' )
    md.remark= $lang.Wrapper( 'lang:md_remark' )

    md.table= $lang.Wrapper( 'lang:md_table' )
    md.tableRow= $lang.Wrapper( 'lang:md_table-row' )
    md.tableCell= $lang.Wrapper( 'lang:md_table-cell' )
    md.tableMarker= $lang.Wrapper( 'lang:md_table-marker' )

    md.code= $lang.Wrapper( 'lang:md_code' )
    md.codeMarker= $lang.Wrapper( 'lang:md_code-marker' )
    md.codeLang= $lang.Wrapper( 'lang:md_code-lang' )
    md.codeContent= $lang.Wrapper( 'lang:md_code-content' )

    md.html= $lang.Wrapper( 'lang:md_html' )
    md.htmlTag= $lang.Wrapper( 'lang:md_html-tag' )
    md.htmlContent= $lang.Wrapper( 'lang:md_html-content' )

    md.para= $lang.Wrapper( 'lang:md_para' )

    md.inline=
    $lang.Parser( new function(){

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
            return md.link( '<a href="' + $jam.htmlEscape( uri ) + '">' + open + title + middle + href + close + '</a>' )
        }
        
        // image
        // [url]
        this[ /(\[)([^\[\]]+)(\])/.source ]=
        function( open, href, close ){
            return md.image( md.imageHref( open + href + close ) + '<a href="' + $jam.htmlEscape( href ) + '"><object data="' + $jam.htmlEscape( href ) + '"></object></a>' )
        }
    
        // emphasis
        // /some text/
        this[ /([^\s"({[]\/)/.source ]=
        $lang.text
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
        $lang.text            
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
    $lang.Parser( new function(){

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
            var embed= md.embed( '<wc:aspect wc:aspect_ratio=".75"><iframe class="wc_lang_md_embed-object" src="' + uri + '" allowfullscreen></iframe></wc:aspect>' )
            return href + embed
        }
        
        // image
        // http://gif1.ru/gifs/267.gif
        this[ /^((?:[\?\/\.]|https?:|ftps?:).*?)$(\n?)/.source ]=
        function( url, close ){
            var href= md.embedHref( url + close )
            url= url.replace( /\xAD/g, '' )
            var embed= md.embed( '<a href="' + $jam.htmlEscape( url ) + '"><image src="' + $jam.htmlEscape( url ) + '" /></a>' )
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
                var rowSep= '<lang:md_table-row-sep><wc:lang-md_table-cell colspan="300">\n--</wc:lang-md_table-cell></lang:md_table-row-sep>'
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

