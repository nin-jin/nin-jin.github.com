<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0" xmlns:wc="https://github.com/nin-jin/wc"><!-- so/XStyle/so_XStyle_Base.xsl -->

    <xsl:output method="html"/>
    
    <xsl:template match=" @* | node() ">
        <xsl:copy>
            <xsl:apply-templates select=" @* "/>
            <xsl:apply-templates select=" node() "/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match=" processing-instruction() "/>

<!-- wc/js-test/wc_js-test.xsl -->

<xsl:template match=" wc:js-test/text() ">
    <textarea class=" wc_js-test_textarea">
        <xsl:copy/>
    </textarea>
</xsl:template>

</xsl:stylesheet>