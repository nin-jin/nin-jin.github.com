<?php

class so_Compile_VML {
    function __construct( $pack, $mixModule ){
        $files= $pack->filesByExt( 'vml' );
                    
        $content= '';
        foreach( $files as $id => $file ):
            $vml= "\n" . $file->content;
            $vml= strtr( $vml, array( "\n" => "\\\n", '"' => '\\"' ) );
            $vml= 'try{ document.write("' . $vml . '") } catch( e ){ }';
            $content.= "/* include( '../../{$id}' ); */\n{$vml}\n";
        endforeach;
        $mixModule->createFile( 'compiled.vml.js' )->content= $content;
    }
}
