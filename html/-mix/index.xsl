<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0" xmlns:html="http://www.w3.org/1999/xhtml"><!-- so/XStyle/so_XStyle_Base.xsl -->

    <xsl:output method="html"/>
    
    <xsl:template match=" @* | node() ">
        <xsl:copy>
            <xsl:apply-templates select=" @* "/>
            <xsl:apply-templates select=" node() "/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match=" processing-instruction() "/>

<!-- html/html/html.xsl -->
    
    <xsl:output method="html"/>
    
    <xsl:template match=" html:include ">
        <xsl:apply-templates select=" document( ., . ) / * / node() "/>
    </xsl:template>
    
    <xsl:template match=" / html:html ">
        <xsl:apply-templates select="node() "/>
    </xsl:template>

</xsl:stylesheet>