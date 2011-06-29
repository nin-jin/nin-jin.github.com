<?php

class so_Compile_CSS {
    function __construct( $pack, $mixModule ){
        $files= $pack->filesByExt( 'css' );
                    
        $indexFile= $mixModule->createFile( 'index.js' );
        $content= '';
        foreach( $files as $id => $file ):
            $content.= "@import url( '../../{$id}?{$file->version}' );\n";
        endforeach;
        $mixModule->createFile( 'index.css' )->content= $content;
        
        $content= '';
        foreach( $files as $id => $file ):
            $content.= "/* @import url( '../../{$id}' ); */\n" . $file->content . "\n";
        endforeach;
        $mixModule->createFile( 'compiled.css' )->content= $content;
    }
}
