<?php 
# so/meta/so_meta.php


class so_meta {
    function __toString( ){
        return print_r( $this, true );
    }
    
    function __set( $name, $value= null ){
        //$this->_aPropertyName( &$name );
        $method= 'set_' . $name;
        if( !method_exists( $this, $method ) ) $method= 'set_';
        $value= $this->$method( $value );
        $this->{ '_' . $name }= $value;
        return $this;
    }
    function set_( $val ){
        throw new Exception( 'property is read only' );
    }
    
    function __get( $name ){
        //$this->_aPropertyName( &$name );
        $name= '_' . $name;
        $method= 'get' . $name;
        //if( !method_exists( $this, $method ) ) $method= 'get_';
        //$value= $this->{ $name }[ 'value' ];
        $value= $this->{ $name }= $this->{ $method }( $this->{ $name } );
        return $value;
    }
    function get_( $val ){
        return $val;
    }
    
    function __isset( $name ){
        //$this->_aPropertyName( &$name );
        return property_exists( $this, '_' . $name ) && isset( $this->{ '_' . $name } );
    }
    
    function __call( $name, $args ){
        $nameList= explode( '_', $name );
        
        if( count( $nameList ) > 1 ):
            $type= array_shift( $nameList );
            $name= '_' . implode( '/', $nameList );
            switch( $type ){
                case 'get': return $this->get_( $this->{$name} );
                case 'set': return $this->set_( $args[0] );
            }
            return $this->_call( $name, $args );
        else:
            if( !property_exists( $this, '_' . $name ) ):
                return $this->_call( $name, $args );
            endif;
            switch( count( $args ) ):
                case 0: return $this->__get( $name );
                case 1: return $this->__set( $name, $args[0] );
            endswitch;
        endif;
        
        throw new Exception( "Wrong parameters count for [{$name}]" );
    }
    function _call( $name, $args ){
        throw new Exception( "Method not found [{$name}]" );
    }
    
    function _aPropertyName( $val ){
        if( $val[0] !== '_' ) $val= '_' . $val;
        if( !property_exists( $this, $val ) ) throw new Exception( "Property [{$val}] not found" );
        if( !$this->$val ) $this->$val= array();
        return $val;
    }

    static function make( ){
        return new static;
    }
    
    function destroy( ){
        $vars= get_object_vars( $this );
        foreach( $vars as $key => $value ):
            unset( $this->$key );
        endforeach;
    }
}



# so/resource/so_resource.php


class so_resource
extends so_meta
{

    protected $_request;
    function set_request( $request ){
        if( isset( $this->request ) ) throw new Exception( 'Redeclaration of $request' );
        return so_dom::make( $request );
    }
    
    protected $_response;
    function get_response( $response ){
        if( isset( $response ) ) return $response;
        $class= $this->responseClass;
        return $class::make();
    }
    
    function run( ){
        $method= $this->request->name;
        if( $method == 'get' && $this->request[ '@query' ]->value != $this->uri ):
            return $this->response->moved( $this->uri );
        endif;
        $this->{ $method }();
        return $this->response;
    }
    
    function error( $error ){
        return $this->response->error( $error );
    }
    
}



# so/so/so.php


class so
extends so_resource
{
    
    protected $responseClass= so_xmlResponse;
    
    var $uri;
    
    function run( ){
        if( count( $this->request ) > 1 ):
            return $this->response->missed(array( 'so:Error' => 'Missed handler ' ));
        else:
            return $this->response->moved( '?gist' );
        endif;
    }
    
}



# so/dom/so_dom.php

class so_dom
extends so_meta
implements Countable, ArrayAccess, IteratorAggregate
{

    static function make( $DOMNode= null ){
        
        if( !isset( $DOMNode ) ):
            return new self;
        elseif( $DOMNode instanceof so_dom ):
            return $DOMNode;
        elseif( is_string( $DOMNode ) ):
            $DOMNode= DOMDocument::loadXML( $DOMNode, LIBXML_COMPACT )->documentElement;
        elseif( $DOMNode instanceof SimpleXMLElement ):
            $DOMNode= dom_import_simplexml( $DOMNode );
        elseif( $DOMNode instanceof DOMNode ):
            $DOMNode= $DOMNode->cloneNode( true );
        else:
            return so_dom::make()->append( $DOMNode )->root;
        endif;
        
        return so_dom::wrap( $DOMNode );
    }
    
    static function wrap( $DOMNode ){
        if( !( $DOMNode instanceof DOMNode ) ) throw new Exception( "[{$DOMNode}] is not a DOMNode" );
        $dom= new so_dom;
        $dom->DOMNode= $DOMNode;
        return $dom;
    }

    protected $_DOMNode;
    function get_DOMNode( $DOMNode ){
        if( !isset( $DOMNode ) ) return new DOMDocument;
        return $DOMNode;
    }
    function set_DOMNode( $DOMNode ){
        if( isset( $this->DOMNode ) ) throw new Exception( 'Redeclaration of [DOMNode]' );
        return $DOMNode;
    }

    protected $_doc;
    function get_doc( $doc ){
        if( isset( $doc ) ) return $doc;
        $DOMDocument= $this->DOMNode->ownerDocument;
        if( $DOMDocument ) return so_dom::wrap( $this->DOMDocument );
        return $this;
    }

    protected $_root;
    function get_root( $root ){
        if( isset( $root ) ) return $root;
        $rootElement= $this->DOMDocument->documentElement;
        if( !$rootElement ) throw new Exception( "Document have not a root element" );
        return so_dom::wrap( $rootElement );
    }

    protected $_DOMDocument;
    function get_DOMDocument( $DOMDocument ){
        if( isset( $DOMDocument ) ) return $DOMDocument;
        $DOMNode= $this->DOMNode;
        $DOMDocument= $DOMNode->ownerDocument;
        if( $DOMDocument ) return $DOMDocument;
        return $DOMNode;
    }
    
    function __toString( ){
        return $this->DOMDocument->saveXML( $this->DOMNode );
    }
    
    protected $_name;
    function get_name( $name ){
        if( isset( $name ) ) return $name;

        $DOMNode= $this->DOMNode;
        $name= $DOMNode->nodeName;
        
        if( $DOMNode instanceof DOMAttr ):
            return "@{$name}";
        endif;
        
        if( $DOMNode instanceof DOMProcessingInstruction ):
            return "?{$name}";
        endif;

        return $name;
    }

    protected $_value;
    function get_value( $value ){
        return $this->DOMNode->nodeValue;
    }

    protected $_childList;
    function get_childList( $childList ){
        $list= new so_dom_List;
        $list->DOMNodeList= $this->DOMNode->childNodes;
        return $list;
    }

    protected $_attrList;
    function get_attrList( $attrList ){
        $list= new so_dom_List;
        $list->DOMNodeList= $this->DOMNode->attributes;
        return $list;
    }

    function append( ){
        foreach( func_get_args() as $arg ):
            if( is_null( $arg ) ) continue 1;
            
            $DOMNode= $this->DOMNode;
            
            if( is_scalar( $arg ) ):
                $arg= $this->DOMDocument->createTextNode( $arg );
                $DOMNode->appendChild( $arg );
                continue 1;
            endif;
            
            if( is_object( $arg ) ):
                if( $arg instanceof SimpleXMLElement ):
                    $arg= dom_import_simplexml( $arg );
                    $DOMNode->appendChild( $arg );
                    continue 1;
                endif;
                
                if( $arg->DOMNode ):
                    $arg= $arg->DOMNode;
                endif;
                
                if( $arg instanceof DOMDocument ):
                    foreach( $arg->childNodes as $node ):
                        $this->append( $node );
                    endforeach;
                    continue 1;
                endif;
                
                if( $arg instanceof DOMNode ):
                    $arg= $this->DOMDocument->importNode( $arg->cloneNode( true ), true );
                    $DOMNode->appendChild( $arg );
                    continue 1;
                endif;
            endif;
            
            foreach( $arg as $key => $value ):
                if( is_numeric( $key ) ):
                    $this->append( $value );
                    continue 1;
                endif;
                
                if( $key[0] === '#' ):
                    if( !is_scalar( $value ) ):
                        $value= '' . so_dom::make( $value )->root();
                    endif;

                    if( $key === '#text' ):
                        $value= $this->DOMDocument->createTextNode( $value );
                        $DOMNode->appendChild( $value );
                        continue 1;
                    endif;
                            
                    if( $key === '#comment' ):
                        $value= $this->DOMDocument->createComment( $value );
                        $DOMNode->appendChild( $value );
                        continue 1;
                    endif;
                            
                    throw new Exception( "Wrong special element name [{$key}]" );
                endif;
                        
                if( $key[0] === '@' ):
                    $name= substr( $key, 1 );
                    
                    if( !is_scalar( $value ) ):
                        $value= '' . so_dom::make( $value )->root();
                    endif;

                    $DOMNode->setAttribute( $name, $value );
                    continue 1;
                endif;
                        
                if( $key[0] === '?' ):
                    $name= substr( $key, 1 );
                    
                    if( is_array( $value ) ):
                        $valueList= array();
                        foreach( $value as $k => $v ):
                            $valueList[]= htmlspecialchars( $k ) . '="' . htmlspecialchars( $v ) . '"';
                        endforeach;
                        $value= implode( " ", $valueList );
                    endif;
                    
                    $content= $this->DOMDocument->createProcessingInstruction( $name, $value );
                    $DOMNode->appendChild( $content );
                    continue 1;
                endif;
                
                if( $key === '!DOCTYPE' ):
                    $name= substr( $key, 1 );
                    
                    if( !$value ):
                        $value= array();
                    endif;
                    
                    $implementation= $this->DOMDocument->implementation;
                    $content= $implementation->createDocumentType( $value[ 'name' ], $value[ 'public' ], $value[ 'system' ] );
                    $DOMNode->appendChild( $content ); // FIXME: не работает =(
                    continue 1;
                endif;
                
                $element= $this->DOMDocument->createElement( $key );
                so_dom::wrap( $element )->append( $value );
                $DOMNode->appendChild( $element );
            endforeach;

        endforeach;
        return $this;
    }
    
    function select( $query ){
        $xpath = new DOMXPath( $this->doc->DOMNode );
        $found= $xpath->query( $query, $this->DOMNode );
        $nodeList= array();
        foreach( $found as $node ):
            $nodeList[]= so_dom::make( $node );
        endforeach;
        return $nodeList;
    }
    
    function drop( ){
        echo '[' . htmlentities( $this->root ) . ']';
        $this->DOMNode->parentNode->removeChild( $this->DOMNode );
        return $this;
    }
    
    function count( ){
        $DOMNode= $this->DOMNode;
        return $DOMNode->attributes->length + $DOMNode->childNodes->length;
    }

    function offsetExists( $key ){
        if( $key[0] === '@' ):
            $name= substr( $key, 1 );
            return $this->DOMNode->hasAttribute( $name );
        endif;
        
        foreach( $this->DOMNode->childNodes as $child ):
            if( $child->nodeName !== $key ) continue;
            return true;
        endforeach;
        
        return false;
    }
    
    function offsetGet( $key ){
        if( $key[0] === '@' ):
            $name= substr( $key, 1 );
            return so_dom::wrap( $this->DOMNode->getAttributeNode( $name ) );
        endif;

        foreach( $this->DOMNode->childNodes as $child ):
            if( $child->nodeName !== $key ) continue;
            return so_dom::wrap( $child );
        endforeach;
        
        return null;
    }
    
    function offsetSet( $key, $value ){
        if( !$key ):
            $this->append( $value );
            return $this;
        endif;
        
        if( $key[0] === '@' ):
            $this->append(array( $key => $value ));
            return $this;
        endif;
        
        unset( $this[ $key ] );
        
        $this->append(array( $key => $value ));
        return $this;
    }
    
    function offsetUnset( $key ){
        if( $key[0] === '@' ):
            $name= substr( $key, 1 );
            $this->DOMNode->removeAttribute( $name );
            return $this;
        endif;

        foreach( $this->DOMNode->childNodes as $child ):
            if( $child->nodeName !== $key ) continue;
            $this->DOMNode->removeChild( $child );
        endforeach;
        
        return $this;
    }
    
    function getIterator( ){
        $list= array();

        if( $attributes= $this->DOMNode->attributes ):
            foreach( $attributes as $child ):
                $list[]= $child;
            endforeach;
        endif;

        foreach( $this->DOMNode->childNodes as $child ):
            $list[]= $child;
        endforeach;
        
        return so_dom_Iterator::make( $list );
    }
    
}



