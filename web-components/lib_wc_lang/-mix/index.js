;// jam/jam/jam.jam
if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}
$jam.$jam= $jam

;// jam/define/jam+define.jam
with( $jam )
$jam.$define=
function( key, value ){
    if( this[ key ] && ( this[ key ] !== value ) ){
        throw new Error( 'Redeclaration of [' + key + ']' )
    }
    this[ key ]= value
    return this
}

;// jam/Value/jam+Value.jam
with( $jam )
$jam.$Value= function( val ){
    var value= function(){
        return val
    }
    value.toString= function(){
        return '$jam.$Value: ' + String( val )
    }
    return value
}

;// jam/glob/jam+glob.jam
with( $jam )
$jam.$glob= $Value( this )

;// jam/createNameSpace/wc+createNameSpace.jam
with( $jam )
$define( '$createNameSpace', function( name ){
    var proxy= function(){}
    proxy.prototype= this
    var ns= new proxy
    $define.call( $glob(), name, ns )
    ns.$define( name, ns )
    return ns
})

;// wc/wc/wc.jam
$jam.$createNameSpace( '$wc' )

;// jam/htmlEscape/jam+htmlEscape.jam
with( $jam )
$define
(   '$htmlEscape'
,   function( str ){
        return String( str )
        .replace( /&/g, '&amp;' )
        .replace( /</g, '&lt;' )
        .replace( />/g, '&gt;' )
        .replace( /"/g, '&quot;' )
        .replace( /'/g, '&apos;' )
    }
)

;// wc/lang_text/wc+lang_text.jam
with( $wc )
$define
(   '$lang_text'
,   $htmlEscape
)

;// jam/Pipe/jam+Pipe.jam
with( $jam )
$define( '$Pipe', new function(){
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
})

;// jam/Class/jam+Class.jam
with( $jam )
$jam.$Class=
function( init ){
    var klass=
    function( ){
        if( this instanceof klass ) return this
        return klass.create.apply( klass, arguments )
    }
    
    klass.constructor= $Class
    
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

;// jam/RegExp/jam+RegExp.jam
with( $jam )
$define
(   '$RegExp'
,   $Class( function( klass, proto ){
    
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

;// jam/Lexer/jam+Lexer.jam
with( $jam )
$define
(   '$Lexer'
,   function( lexems ){
        if( !lexems ) throw new Error( 'lexems is required' )
    
        var nameList= []
        var regexpList= []
        var sizeList= []
    
        for( var name in lexems ){
            var regexp= $RegExp( lexems[ name ] )
            nameList.push( name )
            regexpList.push( regexp.source() )
            sizeList.push( regexp.count() )
        }
        
        var regexp= RegExp( '([\\s\\S]*?)((' + regexpList.join( ')|(' ) + ')|$)', 'g' )
    
        return $Class( function( klass, proto ){
            
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
                } else {
                    delete this.name
                    delete this.found
                    delete this.chunks
                    return this
                }
            }
            
        })
    }
)

;// jam/Parser/jam+Parser.jam
with( $jam )
$define
(    '$Parser'
,    function( syntaxes ){
        var lexems= []
        var handlers= []
        handlers[ '' ]= syntaxes[ '' ] || $Pipe()

        for( var regexp in syntaxes ){
            if( !syntaxes.hasOwnProperty( regexp ) ) continue
            if( !regexp ) continue
            lexems.push( RegExp( regexp ) )
            handlers.push( syntaxes[ regexp ] )
        }
        var lexer= $Lexer( lexems )
        
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

;// jam/Concater/jam+Concater.jam
with( $jam )
$define
(   '$Concater'
,   function( delim ){
        delim= delim || ''
        return function( list ){
            return list.join( delim )
        }
    }
)

;// wc/lang/wc+lang.jam
with( $wc )
$define
(   '$lang'
,   new function( ){
        var lang=
        function( name ){
            return this[ '$lang' + '_' + name ] || $lang_text
        }
        
        lang.Wrapper=
        function( name ){
            var prefix= '<' + name + '>'
            var postfix= '</' + name + '>'
            return function( content ){
                return prefix + content + postfix
            }
        }
        
        lang.Parser=
        function( map ){
            if( !map[ '' ] ) map[ '' ]= $lang_text
            return $Pipe
            (   $Parser( map )
            ,   $Concater()
            )
        }
        
        return lang
    }
)

;// wc/lang_css/wc+lang_css.jam
with( $wc )
$define
(    '$lang_css'
,    new function(){
    
        var css=
        function( str ){
            return css.root( css.stylesheet( str ) )
        }

        css.root= $lang.Wrapper( 'wc:lang_css' )
        css.remark= $lang.Wrapper( 'wc:lang_css-remark' )
        css.string= $lang.Wrapper( 'wc:lang_css-string' )
        css.bracket= $lang.Wrapper( 'wc:lang_css-bracket' )
        css.selector= $lang.Wrapper( 'wc:lang_css-selector' )
        css.tag= $lang.Wrapper( 'wc:lang_css-tag' )
        css.id= $lang.Wrapper( 'wc:lang_css-id' )
        css.klass= $lang.Wrapper( 'wc:lang_css-class' )
        css.pseudo= $lang.Wrapper( 'wc:lang_css-pseudo' )
        css.property= $lang.Wrapper( 'wc:lang_css-property' )
        css.value= $lang.Wrapper( 'wc:lang_css-value' )
             
        css.stylesheet=
        $lang.Parser( new function( ){
        
            this[ /(\/\*[\s\S]*?\*\/)/.source ]=
            $Pipe( $lang_text, css.remark )

            this[ /(\*|(?:\\[\s\S]|[\w-])+)/.source ]=
            $Pipe( $lang_text, css.tag )

            this[ /(#(?:\\[\s\S]|[\w-])+)/.source ]=
            $Pipe( $lang_text, css.id )

            this[ /(\.(?:\\[\s\S]|[\w-])+)/.source ]=
            $Pipe( $lang_text, css.klass )

            this[ /(::?(?:\\[\s\S]|[\w-])+)/.source ]=
            $Pipe( $lang_text, css.pseudo )

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
            $Pipe( $lang_text, css.remark )

            this[ /([\w-]+\s*:)/.source  ]=
            $Pipe( $lang_text, css.property )

            this[ /([^:]+?(?:;|$))/.source ]=
            $Pipe( $lang_text, css.value )
            
        })
        
        return css
    }
) 

;// wc/lang_pcre/wc+lang_pcre.jam
with( $wc )
$define
(    '$lang_pcre'
,    new function(){
    
        var pcre=
        function( str ){
            return pcre.root( pcre.content( str ) )
        }

        pcre.root= $lang.Wrapper( 'wc:lang_pcre' )
        pcre.backslash= $lang.Wrapper( 'wc:lang_pcre-backslash' )
        pcre.control= $lang.Wrapper( 'wc:lang_pcre-control' )
        pcre.spec= $lang.Wrapper( 'wc:lang_pcre-spec' )
        pcre.text= $lang.Wrapper( 'wc:lang_pcre-text' )
        
        pcre.content=
        $lang.Parser( new function(){
        
            this[ /\\([\s\S])/.source ]=
            new function( ){
                var backslash= pcre.backslash( '\\' )
                return function( symbol ){
                    return backslash + pcre.spec( $lang_text( symbol ) )
                }
            }
    
            this[ /([(){}\[\]$^])/.source ]=
            $Pipe( $lang_text, pcre.control )
            
        })
        
        return pcre
    }
) 

;// wc/lang_js/wc+lang_js.jam
with( $wc )
$define
(    '$lang_js'
,    new function(){
    
        var js=
        function( str ){
            return js.root( js.content( str ) )
        }

        js.root= $lang.Wrapper( 'wc:lang_js' )
        js.remark= $lang.Wrapper( 'wc:lang_js-remark' )
        js.string= $lang.Wrapper( 'wc:lang_js-string' )
        js.internal= $lang.Wrapper( 'wc:lang_js-internal' )
        js.external= $lang.Wrapper( 'wc:lang_js-external' )
        js.keyword= $lang.Wrapper( 'wc:lang_js-keyword' )
        js.number= $lang.Wrapper( 'wc:lang_js-number' )
        js.regexp= $lang.Wrapper( 'wc:lang_js-regexp' )
        js.bracket= $lang.Wrapper( 'wc:lang_js-bracket' )
        js.operator= $lang.Wrapper( 'wc:lang_js-operator' )
             
        js.content=
        $lang.Parser( new function(){
        
            this[ /(\/\*[\s\S]*?\*\/)/.source ]=
            $Pipe( $lang_text, js.remark )
            this[ /(\/\/[^\n]*)/.source ]=
            $Pipe( $lang_text, js.remark )
            
            this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
            $Pipe( $lang_text, js.string )
            this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
            $Pipe( $lang_text, js.string )
            
            this[ /(\/(?:[^\n\/\\]*(?:\\\\|\\[^\\]))*[^\n\/\\]*\/[mig]*)/.source ]=
            $Pipe( $lang_pcre, js.regexp )
            
            this[ /\b(_[\w$]*)\b/.source ]=
            $Pipe( $lang_text, js.internal )
            
            this[ /(\$[\w$]*)(?![\w$])/.source ]=
            $Pipe( $lang_text, js.external )

            this[ /\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|void|try|catch|null|typeof|instanceof|return|delete|window|document)\b/.source ]=
            $Pipe( $lang_text, js.keyword )
            
            this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
            $Pipe( $lang_text, js.number )
            
            this[ /([(){}\[\]])/.source ]=
            $Pipe( $lang_text, js.bracket )
            
            this[ /(\+{1,2}|-{1,2}|\*|\/|&{1,2}|\|{1,2}|={1,2}|%|\^|!)/.source ]=
            $Pipe( $lang_text, js.operator )
            
        })
        
        return js
    }
) 

;// wc/lang_sgml/wc+lang_sgml.jam
with( $wc )
$define
(    '$lang_sgml'
,    new function(){
    
        var sgml=
        function( str ){
            return sgml.root( sgml.content( str ) )
        }

        sgml.root= $lang.Wrapper( 'wc:lang_sgml' )
        sgml.tag= $lang.Wrapper( 'wc:lang_sgml-tag' )
        sgml.tagBracket= $lang.Wrapper( 'wc:lang_sgml-tag-bracket' )
        sgml.tagName= $lang.Wrapper( 'wc:lang_sgml-tag-name' )
        sgml.attrName= $lang.Wrapper( 'wc:lang_sgml-attr-name' )
        sgml.attrValue= $lang.Wrapper( 'wc:lang_sgml-attr-value' )
        sgml.comment= $lang.Wrapper( 'wc:lang_sgml-comment' )
        sgml.decl= $lang.Wrapper( 'wc:lang_sgml-decl' )
        
        sgml.tag=
        $Pipe
        (   $lang.Parser( new function(){
            
                this[ /^(<\/?)([a-zA-Z][\w:-]*)/.source ]=
                function( bracket, tagName ){
                    return sgml.tagBracket( $lang_text( bracket ) ) + sgml.tagName( tagName )
                } 
                
                this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(")([\s\S]*?)(")/.source ]=
                this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(')([\s\S]*?)(')/.source ]=
                function( prefix, name, sep, open, value, close ){
                    name= sgml.attrName( name )
                    value= sgml.attrValue( open + $lang_css.style( value ) + close )
                    return prefix + name + sep + value
                }
    
                this[ /(\s)([oO][nN]\w+)(\s*=\s*)(")([\s\S]*?)(")/.source ]=
                this[ /(\s)([oO][nN]\w+)(\s*=\s*)(')([\s\S]*?)(')/.source ]=
                function( prefix, name, sep, open, value, close ){
                    name= sgml.attrName( name )
                    value= sgml.attrValue( open + $lang_js( value ) + close )
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
        ,   $lang.Wrapper( 'wc:lang_sgml-tag' )
        )

        sgml.content=
        $lang.Parser( new function(){
        
            this[ /(<!--[\s\S]*?-->)/.source ]=
            $Pipe( $lang_text, sgml.comment )
            
            this[ /(<![\s\S]*?>)/.source ]=
            $Pipe( $lang_text, sgml.decl )
            
            this[ /(<[sS][tT][yY][lL][eE][^>]*>)([\s\S]+?)(<\/[sS][tT][yY][lL][eE]>)/.source ]=
            function( prefix, content, postfix ){
                prefix= $lang_sgml.tag( prefix )
                postfix= $lang_sgml.tag( postfix )
                content= $lang_css( content )
                return prefix + content + postfix
            }
            
            this[ /(<[sS][cC][rR][iI][pP][tT][^>]*>)([\s\S]+?)(<\/[sS][cC][rR][iI][pP][tT]>)/.source ]=
            function( prefix, content, postfix ){
                prefix= $lang_sgml.tag( prefix )
                postfix= $lang_sgml.tag( postfix )
                content= $lang_js( content )
                return prefix + content + postfix
            }
            
            this[ /(<[^>]+>)/.source ]=
            sgml.tag
            
        })
        
        return sgml
    }
) 

