$jq( function( ){
    var message= ''
    
    function collectSheets( sheet ){
        if( !sheet ) return ''
        
        var str= sheet.href + '\n'
        
        var rules= sheet.cssRules
        for( var i= 0; i < rules.length; ++i ){
            str+= collectSheets( rules[ i ].styleSheet )
        }
        
        return str
    }
    
    var sheets= document.styleSheets
    for( var i= 0; i < sheets.length; ++i ){
        message+= collectSheets( sheets[ i ] )
    }

    $jq( 'script' ).each( function( ){
        message+= this.src + '\n'
    })
    
    message= 'Loaded:\n' + message
    
    $jq( '#demo_message' ).text( message )
})