# so/dom/so_dom_iterator.php

class so_dom_iterator
extends so_meta
implements Iterator
{

    static function make( $list ){
        $iterator= new so_dom_iterator;
        $iterator->list= $list;
        return $iterator;
    }

    protected $_list;
    function &get_list( &$list ){
        return $list;
    }
    function set_list( $list ){
        if( isset( $this->list ) ) throw new Exception( 'Redeclaration of [list]' );
        return $list;
    }

    protected $_iterator;
    function &get_iterator( &$iterator ){
        if( isset( $iterator ) ) return $iterator;
        return new ArrayIterator( $this->list );
    }

    function current( ){
        return so_dom::wrap( $this->iterator->current() );
    }
    
    function key( ){
        return $this->current()->name;
    }
    
    function next( ){
        $this->iterator->next();
        return $this;
    }
    
    function rewind( ){
        $this->iterator->rewind();
        return $this;
    }
    
    function valid( ){
        return $this->iterator->valid();
    }
    
}



# so/file/so_file.php


class so_file
extends so_meta
{

    static $all= array();
    
    static function make( $path ){
        if( !preg_match( '~^([^/\\\\:]+:|[/\\\\])~', $path ) ):
            $path= dirname( dirname( __DIR__ ) ) . '/' . $path;
        endif;
        
        $path= strtr( $path, array( '\\' => '/' ) );
        
        while( true ):
            $last= $path;
            $path= preg_replace( '~/[^/:]+/\\.\\.~', '', $path, 1 );
            if( $path === $last ) break 1;
        endwhile;
        
        return static::$all[ $path ] ?: static::$all[ $path ]= parent::make()->path( $path );
    }
    
    protected $_path;
    function set_path( $path ){
        if( isset( $this->path ) ) throw new Exception( 'Redeclaration of $path' );
        return $path;
    }
    
    protected $_name;
    function get_name( $name ){
        if( isset( $name ) ) return $name;
        return basename( $this->path );
    }
    
    protected $_nameList;
    function get_nameList( $nameList ){
        if( isset( $nameList ) ) return $nameList;
        return explode( '.', $this->name );
    }
    
    protected $_parent;
    function get_parent( $parent ){
        if( isset( $parent ) ) return $parent;
        return so_file::make( dirname( $this->path ) . '/' );
    }
    
    protected $_exists;
    function get_exists( $exists ){
        return file_exists( $this->path );
    }
    function set_exists( $exists ){
        if( $exists ):
            if( $this->exists ) return $exists;
            $this->parent->exists= true;
            @mkdir( $this->path, 0777, true );
        else:
            @unlink( $this->path );
        endif;
        return $exists;
    }
    
    protected $_content;
    function get_content( $content ){
        if( isset( $content ) ) return $content;
        return @file_get_contents( $this->path );
    }
    function set_content( $content ){
        if( $content == $this->content ) return $content;
        $this->parent->exists= true;
        file_put_contents( $this->path, $content );
        $this->_version= null;
        return $content;
    }
    
    protected $_version;
    function get_version( $version ){
        if( isset( $version ) ) return $version;
        
        return strtoupper( base_convert( filemtime( $this->path ), 10, 36 ) );
    }
    
    protected $_childList;
    function get_childList( $childList ){
        if( isset( $childList ) ) return $childList;
        
        $list= array();
        
        if( $this->exists ):
            $dir= dir( $this->path );
            while( false !== ( $file= $dir->read() ) ):
                if( $file === '.' ) continue;
                if( $file === '..' ) continue;
                $list[]= $file;
            endwhile;
            $dir->close();
        endif;
        
        natsort( $list );
        
        return $list;
    }
    
    function go( $path ){
        return so_file::make( preg_replace( '~[^/]+$~', '', $this->path ) . $path );
    }
    
    function __toString( ){
        return $this->path;
    }

}



# so/NativeTemplate/so_NativeTemplate.php


class so_NativeTemplate extends so_meta {

    public $path= '';
    public $param= array();
    
    protected $_content;
    function get_content(){
        ob_start();
            $this->exec();
        return ob_get_clean();
    }
    
    function exec() {
        extract( $this->param );
        include( $this->path );
    }
} 



# so/Compile/so_Compile_All.php


class so_Compile_All {
    function __construct(){        
        $root= new so_WC_Root;
        $docModules= $root->createPack( 'doc' )->index->modules;
        $packs= $root->packs;
        //$packs= array( $root->createPack( 'so' ) );
        foreach( $packs as $pack ):
            $srcPack= $pack->index;
            $docPack= new so_WC_MetaPack;
            $docPack->modules= array_merge( $docModules, $srcPack->modules );
            
            new so_Compile_JS( $srcPack, $pack->mixModule );
            new so_Compile_JS( $docPack, $pack->mixDocModule );
            
            new so_Compile_CSS( $srcPack, $pack->mixModule );
            new so_Compile_CSS( $docPack, $pack->mixDocModule );
            
            new so_Compile_XSL( $srcPack, $pack->mixModule );
            new so_Compile_XSL( $docPack, $pack->mixDocModule );
            
            new so_Compile_XML( $srcPack, $pack->mixModule );
            new so_Compile_XML( $docPack, $pack->mixDocModule );

            new so_Compile_Locale( $srcPack, $pack->mixModule );
            new so_Compile_Locale( $docPack, $pack->mixDocModule );

            new so_Compile_PHP( $srcPack, $pack->mixModule );
            new so_Compile_PHP( $docPack, $pack->mixDocModule );

            # new so_Compile_Other( $srcPack, $pack->mixModule );
            # new so_Compile_Other( $docPack, $pack->mixDocModule );
            
            
            $names= array();
            $minName= 'A';
            
            $fileList= array(
                $pack->mixModule->createFile( 'min.xsl' ),
                $pack->mixModule->createFile( 'min.css' ),
                $pack->mixModule->createFile( 'min.js' ),
                $pack->mixModule->createFile( 'min.php' ),
            );
            
            $replacer= function( $matches ) use( &$names, &$minName ) {
                list( $str, $prefix, $bs, $localName )= $matches;
                $name= &$names[ $prefix . ':' . $localName ];
                if( !$name ) $name= $minName++;
                return $prefix . $bs . ':' . $name;
            };
            foreach( $fileList as $file ):
                $minified= preg_replace_callback( '/(wc)(\\\\?):([a-z0-9_-]+)/i', $replacer, $file->content );
                $file->content= $minified;
            endforeach;
            
            $replacer= function( $matches ) use( &$names, &$minName ) {
                list( $str, $prefix, $localName )= $matches;
                $name= &$names[ $prefix . ':' . $localName ];
                if( !$name ) $name= $minName++;
                return '$' . $prefix . '.' . $name;
            };
            foreach( $fileList as $file ):
                $minified= preg_replace_callback( '/\$(wc|jam)\.([a-z0-9_-]+)/i', $replacer, $file->content );
                $file->content= $minified;
            endforeach;
            
            foreach( $fileList as $file ):
                $pack->mixModule->createFile( $file->name . '.gz' )->content= gzencode( $file->content, 9 );
            endforeach;
            
            $registry= so_dom::make( '<so:compile_name-list xmlns:so="https://github.com/nin-jin/so" />' );
            foreach( $names as $orig => $min ):
                $registry[]= array( 'so:compile_name' => array( '@orig' => $orig, '@min' => 'm:' . $min ) );
            endforeach;
            $pack->mixModule->createFile( 'names.xml' )->content= $registry;
            
            //$pack->mixModule->createFile( 'index.xsl' )->content= $pack->mixModule->createFile( 'min.xsl' )->content;
            //$pack->mixModule->createFile( 'index.css' )->content= $pack->mixModule->createFile( 'min.css' )->content;
            //$pack->mixModule->createFile( 'index.js' )->content= $pack->mixModule->createFile( 'min.js' )->content;
            //$pack->mixModule->createFile( 'index.php' )->content= $pack->mixModule->createFile( 'min.php' )->content;
        
        endforeach;
    }
}



