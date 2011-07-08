<?php

class so_Compile_CSS {
    function __construct( $pack, $mixModule ){
        $files= $pack->filesByExt( 'css' );
        
        $indexFile= $mixModule->createFile( 'index.css' );
        if( count( $files ) > 32 ):
            $pages= array();
            foreach( array_values( $files ) as $index => $file ):
                $pageNumb= floor( $index / 30 );
                $pages[ $pageNumb ][]= $file;
            endforeach;
            $indexContent= '';
            foreach( $pages as $pageNumb => $page ):
                $pageFile= $mixModule->createFile( "page_{$pageNumb}.css" );
                $pageContent= '';
                foreach( $page as $file ):
                    $pageContent.= "@import url( '../../{$file->id}?{$file->version}' );\n";
                endforeach;
                $pageFile->content= $pageContent;
                $indexContent.= "@import url( '../../{$pageFile->id}?{$pageFile->version}' );\n";
            endforeach;
            $indexFile->content= $indexContent;
        else:
            $content= '';
            foreach( $files as $id => $file ):
                $content.= "@import url( '../../{$file->id}?{$file->version}' );\n";
            endforeach;
            $indexFile->content= $content;
        endif;
        
        $content= '';
        foreach( $files as $file ):
            $content.= "/* @import url( '../../{$file->id}' ); */\n{$file->content}\n";
        endforeach;
        $mixModule->createFile( 'compiled.css' )->content= $content;
    }
}
