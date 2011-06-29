<?php

function so_autoload( $class ){
    $chunks= explode( '_', $class );
    $pack= $chunks[0];
    $module= $chunks[1];
    $root= dirname( dirname( dirname( __FILE__ ) ) );
    include( "{$root}/{$pack}/{$module}/{$class}.php" );
}

spl_autoload_register( 'so_autoload' );
