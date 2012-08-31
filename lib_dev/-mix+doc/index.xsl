<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml" xmlns:doc="https://github.com/nin-jin/doc" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:wc="https://github.com/nin-jin/wc" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:output method="html"></xsl:output><xsl:template match=" @* | node() "><xsl:copy><xsl:apply-templates select=" @* "></xsl:apply-templates><xsl:apply-templates select=" node() "></xsl:apply-templates></xsl:copy></xsl:template><xsl:template match=" processing-instruction() "></xsl:template><xsl:output method="html"></xsl:output><xsl:template match=" html:include "><xsl:apply-templates select=" document( ., . ) / * / node() "></xsl:apply-templates></xsl:template><xsl:template match=" / html:html "><xsl:apply-templates select="node() "></xsl:apply-templates></xsl:template><xsl:template match=" wc:R/text() "><textarea><xsl:copy></xsl:copy></textarea></xsl:template><xsl:template match=" wc:A/text() "><textarea class=" wc_js-test_textarea"><xsl:copy></xsl:copy></textarea></xsl:template><xsl:template match=" doc:pack "><wc:S><xsl:apply-templates></xsl:apply-templates></wc:S></xsl:template><xsl:template match=" doc:file "><a class=" reset=true " href="{ doc:link }"><wc:T><xsl:value-of select=" doc:title "></xsl:value-of></wc:T></a></xsl:template><xsl:variable name="wc:U"><xsl:value-of select=" substring-before( substring-after( /processing-instruction()[ name() = 'xml-stylesheet' ], 'href=&quot;' ), '&quot;' ) "></xsl:value-of><xsl:text>/../..</xsl:text></xsl:variable><xsl:template match=" /doc:root "><html><head><title><xsl:value-of select=" . // html:h1[ 1 ] "></xsl:value-of></title><meta content="text/html;charset=utf-8" http-equiv="content-type"></meta><meta content="IE=edge, chrome=1" http-equiv="X-UA-Compatible"></meta><link href="{$wc:U}/-mix+doc/index.css" rel="stylesheet"></link><script src="{$wc:U}/-mix+doc/index.js?">//</script></head><body><xsl:copy><xsl:apply-templates select=" @* "></xsl:apply-templates><wc:V><wc:W wc:X="left"><wc:Y><xsl:apply-templates select=" document( '../-mix/index.doc.xml', / ) / * / node() "></xsl:apply-templates></wc:Y></wc:W><wc:Z><wc:AA><wc:Z><xsl:apply-templates></xsl:apply-templates></wc:Z></wc:AA></wc:Z><wc:AB>
                        License: <a href="http://ru.wikipedia.org/wiki/%D0%9E%D0%B1%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5_%D0%B4%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B5">Public Domain</a>
                    </wc:AB></wc:V></xsl:copy></body></html></xsl:template></xsl:stylesheet>