# so/Compile/so_Compile_CSS.php


class so_Compile_CSS {
    function __construct( $pack, $mixModule ){
        $files= $pack->selectFiles( '|\\.css$|' );
        
        $indexFile= $mixModule->createFile( 'index.css' );
        if( count( $files ) > 32 ):
            $pages= array();
            foreach( array_values( $files ) as $index => $file ):
                $pageNumb= floor( $index / 30 );
                $pages[ $pageNumb ][]= $file;
            endforeach;
            $indexContent= '';
            foreach( $pages as $pageNumb => $page ):
                $pageFile= $mixModule->createFile( "page_{$pageNumb}.css" );
                $pageContent= '';
                foreach( $page as $file ):
                    $pageContent.= "@import url( '../../{$file->id}?{$file->version}' );\n";
                endforeach;
                $pageFile->content= $pageContent;
                $indexContent.= "@import url( '../../{$pageFile->id}?{$pageFile->version}' );\n";
            endforeach;
            $indexFile->content= $indexContent;
        else:
            $content= '';
            foreach( $files as $id => $file ):
                $content.= "@import url( '../../{$file->id}?{$file->version}' );\n";
            endforeach;
            $indexFile->content= $content;
        endif;
        
        $head= '';
        $content= '';
        foreach( $files as $file ):
            preg_match_all
            (   '/^\s*@namespace .*$/m'
            ,   $file->content
            ,   &$namespaceList
            );
            $head.= implode( "\n", $namespaceList[0] );
            $content.= "/* @import url( '../../{$file->id}' ); */\n{$file->content}\n";
        endforeach;
        $compiled= $head . $content;
        $mixModule->createFile( 'compiled.css' )->content= $compiled;
        
        $minified= $compiled;
        $minified= preg_replace( '~/\\*[\w\W]*?\\*/~', '', $minified );
        $minified= preg_replace( '~^\s+~m', '', $minified );
        $minified= preg_replace( '~[\r\n]~', '', $minified );
        
        //$replacer= function( $matches ) use( $mixModule ) {
        //    list( $str, $prefix, $url, $postfix )= $matches;
        //    $file= so_file::make( $mixModule->path . '/' )->go( $url );
        //    $type= image_type_to_mime_type( exif_imagetype( $file ) );
        //    return $prefix . 'data:' . $type . ';base64,' . base64_encode( $file->content ) . $postfix;
        //};
        //$minified= preg_replace_callback( "~(url\(\s*')([^:]+(?:/|$).*?)('\s*\))~", $replacer, $minified );
            
        $mixModule->createFile( 'min.css' )->content= $minified;
    }
}



# so/Compile/so_Compile_JS.php


class so_Compile_JS {
    function __construct( $pack, $mixModule ){
        $files= $pack->selectFiles( '|(?:\\.jam)?\\.js$|' );
        
        $indexFile= $mixModule->createFile( 'index.js' );
        $indexPath= '/' . $indexFile->id;
        if( count( $files ) ):
            $tpl= new so_Compile_JS_Index;
            $tpl->param= compact( 'indexPath', 'files' );
            $indexFile->content= $tpl->content;
        else:
            $indexFile->exists= false;
        endif;
        
        $compiled= '';
        foreach( $files as $file ):
            $compiled.= ";// {$file->id}\n" . $file->content . "\n";
        endforeach;
        $mixModule->createFile( 'compiled.js' )->content= $compiled;

        $minified= $compiled;
        $minified= preg_replace( '~/\\*[\w\W]*?\\*/~', '', $minified );
        $minified= preg_replace( '~^\s+~m', '', $minified );
        $minified= preg_replace( '~//[^"\'\n\r]*?$\n~m', '', $minified );
        $minified= preg_replace( '~;[\r\n]~', ';', $minified );
        $mixModule->createFile( 'min.js' )->content= $minified;
        
    }
}



# so/Compile/so_Compile_JS_Index.php


class so_Compile_JS_Index extends so_NativeTemplate {
    function exec(){
        extract( $this->param );


?>
;(function( modules ){
    var packPath= '<?=$indexPath;?>'
    var scripts= document.getElementsByTagName( 'script' )
    if( !scripts.length ) scripts= document.getElementsByTagNameNS( 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'script' )
    
    for( var i= scripts.length - 1; i >= 0; --i ){
        var script= scripts[ i ]
        var src= script.getAttribute( 'src' )
        if( !src ) continue
        src= src.replace( /^(?=[^:]+\/)/, document.location.pathname.replace( /\/[^\/]*$/, '/' ) )
        while( true ) {
            srcNew= src.replace( /\/(?!\.\.)[^\/]+\/\.\.(?=\/)/g, '' )
            if( srcNew === src ) break
            src= srcNew
        }
        if( src.indexOf( packPath ) >= 0 ) break
        if( !i ) throw new Error( 'Can not locate index script path' )
    }
    var dir= src.replace( /[^\/]+$/, '' )
        
    try {
        document.write( '' )
        var canWrite= true
    } catch( e ){}
    
    if( canWrite ){
        var module
        while( module= modules.shift() ){
            document.write( '<script src="' + dir + module + '"><' + '/script>' )
        }
    } else {
        var next= function(){
            var module= modules.shift()
            if( !module ) return
            var loader= document.createElement( 'script' )
            loader.src= dir + module
            loader.onload= next
            script.parentNode.insertBefore( loader, script )
        }
        next()
    }
}).call( this, [
<? foreach( $files as $file ): ?>
    "../../<?= $file->id; ?>?<?= $file->version; ?>",
<? endforeach; ?>
null ])
<?php


    }
}
    



# so/Compile/so_Compile_Locale.php


class so_Compile_Locale {
    function __construct( $pack, $mixModule ){
        $namePattern= '|\\.locale=(\w*)\\.xml$|';
        $fileList= $pack->selectFiles( $namePattern );
        
        $index= array();
        foreach( $fileList as $file ):
            preg_match( $namePattern, $file->name, $locale );
            $index[ $locale[1] ][ $file->id ]= $file;
        endforeach;
        
        $xstyle= new so_XStyle;
        
        foreach( $index as $locale => $fileList ):
            
            $indexStruct= array();
            foreach( $fileList as $file ):
                $indexStruct[]=  array( '#comment' => $file->id );
                $indexStruct[]=  DOMDocument::load( $file->path )->documentElement;
            endforeach;
            
            $indexDOM= $xstyle->aDocument(array(
                'locale:list' => array(
                    '@xmlns:locale' => 'https://github.com/nin-jin/locale',
                    $indexStruct,
                ),
            ));
            
            $indexFile= $mixModule->createFile( "index.locale={$locale}.xml" );
            $indexFile->content= $indexDOM->saveXML();
            
        endforeach;
        
    }
}



# so/Compile/so_Compile_Other.php


class so_Compile_Other {
    function __construct( $pack, $mixModule ){
        $files= $pack->files;
                    
        foreach( $files as $id => $file ):
            if( in_array( $file->ext, array( 'jam', 'js', 'css', 'xml', 'xsl', 'tree' ) ) ) continue;
            copy( $file->path, $mixModule->path . '/' . $file->name );
        endforeach;
    }
}



# so/Compile/so_Compile_PHP.php


