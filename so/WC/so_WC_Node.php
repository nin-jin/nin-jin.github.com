<?php

class so_WC_Node extends so_Meta {
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
