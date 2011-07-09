with( $jam )
$define( '$schedule', function( timeout, proc ){
    var timerID= $glob().top.setTimeout( proc, timeout )
    return function( ){
        $glob().top.clearTimeout( timerID )
    }
})