class so_Compile_PHP {
    function __construct( $pack, $mixModule ){
        $files= $pack->selectFiles( '|\\.php$|' );
        
        $indexFile= $mixModule->createFile( 'index.php' );
        $compiledFile= $mixModule->createFile( 'compiled.php' );
        $minFile= $mixModule->createFile( 'min.php' );
        
        if( !count( $files ) ):
            $indexFile->exists= false;
            $compiledFile->exists= false;
            return;
        endif;
        
        $indexFile->content= "<?php require_once( dirname( dirname( __DIR__ ) ) . '/so/autoload/so_autoload.php' );\n";
        
        $compiled= "<?php \n";
        foreach( $files as $file ):
            $compiled.= "# {$file->id}\n" . substr( $file->content, 6 ). "\n\n\n";
        endforeach;
        $compiledFile->content= $compiled;
        
        $minified= $compiled;
        $mixModule->createFile( 'min.php' )->content= $minified;
        
    }
}



# so/Compile/so_Compile_XML.php


class so_Compile_XML {
    function __construct( $packSource, $mixModule ){
        $xmlIndex = $mixModule->createFile( 'index.doc.xml' );

        #if( $packSource->version === $xmlIndex->version ) return;
        
        $index= array();

        foreach( $mixModule->root->packs as $pack ):
            $mainFile= $pack->mainFile;
            if( !$mainFile->exists ) continue;
            
            if( $pack->id === $mixModule->pack->id ):
                $fileList= array();
                
                foreach( $pack->selectFiles( '|\\.doc\\.xml$|' ) as $file ):
                    $fileList[]= array(
                        'file' => array(
                            'link' => "../../{$file->id}?{$file->version}",
                            'title' => DOMDocument::load( $file->path )->getElementsByTagName( 'h1' )->item(0)->nodeValue,
                        ),
                    );
                endforeach;
            else:
                $fileList= array(
                    'file' => array(
                        'link' => "../../{$mainFile->id}?{$mainFile->version}",
                        'title' => DOMDocument::load( $mainFile->path )->getElementsByTagName( 'h1' )->item(0)->nodeValue,
                    ),
                );
            endif;
            $index[]= array( 'pack' => $fileList );
        endforeach;
        
        $index= so_dom::make( array(
            'root' => array(
                '@xmlns' => 'https://github.com/nin-jin/doc',
                $index,
            ),
        ) );
    
        $xmlIndex->content= $index;
    }
}



# so/Compile/so_Compile_XSL.php


class so_Compile_XSL {
    function __construct( $pack, $mixModule ){
        $fileList= $mixModule->root->createPack( 'so' )->createModule( 'XStyle' )->selectFiles( '|\\.xsl$|' );
        $fileList= array_merge( $fileList, $pack->selectFiles( '|\\.xsl$|' ) );
        
        $index= array();
        foreach( $fileList as $file ):
            $index[]= array(
                'xsl:include' => array(
                    '@href' => "../../{$file->id}?{$file->version}" 
                ),
            );
        endforeach;
        
        $index= so_dom::make()->append( array(
            'xsl:stylesheet' => array(
                '@version' => '1.0',
                '@xmlns:xsl' => 'http://www.w3.org/1999/XSL/Transform',
                $index,
            ),
        ) );

        $mixModule->createFile( 'index.xsl' )->content= $index;

        $compiled= so_dom::make( '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" />' );
        
        foreach( $fileList as $file ):
            $docEl= DOMDocument::load( $file->path )->documentElement;
            $prefix= $file->pack->name;
            $ns= $docEl->lookupNamespaceURI( $prefix );
            if( $ns ):
                $compiled[ '@xmlns:' . $prefix ]= $ns;
            endif;
            $compiled[]= array(
                '#comment' => " {$file->id} ",
                $docEl->childNodes,
            );
        endforeach;
        
        
        $mixModule->createFile( 'compiled.xsl' )->content= $compiled;
        
        $minified= new DOMDOcument();
        $minified->formatOutput= false;
        $minified->preserveWhiteSpace= false;
        $minified->loadXML( $compiled );
        $mixModule->createFile( 'min.xsl' )->content= $minified->C14N();
    }
}



# so/HttpRequest/so_HttpRequest.php


class so_HttpRequest
extends so_meta
{
    
    static function create( ){
        return new self;
    }
    
    protected $_method;
    function get_method( $method ){
        return strtolower( $_SERVER[ 'REQUEST_METHOD' ] );
    }
    
    protected $_type;
    function get_type( $type ){
        return strtolower( $_SERVER[ 'CONTENT_TYPE' ] );
    }
    
    protected $_data;
    function get_data( $data ){
        if( $data ) return $data;
        
        $query= $_SERVER[ 'QUERY_STRING' ];
        
        if(( $this->method === 'put' )and( $this->type === 'application/x-www-form-urlencoded' )):
            $raw= '';
            $input= fopen( 'php://input', 'r' );
            while( $chunk= fread( $input, 1024 ) ) $raw.= $chunk;
            fclose( $input );
            $query.= '/' . $raw;
        endif;
        
        $data= array();
        
        $chunkList= preg_split( '![&/]!', $query );
        foreach( $chunkList as $chunk ):
            if( !$chunk ) continue;
            list( $key, $val )= explode( '=', $chunk, 2 );
            $data[ urldecode( $key ) ]= urldecode( $val );
        endforeach;
        
        $data+= $_POST;
        
        foreach( $data as $key => $value ):
            $keyList= explode( '_', $key );
            $current= &$data;
            while( count( $keyList ) > 1 ):
                $current= &$current[ array_shift( $keyList ) ];
            endwhile;
            $current[ $keyList[ 0 ] ]= $value;
        endforeach;
        
        return $data;
    }
    
    protected $_query;
    function get_query( $query ){
        if( $query ) return $query;
        
        $chunkList= array();
        $keyList= array();
        $iterator= new RecursiveIteratorIterator( new RecursiveArrayIterator( $this->data ), RecursiveIteratorIterator::SELF_FIRST );
        foreach( $iterator as $key => $val ):
            array_splice( $keyList, $iterator->getDepth() );
            $keyList[]= $key;
            if( is_scalar( $val ) ):
                $chunk= array( implode( '_', $keyList ) );
                if( $val ) $chunk[]= $val;
                $chunkList[]= implode( '=', $chunk );
            endif;
        endforeach;
        $query= implode( '/', $chunkList );
        
        return $query;
    }
    
}



# so/Tree/so_Tree.php


class so_Tree extends so_meta {

    protected $_struct;
    function get_struct( $val ){
        if( isset( $val ) ) return $val;
        return array();
    }
    function set_struct( $val ){
        if( isset( $this->struct ) ) throw new Exception( 'Redeclaration of $struct' );
        return $val;
    }

    protected $separatorOfChunks= "\n";
    protected $separatorOfPair= "= ";
    protected $separatorOfKeys= " ";
    protected $indentationToken= "    ";

    protected $_string;
    function get_string( $val ){
        if( isset( $val ) ) return $val;
        
        $chunkList= array();
        $lastKeyList= array();
        foreach( $this->struct as $index => $keyList ):
            $prefix= array();
            $actualKeyList= array();
            $value= array_pop( $keyList );
            foreach( $keyList as $index => $key ):
                if( !$actualKeyList && $key === $lastKeyList[ $index ] ):
                    $prefix[]= str_pad( " ", strlen( $key ) );//$this->indentationToken;
                else:
                    $actualKeyList[]= $key;
                endif;
            endforeach;
            $chunk= implode( str_pad( " ", strlen( $this->separatorOfKeys ) ), $prefix );
            $chunk.= implode( $this->separatorOfKeys, $actualKeyList );
            $chunk.= $this->separatorOfPair . $value;
            $lastKeyList= $keyList;
            $chunkList[]= $chunk;
        endforeach;

        $val= implode( $this->separatorOfChunks, $chunkList );
        return $val;
    }
    function set_string( $val ){
        if( isset( $this->string ) ) throw new Exception( 'Redeclaration of $string' );
        
        $chunkList= explode( $this->separatorOfChunks, $val );
        $struct= array();
        $lastKeyList= array();
        foreach( $chunkList as $chunk ):

            $pair= explode( $this->separatorOfPair, $chunk, 2 );
            
            $keyList= explode( $this->indentationToken, $pair[0] );
            $keyListTail= array_pop( $keyList );
            if( $keyListTail ):
                $keyListTail= explode( $this->separatorOfKeys, $keyListTail );
                $keyList= array_merge( $keyList, $keyListTail );
            endif;
            
            foreach( $keyList as $index => &$key ):
                if( !$key ) $key= $lastKeyList[ $index ];
            endforeach;
            $lastKeyList= $keyList; 
            
            $keyList[]= $pair[1];
            $struct[]= $keyList;

        endforeach;
        $this->struct= $struct;
        return null;
    }
    
    function aPath( $val ){
        if( is_string( $val ) ) $val= explode( $this->separatorOfKeys, $val );
        if( !is_array( $val ) ) throw new Exception( 'Wrong path type' );
        return $val;
    }

    function get( $keyList ){
        $this->aPath( &$keyList );
        $filtered= array();
        foreach( $this->struct as $chunk ):
            if( count( $chunk ) !== count( $keyList ) + 1 ) continue;
            foreach( $keyList as $index => $key ):
                if( $key !== $chunk[ $index ] ) continue 2;
            endforeach;
            $filtered[]= end( $chunk );
        endforeach;
        return $filtered;
    }

} 



# so/WC/so_WC_File.php


class so_WC_File extends so_meta {
    protected $_name;
    function set_name( $name ){
        if( isset( $this->name ) ) throw new Exception( 'Redeclaration of $name' );
        return $name;
    }
    
