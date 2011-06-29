<?php

class so_Compile_XML {
    function __construct( $packSource, $mixModule ){
        $index= array();

        foreach( $mixModule->root->packs as $pack ):
            $mainFile= $pack->mainFile;
            if( !$mainFile->exists ) continue;
            
            if( $pack->id === $mixModule->pack->id ):
                $fileList= array();
                
                foreach( $pack->filesByExt( 'xml' ) as $file ):
                    $fileList[]= array(
                        'file' => array(
                            'link' => "../../{$file->id}?{$file->version}",
                            'title' => DOMDocument::load( $file->path )->getElementsByTagName( 'h1' )->item(0)->nodeValue,
                        ),
                    );
                endforeach;
            else:
                $fileList= array(
                    'file' => array(
                        'link' => "../../{$mainFile->id}?{$file->version}",
                        'title' => DOMDocument::load( $mainFile->path )->getElementsByTagName( 'h1' )->item(0)->nodeValue,
                    ),
                );
            endif;
            $index[]= array( 'pack' => $fileList );
        endforeach;
        
        $xstyle= new so_XStyle;

        $xslFile= $mixModule->createFile( 'index.xsl' );

        $index= $xstyle->aDocument(array(
            'root' => array(
                '@xmlns' => 'https://github.com/nin-jin/doc',
                $index,
            ),
        ));
    
        $mixModule->createFile( 'index.doc.xml' )->content= $index->saveXML();
    }
}
