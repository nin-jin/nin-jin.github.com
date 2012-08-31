<?php

header( 'content-type: text/plain', true );
require_once( '../../../so/autoload/so_autoload.php' );

$dom= so_dom::create();
$dom[ '?xml-stylesheet' ]= array( 'href' => 'my.xsl', 'type' => 'text/xsl' );
$dom[ 'html' ]= '';
$dom->root[]= array( '@id' => 'id of root', 'head' => so_dom::create( '<title>example</title>' ) );
// $dom[' html / body / #text ']= '</html>'; // TODO
$dom[ '#comment' ]= $dom->root;

echo "{$dom}\n";

foreach( $dom as $key => $child ):
    echo "{$key} | {$child->value}\n";
endforeach;

$dom->DOMNode; // cast to DOMNode