    protected $_id;
    function get_id( $id ){
        if( isset( $id ) ) return $id;
        return $this->module->id . '/' . $this->name;
    }
    
    protected $_path;
    function get_path( $path ){
        if( isset( $path ) ) return $path;
        return $this->module->path . '/' . $this->name;
    }
    
    protected $_ext;
    function get_ext( $ext ){
        if( isset( $ext ) ) return $ext;
        $ext= explode( '.', pathinfo( $this->name, PATHINFO_BASENAME ) );
        array_shift( $ext );
        return implode( '.', $ext );
    }
    
    protected $_exists;
    function get_exists( $exists ){
        return is_file( $this->path );
    }
    function set_exists( $exists ){
        if( $exists ) throw new Exception( '$exists=true is not implemented' );
        else @unlink( $this->path );
        return $exists;
    }
    
    protected $_root;
    function get_root( $root ){
        if( isset( $root ) ) return $root;
        return $this->module->root;
    }
    
    protected $_pack;
    function get_pack( $pack ){
        if( isset( $pack ) ) return $pack;
        return $this->module->pack;
    }
    function set_pack( $pack ){
        if( isset( $this->pack ) ) throw new Exception( 'Redeclaration of $pack' );
        return $pack;
    }
    
    protected $_module;
    function set_module( $module ){
        if( isset( $this->module ) ) throw new Exception( 'Redeclaration of $module' );
        return $module;
    }
    
    protected $_content;
    function get_content( $content ){
        if( isset( $content ) ) return $content;
        return @file_get_contents( $this->path );
    }
    function set_content( $content ){
        if( $content == $this->content ) return $content;
        $this->module->exists= true;
        file_put_contents( $this->path, $content );
        $this->_version= '';
        return $content;
    }
    
    protected $_version;
    function get_version( $version ){
        if( isset( $version ) ) return $version;

        return strtoupper( base_convert( filemtime( $this->path ), 10, 36 ) );
    }

    protected $_dependModules;
    function get_dependModules( $depends ){
        if( isset( $depends ) ) return $depends;
        $depends= array();
        if( $this->ext === 'jam.js' ):
            preg_match_all
            (   '/(?:\$(\w+)\.)(\w+)(?![\w$])/'
            ,   $this->content
            ,   &$matches
            ,   PREG_SET_ORDER
            );
            if( $matches ) foreach( $matches as $item ):
                list( $str, $packName, $moduleName )= $item;
                
                $pack= $this->root->createPack( $packName );
                if( !$pack->exists ) throw new Exception( "Pack [{$pack->id}] not found for [{$this->id}]" );
                
                $module= $pack->createModule( $moduleName );
                if( !$module->exists ) throw new Exception( "Module [{$module->id}] not found for [{$this->id}]" );
                
                $depends[ $module->id ]= $module;
                
                $module= $module->pack->mainModule;
                if( $module->exists ) $depends[ $module->id ]= $module;
            endforeach;
        endif;
        
        if( $this->ext === 'php' ):
            preg_match_all
            (   '/class\s+\w+\s+extends\s+([a-zA-Z]+)_([a-zA-Z]+)/'
            ,   $this->content
            ,   &$matches1
            ,   PREG_SET_ORDER
            );
            preg_match_all
            (   '/\b([a-zA-Z]+)_([a-zA-Z]+)\w*::/'
            ,   $this->content
            ,   &$matches2
            ,   PREG_SET_ORDER
            );
            $matches= array_merge( $matches1, $matches2 );
            if( $matches ) foreach( $matches as $item ):
                list( $str, $packName, $moduleName )= $item;
                
                $pack= $this->root->createPack( $packName );
                $module= $pack->createModule( $moduleName );

                if( !$module || !$module->exists ) throw new Exception( "Module [{$module->id}] not found for [{$this->id}]" );
                $depends[ $module->id ]= $module;

                $module= $module->pack->mainModule;
                if( $module->exists ) $depends[ $module->id ]= $module;
            endforeach;
        endif;
        
        if( $this->ext === 'xsl' ):
            preg_match_all
            (   '/<([a-zA-Z]+):([a-zA-Z-]+)/'
            ,   $this->content
            ,   &$matches1
            ,   PREG_SET_ORDER
            );
            preg_match_all
            (   '/\b([a-zA-Z]+):([a-zA-Z-]+)=[\'"]/'
            ,   $this->content
            ,   &$matches2
            ,   PREG_SET_ORDER
            );
            $matches= array_merge( $matches1, $matches2 );
            if( $matches ) foreach( $matches as $item ):
                list( $str, $packName, $moduleName )= $item;
                if( $packName == 'xsl' ) continue;
                if( $packName == 'xmlns' ) continue;
                if( $packName == 'xml' ) continue;
                
                $pack= $this->root->createPack( $packName );
                $module= $pack->createModule( $moduleName );

                if( !$module || !$module->exists ) throw new Exception( "Module [{$module->id}] not found for [{$this->id}]" );
                $depends[ $module->id ]= $module;

                $module= $module->pack->mainModule;
                if( $module->exists ) $depends[ $module->id ]= $module;
            endforeach;
        endif;
        
        if( $this->ext === 'meta.tree' ):
            $meta= new so_Tree;
            $meta->string= $this->content;
            foreach( $meta->get( 'include pack' ) as $packId ):
                $pack= $this->root->createPack( trim( $packId ) );
                if( !$pack->exists ) throw new Exception( "Pack [{$pack->id}] not found for [{$this->id}]" );
                $depends+= $pack->modules;
            endforeach;
            foreach( $meta->get( 'include module' ) as $moduleId ):
                $names= explode( '/', trim( $moduleId ) );
                if( !$names[ 1 ] ) array_push( $names, $this->pack->name );
                $pack= $this->root->createPack( $names[0] );
                $module= $pack->createModule( $names[1] );
                if( !$module->exists ) throw new Exception( "Module [{$module->id}] not found for [{$this->id}]" );
                $depends[ $module->id ]= $module;
            endforeach;
        endif;
        return $depends;
    }

}



# so/WC/so_WC_MetaModule.php


class so_WC_MetaModule extends so_WC_Node {
    protected $_files;
    function set_files( $files ){
        if( isset( $this->files ) ) throw new Exception( 'Redeclaration of $files' );
        return $files;
    }
    
    function selectFiles( $regexp ){
        $res= array();
        foreach( $this->files as $file ):
            if( !preg_match( $regexp, $file->name ) ) continue;
            $res[ $file->id ]= $file;
        endforeach;
        return $res;
    }
    
    protected $_dependModules;
    function get_dependModules( $depends ){
        if( isset( $depends ) ) return $depends;
        $depends= array();
        foreach( $this->files as $file ):
            $depends= array_merge( $depends, $file->dependModules );
        endforeach;
        unset( $depends[ $this->id ] );
        return $depends;
    }
    
    protected $_version;
    function get_version( $version ){
        if( isset( $version ) ) return $version;
        $version= '';
        foreach( $this->files as $file ):
            if( $file->version <= $version ) continue;
            $version= $file->version;
        endforeach;
        return $version;
    }
    
    /*protected $_content
    function get_content( $content ){
        $content= '';
        foreach( $this->files as $id => $file ):
            $content.= "// {$id}\n" . $file->content . "\n";
        endforeach;
        return $content;
    }*/
}



# so/WC/so_WC_MetaPack.php


class so_WC_MetaPack extends so_WC_Node {
    protected $_modules;
    function set_modules( $modules ){
        if( isset( $this->modules ) ) throw new Exception( 'Redeclaration of $modules' );
        return $modules;
    }
    
    protected $_files;
    function get_files( $files ){
        if( isset( $files ) ) return $files;
        $files= array();
        foreach( $this->modules as $module ):
            $files= array_merge( $files, $module->files );
        endforeach;
        return $files;
    }

    function selectFiles( $ext ){
        $res= array();
        $mainModule= $this->mainModule;
        if( $mainModule && $mainModule->exists ):
            $res= array_merge( $res, $mainModule->selectFiles( $ext ) );
        endif;
        foreach( $this->modules as $module ):
            $res= array_merge( $res, $module->selectFiles( $ext ) );
        endforeach;
        return $res;
    }

    protected $_mainModule;
    function get_mainModule( $val ){
        if( isset( $val ) ) return $val;
        return $this->modules[0];
    }
    
    protected $_dependModules;
    function get_dependModules( $depend ){
        return $this->modules;
    }
    
    protected $_index;
    function get_index( $index ){
        if( isset( $index ) ) return $index;
        
        $deferred= $sorted= array();
        
        $current= $this;
        while( $current ){
            foreach( $current->dependModules as $dep ):
                if( $sorted[ $dep->id ] ) continue;
                if( $deferred[ $dep->id ] ) continue;
                $deferred[ $current->id ]= $current;
                $current= $dep;
                continue 2;
            endforeach;
            
            $sorted[ $current->id ]= $current;
            $current= end( $deferred );
            unset( $deferred[ $current->id ] );
        }
        
        $pack= new so_WC_MetaPack;
        $pack->modules= $sorted;
        
        return $pack;
    }
    
    protected $_version;
    function get_version( $version ){
        if( isset( $version ) ) return $version;
        $version= '';
        foreach( $this->modules as $module ):
            if( $module->version <= $version ) continue;
            $version= $module->version;
        endforeach;
        return $version;
    }
}



