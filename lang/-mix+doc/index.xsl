<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml" xmlns:doc="https://github.com/nin-jin/doc" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:wc="https://github.com/nin-jin/wc" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:output method="html"></xsl:output><xsl:template match=" @* | node() "><xsl:copy><xsl:apply-templates select=" @* "></xsl:apply-templates><xsl:apply-templates select=" node() "></xsl:apply-templates></xsl:copy></xsl:template><xsl:template match=" processing-instruction() "></xsl:template><xsl:output method="html"></xsl:output><xsl:template match=" html:include "><xsl:apply-templates select=" document( ., . ) / * / node() "></xsl:apply-templates></xsl:template><xsl:template match=" / html:html "><xsl:apply-templates select="node() "></xsl:apply-templates></xsl:template><xsl:template match=" wc:CT/text() "><textarea><xsl:copy></xsl:copy></textarea></xsl:template><xsl:template match=" wc:CU/text() "><textarea class=" wc_js-test_textarea"><xsl:copy></xsl:copy></textarea></xsl:template><xsl:template match=" doc:pack "><wc:CV><xsl:apply-templates></xsl:apply-templates></wc:CV></xsl:template><xsl:template match=" doc:file "><a class=" reset=true " href="{ doc:link }"><wc:CW><xsl:value-of select=" doc:title "></xsl:value-of></wc:CW></a></xsl:template><xsl:variable name="wc:CX"><xsl:value-of select=" substring-before( substring-after( /processing-instruction()[ name() = 'xml-stylesheet' ], 'href=&quot;' ), '&quot;' ) "></xsl:value-of><xsl:text>/../..</xsl:text></xsl:variable><xsl:template match=" /doc:root "><html><head><title><xsl:value-of select=" . // html:h1[ 1 ] "></xsl:value-of></title><meta content="text/html;charset=utf-8" http-equiv="content-type"></meta><meta content="IE=edge, chrome=1" http-equiv="X-UA-Compatible"></meta><link href="{$wc:CX}/-mix+doc/index.css" rel="stylesheet"></link><script src="{$wc:CX}/-mix+doc/index.js?">//</script></head><body><xsl:copy><xsl:apply-templates select=" @* "></xsl:apply-templates><wc:CY><wc:CZ wc:DA="left"><wc:DB><xsl:apply-templates select=" document( '../-mix/index.doc.xml', / ) / * / node() "></xsl:apply-templates></wc:DB></wc:CZ><wc:DC><wc:DD><wc:DC><xsl:apply-templates></xsl:apply-templates></wc:DC></wc:DD></wc:DC><wc:DE>
                        License: <a href="http://ru.wikipedia.org/wiki/%D0%9E%D0%B1%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5_%D0%B4%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B5">Public Domain</a>
                    </wc:DE></wc:CY></xsl:copy></body></html></xsl:template></xsl:stylesheet>