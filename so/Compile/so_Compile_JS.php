<?php

class so_Compile_JS {
    function __construct( $pack, $mixModule ){
        $files= $pack->filesByExt(array( 'js', 'jam' ));
        
        $indexFile= $mixModule->createFile( 'index.js' );
        $indexPath= '/' . $indexFile->id;
        if( count( $files ) ):
            $tpl= new so_Compile_JS_Index;
            $tpl->param= compact( 'indexPath', 'files' );
            $indexFile->content= $tpl->content;
        else:
            $indexFile->exists= false;
        endif;
        
        $content= '';
        foreach( $files as $id => $file ):
            $content.= "// {$id}\n" . $file->content . "\n";
        endforeach;
        $mixModule->createFile( 'compiled.js' )->content= $content;
    }
}