# so/WC/so_WC_Module.php


class so_WC_Module extends so_WC_MetaModule {
    protected $_name;
    function set_name( $name ){
        if( isset( $this->name ) ) throw new Exception( 'Redeclaration of $name' );
        return $name;
    }
    
    protected $_id;
    function get_id( $id ){
        if( isset( $id ) ) return $id;
        return $this->pack->id . '/' . $this->name;
    }
    
    protected $_path;
    function get_path( $path ){
        if( isset( $path ) ) return $path;
        return $this->pack->path . '/' . $this->name;
    }
    
    protected $_exists;
    function get_exists( $exists ){
        return is_dir( $this->path );
    }
    function set_exists( $exists ){
        $this->pack->exists= true;
        if( $exists ) @mkdir( $this->path, 0777, true );
        else throw new Exception( '$exists=false is not implemented' );
        return $exists;
    }
    
    protected $_root;
    function get_root( $root ){
        if( isset( $root ) ) return $root;
        return $this->pack->root;
    }
    
    protected $_pack;
    function set_pack( $pack ){
        if( isset( $this->pack ) ) throw new Exception( 'Redeclaration of $pack' );
        return $pack;
    }
    
    protected $_files;
    function get_files( $files ){
        if( isset( $files ) ) return $files;
        $files= array();
        foreach( $this->childNameList as $name ):
            $file= $this->createFile( $name );
            if( !$file->exists ) continue;
            $files[ $file->id ]= $file;
        endforeach;
        return $files;
    }
    
    protected $_fileCache= array();
    function createFile( $name ){
        if( key_exists( $name, $this->_fileCache ) ) return $this->_fileCache[ $name ];

        $file= new so_WC_File;
        $file->name= $name;
        $file->module= $this;
        $this->_fileCache[ $name ]= $file;

        return $file;
    }
}



# so/WC/so_WC_Node.php


class so_WC_Node extends so_meta {
    protected $_childNameList;
    function get_childNameList( $names ){
        if( isset( $names ) ) return $names;
        
        $names= array();
        foreach( glob( $this->path . '/{*,*.*}', GLOB_BRACE ) as $file ):
            $name= preg_replace( '!^.*/([^/]+)$!', '$1', $file );
            if( strpos( '.-', $name[0] ) !== false ) continue;
            $names[]= $name;
        endforeach;
        
        return $names;
    }
}



# so/WC/so_WC_Pack.php


class so_WC_Pack extends so_WC_MetaPack {
    protected $_name;
    function set_name( $name ){
        if( isset( $this->name ) ) throw new Exception( 'Redeclaration of $name' );
        return $name;
    }
    
    protected $_id;
    function get_id( $id ){
        if( isset( $id ) ) return $id;
        return $this->name;
    }
    
    protected $_path;
    function get_path( $path ){
        if( isset( $path ) ) return $path;
        return $this->root->path . '/' . $this->name;
    }
    
    protected $_exists;
    function get_exists( $exists ){
        return is_dir( $this->path );
    }
    function set_exists( $exists ){
        if( $exists ) @mkdir( $this->path, 0777, true );
        else throw new Exception( '$exists=false is not implemented' );
        return $exists;
    }
    
    protected $_root;
    function set_root( $root ){
        if( isset( $this->root ) ) throw new Exception( 'Redeclaration of $root' );
        return $root;
    }
    
    protected $_modules;
    function get_modules( $modules ){
        if( isset( $modules ) ) return $modules;
        $modules= array();
        foreach( $this->childNameList as $name ):
            $module= $this->createModule( $name );
            if( !$module->exists ) continue;
            $modules[ $module->id ]= $module;
        endforeach;
        return $modules;
    }
    
    protected $_mainFile;
    function get_mainFile( $value ){
        if( isset( $value ) ) return $value;
        return $this->mainModule->createFile( $this->name . '.doc.xml' );
    }    

    protected $_mainModule;
    function get_mainModule( $mainModule ){
        if( isset( $mainModule ) ) return $mainModule;
        return $this->createModule( $this->name );
    }
    
    protected $_mixModule;
    function get_mixModule( $mixModule ){
        if( isset( $mixModule ) ) return $mixModule;
        return $this->createModule( '-mix' );
    }
    
    protected $_mixDocModule;
    function get_mixDocModule( $mixModule ){
        if( isset( $mixModule ) ) return $mixModule;
        return $this->createModule( '-mix+doc' );
    }
    
    protected $_moduleCache= array();
    function createModule( $name ){
        if( key_exists( $name, $this->_moduleCache ) ) return $this->_moduleCache[ $name ];

        $module= new so_WC_Module;
        $module->name= $name;
        $module->pack= $this;
        $this->_moduleCache[ $name ]= $module;
        
        return $module;
    }
    
    protected $_fileCache= array();
    function createFile( $name ){
        if( key_exists( $name, $this->_fileCache ) ) return $this->_fileCache[ $name ];

        $file= new so_WC_File;
        $file->name= $name;
        $file->module= $this;
        $file->pack= $this;
        $this->_fileCache[ $name ]= $file;
        
        return $file;
    }
}



# so/WC/so_WC_Root.php


class so_WC_Root extends so_WC_Node {
    protected $_path;
    function get_path( $path ){
        if( isset( $path ) ) return $path;
        return dirname( dirname( dirname( __FILE__ ) ) );
    }
    
    protected $_packs;
    function get_packs( $packs ){
        if( isset( $packs ) ) return $packs;
        $packs= array();
        foreach( $this->childNameList as $name ):
            $pack= $this->createPack( $name );
            if( !$pack->exists ) continue;
            $packs[ $pack->id ]= $pack;
        endforeach;
        return $packs;
    }

    protected $_modules;
    function get_modules( $modules ){
        if( isset( $modules ) ) return $modules;
        $modules= array();
        foreach( $this->packs as $pack ):
            $modules= array_merge( $modules, $pack->modules );
        endforeach;
        return $modules;
    }

    protected $_files;
    function get_files( $files ){
        if( isset( $files ) ) return $files;
        $files= array();
        foreach( $this->modules as $module ):
            $files= array_merge( $files, $module->files );
        endforeach;
        return $files;
    }

    protected $_mixPack;
    function get_mixPack( $value ){
        if( isset( $value ) ) return $value;
        return $this->createPack( '-mix' );
    }
    
    protected $_packCache= array();
    function createPack( $name ){
        if( key_exists( $name, $this->_packCache ) ) return $this->_packCache[ $name ];

        $pack= new so_WC_Pack;
        $pack->name= $name;
        $pack->root= $this;
        $this->_packCache[ $name ]= $pack;
        
        return $pack;
    }
}



# so/XStyle/so_XStyle.php


class so_XStyle extends so_meta {

    protected $_dir;
    function get_dir( $dir ){
        if( isset( $dir ) ) return $dir;
        return dirname( $this->pathXSL );
    }

    protected $_pathXS;
    function set_pathXS( $pathXS ){
        if( isset( $this->pathXSL ) or isset( $this->pathXS ) ) throw new Exception( 'Redeclaration of $pathXS' );
        return realpath( $pathXS );
    }
    
    protected $_pathXSL;
    function get_pathXSL( $pathXSL ){
        if( isset( $pathXSL ) ) return $pathXSL;
        return preg_replace( '!\.xs$!i', '.xsl', $this->pathXS );
    }
    function set_pathXSL( $pathXSL ){
        if( isset( $this->pathXSL ) or isset( $this->pathXS ) ) throw new Exception( 'Redeclaration of $pathXSL' );
        return realpath( $pathXSL );
    }

    protected $_docXS;
    function get_docXS( $docXS ){
        if( isset( $docXS ) ) return $docXS;
        $docXS= new DOMDocument( );
        if( file_exists( $this->pathXS ) ) $docXS->load( $this->pathXS, LIBXML_COMPACT );
        return $docXS;
    }
    function set_docXS( $docXS ){
        $docXS= so_dom::make( $docXS );
        if( file_exists( $this->pathXS ) ) unlink( $this->pathXS );
        file_put_contents( $this->pathXS, $docXS );
        return null;
    }

    protected $_docXSL;
    function get_docXSL( $docXSL ){
        if( isset( $docXSL ) ) return $docXSL;
        if( file_exists( $this->pathXS ) ) $this->sync();
        $dir= getcwd();
        chdir( $this->dir );
        $docXSL= so_dom::make( file_get_contents( $this->pathXSL ) );
        chdir( $dir );
        return $docXSL;
    }
    function set_docXSL( $docXSL ){
        $docXSL= so_dom::create( $docXSL );
        if( file_exists( $this->pathXSL ) ) unlink( $this->pathXSL );
        file_put_contents( $this->pathXSL, $docXSL );
        return null;
    }

    protected $_processor;
    function get_processor( $processor ){
        if( isset( $processor ) ) return $processor;
        $processor= new XSLTProcessor( );
        $processor->importStyleSheet( $this->docXSL->DOMNode );
        return $processor;
    }

    function process( $doc ){
        $doc= so_dom::make( $doc );
        
        $doc= $this->processor->transformToDoc( $doc->DOMNode );
        
        return so_dom::make( $doc );
    }

