<?php

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
    
    protected $_donorPackJAM;
    function get_donorPackJAM( $donorPack ){
        if( isset( $donorPack ) ) return $donorPack;
        
        foreach( $this->mainModule->filesByExt( 'jam' ) as $file ):
            preg_match_all
            (   '/\$(\w+)\.\$createNameSpace\b/'
            ,   $file->content
            ,   &$matches
            ,   PREG_SET_ORDER
            );
            if( !$matches ) continue;
            foreach( $matches as $item ):
                $pack= $this->root->createPack( $item[1] );
                if( !$pack->exists ) continue;
                return $pack;
            endforeach;
        endforeach;
    }
    
    function createModule( $name ){
        $module= new so_WC_Module;
        $module->name= $name;
        $module->pack= $this;
        return $module;
    }
    
    function createFile( $name ){
        $file= new so_WC_File;
        $file->name= $name;
        $file->module= $this;
        $file->pack= $this;
        return $file;
    }
}
