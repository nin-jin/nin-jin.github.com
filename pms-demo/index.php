<?php 

require_once( __DIR__ . '/pms/-mix/release.php' );

\pms\so_compiler::start( 'demo' );

readfile( __DIR__ . '/index.html' ); 