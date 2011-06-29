<?php

class so_Tree extends so_Meta {

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
        $list= array( $this->struct );
        foreach( $keyList as $key ):
            $listNew= array();
            foreach( $list as $value ):
                if( in_array( $key, $value ) )
            endforeach;
        endforeach;
    }

} 
