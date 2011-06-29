<?xml version="1.0"?>
<stylesheet xmlns="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:html="http://www.w3.org/1999/xhtml">

<!-- so/XStyle/so_XStyle_Base.xsl -->

<xsl:output xmlns:xsl="http://www.w3.org/1999/XSL/Transform" method="html"/>

<xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" match=" @* | node() ">
    <xsl:copy>
        <xsl:apply-templates select=" @* "/>
        <xsl:apply-templates select=" node() "/>
    </xsl:copy>
</xsl:template>
<xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" match=" processing-instruction() "/>

</stylesheet>
