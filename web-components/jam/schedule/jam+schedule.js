with( $jam )
$define( '$schedule', function( timeout, proc ){
    var timerID= $glob().setTimeout( proc, timeout )
    return function( ){
        $glob().clearTimeout( timerID )
    }
})
