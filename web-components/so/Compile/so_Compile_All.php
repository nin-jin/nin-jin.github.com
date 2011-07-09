<?php

class so_Compile_All {
    function __construct(){        
        $root= new so_WC_Root;
        $docModules= $root->createPack( 'doc' )->index->modules;
        foreach( $root->packs as $pack ):
            $srcPack= $pack->index;
            $docPack= new so_WC_MetaPack;
            $docPack->modules= array_merge( $docModules, $srcPack->modules );
            
            new so_Compile_VML( $srcPack, $pack->mixModule );
            new so_Compile_VML( $docPack, $pack->mixDocModule );

            new so_Compile_JS( $srcPack, $pack->mixModule );
            new so_Compile_JS( $docPack, $pack->mixDocModule );
            
            new so_Compile_CSS( $srcPack, $pack->mixModule );
            new so_Compile_CSS( $docPack, $pack->mixDocModule );
            
            new so_Compile_XSL( $srcPack, $pack->mixModule );
            new so_Compile_XSL( $docPack, $pack->mixDocModule );
            
            new so_Compile_XML( $srcPack, $pack->mixModule );
            new so_Compile_XML( $docPack, $pack->mixDocModule );

            # new so_Compile_Other( $srcPack, $pack->mixModule );
            # new so_Compile_Other( $docPack, $pack->mixDocModule );
        endforeach;
    }
}
