<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0" xmlns:locale="https://github.com/nin-jin/locale"><!-- so/XStyle/so_XStyle_Base.xsl -->

    <xsl:output method="html"/>
    
    <xsl:template match=" @* | node() ">
        <xsl:copy>
            <xsl:apply-templates select=" @* "/>
            <xsl:apply-templates select=" node() "/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match=" processing-instruction() "/>

<!-- locale/locale/locale.xsl -->

    <xsl:param name="locale:lang" select=" / * / @xml:lang "/>
    <xsl:param name="locale:path" select=" concat( '../-mix/index.locale=', $locale:lang, '.xml' ) "/>

</xsl:stylesheet>