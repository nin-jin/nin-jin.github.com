<?php

class so_XStyle extends so_Meta {

    protected $_dir;
    function get_dir( $dir ){
        if( isset( $dir ) ) return $dir;
        return dirname( $this->pathXSL );
    }

    protected $_pathXS;
    function set_pathXS( $pathXS ){
        if( isset( $this->pathXS ) ) throw new Exception( 'Redeclaration of $pathXS' );
        return $pathXS;
    }
    
    protected $_pathXSL;
    function set_pathXSL( $pathXSL ){
        if( isset( $this->pathXSL ) ) throw new Exception( 'Redeclaration of $pathXSL' );
        return $this->pathXS ? $this->pathXS . 'l' : $pathXSL;
    }

    protected $_docXS;
    function get_docXS( $docXS ){
        if( isset( $docXS ) ) return $docXS;
        $docXS= new DOMDocument( );
        if( file_exists( $this->pathXS ) ) $docXS->load( $this->pathXS, LIBXML_COMPACT );
        return $docXS;
    }
    function set_docXS( $docXS ){
        $this->aDocument( &$docXS );
        if( file_exists( $this->pathXS ) ) unlink( $this->pathXS );
        $docXS->save( $this->pathXS );
        return null;
    }

    protected $_docXSL;
    function get_docXSL( $docXSL ){
        if( isset( $docXSL ) ) return $docXSL;
        if( file_exists( $this->pathXS ) ) $this->sync();
        $docXSL= new DOMDocument( );
        $docXSL->load( $this->pathXSL, LIBXML_COMPACT );
        return $docXSL;
    }
    function set_docXSL( $docXSL ){
        $this->aDocument( &$docXSL );
        if( file_exists( $this->pathXSL ) ) unlink( $this->pathXSL );
        $docXSL->save( $this->pathXSL );
        return null;
    }

    protected $_processor;
    function get_processor( $processor ){
        if( isset( $processor ) ) return $processor;
        $processor= new XSLTProcessor( );
        $processor->importStyleSheet( $this->docXSL );
        return $processor;
    }

    function aDocument( $val ){
        if( is_string( $val ) ):
            $val= DOMDocument::loadXML( $val );
        elseif( is_array( $val ) ):
            $val= $this->_array2doc( $val );
        endif;
        if( is_object( $val ) ):
            if( $val instanceof SimpleXMLElement ) $val= dom_import_simplexml( $val );
            if( $val->ownerDocument ) $val= $val->ownerDocument;
        endif;
        if(!( $val instanceof DOMDocument )) throw new Exception( "Wrong type {$val}" );
        return $val;
    }

    function _value2node( $value, $parent ){
        $doc= $parent->ownerDocument or $doc= $parent;

        switch( true ):
            case( is_null( $value ) ):
                return;
                
            case( is_scalar( $value ) ):
                $parent->appendChild( $doc->createTextNode( $value ) );
                return;
            
            case( is_object( $value ) ):
                switch( true ):
                    case( $value instanceof SimpleXMLElement ):
                        $value= dom_import_simplexml( $value );
                        
                    case( $value instanceof DOMNode ):
                        $parent->appendChild( $doc->importNode( $value, true ) );
                        return;
                    
                    case( $value instanceof DOMNodeList ):
                        for( $i= 0; $i < $value->length; ++$i ):
                            $parent->appendChild( $doc->importNode( $value->item( $i ), true ) );
                        endfor;
                        return;
                endswitch;
                throw new Exception( "Unsupported type of object" );
            
            case( is_array( $value ) ):
                foreach( $value as $key => $value ):
                    if( is_numeric( $key ) ):
                        $this->_value2node( $value, $parent );
                        continue;
                    endif;
                    
                    switch( $key[0] ):
                        case '#':
                            switch( $key ):
                                case '#text':
                                    $parent->appendChild( $doc->createTextNode( $value ) );
                                    break;
                                    
                                case '#comment':
                                    $parent->appendChild( $doc->createComment( $value ) );
                                    break;
                                    
                                default:
                                    throw new Exception( "Wrong element name [{$key}]" );
                            endswitch;
                            break;
                            
                        case '@':
                            $name= substr( $key, 1 );
                            $parent->setAttribute( $name, $value );
                            break;
                            
                        case '?':
                            $name= substr( $key, 1 );
                            if( is_array( $value ) ):
                                $valueList= array();
                                foreach( $value as $key => $val ):
                                    $valueList[]= htmlspecialchars( $key ) . '="' . htmlspecialchars( $val ) . '"';
                                endforeach;
                                $value= implode( " ", $valueList );
                            endif;
                            $parent->appendChild( $doc->createProcessingInstruction( $name, $value ) );
                            break;
                        
                        default:
                            $node= $parent->appendChild( $doc->createElement( $key ) );
                            $this->_value2node( $value, $node );
                            break;
                    endswitch;
                endforeach;
                return;
                
            default:
                throw new Exception( "Unsupported type of value" );
        endswitch;
    }
    function _array2doc( $array ){
        $doc= new DOMDocument;
        $this->_value2node( $array, $doc );
        return $doc;
    }

    function process( $doc ){
        $this->aDocument( &$doc );
        
        $dir= getcwd();
        chdir( $this->dir );
            $doc= $this->processor->transformToDoc( $doc );
        chdir( $dir );
        
        return $this->aDocument( $doc );
    }

    function sync( ){
        if( !file_exists( $this->pathXS ) ) return $this;
        if
        (    file_exists( $this->pathXSL )
        &&  ( filemtime( $this->pathXS ) === fileatime( $this->pathXS ) )
        ) return $this;

        $xs2xsl= new $this;
        $xs2xsl->pathXSL= __DIR__ . '/so_XStyle_Compiler.xsl';
        $this->docXSL= $xs2xsl->process( $this->docXS );
        $this->docXS= $this->docXS;
        return $this;
    }

}
