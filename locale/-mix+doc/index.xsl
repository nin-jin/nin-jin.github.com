<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:wc="https://github.com/nin-jin/wc" xmlns:doc="https://github.com/nin-jin/doc" xmlns:locale="https://github.com/nin-jin/locale"><!-- so/XStyle/so_XStyle_Base.xsl -->

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

<!-- wc/demo/wc-test-js.xsl -->

<xsl:template match=" wc:demo/text() ">
    <textarea>
        <xsl:copy/>
    </textarea>
</xsl:template>

<!-- wc/js-test/wc_js-test.xsl -->

<xsl:template match=" wc:js-test/text() ">
    <textarea class=" wc_js-test_textarea">
        <xsl:copy/>
    </textarea>
</xsl:template>

<!-- doc/root/doc-root.xsl -->

<xsl:template xmlns:wc="https://github.com/nin-jin/wc" match=" doc:pack ">
    <wc:vmenu_branch>
        <xsl:apply-templates/>
    </wc:vmenu_branch>
</xsl:template>

<xsl:template xmlns:wc="https://github.com/nin-jin/wc" match=" doc:file ">
    <a href="{ doc:link }" class=" reset=true ">
        <wc:vmenu_leaf>
            <xsl:value-of select=" doc:title "/>
        </wc:vmenu_leaf>
    </a>
</xsl:template>

<xsl:variable name="wc:root-uri">
    <xsl:value-of select=" substring-before( substring-after( /processing-instruction()[ name() = 'xml-stylesheet' ], 'href=&quot;' ), '&quot;' ) "/>
    <xsl:text>/../..</xsl:text>
</xsl:variable>
    
<xsl:template xmlns:wc="https://github.com/nin-jin/wc" match=" /doc:root ">
    <html>
        <head>
        
            <title>
                <xsl:value-of select=" . // html:h1[ 1 ] "/>
            </title>
            <meta http-equiv="content-type" content="text/html;charset=utf-8"/>
            <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1"/>
            <link href="{$wc:root-uri}/-mix+doc/index.css" rel="stylesheet"/>
            <script src="{$wc:root-uri}/-mix+doc/index.js?">//</script>

        </head>
        <body>
            <xsl:copy>
                <xsl:apply-templates select=" @* "/>
                <wc:desktop>
                    <wc:sidebar wc:sidebar_align="left">
                        <wc:vmenu_root>
                            <xsl:apply-templates select=" document( '../-mix/index.doc.xml', / ) / * / node() "/>
                        </wc:vmenu_root>
                    </wc:sidebar>
                
                    <wc:spacer>
                        <wc:paper>
                            <wc:spacer>
                            
                                <xsl:apply-templates/>
                                
                            </wc:spacer>
                            <!--<wc:spacer>-->
                                <!--<wc:disqus>
                                    ...
                                </wc:disqus>-->
                                <!--<div id="disqus_thread">-->
                                <!--    <script>-->
                                <!--        disqus_developer= 1-->
                                <!--        disqus_url= '//' + document.location.host + document.location.pathname-->
                                <!--    </script>-->
                                <!--    <script src="http://nin-jin.disqus.com/embed.js" async="async" defer="defer">//</script>-->
                                <!--</div>-->
                            <!--</wc:spacer>-->
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

<!-- locale/locale/locale.xsl -->

    <xsl:param name="locale:lang" select=" / * / @xml:lang "/>
    <xsl:param name="locale:path" select=" concat( '../-mix/index.locale=', $locale:lang, '.xml' ) "/>

</xsl:stylesheet>