/* include( '../../wc/css3/wc-css3.vml' ); */
document.write("\
<?import namespace=\"vml\" implementation=\"#default#VML\" ?>\
<vml:shapetype\
    xmlns:vml='urn:schemas-microsoft-com:vml'\
    adj='0,0,0,0'\
	id='wc-css3_roundrect'\
	coordorigin='0 0'\
	coordsize='1000000 1000000'\
	stroked='false'\
	filled='false'\
	>\
\
    <vml:formulas>\
        <vml:f eqn='val width'></vml:f> <!-- @0: width -->\
        <vml:f eqn='val height'></vml:f> <!-- @1: height -->\
\
        <vml:f eqn='prod #0 width pixelwidth'></vml:f> <!-- @2: adj0 * width / pixelwidth -->\
        <vml:f eqn='prod #1 width pixelwidth'></vml:f> <!-- @3: adj1 * width / pixelwidth -->\
        <vml:f eqn='prod #2 width pixelwidth'></vml:f> <!-- @4: adj2 * width / pixelwidth -->\
        <vml:f eqn='prod #3 width pixelwidth'></vml:f> <!-- @5: adj3 * width / pixelwidth -->\
\
        <vml:f eqn='prod #0 height pixelheight'></vml:f> <!-- @6: adj0 * height / pixelheight -->\
        <vml:f eqn='prod #1 height pixelheight'></vml:f> <!-- @7: adj1 * height / pixelheight -->\
        <vml:f eqn='prod #2 height pixelheight'></vml:f> <!-- @8: adj2 * height / pixelheight -->\
        <vml:f eqn='prod #3 height pixelheight'></vml:f> <!-- @9: adj3 * height / pixelheight -->\
\
        <vml:f eqn='sum width 0 @3'></vml:f> <!-- @10: width - @3 -->\
        <vml:f eqn='sum width 0 @4'></vml:f> <!-- @11: width - @4 -->\
\
        <vml:f eqn='sum height 0 @8'></vml:f> <!-- @12: height - @8 -->\
        <vml:f eqn='sum height 0 @9'></vml:f> <!-- @13: height - @9 -->\
    </vml:formulas>\
\
	<vml:path v='m @2,0 l @10,0 qx @0,@7 l @0,@12 qy @11,@1 l @5,@1 qx 0,@13 l 0,@6 qy @2,0 xe'></vml:path>\
\
</vml:shapetype>\
")
