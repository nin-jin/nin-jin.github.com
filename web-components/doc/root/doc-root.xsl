<xsl:stylesheet
    version="1.0"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:html="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:wc="https://github.com/nin-jin/wc"
    xmlns:doc="https://github.com/nin-jin/doc"
    >

<xsl:template match=" doc:pack ">
    <wc:vmenu-branch>
        <xsl:apply-templates />
    </wc:vmenu-branch>
</xsl:template>

<xsl:template match=" doc:file ">
    <a href="{ doc:link }" class=" reset=true ">
        <wc:vmenu-leaf>
            <xsl:value-of select=" doc:title " />
        </wc:vmenu-leaf>
    </a>
</xsl:template>

<xsl:variable name="wc:root-uri">
    <xsl:value-of select=" substring-before( substring-after( /processing-instruction()[ name() = 'xml-stylesheet' ], 'href=&quot;' ), '&quot;' ) " />
    <xsl:text>/../..</xsl:text>
</xsl:variable>
    
<xsl:template match=" /doc:root ">
    <html>
        <head>
        
            <title>
                <xsl:value-of select=" . // html:h1[ 1 ] " />
            </title>
            <meta http-equiv="content-type" content="text/html;charset=utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1"/>
            <link href="{$wc:root-uri}/-mix+doc/index.css" rel="stylesheet" />
            <script src="{$wc:root-uri}/-mix+doc/index.js?">//</script>

        </head>
        <body>
            <xsl:copy>
                <xsl:apply-templates select=" @* " />
                <wc:desktop>
                    <wc:sidebar class=" align=left ">
                        <wc:vmenu-root>
                            <xsl:apply-templates select=" document( '../-mix/index.doc.xml', / ) / * / node() " />
                        </wc:vmenu-root>
                    </wc:sidebar>
                
                    <wc:sidebar class=" align=right ">
                        <wc:vmenu-root>
                            <a href="../-mix/index.js" class=" reset=true ">
                                <wc:vmenu-leaf>index.js</wc:vmenu-leaf>
                            </a>
                            <a href="../-mix/index.css" class=" reset=true ">
                                <wc:vmenu-leaf>index.css</wc:vmenu-leaf>
                            </a>
                            <a href="../-mix/index.xsl" class=" reset=true ">
                                <wc:vmenu-leaf>index.xsl</wc:vmenu-leaf>
                            </a>
                        </wc:vmenu-root>
                    </wc:sidebar>
                    
                    <wc:spacer>
                        <wc:paper>
                            <wc:spacer>
                            
                                <xsl:apply-templates />
                                
                            </wc:spacer>
                        </wc:paper>
                    </wc:spacer>
                    
                    <wc:footer>
                        License: <a href="http://ru.wikipedia.org/wiki/%D0%9E%D0%B1%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5_%D0%B4%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B5">Public Domain</a>
                    </wc:footer>

                </wc:desktop>
            </xsl:copy>
            
        </body>
    </html>
</xsl:template>

</xsl:stylesheet>
