<?php

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
    
    function createPack( $name ){
        $pack= new so_WC_Pack;
        $pack->name= $name;
        $pack->root= $this;
        return $pack;
    }
}
