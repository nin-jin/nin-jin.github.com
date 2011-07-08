<?xml version="1.0"?>
<stylesheet xmlns="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:wc="https://github.com/nin-jin/wc">

<!-- so/XStyle/so_XStyle_Base.xsl -->

<xsl:output xmlns:xsl="http://www.w3.org/1999/XSL/Transform" method="html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

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

<!-- wc/test-js/wc-test-js.xsl -->

<xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" match=" wc:test-js/text() ">
    <textarea class=" wc_test-js_textarea">
        <xsl:copy/>
    </textarea>
</xsl:template>

</stylesheet>
