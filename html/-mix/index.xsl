<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:output method="html"></xsl:output><xsl:template match=" @* | node() "><xsl:copy><xsl:apply-templates select=" @* "></xsl:apply-templates><xsl:apply-templates select=" node() "></xsl:apply-templates></xsl:copy></xsl:template><xsl:template match=" processing-instruction() "></xsl:template><xsl:output method="html"></xsl:output><xsl:template match=" html:include "><xsl:apply-templates select=" document( ., . ) / * / node() "></xsl:apply-templates></xsl:template><xsl:template match=" / html:html "><xsl:apply-templates select="node() "></xsl:apply-templates></xsl:template></xsl:stylesheet>