<?php

class so_Compile_Other {
    function __construct( $pack, $mixModule ){
        $files= $pack->files;
                    
        foreach( $files as $id => $file ):
            if( in_array( $file->ext, array( 'jam', 'js', 'css', 'xml', 'xsl', 'tree' ) ) ) continue;
            copy( $file->path, $mixModule->path . '/' . $file->name );
        endforeach;
    }
}
