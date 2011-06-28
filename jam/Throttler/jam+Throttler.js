with( $jam )
$define
(	'$Throttler'
,	function( latency, func ){
		var stop
		return function(){
			if( stop ) stop= stop()
			stop= $schedule( latency, func )
		}
	}
)
