<?php

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

    function filesByExt( $ext ){
        $res= array();
        $mainModule= $this->mainModule;
        if( $mainModule && $mainModule->exists ):
            $res= array_merge( $res, $mainModule->filesByExt( $ext ) );
        endif;
        foreach( $this->modules as $module ):
            $res= array_merge( $res, $module->filesByExt( $ext ) );
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
        if( isset( $depends ) ) return $depends;
        return $this->modules;
    }
    
    protected $_index;
    function get_index( $index ){
        if( isset( $index ) ) return $index;
        
        $deferred= $sorted= array();
        
        $current= $this;
        while( $current ){
            foreach( $current->dependModules as $dep ):
                if( $sorted[ $dep->path ] ) continue;
                if( $deferred[ $dep->path ] ) continue;
                $deferred[ $current->path ]= $current;
                $current= $dep;
                continue 2;
            endforeach;
            
            $sorted[ $current->path ]= $current;
            $current= end( $deferred );
            unset( $deferred[ $current->path ] );
        }
        
        $pack= new so_WC_MetaPack;
        $pack->modules= $sorted;
        
        return $pack;
    }
    
    protected $_version;
    function get_version( $version ){
        if( isset( $version ) ) return $version;
        $version= 0;
        foreach( $this->modules as $module ):
            if( $module->version <= $version ) continue;
            $version= $module->version;
        endforeach;
        return $version;
    }
}
