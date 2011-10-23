<?xml version="1.0"?>
<stylesheet xmlns="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:wc="https://github.com/nin-jin/wc">

<!-- so/XStyle/so_XStyle_Base.xsl -->

    <xsl:output xmlns:xsl="http://www.w3.org/1999/XSL/Transform" method="html"/>
    
    <xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" match=" @* | node() ">
        <xsl:copy>
            <xsl:apply-templates select=" @* "/>
            <xsl:apply-templates select=" node() "/>
        </xsl:copy>
    </xsl:template>

    <xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" match=" processing-instruction() "/>

<!-- wc/demo/wc-test-js.xsl -->

<xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" match=" wc:demo/text() ">
    <textarea>
        <xsl:copy/>
    </textarea>
</xsl:template>

<!-- wc/js-test/wc_js-test.xsl -->

<xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" match=" wc:js-test/text() ">
    <textarea class=" wc_js-test_textarea">
        <xsl:copy/>
    </textarea>
</xsl:template>

</stylesheet>
