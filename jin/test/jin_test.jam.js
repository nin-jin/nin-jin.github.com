this.$jin_test= $jin_class( function( $jin_test, test ){
    
    test.passed= null
    test.timeout= null
    test.onDone= null
    test.timer= null
    
    test.asserts= null
    test.results= null
    test.errors= null
    
    test.init= function( test, code, onDone ){
        test.asserts= []
        test.results= []
        test.errors= []
        test.onDone= onDone || function(){}
        
        var complete= false
        
        test.callback( function( ){
            if( typeof code === 'string' )
                code= new Function( 'test', code )
            
            if( !code ) return
            
            code( test )
            complete= true
        } ).call( )
        
        if( !complete ) test.passed= false
        
        if(( test.passed == null )&&( test.timeout != null )){
            test.timer= setTimeout( function( ){
                test.asserts.push( false )
                test.errors.push( new Error( 'timeout(' + test.timeout + ')' ) )
                test.done()
            }, test.timeout )
        } else {
            test.done()
        }
    }
    
    var AND= function( a, b ){ return a && b }
    
    test.done= function( test ){
        test.timer= clearTimeout( test.timer )
        
        if( test.passed == null )
            test.passed= test.asserts.reduce( AND, true )
        
        test.onDone.call( null, test )
    }
    
    var compare= function( a, b ){
        return Number.isNaN( a )
        ? Number.isNaN( b )
        : ( a === b )
    }
    
    test.ok= function( test, value ){
        switch( arguments.length ){
            case 1:
                var passed= true
                break
            
            case 2:
                var passed= !!value
                break
            
            default:
                for( var i= 2; i < arguments.length; ++i ){
                    var passed= compare( arguments[ i ], arguments[ i - 1 ] )
                    if( !passed ) break;
                }
        }
        
        test.asserts.push( passed )
        test.results.push( [].slice.call( arguments, 1 ) )
        
        return test
    }
    
    test.not= function( test, value ){
        switch( arguments.length ){
            case 1:
                var passed= false
                break
            
            case 2:
                var passed= !value
                break
            
            default:
                for( var i= 2; i < arguments.length; ++i ){
                    var passed= !compare( arguments[ i ], arguments[ i - 1 ] )
                    if( !passed ) break;
                }
        }
        
        test.asserts.push( passed )
        test.results.push( [].slice.call( arguments, 1 ) )
        
        return test
    }
    
    test.callback= function( test, func ){
        return $jin_thread( function( ){
            try {
                return func.apply( this, arguments )
            } catch( error ){
                test.errors.push( error )
                throw error
            }
        } )
    }
    
    var destroy= test.destroy
    test.destroy= function( test ){
        test.timer= clearTimeout( test.timer )
        destroy( test )
    }
    
} )