    function sync( ){
        if( !file_exists( $this->pathXS ) ) return $this;
        if
        (    file_exists( $this->pathXSL )
        &&  ( filemtime( $this->pathXS ) === fileatime( $this->pathXS ) )
        ) return $this;

        $xs2xsl= new $this;
        $xs2xsl->pathXSL= __DIR__ . '/compiler/so_XStyle_compiler.xsl';
        $this->docXSL= $xs2xsl->process( $this->docXS );
        $this->docXS= $this->docXS;
        return $this;
    }

}



# so/autoload/so_autoload.php


if( !class_exists( 'so_autoload' ) ):

    class so_autoload
    {
    
        static function load( $class ){
            static $root;
            if( !$root ) $root= dirname( dirname( dirname( __FILE__ ) ) );
            
            $class= strtr( $class, array( '\\' => '_') );
            $chunks= explode( '_', $class );
            $pack= $chunks[0];
            $module= $chunks[1];
            
            $path2class= "{$class}.php";
            if( !$module ) $module= $pack;
            $path= "{$root}/{$pack}/{$module}/{$class}.php";
            
            if( file_exists( $path ) ) include_once( $path );
        }
    
    }
    
    spl_autoload_register(array( 'so_autoload', 'load' ));

endif;


# so/cookie/so_cookie.php


class so_cookie
extends so_meta
{

    static function make( $name ){
        $cookie= new so_cookie;
        $cookie->name= $name;
        return $cookie;
    }
    
    protected $_name;
    function set_name( $name ){
        if( isset( $this->name ) ) throw new Exception( 'Redeclaration of $name' );
        return $name;
    }

    protected $_expires;
    function get_expires( $expires ){
        if( isset( $expires ) ) return $expires;
        $expires= mktime( 0, 0, 0, 1, 1, 2030 );
        return $expires;
    }
    function set_expires( $expires ){
        if( isset( $this->expires ) ) throw new Exception( 'Redeclaration of $expires' );
        return $expires;
    }

    protected $_value;
    function get_value( $value ){
        return $_COOKIE[ $this->name ];
    }
    function set_value( $value ){
        $_COOKIE[ $this->name ]= $value;
        setcookie( $this->name, $value, $this->expires );
        return $value;
    }
}


# so/crypt/so_crypt.php


class so_crypt
{

    static $lexicon64= 'abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789';

    static function generateId( ){
        $symbolList= str_split( base_convert( uniqid( ), 16, 4 ), 3 );
        
        $id= '';
        foreach( $symbolList as $symbol ):
            $id.= so_crypt::$lexicon64[ intval( $symbol, 4 ) ];
        endforeach;
        
        return $id;
    }

    static function generateKey( ){
        $symbolList= str_split( base_convert( mt_rand( 1, pow( 64, 5 ) ), 10, 4 ), 3 );
        
        $key= '';
        foreach( $symbolList as $symbol ):
            $key.= so_crypt::$lexicon64[ intval( $symbol, 4 ) ];
        endforeach;
        
        return $key;
    }

}



# so/xmlResponse/so_xmlResponse.php


class so_xmlResponse
extends so_meta
{

    public $type= 'application/xml';
    public $encoding= 'utf-8';
    public $status= '';
    public $location= '';

    protected $_content;
    function get_content( $content ){
        if( isset( $content ) ) return $content;
        
        $response= array();
        
        $root= new so_WC_Root;
        $mix= $root->createPack( 'so' )->createModule( '-mix' );
        
        $response[ '!DOCTYPE' ]= array( 'name' => 'html' );
        
        $response[ '?xml-stylesheet' ]= array(
            'href' => 'so/-mix/index.xsl?' . $mix->createFile( 'index.xsl' )->version,
            'type' =>'text/xsl',
        );
        
        $response[ 'html' ]= array(
            '@xmlns' => 'http://www.w3.org/1999/xhtml',
            '@xmlns:html' => 'http://www.w3.org/1999/xhtml',
            '@xmlns:so' => 'https://github.com/nin-jin/so',
            '@xmlns:wc' => 'https://github.com/nin-jin/wc',
            'so:page' => array(
                'so:page_script' => 'so/-mix/index.js?' . $mix->createFile( 'index.js' )->version,
                'so:page_stylesheet' => 'so/-mix/index.css?' . $mix->createFile( 'index.css' )->version,
            ),
        );
        
        return so_dom::make()->append( $response );
    }
    
    function error( $error ){
        $this->status= 'error';
        $this->content->root['so:page']->append( array(
            'so:Error' => (string)$error,
        ) );
        return $this;
    }

    function ok( $content ){
        $this->status= 'ok';
        $this->content->root['so:page']->append( $content );
        return $this;
    }

    function missed( $content ){
        $this->status= 'missed';
        $this->content->root['so:page']->append( $content );
        return $this;
    }

    function found( $location ){
        $this->status= 'found';
        $this->location= $location;
        $this->content->root['so:page']->append( array(
            'so:found' => (string)$location,
        ) );
        return $this;
    }

    function moved( $location ){
        $this->status= 'moved';
        $this->location= $location;
        $this->content->root['so:page']->append( array(
            'so:moved' => (string)$location,
        ) );
        return $this;
    }

}



# so/front/so_front.php

class so_front
extends so_meta
{
    
    static $httpCodes= array(
        'ok' => 200,
        'found' => 302,
        'moved' => 301,
        'missed' => 404,
        'error' => 500,
    );
    
    protected $_namespace;
    function get_namespace( $namespace ){
        if( isset( $namespace ) ) return $namespace;
        return array();
    }
    function set_namespace( $namespace ){
        if( isset( $this->namespace ) ) throw new Exception( 'Redeclaration of $namespace' );
        if( is_string( $namespace ) ) $namespace= explode( '/', $namespace );
        return (array)$namespace;
    }
    
    protected $_request;
    function get_request( $request ){
        if( isset( $request ) ) return $request;
        
        $method= strtolower( $_SERVER[ 'REQUEST_METHOD' ] );
        $type= strtolower( $_SERVER[ 'CONTENT_TYPE' ] );
        $query= $_SERVER[ 'QUERY_STRING' ];
        
        if(( $method === 'put' )and( strpos( $type, 'application/x-www-form-urlencoded' ) === 0 )):
            $raw= '';
            $input= fopen( 'php://input', 'r' );
            while( $chunk= fread( $input, 1024 ) ) $raw.= $chunk;
            fclose( $input );
            $query.= '/' . $raw;
        endif;
        
        $data= array( '@query' => '?' . $query );
        
        $chunkList= preg_split( '![&/]!', $query );
        foreach( $chunkList as $chunk ):
            if( !$chunk ) continue;
            list( $key, $val )= explode( '=', $chunk, 2 );
            if( !preg_match( '!^\w+$!', $key ) ) continue;
            $data[ $key ]= urldecode( $val ) ?: null;
        endforeach;
        
        $data+= $_POST;
        
        foreach( $data as $key => $value ):
            $keyList= explode( '_', $key );
            $current= &$data;
            while( count( $keyList ) > 1 ):
                $current= &$current[ array_shift( $keyList ) ];
            endwhile;
            $current[ $keyList[ 0 ] ]= $value;
        endforeach;
        
        return so_dom::make(array( $method => $data ));
    }
    function set_request( $request ){
        if( isset( $this->request ) ) throw new Exception( 'Redeclaration of $request' );
        return $request;
    }

    protected $_resource;
    function get_resource( $resource ){
        if( isset( $resource ) ) return $resource;
        
        $keyList= $this->namespace;
        foreach( $this->request as $key => $value ):
            if( $key[0] == '@' ) continue;
            $keyList[]= $key;
        endforeach;
        
        while( $keyList ):
            $Class= implode( '_', $keyList );
            if( class_exists( $Class ) ) break;
            array_pop( $keyList );
        endwhile;
        
        $resource= $Class::make()->request( $this->request );
        return $resource;
    }
    
    function run( ){
        header( "Content-Type: text/html,charset=utf-8", true, 500 );
        
        $front= $this;
        register_shutdown_function( function( ) use( $front ) {
            $error= trim( ob_get_clean(), " \r\n");
            if( !$error ) return;
            $response= so_xmlResponse::make()->error( $error ) ;
            $front->send( $response );
        });
        
        $html_errors= ini_get( 'html_errors' );
        ini_set( 'html_errors', 0 );
            ob_start();
                $uri= $this->resource->uri;
                try {
                    $response= $this->resource->run();
                } catch( Exception $error ){
                    $response= $this->resource->response->error( $error );
                }
            $error= ob_get_clean();
        ini_set( 'html_errors', $html_errors );
        
        if( $error !== '' ):
            $response= $this->resource->error( $error );
        endif;
        
        if( !$response ):
            $response= $this->resource->error( 'Response is empty' );
        endif;
        
        $this->send( $response );
        
        return $this;
    }
    
    function send( $response ){
        $type= $response->type;
        $content= $response->content;
        
        if( $type === 'application/xml' ):
            if( !preg_match( '!\\b(Presto|Gecko|AppleWebKit|Trident)\\b!', $_SERVER['HTTP_USER_AGENT'] ) ):
                $type= 'text/html';
                $xs= new so_XStyle;
                $xs->pathXSL= 'so/-mix/index.xsl';
                foreach( $xs->docXSL as $key => $dom ):
                    if( $key != 'xsl:include' ) continue;
                    $dom['@href']= preg_replace( '!\?[^?]*$!', '', $dom['@href']->value );
                endforeach;
                $content= $xs->process( (string)$content );
                $type= 'text/html';
            endif;
        endif;
        
        $encoding= $response->encoding;
        $httpCode= static::$httpCodes[ $response->status ];
        header( "Content-Type: {$type}", true, $httpCode );
        
        if( $location= $response->location ):
            header( "Location: {$location}", true );
        endif;
        
        echo $content;
        
        return $this;
    }
    
}



