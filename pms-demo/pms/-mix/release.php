<?php namespace pms;

// ../../so/autoload/so_autoload.php 


if( !class_exists( 'so_autoload' ) ):

    class so_autoload
    {
    
        static function load( $class ){
            static $root;
            if( !$root ) $root= dirname( dirname( dirname( __FILE__ ) ) );
            
            $class= strtr( $class, array( '\\' => '_') );
            $chunks= explode( '_', $class );
            
            $pack= $chunks[0];
            $module= &$chunks[1];
            if( !$module ) $module= $pack;
            
            $path2class= "{$class}.php";
            $path= "{$root}/{$pack}/{$module}/{$class}.php";
            
            if( file_exists( $path ) ) include_once( $path );
        }
    
    }
    
    spl_autoload_register(array( __NAMESPACE__ . '\\so_autoload', 'load' ));

endif;

// ../../so/array/so_array.php 


class so_array
extends \ArrayObject
{
    use so_meta;
    
    static function make( $array ){
        return new static( $array );
    }

    static function ensure( &$value ){
        return $value= static::make( $value );
    }
    
    function _string_meta( ){
        $string= '';
        
        foreach( $this as $key => $val ):
            if( is_string( $key ) )
                $key= "'" . strtr( $key, array( "'" => "\'", "\n" => "\\n" ) ) . "'";
            
            if( is_array( $val ) )
                $val= (string) so_array::make( $val );
            
            if( is_string( $val ) )
                $val= "'" . strtr( $val, array( "'" => "\'", "\n" => "\\n" ) ) . "'";
            
            if( is_bool( $val ) )
                $val= $val ? 'TRUE' : 'FALSE';
            
            if( is_null( $val ) )
                $val= 'NULL';
            
            $string.= $key . " => " .  trim( $val, "\n" ) . "\n";
        endforeach;
        
        $string= preg_replace( '~^~m', '    ', $string );
        $string= "array(\n" . $string . ")\n";
            
        return $string;
    }
}

// ../../so/meta/so_meta.php 


trait so_meta {
    
    static function className( ){
        return get_class();
    }
    
    function __get( $name ){
        $valueField= $name . '_value';
        if( !property_exists( $this, $valueField ) )
            return $this->_make_meta( $name );
        
        $value= &$this->{ $valueField };
        if( isset( $value ) )
            return $value;
        
        $makeMethod= $name . '_make';
        if( !method_exists( $this, $makeMethod ) )
            return $value;
        
        return $value= $this->{ $makeMethod }();
    }
    function _make_meta( $name ){
        throw new \Exception( "Property [$name] is not defined in (" . get_class( $this ) . ")" );
    }
    
    function __isset( $name ){
        $valueField= $name . '_value';
        if( !property_exists( $this, $valueField ) )
            return false;
        
        return isset( $this->{ $valueField } );
    }
    
    function __set( $name, $value ){
        $valueField= $name . '_value';
        if( !property_exists( $this, $valueField ) )
            return $this->_store_meta( $name, $value );
        
        $storeMethod= $name . '_store';
        if( !method_exists( $this, $storeMethod ) )
            throw new \Exception( "Property [$name] is read only" );
        
        $dependsField= $name . '_depends';
        $depends= property_exists( $this, $dependsField ) ? $this->{ $dependsField } : array( $name );
        
        foreach( $depends as $prop ):
            if( !isset( $this->{ $prop } ) ) continue;
            throw new \Exception( "Property [$name] can not be stored because [$prop] is defined" );
        endforeach;
        
        $this->{ $valueField }= $this->{ $storeMethod }( $value );
        
        return $this;
    }
    function _store_meta( $name, $value ){
        throw new \Exception( "Property [$name] is not defined in (" . get_class( $this ) . ")" );
    }
    
    function __unset( $name ){
        $valueField= $name . '_value';
        
        if( !property_exists( $this, $valueField ) )
            return $this->_drop_meta( $name );
        
        $this->{ $valueField }= null;
        
        return $this;
    }
    function _drop_meta( $name ){
        throw new \Exception( "Property [$name] is not defined in (" . get_class( $this ) . ")" );
    }
    
    function __call( $name, $args ){
        if( !property_exists( $this, $name . '_value' ) )
            return $this->_call_meta( $name, $args );
        
        $count= count( $args );
        
        switch( $count ):
            case 0: return $this->__get( $name );
            case 1: return $this->__set( $name, $args[ 0 ] );
        endswitch;
        
        throw new \Exception( "Wrong arguments count ($count)" );
    }
    
    function _call_meta( $name, $args ){
        throw new \Exception( "Method [$name] is not defined in (" . get_class( $this ) . ")" );
    }
    
    function _string_meta( $prefix= '' ){
        $string= '';
        
        foreach( get_object_vars( $this ) as $key => $val ):
            $key= preg_replace( '~_value$~', '', $key );
            
            if( preg_match( '~_depends$~', $key ) )
                continue;
            
            $key= $prefix . $key;
            
            if( is_array( $val ) )
                $val= so_array::make( $val );
            
            if( is_string( $val ) )
                $val= "'" . strtr( $val, array( "'" => "\'", "\n" => "\\n" ) ) . "'";
            
            if( is_bool( $val ) )
                $val= $val ? 'TRUE' : 'FALSE';
            
            if( is_null( $val ) )
                $val= 'NULL';
            
            $string.= $key . '= ' . trim( $val, "\n" ) . "\n";// . '=' . $key . "\n";
        endforeach;
        
        $string= preg_replace( '~^~m', '    ', $string );
        
        return get_class( $this ) . " {\n" . $string . "}\n";
    }
    
    function __toString( ){
        static $processing;
        
        if( $processing )
            return '@';
        
        $processing= true;
        
        try {
            $string= (string) $this->_string_meta();
        } catch( \Exception $exception ){
            echo $exception;
            $string= '#';
        }
        
        $processing= false;
        return $string;
    }

    function destroy( ){
        $vars= get_object_vars( $this );
        
        foreach( $vars as $name => $value )
            unset( $this->$name );
    }
    
}


// ../../so/factory/so_factory.php 


trait so_factory {
    
    static function make( ){
        return new static;
    }
    
}


// ../../so/singleton/so_singleton.php 


trait so_singleton
{
    use so_factory {
        so_factory::make as makeInstance;
    }

    static $all= array();
    
    static function make( ){
        $obj= end( static::$all );
        
        if( $obj === false )
            $obj= static::$all[]= static::makeInstance();
        
        return $obj;
    }
    
}

// ../../so/registry/so_registry.php 


trait so_registry
{
    use so_factory {
        so_factory::make as makeInstance;
    }

    static $all= array();
    #static $id_prop= 'id';
    
    static function make( $id= null ){
        if( $id instanceof static )
            $id= $id->{ static::$id_prop };
        
        $cached= &static::$all[ (string) $id ];
        if( $cached ) return $cached;
        
        $obj= static::makeInstance();
        $obj->{ static::$id_prop }= $id;
        $cached2= &static::$all[ (string) $obj->{ static::$id_prop } ];
        
        if( !$cached2 ) $cached2= $obj;
        $cached= $cached2;
        
        return $cached;
    }
    
    static function ensure( &$value ){
        return $value= static::make( $value );
    }
    
    function primary( ){
        $cache= &static::$all[ (string) $this->{ static::$id_prop } ];
        if( !$cache ) $cache= $this;
        return $cache;
    }
    
}

// ../../so/value/so_value.php 


class so_value
{

    static function make( &$val ){
        return $val;
    }

}

// ../../so/Tree/so_Tree.php 


class so_Tree
{
    use so_meta;
    use so_factory;

    static $separatorOfChunks= "\n";
    static $separatorOfPair= "= ";
    static $separatorOfKeys= " ";
    static $indentationToken= "    ";

    var $struct_value;
    function struct_make( ){
        return array();
    }
    function struct_store( $data ){
        return (array) $data;
    }

    var $string_value;
    function string_make( ){
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
            
            $chunk= implode( str_pad( " ", strlen( staic::separatorOfKeys ) ), $prefix );
            $chunk.= implode( static::$separatorOfKeys, $actualKeyList );
            $chunk.= static::$separatorOfPair . $value;
            $lastKeyList= $keyList;
            $chunkList[]= $chunk;
        endforeach;

        $val= implode( static::$separatorOfChunks, $chunkList );
        return $val;
    }
    function string_store( $val ){
        $chunkList= explode( static::$separatorOfChunks, $val );
        $struct= array();
        $lastKeyList= array();
        foreach( $chunkList as $chunk ):
            
            $pair= explode( static::$separatorOfPair, $chunk, 2 );
            
            $keyList= explode( static::$indentationToken, $pair[0] );
            $keyListTail= array_pop( $keyList );
            if( $keyListTail ):
                $keyListTail= explode( static::$separatorOfKeys, $keyListTail );
                $keyList= array_merge( $keyList, $keyListTail );
            endif;
            
            foreach( $keyList as $index => &$key ):
                if( !$key ) $key= $lastKeyList[ $index ];
            endforeach;
            $lastKeyList= $keyList; 
            
            $keyList[]= so_value::make( $pair[1] );
            $struct[]= $keyList;

        endforeach;
        $this->struct= $struct;
        return null;
    }
    
