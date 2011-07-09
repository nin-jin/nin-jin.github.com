<xsl:stylesheet
    version="1.0"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:html="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:wc="https://github.com/nin-jin/wc"
    xmlns:doc="https://github.com/nin-jin/doc"
    >

<xsl:output
    method="html"
    doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
    doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
/>

<xsl:template match=" @* | node() ">
    <xsl:copy>
        <xsl:apply-templates select=" @* " />
        <xsl:apply-templates select=" node() " />
    </xsl:copy>
</xsl:template>
<xsl:template match=" processing-instruction() " />

</xsl:stylesheet>