# so/storage/so_storage.php


class so_storage
extends so_meta
{

    static $all= array();
    
    static function make( $key= '' ){
        return static::$all[ $key ] ?: static::$all[ $key ]= parent::make()->key( $key );
    }
    
    protected $_key;
    function set_key( $key ){
        if( isset( $this->key ) ) throw new Exception( 'Property [$key] is alredy defined' );
        return $key;
    }
    
    static $dir= '';
    protected $_dir;
    function get_dir( $dir ){
        if( isset( $dir ) ) return $dir;
        $key= md5( $this->key );
        $key= chunk_split( substr( $key, 0, 6 ), 3, '/' ) . substr( $key, 6 );
        #$key= strtr( $this->key, array( '?' => '', '=' => '/=', '+' => '/+' ) );
        return so_file::make( 'so/storage/data/' )->go( $key . '/' );
    }
    
    protected $_version;
    function get_version( $version ){
        if( isset( $version ) ) return $version;
        return (int) array_pop( $this->dir->childList );
    }
    
    protected $_content;
    function get_content( $content ){
        if( isset( $content ) ) return $content;
        return @file_get_contents( $this->dir->go( $this->version )->path );
    }
    function set_content( $content ){
        if( $content == $this->content ) return $content;
        $this->dir->go( $this->version + 1 )->content= $content;
        $this->_version= null;
        return $content;
    }
    
    protected $_uri;
    function get_uri( $uri ){
        return strtr( $this->dir->go( $this->version )->path, array( '~' => '%7E', '#' => '%23' ) );
    }
    
}



# so/gist/so_gist.php


class so_gist
extends so_resource
{
    
    protected $responseClass= so_xmlResponse;
    
    protected $_storage;
    function get_storage( $storage ){
        if( isset( $storage ) ) return $storage;
        return so_storage::make( $this->uri );
    }
    
    protected $_uri;
    function get_uri( $uri ){
        if( isset( $uri ) ) return $uri;
        $uri= '?gist';
        if( $this->name ) $uri.= '=' . urlencode( $this->name );
        return $uri;
    }
    
    protected $_name;
    function get_name( $name ){
        if( isset( $name ) ) return $name;
        return $this->request[ 'gist' ]->value;
    }
    function set_name( $name ){
        if( isset( $this->name ) ) throw new Exception( 'Property $name already defined' );
        return $name;
    }
    
    protected $_title;
    function get_title( $title ){
        if( isset( $title ) ) return $title;
        return $this->name ?: 'Gist!';
    }
    
    protected $_contentDefault;
    function get_contentDefault( $contentDefault ){
        if( isset( $contentDefault ) ) return $contentDefault;
        
        return so_dom::make( array( 'so:gist' => array(
            '@xmlns:so' => 'https://github.com/nin-jin/so',
            'so:gist_uri' => $this->uri,
            'so:gist_name' => $this->name,
            'so:gist_content' => '!!! ' . $this->title . "\n    ...\n",
        ) ) );
    }
    
    protected $_dom;
    function get_dom( $dom ){
        if( isset( $dom ) ) return $dom;
        
        $dom= $this->storage->version ? so_dom::make( $this->storage->content ) : $this->contentDefault;
        
        return $dom;
    }
    function set_dom( $dom ){
        $this->storage->content= $dom;
        return $dom;
    }
    
    function get( ){
        $page= array(
            'so:page_title' => $this->title,
            //'so:path' => array(
            //    $this->name ?
            //    array( 'so:path_item' => array(
            //        'so:path_title' => $this->author,
            //        'so:path_link' => so_gist::make()->author( $this->author )->uri,
            //    ) )
            //    : null,
            //),
            'so:page_aside' => array(
                123
                //'html:include' => array(
                //    '@href' => 'so/content/navigation.gist.xml',
                //),
            ),
            $this->dom,
        );
        
        if( $this->storage->version ) $this->response->ok( $page );
        else $this->response->missed( $page );
        
        return $this;
    }
    
    function delete( ){
        $this->dom= $this->contentDefault;
        $this->get();
        return $this;
    }

    function put( ){
        
        $dom= $this->dom;
        $dom[ 'so:gist_content' ]= $this->request[ 'content' ]->value;
        $this->dom= $dom;
        
        $this->get();
        
        return $this;
    }

}



# so/gist/so_gist_all.php


class so_gist_all
extends so_resource
{

    protected $responseClass= so_xmlResponse;
    
    protected $_uri;
    function get_uri( $uri ){
        if( isset( $uri ) ) return $uri;
        return '?gist/all';
    }
    
    function get( ){
        $root= new so_WC_Root;
        $files= $root->createPack( 'so' )->createModule( 'content' )->selectFiles( '/\\.gist\\.xml$/' );
        $content= array(
            'so:path' => array(
                array( 'so:path_item' => array(
                    'so:path_title' => 'Записи',
                    'so:path_link' => '?gist/all',
                ) ),
            ),
            'so:gist_creator' => array(
                'so:gist_name' => $this->request['gist']->value,
                'so:gist_author' => $this->request['author']->value,
            ),
        );
        foreach( $files as $file ):
            $content[]= array(
                so_gist::make()->file( $file )->data,
                //'html:include' => array(
                //    '@href' => $file->id . '?' . $file->version,
                //),
            );
        endforeach;
        
        $this->response->ok( $content );
        
        return $this;
    }
    
}



# so/gist/so_gist_list.php


class so_gist_list extends so_meta {
    
    static function create( $request ){
        $obj= new self;
        $obj->request= $request;
        return $obj;
    }
    
    protected $_request;
    function set_request( $request ){
        if( isset( $this->request ) ) throw new Exception( 'Redeclaration of $request' );
        return $request;
    }
    
    protected $_response;
    function get_response( $response ){
        if( isset( $response ) ) return $response;
        return so_xmlResponse::create();
    }
    
    protected $_uri;
    function get_uri( $uri ){
        if( isset( $uri ) ) return $uri;
        return '?so/list';
    }
    
    function get( ){
        $response= array(
            'so:gist_Creator' => array(
                'so:gist_name' => (string)$this->request['gist']->value,
            )
        );
        
        $root= new so_WC_Root;
        $files= $root->createPack( 'so' )->createModule( 'content' )->selectFiles( '/\\.gist\\.xml$/' );
        foreach( $files as $file ):
            $name= preg_replace( '/\\.gist\\.xml$/', '', $file->name );
            $response[]= array(
                'a' => array(
                    '@href' => '?so/gist=' . $name,
                    $name,
                )
            );
        endforeach;
        
        return so_xmlResponse::ok( $response );
    }
    
}



# so/htmlResponse/so_htmlResponse.php


class so_htmlResponse
extends so_meta
{

    public $type= 'text/html';
    public $encoding= 'utf-8';
    public $status= '';
    public $location= '';
    public $content= '';
    
    function error( $error ){
        $this->status= 'error';
        $this->content= "Error: {$error}";
    }

    function ok( $content ){
        $this->status= 'ok';
        $this->content= $content;
    }

    function found( $location ){
        $this->status= 'found';
        $this->location= $location;
        $this->content= "Found: {$location}";
    }

}



# so/phpinfo/so_phpinfo.php


class so_phpinfo
extends so_resource
{
    
    protected $responseClass= so_htmlResponse;
    
    protected $_uri;
    function get_uri( $uri ){
        if( isset( $uri ) ) return $uri;
        $uri= '?phpinfo';
        return $uri;
    }
    
    function get( ){
        ob_start();
        phpinfo();
        $html= ob_get_clean();
        $this->response->ok( $html );
        return $this;
    }
    
}



# so/textResponse/so_textResponse.php


class so_textResponse
extends so_meta
{

    public $type= 'text/plain';
    public $encoding= 'utf-8';
    public $status= '';
    public $location= '';
    public $content= '';
    
    function error( $error ){
        $this->status= 'error';
        $this->content= "Error: {$error}";
    }

    function ok( $content ){
        $this->status= 'ok';
        $this->content= $content;
    }

    function found( $location ){
        $this->status= 'found';
        $this->location= $location;
        $this->content= "Found: {$location}";
    }

}



# so/user/so_user.php


class so_user
extends so_meta
{

    protected $_id;
    function get_id( $id ){
        if( isset( $id ) ) return $id;
        
        $cookie= so_cookie::make( 'so_user_id' );
        
        $id= $cookie->value;
        
        if( !$id ):
            $id= so_crypt::generateId();
            $cookie->value= $id;
        endif;
        
        return $id;
    }
    function set_id( $id ){
        if( isset( $this->id ) ) throw new Exception( 'Redeclaration of $id' );
        return $id;
    }

    protected $_key;
    function get_key( $key ){
        if( isset( $key ) ) return $key;
        
        $cookie= so_cookie::make( 'so_user_key' );
        
        $key= $cookie->value;
        
        if( !$key ):
            $key= so_crypt::generateKey();
            $cookie->value= $key;
        endif;
        
        return $key;
    }
    function set_key( $key ){
        so_cookie::make( 'so_user_key' )->value= $key;
        return $key;
    }

}