    function get( $keyList ){
        if( is_string( $keyList ) ) $keyList= explode( static::$separatorOfKeys, $keyList );
        if( !is_array( $keyList ) ) throw new \Exception( 'Wrong path type' );
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


// ../../so/iterator/so_iterator.php 

class so_iterator
implements \Iterator
{
    use so_meta;
    use so_factory;

    var $collection_value;
    function collection_make( ){
        throw new \Exception( 'Property [collection] is not defined' );
    }
    function collection_store( $value ){
        return $value;
    }

    var $keyList_value;
    function keyList_make( ){
        return array_keys( $this->collection->list );
    }

    var $ArrayIterator_value;
    function ArrayIterator_make( ){
        return new \ArrayIterator( $this->keyList );
    }
    
    function current( ){
        return $this->collection[ $this->key() ];
    }
    
    function key( ){
        return $this->ArrayIterator->current();
    }
    
    function next( ){
        $this->ArrayIterator->next();
        return $this;
    }
    
    function rewind( ){
        $this->ArrayIterator->rewind();
        return $this;
    }
    
    function valid( ){
        return $this->ArrayIterator->valid();
    }

}


// ../../so/collection/so_collection.php 


trait so_collection
#implements \Countable, \ArrayAccess, \IteratorAggregate
{
    #use so_meta;
    
    static function make( $list= null ){
        if( $list instanceof static )
            return $list;
        
        $obj= new static;
        
        if( isset( $list ) )
            $obj->list( $list );
        
        return $obj;
    }
    
    static function ensure( &$value ){
        return $value= static::make( $value );
    }
    
    var $list_value;
    function list_make( ){
        return array();
    }
    function list_store( $list ){
        return (array) $list;
    }
    
    function count( ){
        return count( $this->list );
    }

    function offsetExists( $key ){
        return isset( $this->list[ $key ] );
    }
    
    function offsetGet( $key ){
        return $this->list[ $key ];
    }
    
    function offsetSet( $key, $value ){
        throw new \Exception( 'Collection is read only' );
    }
    
    function offsetUnset( $key ){
        throw new \Exception( 'Collection is read only' );
    }
    
    function getIterator( ){
        return so_iterator::make()->collection( $this );
    }
    
}


// ../../so/dom/so_dom.php 

class so_dom
implements \Countable, \ArrayAccess, \IteratorAggregate
{
    use so_meta;

    static function make( $DOMNode= null, $base= null ){
        
        if( !isset( $DOMNode ) )
            return new static;
        
        if( $DOMNode instanceof so_dom )
            return $DOMNode;
        
        $obj= new static;
        
        if( $DOMNode instanceof \DOMNode )
            return $obj->DOMNode( $DOMNode );
        
        if( $DOMNode instanceof so_file ):
            if( !$base )
                $base= (string) $DOMNode->parent;
            $DOMNode= (string) $DOMNode->content;
        endif;
        
        if( is_string( $DOMNode ) ):
            $dir= getcwd();
            chdir( $base ?: (string) so_front::make()->dir );
            $doc= new \DOMDocument( '1.0', 'utf-8' );
            $doc->loadXML( $DOMNode, LIBXML_COMPACT );
            chdir( $dir );
            return $obj->DOMNode( $doc->documentElement );
        endif;
        
        if( $DOMNode instanceof SimpleXMLElement )
            return $obj->DOMNode( dom_import_simplexml( $DOMNode ) );
        
        if( is_array( $DOMNode ) ):
            $obj[]= $DOMNode;
            return $obj->root;
        endif;
        
        throw new \Exception( 'Unsupported type of argument' );
    }
    
    static function ensure( &$value ){
        return $value= static::make( $value );
    }
    
    var $mime= 'application/xml';
    var $extension= 'xml';

    var $DOMNode_value;
    function DOMNode_make( ){
        return new \DOMDocument( '1.0', 'utf-8' );
    }
    function DOMNode_store( $value ){
        return $value;
    }

    var $DOMDocument_value;
    function DOMDocument_make( ){
        $DOMNode= $this->DOMNode;
        $DOMDocument= $DOMNode->ownerDocument;
        if( $DOMDocument ) return $DOMDocument;
        return $DOMNode;
    }
    
    var $doc_value;
    function doc_make( ){
        return so_dom::make( $this->DOMDocument );
    }

    var $root_value;
    function root_make( ){
        $rootElement= $this->DOMDocument->documentElement;
        if( !$rootElement ) throw new \Exception( "Document have not a root element" );
        return so_dom::make( $rootElement );
    }

    function _string_meta( ){
        return $this->DOMDocument->saveXML( $this->DOMNode );
    }
    
    var $name_value;
    function name_make( ){
        return $this->DOMNode->nodeName;
    }

    var $value_value;
    function value_make( ){
        return $this->DOMNode->nodeValue;
    }
    
    var $parent_value;
    function parent_make( ){
        $parent= $this->DOMNode->parentNode;
        if( !$parent ) return null;
        return so_dom::make( $parent );
    }
    function parent_store( $parent ){
        if( $parent ):
            $parent= so_dom::make( $parent );
            $parent[]= $this;
            return $parent;
        else:
            $DOMNode= $this->DOMNode;
            $DOMNode->parentNode->removeChild( $DOMNode );
        endif;
    }

    var $childs_value;
    function childs_make( ){
        $list= array();
        foreach( $this->DOMNode->childNodes as $node )
            $list[]= $node;
        return so_dom_collection::make( $list );
    }

    var $attrs_value;
    function attrs_make( ){
        $list= array();
        foreach( $this->DOMNode->attributes as $node )
            $list[]= $node;
        return so_dom_collection::make( $list );
    }

    function select( $query ){
        $xpath = new domxPath( $this->DOMDocument );
        $found= $xpath->query( $query, $this->DOMNode );
        $nodeList= array();
        foreach( $found as $node ):
            $nodeList[]= $node;
        endforeach;
        return so_dom_collection::make( $nodeList );
    }
    
    function drop( ){
        $DOMNode= $this->DOMNode;
        $DOMNode->parentNode->removeChild( $DOMNode );
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
        
        return isset( $this->child[ $key ] );
    }
    
    function offsetGet( $key ){
        if( $key[0] === '@' ):
            $name= substr( $key, 1 );
            return $this->DOMNode->getAttribute( $name );
        endif;
        
        $list= array();
        foreach( $this->child as $item ):
            if( $item->name != $key ) continue;
            $list= array_merge( $list, $item->childs->list );
        endforeach;
        
        return so_dom_collection::make( $list );
    }
    
    function offsetSet( $key, $value ){
        if( !$key ):
            if( !isset( $value ) )
                return $this;
            
            $DOMNode= $this->DOMNode;
            
            if( is_scalar( $value ) ):
                $value= $this->DOMDocument->createTextNode( $value );
                $DOMNode->appendChild( $value );
                return $this;
            endif;
            
            if( is_object( $value ) ):
                if( $value instanceof SimpleXMLElement ):
                    $value= dom_import_simplexml( $value );
                    $DOMNode->appendChild( $value );
                    return $this;
                endif;
                
                if( isset( $value->DOMNode ) ):
                    $value= $value->DOMNode;
                endif;
                
                if( $value instanceof \DOMDocument ):
                    foreach( $value->childNodes as $node ):
                        $this[]= $node;
                    endforeach;
                    return $this;
                endif;
                
                if( $value instanceof \DOMNode ):
                    $value= $this->DOMDocument->importNode( $value->cloneNode( true ), true );
                    $DOMNode->appendChild( $value );
                return $this;
                endif;
            endif;
            
            foreach( $value as $key => $value ):
                
                if( is_int( $key ) ):
                    $this[]= $value;
                    continue 1;
                endif;
                
                if( $key[0] === '#' ):
                    if( !is_scalar( $value ) ):
                        $value= (string) so_dom::make( $value );
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
                            
                    throw new \Exception( "Wrong special element name [{$key}]" );
                endif;
                        
                if( $key[0] === '@' ):
                    $name= substr( $key, 1 );
                    
                    if( !is_scalar( $value ) ):
                        $value= (string) so_dom::make( $value );
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
                    $public= &$value[ 'public' ];
                    $system= &$value[ 'system' ];
                    
                    $implementation= $this->DOMDocument->implementation;
                    $content= $implementation->createDocumentType( $value[ 'name' ], $public, $system );
                    $DOMNode->appendChild( $content ); // FIXME: не работает =(
                    continue 1;
                endif;
                
                $keys= explode( '/', $key );
                while( count( $keys ) > 1 )
                    $value= array( array_pop( $keys ) => $value );
                $key= $keys[0];
                
                $element= $this->DOMDocument->createElement( $key );
                so_dom::make( $element )[]= $value;
                $DOMNode->appendChild( $element );
            endforeach;
            return $this;
        endif;
        
        if( $key[0] === '@' ):
            $name= substr( $key, 1 );
            $this->DOMNode->setAttribute( $name, $value );
            return $this;
        endif;
        
        $this->childs[ $key ]->parent= null;
        
        $this[]= array( $key => $value );
        return $this;
    }
    
    function offsetUnset( $key ){
        if( $key[0] === '@' ):
            $name= substr( $key, 1 );
            $this->DOMNode->removeAttribute( $name );
            return $this;
        endif;

        $this->child[ $key ]->parent= null;
        
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
        
        return so_dom_collection::make( $list )->getIterator();
    }
    
}


// ../../so/dom/so_dom_collection.php 

class so_dom_collection
implements \Countable, \ArrayAccess, \IteratorAggregate
{
    use so_meta;
    use so_collection;
    
    var $parent_value;
    function parent_make( ){
        $list= array();
        foreach( $this as $item ):
            $list[]= $item->parent;
        endforeach;
        return so_dom_collection::make( $list );
    }
    function parent_store( $parent ){
        foreach( $this as $item ):
            $item->parent= $parent;
        endforeach;
    }

    function offsetExists( $key ){
        if( is_int( $key ) ):
            return isset( $this->list[ $key ] );
        endif;
        
        foreach( $this as $item ):
            if( $item->name !== $key ) continue;
            return true;
        endforeach;
        
        return false;
    }
    
    function offsetGet( $key ){
        if( is_int( $key ) ):
            return $this->list_value[ $key ]= so_dom::make( $this->list[ $key ] );
        endif;
        
        $list= array();
        foreach( $this as $item ):
            if( $item->name != $key ) continue;
            $list[]= $item;
        endforeach;
        
        return so_dom_collection::make( $list );
    }
    
    function offsetSet( $key, $value ){
        if( is_int( $key ) ):
            $this->list[ $key ]->content= $value;
            return $this;
        endif;
        throw new \Exception( 'Not implemented yet' );
        $list= array();
        foreach( $this as $item ):
            if( $item->name != $key ) continue;
            $list= array_merge( $list, $item->childs->list );
        endforeach;
        
        return $this;
    }
    
    function offsetUnset( $key ){
        if( is_int( $key ) ):
            $this->list[ $key ]->parent= null;
            return $this;
        endif;
        
        $this[ $key ]->parent= null;
        
        return $this;
    }
    
    function _string_meta( ){
        $string= '';
        
        foreach( $this as $item )
            $string.= $item;
        
        return $string;
    }
    
}


// ../../so/source/so_source.php 


class so_source
{
    use so_meta;
    
    use so_registry {
        so_registry::make as makeAdapter;
    }
    static $id_prop= 'file';
    
    static function make( $file ){
        so_file::ensure( $file );
        $nameList= $file->nameList;
        
        while( $nameList ):
            array_shift( $nameList );
            $className= __NAMESPACE__ . '\\' . ( $nameList ? 'so_source__' . implode( '_', $nameList ) : 'so_source' );
            if( class_exists( $className ) )
                return $className::makeAdapter( $file );
        endwhile;
        
        throw new \Exception( "Can not make (so_source) for [{$file}]" );
    }
    
    var $file_value;
    function file_make( ){
        throw new \Exception( 'Property [file] is not defined' );
    }
    function file_store( $data ){
        return so_file::make( $data );
    }
    
    var $uri_value;
    function uri_make( ){
        return $this->file->uri;
    }
    
    var $name_value;
    function name_make( ){
        return $this->file->name;
    }
    
    var $extension_value;
    function extension_make( ){
        return $this->file->extension;
    }
    
    var $content_value;
    function content_make( ){
        return $this->file->content;
    }
    function content_store( $data ){
        return $this->file->content= $data;
    }
    
    var $root_value;
    function root_make( ){
        return $this->module->root;
    }
    
    var $package_value;
    function package_make( ){
        return $this->module->package;
    }
    
    var $module_value;
    function module_make( ){
        return so_module::make( $this->file->parent );
    }
    
    var $sources_value;
    function sources_make( ){
        return so_source_collection::make(array( (string) $this->file => $this ));
    }
    
    var $exists_value;
    function exists_make( ){
        return $this->file->exists;
    }

    var $version_value;
    function version_make( ){
        return $this->file->version;
    }
    
    var $uses_value;
    function uses_make( ){
        return so_module_collection::make();
    }
    
}

// ../../so/source/so_source__jam_js.php 


class so_source__jam_js
extends so_source
{

    var $uses_value;
    function uses_make( ){
        $root= $this->root;
        $package= $this->package;
        
        preg_match_all
        (   '/\$([a-zA-Z0-9]+)(?:[._]([a-zA-Z0-9]+))?(?![a-zA-Z0-9$])/'
        ,   $this->file->content
        ,   $matches
        ,   PREG_SET_ORDER
        );
        
        $uses= array();
        
        $mainModule= $package[ $package->name ];
        if( $mainModule->exists )
            $uses+= $mainModule->modules->list;
        
        if( $matches ) foreach( $matches as $item ):
            list( $str, $packName )= $item;
            $moduleName= so_value::make( $item[2] );
            if( !$moduleName )
                $moduleName= $packName;
            
            $module= $root[ $packName ][ $moduleName ];
            if( $module === $this->module )
                continue;
            if( !$module->exists )
                throw new \Exception( "Module [{$module->dir}] not found for [{$this->file}]" );
            
            $uses+= $module->modules->list;
        endforeach;
        
        $uses+= $this->module->modules->list;
        
        return so_module_collection::make( $uses );
    }

    function uriJS_make( ){
        return $this->file->uri;
    }

    function contentJS_make( ){
        return $this->file->content;
    }

}

// ../../so/source/so_source__meta_tree.php 


class so_source__meta_tree
extends so_source
{

    var $uses_value;
    function uses_make( ){
        
        $meta= new so_Tree;
        $meta->string= $this->file->content;
        
        $depends= array();
        
        foreach( $meta->get( 'include pack' ) as $packageId ):
            $package= $this->root[ trim( $packageId ) ];
            
            if( !$package->exists )
                throw new \Exception( "Pack [{$package->dir}] not found for [{$this->file}]" );
            
            $depends+= $package->modules->list;
        endforeach;
        
        foreach( $meta->get( 'include module' ) as $moduleId ):
            $names= explode( '/', trim( $moduleId ) );
            
            if( !isset( $names[ 1 ] ) )
                array_push( $names, $this->package->name );
            
            $module= $this->root[ $names[0] ][ $names[1] ];
            if( !$module->exists )
                throw new \Exception( "Module [{$module->dir}] not found for [{$this->file}]" );
            
            $depends+= $module->modules->list;
        endforeach;
        
        return so_module_collection::make( $depends );
    }

}

// ../../so/source/so_source__php.php 


class so_source__php
extends so_source
{

    var $uses_value;
    function uses_make( ){
        
        preg_match_all
        (   '/\b(?:extends|implements|use|new)\s+([a-zA-Z0-9]+)_([a-zA-Z0-9]+)/'
        ,   $this->file->content
        ,   $matches1
        ,   PREG_SET_ORDER
        );
        
        preg_match_all
        (   '/\b([a-zA-Z0-9]+)_([a-zA-Z0-9]+)\w*::/'
        ,   $this->file->content
        ,   $matches2
        ,   PREG_SET_ORDER
        );
        
        $matches= array_merge( $matches1, $matches2 );
        
        $depends= array();
        if( $matches ) foreach( $matches as $item ):
            list( $str, $packName, $moduleName )= $item;
            
            $module= $this->root[ $packName ][ $moduleName ];
            if( !$module->exists )
                throw new \Exception( "Module [{$module->dir}] not found for [{$this->file}]" );
            
            $depends+= $module->modules->list;
        endforeach;
        
        return so_module_collection::make( $depends );
    }

}

// ../../so/source/so_source__xsl.php 


class so_source__xsl
extends so_source
{

    var $uses_value;
    function uses_make( ){
        
        preg_match_all
        (   '/<([a-zA-Z0-9]+)_([a-zA-Z0-9-]+)/'
        ,   $this->file->content
        ,   $matches1
        ,   PREG_SET_ORDER
        );
        
        preg_match_all
        (   '/ ([a-zA-Z0-9]+)_([a-zA-Z0-9-]+)[\w-]*=[\'"]/'
        ,   $this->file->content
        ,   $matches2
        ,   PREG_SET_ORDER
        );
        
        $matches= array_merge( $matches1, $matches2 );
        
        $depends= array();
        if( $matches ) foreach( $matches as $item ):
            list( $str, $packName, $moduleName )= $item;
            
            $module= $this->root[ $packName ][ $moduleName ];
            if( !$module->exists )
                throw new \Exception( "Module [{$module->dir}] not found for [{$this->file}]" );
            
            $depends+= $module->modules->list;
        endforeach;
        
        return so_module_collection::make( $depends );
    }

    function content_make( ){
        return so_dom::make( $this->file->content );
    }

}

// ../../so/source/so_source_collection.php 


class so_source_collection
implements \Countable, \ArrayAccess, \IteratorAggregate
{
    use so_meta;
    use so_collection;
    
    var $uses_value;
    function uses_make( ){
        $list= array();
        
        foreach( $this as $source )
            $list+= $source->uses->list;
        
        return so_module_collection::make( $list );
    }
    
    var $sources_value;
    function sources_make( ){
        return $this;
    }
    
}


// ../../so/module/so_module.php 


class so_module
implements \ArrayAccess
{
    use so_meta;
    
    use so_registry;
    static $id_prop= 'dir';
    
    var $dir_value;
    function dir_make( ){
        throw new \Exception( 'Property [dir] is not defined' );
    }
    function dir_store( $data ){
        return so_file::make( $data );
    }
    
    var $name_value;
    function name_make( ){
        return $this->dir->name;
    }
    
    var $root_value;
    function root_make( ){
        return $this->package->root;
    }
    
    var $package_value;
    function package_make( ){
        return so_package::make( $this->dir->parent );
    }
    
    var $modules_value;
    function modules_make( ){
        return so_module_collection::make(array( (string) $this->dir => $this ));
    }
    
    var $sources_value;
    function sources_make(){
        $list= array();
        
        foreach( $this->dir->childs as $child ):
            if( $child->type != 'file' )
                continue;
            $source= $this[ $child->name ];
            $list+= $source->sources->list;
        endforeach;
        
        return so_source_collection::make( $list );
    }
    
    var $exists_value;
    function exists_make( ){
        return $this->dir->exists;
    }

    var $version_value;
    function version_make( ){
        $version= '';
        
        foreach( $this->sources as $source )
            if( ( $v= $source->version ) > $version )
                $version= $v;
        
        return $version;
    }
    
    var $uses_value;
    function uses_make( ){
        return $this->sources->uses;
    }
    
    function offsetExists( $name ){
        return $this->dir->go( $name )->exists;
    }
    
    function offsetGet( $name ){
        return so_source::make( $this->dir->go( $name ) );
    }

    function offsetSet( $name, $value ){
        throw new \Exception( "Not implemented" );
    }

    function offsetUnset( $name ){
        throw new \Exception( "Not implemented" );
    }

}

// ../../so/module/so_module_collection.php 


class so_module_collection
implements \Countable, \ArrayAccess, \IteratorAggregate
{
    use so_meta;
    use so_collection;
    
    var $sources_value;
    function sources_make( ){
        $list= array();
        
        foreach( $this as $module )
            $list+= $module->sources->list;
        
        return so_source_collection::make( $list );
    }
    
    var $depends_value;
    function depends_make( ){
        $out= array();
        
        foreach( $this as $inId => $in ):
            if( isset( $out[ $inId ] ) ) continue;
            $mark= array( $inId => $in );
            
            while( $mark ):
                end( $mark );
                list( $curId, $cur )= each( $mark );
                
                foreach( $cur->uses as $depId => $dep ):
                    if( isset( $out[ $depId ] ) ) continue;
                    if( isset( $mark[ $depId ] ) ) continue;
                    
                    $mark[ $depId ]= $dep;
                    continue 2;
                endforeach;
                
                $out[ $curId ]= $cur;
                unset( $mark[ $curId ] );
            endwhile;
        endforeach;
        
        return so_module_collection::make( $out );
    }
    
}


// ../../so/package/so_package.php 


class so_package
implements \ArrayAccess
{
    use so_meta;
    
    use so_registry;
    static $id_prop= 'dir';
    
    var $dir_value;
    function dir_make( ){
        throw new \Exception( 'Property [dir] is not defined' );
    }
    function dir_store( $data ){
        return so_file::make( $data );
    }
    
    var $name_value;
    function name_make( ){
        return $this->dir->name;
    }
    
    var $exists_value;
    function exists_make( ){
        return $this->dir->exists;
    }

    var $root_value;
    function root_make( ){
        return so_root::make( $this->dir->parent );
    }
    
    var $packages_value;
    function packages_make( ){
        return so_package_collection::make(array( (string) $this->dir => $this ));
    }
    
    var $modules_value;
    function modules_make(){
        $list= array();
        
        foreach( $this->dir->childs as $child ):
            if( $child->type != 'dir' )
                continue;
            $module= $this[ $child->name ];
            $list+= $module->modules->list;
        endforeach;
        
        return so_module_collection::make( $list );
    }
    
    var $sources_value;
    function sources_make( ){
        return $this->modules->sources;
    }
    
    var $depends_value;
    function depends_make( ){
        return $this->modules->depends;
    }
    
    var $version_value;
    function version_make( ){
        $version= '';
        
        foreach( $this->modules as $module )
            if( ( $v= $module->version ) > $version )
                $version= $v;
        
        return $version;
    }
    
    function offsetExists( $name ){
        return $this->dir->go( $name )->exists;
    }
    
    function offsetGet( $name ){
        return so_module::make( $this->dir->go( $name ) );
    }

    function offsetSet( $name, $value ){
        throw new \Exception( "Not implemented" );
    }

    function offsetUnset( $name ){
        throw new \Exception( "Not implemented" );
    }

}

// ../../so/package/so_package_collection.php 


class so_package_collection
implements \Countable, \ArrayAccess, \IteratorAggregate
{
    use so_meta;
    use so_collection;
    
    function list_store( $list ){
        $list= (array) $list;
        
        foreach( $list as $key => $package ):
            if( !is_numeric( $key ) )
                continue;
            unset( $list[ $key ] );
            $package= so_package::make( $package );
            $list+= $package->packages->list;
        endforeach;
        
        return $list;
    }
    
    var $modules_value;
    function modules_make( ){
        $list= array();
        
        foreach( $this as $package )
            $list+= $package->modules->list;
        
        return so_module_collection::make( $list );
    }
    
    var $sources_value;
    function sources_make( ){
        return $this->modules->sources;
    }
    
    var $depends_value;
    function depends_make( ){
        return $this->modules->depends;
    }
    
}


// ../../so/XStyle/so_XStyle.php 


class so_XStyle
{
    use so_meta;
    use so_factory;

    var $dir_value;
    function dir_make( ){
        return dirname( $this->pathXSL );
    }

    var $pathXS_value;
    var $pathXS_depends= array( 'pathXS', 'pathXSL' );
    function pathXS_store( $pathXS ){
        return realpath( $pathXS );
    }
    
    var $pathXSL_value;
    var $pathXSL_depends= array( 'pathXS', 'pathXSL' );
    function pathXSL_make( ){
        return preg_replace( '!\.xs$!i', '.xsl', $this->pathXS );
    }
    function pathXSL_store( $pathXSL ){
        return realpath( $pathXSL );
    }

    var $docXS_value;
    function docXS_make( ){
        $docXS= new \DOMDocument( '1.0', 'utf-8' );
        if( file_exists( $this->pathXS ) ) $docXS->load( $this->pathXS, LIBXML_COMPACT );
        return $docXS;
    }
    function docXS_store( $docXS ){
        $docXS= so_dom::make( $docXS );
        if( file_exists( $this->pathXS ) ) unlink( $this->pathXS );
        file_put_contents( $this->pathXS, $docXS );
        return null;
    }

    var $docXSL_value;
    function docXSL_make( ){
        if( file_exists( $this->pathXS ) ) $this->sync();
        $docXSL= so_dom::make( so_file::make( $this->pathXSL ) );
        return $docXSL;
    }
    function docXSL_store( $docXSL ){
        $docXSL= so_dom::create( $docXSL );
        if( file_exists( $this->pathXSL ) ) unlink( $this->pathXSL );
        file_put_contents( $this->pathXSL, $docXSL );
        return null;
    }

    var $processor_value;
    function processor_make(){
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


// ../../so/front/so_front.php 


class so_front
{
    use so_meta;
    use so_singleton {
        so_singleton::makeInstance as makeAdapter;
    }
    
    static function makeInstance( ){
        if( so_value::make( $_SERVER[ 'SESSIONNAME' ] ) == 'Console' )
            return so_front_console::makeAdapter();
        
        return so_front_http::makeAdapter();
    }
    
    var $dir_value;
    function dir_make( ){
        return so_file::make( getcwd() );
    }
    
    var $uri_value;
    var $method_value;
    var $data_value;

    var $package_value;
    function package_make( ){
        return so_package::make( 'so' );
    }
    function package_store( $data ){
        return so_package::make( $data );
    }
    
    function send( $response ){
        echo $response->content;
    }
    
}

// ../../so/front/so_front_console.php 


class so_front_console
extends so_front
{

    var $uri_value;
    function uri_make( ){
        $uri= so_value::make( $_SERVER[ 'argv' ][ 1 ] );
        return so_uri::make( $uri );
    }

    var $method_value;
    function method_make( ){
        $method= so_value::make( $_SERVER[ 'argv' ][ 2 ] );
        return strtolower( $method ?: 'get' );
    }

    var $data_value;
    function data_make( ){
        return null;
    }
    
}

// ../../so/front/so_front_http.php 


class so_front_http
extends so_front
{

    static $codeMap= array(
        'ok' => 200,
        'moved' => 301,
        'found' => 302,
        'see' => 303,
        'missed' => 404,
        'error' => 500,
    );
    
    var $dir_value;
    function dir_make( ){
        return so_file::make( dirname( so_value::make( $_SERVER[ 'SCRIPT_FILENAME' ] ) ) );
    }
    
    var $uri_value;
    function uri_make( ){
        $uri= so_value::make( $_SERVER[ 'REQUEST_URI' ] );
        return so_uri::make( $uri );
    }

    var $method_value;
    function method_make( ){
        $method= so_value::make( $_SERVER[ 'REQUEST_METHOD' ] );
        return strtolower( $method ?: 'get' );
    }

    var $data_value;
    function data_make( ){
        switch( $this->method ):
            
            case 'get':
            case 'head':
                return null;
            
            case 'post':
                return so_query::make( $_POST + $_FILES );
            
            default:
                $raw= '';
                $input= fopen( 'php://input', 'r' );
                while( $chunk= fread( $input, 1024 ) ) $raw.= $chunk;
                fclose( $input );
                
                $type= preg_replace( '~;.*$~', '', so_value::make( $_SERVER[ 'CONTENT_TYPE' ] ) ?: '' );
                
                switch( $type ):
                    
                    case 'application/x-www-form-urlencoded':
                        return so_query::make( $raw );
                        break;
                    
                    case 'text/xml':
                    case 'application/xml':
                        return so_dom::make( $raw );
                    
                    case 'text/json':
                    case 'application/json':
                        return json_decode( $raw );
                    
                    default:
                        return $raw;
                    
                endswitch;
            
        endswitch;
    }

    function send( $response ){
        $content= $response->content;
        $mime= $content->mime;
        $cache= $response->cache;
        $private= $response->private;
        
        if( $mime === 'application/xml' ):
            $accept= preg_split( '~[,;] ?~', strtolower( so_value::make( $_SERVER[ 'HTTP_ACCEPT' ] ) ?: '' ) );
            if( !in_array( 'application/xhtml+xml', $accept ) ):
                
                $xs= new so_XStyle;
                $xs->pathXSL= (string) so_front::make()->package['-mix']['index.xsl']->file;
                $xsl= $xs->docXSL;
                foreach( $xsl->childs[ 'xsl:include' ] as $dom ):
                    $dom['@href']= preg_replace( '!\?[^?]*$!', '', $dom['@href'] );
                endforeach;
                
                $content= (string) $xs->process( (string) $content );
                $content= preg_replace( '~^<\\?xml .+?\\?>\n?~', '', $content );
                $mime= 'text/html';
            endif;
        endif;
        
        $encoding= $response->encoding;
        $code= static::$codeMap[ $response->status ];
        header( "Content-Type: {$mime}", true, $code );
        
        if( !$private )
            header( "Access-Control-Allow-Origin: *", true );
        
        if( $cache ):
            header( "Cache-Control: " . ( $private ? 'private' : 'public' ), true );
        else:
            header( "Cache-Control: no-cache", true );
        endif;
        
        if( $location= $response->location ):
            header( "Location: {$location}", true );
        endif;
        
        echo str_pad( $content, 512, ' ', STR_PAD_RIGHT );
        
        return $this;
    }
    
}

// ../../so/query/so_query.php 


class so_query
implements \Countable, \ArrayAccess, \IteratorAggregate
{
    use so_meta;
    use so_factory;
    
    static $sepaName= '=';
    static $sepaChunk= ';&';
    
    static function make( $uri= null ){
        $obj= new static;
        if( is_null( $uri ) ) return $obj;
        if( is_string( $uri ) ) return $obj->string( $uri );
        if( is_array( $uri ) ) return $obj->struct( $uri );
        if( $uri instanceof so_query ) return $uri;
        throw new \Exception( 'Wrong type of argument' );
    }
    
    static function ensure( &$value ){
        return $value= static::make( $value );
    }
    
    function escape( $string ){
        $string= preg_replace_callback
        (   "=[^- a-zA-Z/?:@!$'()*+,._~\x{A0}-\x{D7FF}\x{F900}-\x{FDCF}\x{FDF0}-\x{FFEF}\x{10000}-\x{1FFFD}\x{20000}-\x{2FFFD}\x{30000}-\x{3FFFD}\x{40000}-\x{4FFFD}\x{50000}-\x{5FFFD}\x{60000}-\x{6FFFD}\x{70000}-\x{7FFFD}\x{80000}-\x{8FFFD}\x{90000}-\x{9FFFD}\x{A0000}-\x{AFFFD}\x{B0000}-\x{BFFFD}\x{C0000}-\x{CFFFD}\x{D0000}-\x{DFFFD}\x{E1000}-\x{EFFFD}\x{E000}-\x{F8FF}\x{F0000}-\x{FFFFD}\x{100000}-\x{10FFFD}]+=u"
        ,   function( $str ){
                return rawurlencode( $str[0] );
            }
        ,   (string) $string
        );
        $string= strtr( $string, ' ', '+' );
        return $string;
    }
    
    var $string_value;
    var $string_depends= array( 'string', 'struct' );
    function string_make( ){
        $chunkList= array();
        foreach( $this->struct as $key => $val ):
            if( is_null( $val ) )
                continue;
            
            $key= is_numeric( $key ) ? '' : static::escape( $key );
            if( $val ):
                $chunk= static::escape( $val );
                if( $key ):
                    $chunk= $key . static::$sepaName[0] . $chunk;
                endif;
            else:
                $chunk= $key;
            endif;
            
            $chunkList[]= $chunk;
        endforeach;
        
        return implode( static::$sepaChunk[0], $chunkList );
    }
    function string_store( $data ){
        $struct= array( );
        
        $chunkList= preg_split( '~[' . static::$sepaChunk . ']~', $data );
        foreach( $chunkList as $chunk ):
            if( !$chunk ) continue;
            $pair= preg_split( '~[' . static::$sepaName . ']~', $chunk, 2 );
            $key= &$pair[0];
            $val= &$pair[1];
            $struct[ urldecode( $key ) ]= urldecode( $val );
        endforeach;
        
        $this->struct= $struct;
    }
    
    var $struct_value;
    var $struct_depends= array( 'struct', 'string' );
    function struct_make( ){
        return array();
    }
    function struct_store( $data ){
        return (array) $data;
    }
    
    var $uri_value;
    function uri_make( ){
        return so_uri::makeInstance()->query( $this )->primary();
    }
    
    var $resource_value;
    function resource_make( ){
        $keyList= array_keys( $this->struct );
        array_unshift( $keyList, so_front::make()->package->name );
        
        while( count( $keyList ) ):
            $class= __NAMESPACE__ . '\\' . implode( '_', $keyList );
            if( count( $keyList ) < 2 ) $class.= '_rootResource';
            if( class_exists( $class ) ) break;
            array_pop( $keyList );
        endwhile;
        
        return $class::make( $this->uri );
    }
    
    function _string_meta( ){
        return $this->string;
    }
    
    function count( ){
        return count( $this->struct );
    }

    function offsetExists( $key ){
        return key_exists( $key, $this->struct );
    }
    
    function offsetGet( $key ){
        $struct= $this->struct;
        return so_value::make( $struct[ $key ] );
    }
    
    function offsetSet( $key, $value ){
        throw new \Exception( 'Query is read only' );
    }
    
    function offsetUnset( $key ){
        throw new \Exception( 'Query is read only' );
    }
    
    function getIterator( ){
        return new \ArrayIterator( $this->struct );
    }
    
}

// ../../so/uri/so_uri.php 


class so_uri
{
    use so_meta;
    
    use so_registry;
    static $id_prop= 'string';
    
    var $string_value;
    var $string_depends= array( 'string', 'scheme', 'login', 'password', 'host', 'port', 'path', 'queryString', 'query', 'anchor' );
    function string_make( ){
        $string= '';
        
        if( $this->scheme )
            $string.= urlencode( $this->scheme ) . ':';
        
        if( $this->host ):
            $string.= '//';
            if( $this->login ):
                $string.= urlencode( $this->login );
                if( $this->password )
                    $string.= ':' . urlencode( $this->password );
                $string.= '@';
            endif;
            $string.= urlencode( $this->host );
            if( $this->port )
                $string.= ':' . urlencode( $this->port );
        endif;
        
        if( $this->path )
            $string.= $this->path;
        
        $queryString= $this->queryString;
        if( $queryString )
            $string.= '?' . $queryString;
        
        if( $this->anchor )
            $string.= '#' . urlencode( $this->anchor );
        
        return $string;
    }
    function string_store( $string ){
        preg_match( '~^(?:(\w*):)?(?://(?:([^/:]*)(?:\:([^/]*))?@)?([^/:]*)(?:\:(\d*))?)?([^?#]*)(?:\?([^#]*))?(?:#(.*)|)?$~', $string, $found );
        
        $this->scheme= so_value::make( $found[ 1 ] );
        $this->login= so_value::make( $found[ 2 ] );
        $this->password= so_value::make( $found[ 3 ] );
        $this->host= so_value::make( $found[ 4 ] );
        $this->port= so_value::make( $found[ 5 ] );
        $this->path= so_value::make( $found[ 6 ] );
        $this->queryString= so_value::make( $found[ 7 ] );
        $this->anchor= so_value::make( $found[ 8 ] );
    }
    
    var $scheme_value;
    var $scheme_depends= array( 'string', 'scheme' );
    function scheme_store( $data ){
        return (string) $data;
    }
    
    var $login_value;
    var $login_depends= array( 'string', 'login' );
    function login_store( $data ){
        return (string) $data;
    }
    
    var $password_value;
    var $password_depends= array( 'string', 'password' );
    function password_store( $data ){
        return (string) $data;
    }
    
    var $host_value;
    var $host_depends= array( 'string', 'host' );
    function host_store( $data ){
        return (string) $data;
    }
    
    var $port_value;
    var $port_depends= array( 'string', 'port' );
    function port_store( $data ){
        return (integer) $data;
    }
    
    var $path_value;
    var $path_depends= array( 'string', 'path' );
    function path_make( ){
        if( $this->host )
            return '/';
        return '';
    }
    function path_store( $data ){
        return (string) $data;
    }
    
    var $queryString_value;
    var $queryString_depends= array( 'string', 'query', 'queryString' );
    function queryString_make( ){
        return (string) $this->query;
    }
    function queryString_store( $data ){
        $this->query= so_query::make( (string) $data );
    }
    
    var $query_value;
    var $query_depends= array( 'string', 'query', 'queryString' );
    function query_make( ){
        return so_query::make();
    }
    function query_store( $data ){
        return so_query::make( $data );
    }
    
    var $anchor_value;
    var $anchor_depends= array( 'string', 'anchor' );
    function anchor_store( $data ){
        return (string) $data;
    }
    
    var $content_value;
    var $content_depends= array();
    function content_make( ){
        $curl= curl_init( $this->string );
        ob_start();
            curl_exec( $curl );
        $data= ob_get_clean();
        $info= curl_getinfo( $curl );
        curl_close( $curl );
        
        switch( preg_replace( '~;.*$~', '', $info[ 'content_type' ] ) ):
            case 'text/xml':
            case 'application/xml':
                return so_dom::make( $data );
            case 'text/json':
            case 'application/json':
                return json_decode( $data );
        endswitch;
        
        return $data;
    }
    function content_store( $data ){
        $curl= curl_init( $this->string );
        $file= tmpfile();
        fwrite( $file, $data );
        fseek( $file, 0 ); // ?
        curl_setopt( $curl, CURLOPT_PUT, true ); 
        curl_setopt( $curl, CURLOPT_INFILE, $file ); 
        curl_setopt( $curl, CURLOPT_INFILESIZE, strlen( $data ) );
        ob_start();
            curl_exec( $curl );
        ob_end_flush();
        fclose( $file );
        curl_close( $curl );
        return $data;
    }
    
    function _string_meta( ){
        return $this->string;
    }
    
}

// ../../so/file/so_file.php 


class so_file
implements \ArrayAccess
{
    use so_meta;
    
    use so_registry;
    static $id_prop= 'path';
    
    var $path_value;
    function path_make(){
        throw new \Exception( 'Property [path] is not defined' );
    }
    function path_store( $data ){
        if( !preg_match( '~^([^/\\\\:]+:|[/\\\\])~', $data ) ):
            $data= dirname( dirname( __DIR__ ) ) . '/' . $data;
        endif;
        
        $data= strtr( $data, array( '\\' => '/' ) );
        
        while( true ):
            $last= $data;
            $data= preg_replace( '~/[^/:]+/\\.\\.(?=/|$)~', '', $data, 1 );
            if( $data === $last ) break 1;
        endwhile;
        
        return $data;
    }
    
    var $uri_value;
    function uri_make( ){
        $uri= so_uri::makeInstance();
        $uri->path= strtr( $this->relate( so_front::make()->dir ), array( '%' => urlencode( '%' ) ) );
        return $uri->primary();
    }
    
    var $name_value;
    function name_make( ){
        return $this->SplFileInfo->getBasename();
    }
    
    var $extension_value;
    function extension_make( ){
        return $this->SplFileInfo->getExtension();
    }
    
    var $nameList_value;
    function nameList_make( ){
        return explode( '.', $this->name );
    }
    
    var $type_value;
    function type_make( ){
        return $this->SplFileInfo->getType();
    }
    
    var $parent_value;
    function parent_make( ){
        return so_file::make( dirname( $this->path ) );
    }
    
    var $exists_value;
    var $exists_depends= array();
    function exists_make( ){
        return file_exists( $this->path );
    }
    function exists_store( $exists ){
        if( $exists ):
            if( $this->exists ) return $exists;
            $this->parent->exists= true;
            mkdir( $this->path, 0777, true );
        else:
            unlink( $this->path );
            unset( $this->childs );
        endif;
        return $exists;
    }
    
    var $content_value;
    var $content_depends= array();
    function content_make( ){
        $path= $this->path;
        if( !is_file( $path ) ) return null;
        $SplFileObject= $this->SplFileObject;
        $SplFileObject->rewind();
        
        $content= '';
        foreach( $SplFileObject as $line )
            $content.= $line;
        
        return $content;
    }
    function content_store( $content ){
        if( isset( $this->content ) )
            if( $content == $this->content )
                return $content;
        
        $this->parent->exists= true;
        
        $lock= $this->lock;
        $this->lock= true;
            $SplFileObject= $this->SplFileObject;
            $SplFileObject->ftruncate( 0 );
            $SplFileObject->fwrite( $content );
            $SplFileObject->fflush();
        $this->lock= $lock;
        
        unset( $this->version );
        unset( $this->exists );
        return $content;
    }
    
    var $lock_value= false;
    var $lock_depends= array();
    function lock_store( $value ){
        if( $value == $this->lock )
            return $value;
        
        $this->SplFileObject->flock( $value ? LOCK_EX : LOCK_UN );
        
        return $value;
    }
    
    var $SplFileInfo_value;
    function SplFileInfo_make( ){
        return new \SplFileInfo( $this->path );
    }
    
    var $SplFileObject_value;
    function SplFileObject_make( ){
        return new \SplFileObject( $this->path, 'a+b' );
    }
    
    function append( $content ){
        $count= $this->SplFileObject->fwrite( (string) $content );
        
        if( is_null( $count ) )
            throw new \Exception( "Can not append to file [{$this->path}]" );
        
        unset( $this->version );
        
        return $this;
    }
    
    var $version_value;
    function version_make( ){
        if( !$this->exists )
            return '';
        return strtoupper( base_convert( $this->SplFileInfo->getMTime(), 10, 36 ) );
    }
    
    var $childs_value;
    function childs_make( ){
        $list= array();
        
        if( $this->exists ):
            $dir= dir( $this->path );
            while( false !== ( $file= $dir->read() ) ):
                if( $file[ 0 ] == '.' ) continue;
                if( $file[ 0 ] == '-' ) continue;
                $list[]= $this->path . '/' . $file;
            endwhile;
            $dir->close();
        endif;
        
        natsort( $list );
        
        return so_file_collection::make( $list );
    }
    
    function relate( $base ){
        $base= explode( '/', (string) so_file::make( $base ) );
        $path= explode( '/', $this->path );
        
        while( isset( $base[ 0 ] ) and isset( $path[ 0 ] ) ):
            if( $base[ 0 ] != $path[ 0 ] ) break;
            array_shift( $base );
            array_shift( $path );
        endwhile;
        
        $path= implode( '/', $path );
        
        if( count( $base ) )
            $path= str_repeat( '../', count( $base ) ) . $path;
        
        return $path;
    }
    
    function go( $path ){
        return so_file::make( rtrim( $this->path, '/' ) . '/' . $path );
    }
    
    function createUniq( $extension= '' ){
        $postfix= $extension ? ( '.' . $extension ) : '';
        while( true ):
            $file= $this->go( uniqid() . $postfix );
            if( !$file->exists ) return $file;
        endwhile;
    }
    
    function move( $target ){
        if( !$this->exists )
            return $this;
            
        so_file::ensure( $target );
        $target->parent->exists= true;
        
        if( false === rename( (string) $this, (string) $target ) )
            throw new \Exception( "Can not copy [{$this}] to [{$target}]" );
        
        unset( $this->version );
        unset( $this->exists );
        unset( $this->content );
        unset( $target->version );
        unset( $target->exists );
        unset( $target->content );
        
        return $target;
    }
    
    function copy( $target ){
        if( !$this->exists )
            return $this;
            
        so_file::ensure( $target );
        $target->parent->exists= true;
        
        if( false === copy( (string) $this, (string) $target ) )
            throw new \Exception( "Can not copy [{$this}] to [{$target}]" );
        
        unset( $target->version );
        unset( $target->exists );
        unset( $target->content );
        
        return $target;
    }
    
    function _string_meta( ){
        return $this->path;
    }

    function offsetExists( $name ){
        return $this->go( $name )->exists;
    }
    
    function offsetGet( $name ){
        return $this->go( $name );
    }

    function offsetSet( $name, $value ){
        throw new \Exception( "Not implemented" );
    }

    function offsetUnset( $name ){
        throw new \Exception( "Not implemented" );
    }

}


// ../../so/file/so_file_collection.php 

class so_file_collection
implements \Countable, \ArrayAccess, \IteratorAggregate
{
    use so_meta;
    use so_collection;
    
    var $exists_value;
    function exists_make( ){
        foreach( $this as $file )
            if( !$file->exists )
                return false;
        return true;
    }
    function exists_store( $data ){
        foreach( $this as $file )
            $file->exists= $data;
        return $data;
    }
    
    function offsetExists( $key ){
        if( is_int( $key ) ):
            return isset( $this->list[ $key ] );
        endif;
        
        foreach( $this as $item ):
            if( $item->name !== $key ) continue;
            return true;
        endforeach;
        
        return false;
    }
    
    function offsetGet( $key ){
        if( is_int( $key ) ):
            return $this->list_value[ $key ]= so_file::make( $this->list[ $key ] );
        endif;
        
        $list= array();
        foreach( $this as $item ):
            if( $item->name != $key ) continue;
            $list[]= $item;
        endforeach;
        
        return so_dom_collection::make( $list );
    }
    
}


// ../../so/root/so_root.php 


class so_root
implements \ArrayAccess
{
    use so_meta;
    
    use so_singleton;
    static $id_prop= 'dir';
    
    var $dir_value;
    function dir_make( ){
        return so_file::make( __DIR__ . '/../..' );
    }
    function dir_store( $data ){
        return so_file::make( $data );
    }
    
    var $root_value;
    function root_make( ){
        return $this;
    }
    
    var $packages_value;
    function packages_make(){
        $list= array();
        
        foreach( $this->dir->childs as $child ):
            if( $child->type != 'dir' )
                continue;
            $package= $this[ $child->name ];
            $list+= $package->packages->list;
        endforeach;
        
        return so_package_collection::make( $list );
    }
    
    var $modules_value;
    function modules_make( ){
        return $this->packages->modules;
    }
    
    var $sources_value;
    function sources_make( ){
        return $this->packages->sources;
    }
    
    var $version_value;
    function version_make( ){
        $version= '';
        
        foreach( $this->packages as $package )
            if( ( $v= $package->version ) > $version )
                $version= $v;
        
        return $version;
    }

    function offsetExists( $name ){
        return $this->dir->go( $name )->exists;
    }
    
    function offsetGet( $name ){
        return so_package::make( $this->dir->go( $name ) );
    }

    function offsetSet( $name, $value ){
        throw new \Exception( "Not implemented" );
    }

    function offsetUnset( $name ){
        throw new \Exception( "Not implemented" );
    }

}


// ../../so/compiler/so_compiler.php 


class so_compiler
{
    use so_meta;
    use so_factory;
    
    static function start( $package= null ){
        $packages= $package ? array( $package ) : so_root::make()->packages;
        foreach( $packages as $package )
            static::make()->package( $package )->clean()->compile()->minify()->bundle()->dumpDepends();
    }
    
    var $package_value;
    var $package_depends= array( 'package', 'modules' );
    function package_make( ){
        throw new \Exception( "Property [package] is not defined" );
    }
    function package_store( $data ){
        return so_package::make( $data );
    }

    var $modules_value;
    var $modules_depends= array( 'package', 'modules' );
    function modules_make( ){
        return $this->package->depends;
    }
    function modules_store( $data ){
        return so_module_collection::make( $data );
    }

    var $sources_value;
    function sources_make( ){
        $exclude= $this->exclude->depends;
        $sources= array();
        
        foreach( $this->modules as $key => $module ):
            if( isset( $exclude[ $key ] ) ) continue;
            $sources+= $module->sources->list;
        endforeach;
        
        return so_source_collection::make( $sources );
    }

    var $exclude_value;
    function exclude_make( ){
        return so_package_collection::make();
    }
    function exclude_store( $data ){
        return so_package_collection::make( $data );
    }

    var $target_value;
    function target_make( ){
        return $this->package[ '-mix' ];
    }
    function target_store( $data ){
        return so_module::make( $data );
    }
    
    var $sourcesJS_value;
    function sourcesJS_make( ){
        $list= array();
        
        foreach( $this->sources as $source ):
            if( $source->extension != 'js' ) continue;
            $list+= $source->sources->list;
        endforeach;
        
        return so_source_collection::make( $list );
    }
    
    var $sourcesCSS_value;
    function sourcesCSS_make( ){
        $list= array();
        foreach( $this->sources as $source )
            if( $source->extension == 'css' )
                $list+= $source->sources->list;
        return so_source_collection::make( $list );
    }
    
    var $sourcesXSL_value;
    function sourcesXSL_make( ){
        $list= array();
        foreach( $this->sources as $source )
            if( $source->extension == 'xsl' )
                $list+= $source->sources->list;
        return so_source_collection::make( $list );
    }
    
    var $sourcesPHP_value;
    function sourcesPHP_make( ){
        $list= array();
        foreach( $this->sources as $source )
            if( $source->extension == 'php' )
                $list+= $source->sources->list;
        return so_source_collection::make( $list );
    }
    
    function clean( ){
        $this->target->dir->childs->exists= false;
        return $this;
    }
    
    function compile( ){
        $this->compileJS();
        $this->compileCSS();
        $this->compileXSL();
        $this->compilePHP();
        return $this;
    }
    
    function compileJS( ){
        $sources= $this->sourcesJS;
        $target= $this->target;
        
        if( !count( $sources ) )
            return $this;
        
        $index= <<<JS
;(function( modules ){
    var scripts= document.getElementsByTagName( 'script' )
    var script= document.currentScript || scripts[ scripts.length - 1 ]
    var dir= script.src.replace( /[^\/]+$/, '' )
        
    var next= function( ){
        var module= modules.shift()
        if( !module ) return
        var loader= document.createElement( 'script' )
        loader.parentScript= script
        loader.src= dir + module
        loader.onload= next
        script.parentNode.insertBefore( loader, script )
    }
    next()
}).call( this, [

JS;
        
        foreach( $sources as $source )
            $index.= "    '" .  $source->file->relate( $target->dir ) . '?' . $source->version . "', \n";
        
        $index.= "    null \n])\n";
        
        $target[ 'dev.js' ]->content= $index;
        
        $compiled= array();
        foreach( $sources as $source ):
            $content= $source->content;
            $content= preg_replace( '~^\s*//.*$\n~m', '', $content );
            $content= preg_replace( '~\n/\\*[\w\W]*?\\*/~', '', $content );
            
            $compiled[]= "// " . $source->file->uri . "\n" .  $content;
        endforeach;
        $compiled= implode( ";\n", $compiled );
        
        $target[ 'release.js' ]->content= $compiled;
        
        $library= <<<JS
new function( window, document ){
    with ( this ){
{$compiled}
        var scripts= document.getElementsByTagName( 'script' )
        var currentScript= document.currentScript || scripts[ scripts.length - 1 ]
        if( currentScript.src ) eval( currentScript.innerHTML )
    }
}( this.window, this.document )
JS;
        $target[ 'library.js' ]->content= $library;
        
        return $this;
    }
    
    function compileCSS( ){
        $sources= $this->sourcesCSS;
        $target= $this->target;
        
        if( !count( $sources ) )
            return $this;
        
        $index= array();
        if( count( $sources ) > 32 ):
            $pages= array();
            $i= 0;
            foreach( $sources as $source ):
                $pageNumb= floor( $i++ / 30 );
                $pages[ $pageNumb ][]= $source;
            endforeach;
            foreach( $pages as $pageNumb => $page ):
                $page= so_source_collection::make( $page );
                $pageContent= array();
                foreach( $page as $source ):
                    $pageContent[]= "@import url( '" . $source->file->relate( $target->dir ) . '?' . $source->version . "' );";
                endforeach;
                $pageFile= $target[ "page_{$pageNumb}.css" ]->file;
                $pageFile->content= implode( "\n", $pageContent );
                $index[]= "@import url( '" . $pageFile->relate( $target->dir ) . '?' . $pageFile->version . "' );";
            endforeach;
        else:
            foreach( $sources as $source )
                $index[]= "@import url( '" . $source->file->relate( $target->dir ) . '?' . $source->version . "' );";
        endif;
        $index= implode( "\n", $index );
        
        $target[ 'dev.css' ]->content= $index;
        
        $compiled= array();
        foreach( $sources as $source )
            $compiled[]= "/* " . $source->file->relate( $target->dir ) . '?' . $source->version . " */\n\n" .  $source->content;
        $compiled= implode( "\n\n", $compiled );
        
        $target[ 'release.css' ]->content= $compiled;
        
        return $this;
    }
    
    function compileXSL( ){
        $sources= $this->sourcesXSL;
        $target= $this->target;
        
        if( !count( $sources ) )
            return $this;
        
        $index= so_dom::make( array(
            'xsl:stylesheet' => array(
                '@version' => '1.0',
                '@xmlns:xsl' => 'http://www.w3.org/1999/XSL/Transform',
            ),
        ) );
        
        foreach( $this->exclude as $package ):
            $file= $package[ '-mix' ][ 'dev.xsl' ]->file;
            $index[]= array( 'xsl:include' => array(
                '@href' => $file->relate( $target->dir ) . '?' . $file->version,
            ) );
        endforeach;
        
        foreach( $sources as $source ):
            $index[]= array( 'xsl:include' => array(
                '@href' => $source->file->relate( $target->dir ) . '?' . $source->version,
            ) );
        endforeach;
        
        $target[ 'dev.xsl' ]->content= $index;
        
        $compiled= so_dom::make( array(
            'xsl:stylesheet' => array(
                '@version' => '1.0',
                '@xmlns:xsl' => 'http://www.w3.org/1999/XSL/Transform',
            ),
        ) );
        
        foreach( $this->exclude as $package ):
            $file= $package[ '-mix' ][ 'release.xsl' ]->file;
            $compiled[]= array( 'xsl:include' => array(
                '@href' => $file->relate( $target->dir ) . '?' . $file->version,
            ) );
        endforeach;
        
        foreach( $sources as $source ):
            $compiled[]= array(
                '#comment' => " " . $source->file->relate( $target->dir ) . '?' . $source->version . " ",
                $source->content->childs,
            );
        endforeach;
        
        $target[ 'release.xsl' ]->content= $compiled;
        
        return $this;
    }
    
    function compilePHP( ){
        $sources= $this->sourcesPHP;
        $target= $this->target;
        
        if( !count( $sources ) )
            return $this;
        
        $index= array( "<?php" );
        foreach( $sources as $source )
            $index[]= "require( __DIR__ . '/" . $source->file->relate( $target->dir ) . "' );";
        $index= implode( "\n", $index );
        
        $target[ 'dev.php' ]->content= $index;
        
        $compiled= array( "<?php namespace " . $this->package->name . ";" );
        foreach( $sources as $source )
            $compiled[]= "// " . $source->file->relate( $target->dir ) . " \n" . substr( $source->content, 6 );
        $compiled= implode( "\n\n", $compiled );
        
        $target[ 'release.php' ]->content= $compiled;
        
        return $this;
    }
    
    function minify( ){
        $target= $this->target;
        
        $minifiedJS= $target[ 'library.js' ]->content;
        $minifiedJS= preg_replace( '~^\s+~m', '', $minifiedJS );
        $minifiedJS= preg_replace( '~^//.*$\n~m', '', $minifiedJS );
        $minifiedJS= preg_replace( '~\n/\\*[\w\W]*?\\*/~', '', $minifiedJS );
        
        $minifiedCSS= $target[ 'release.css' ]->content;
        $minifiedCSS= preg_replace( '~/\\*[\w\W]*?\\*/~', '', $minifiedCSS );
        $minifiedCSS= preg_replace( '~^\s+~m', '', $minifiedCSS );
        $minifiedCSS= preg_replace( '~[\r\n]~', '', $minifiedCSS );
        
        $minifiedXSL= null;
        if( $target[ 'release.xsl' ]->exists ):
            $minifiedXSL= $target[ 'release.xsl' ]->content;
            $doc= new \DOMDocument();
            $doc->formatOutput= false;
            $doc->preserveWhiteSpace= false;
            $doc->loadXML( (string) $minifiedXSL );
            $minifiedXSL= $doc->C14N();
        endif;
        
        $minifiedPHP= $target[ 'release.php' ]->content;
        
        if( $minifiedJS ) $target[ 'minified.js' ]->content= $minifiedJS;
        if( $minifiedCSS ) $target[ 'minified.css' ]->content= $minifiedCSS;
        if( $minifiedXSL ) $target[ 'minified.xsl' ]->content= so_dom::make( $minifiedXSL );
        if( $minifiedPHP ) $target[ 'minified.php' ]->content= $minifiedPHP;
        
        return $this;
    }
    
    function bundle( ){
        $target= $this->target;
        
        $bundleCSS= $target[ 'minified.css' ]->content;
        if( $bundleCSS ):
            $replacer= function( $matches ) use( $target ) {
                list( $str, $prefix, $url, $postfix )= $matches;
                $file= $target->dir->go( $url );
                $type= image_type_to_mime_type( exif_imagetype( $file ) );
                return $prefix . 'data:' . $type . ';base64,' . base64_encode( $file->content ) . $postfix;
            };
            $bundleCSS= preg_replace_callback( "~(url\(\s*')([^:]+(?:/|$).*?)('\s*\))~", $replacer, $bundleCSS );
            
            $target[ 'bundle.css' ]->content= $bundleCSS;
        endif;
        
        if( $bundleJS= $target[ 'minified.js' ]->content ):
            $bundleCSS= strtr( $bundleCSS, array( '"' => '\\"', '\\' => '\\\\' ) );
            $bundleJS= <<<JS
document.getElementsByTagName( 'head' )[0].appendChild( document.createElement( 'style' ) ).textContent= "{$bundleCSS}"
{$bundleJS}
JS;
            $target[ 'bundle.js' ]->content= $bundleJS;
        endif;
        
        return $this;
    }
    
    function dumpDepends( ){
        $root= so_root::make();
        
        $map= array();
        foreach( $this->modules as $base ):
            foreach( $base->uses as $target ):
                $map[ $target->dir->relate( $root->dir ) ][ $base->dir->relate( $root->dir ) ]= 1;
            endforeach;
        endforeach;
        foreach( $map as &$module ):
            $module= array_keys( $module );
        endforeach;
        
        $this->target[ 'depends.json' ]->content= json_encode( $map, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES );
    }
    
}