<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:wc="https://github.com/nin-jin/wc" xmlns:doc="https://github.com/nin-jin/doc" xmlns:so="https://github.com/nin-jin/so"><!-- so/XStyle/so_XStyle_Base.xsl -->

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

<!-- so/Error/so_Error.xsl -->

<xsl:template xmlns:wc="https://github.com/nin-jin/wc" match=" so:Error ">
    <wc:spacer>
        <wc:paper>
            <wc:error>
                <xsl:apply-templates select=" text() "/>
            </wc:error>
        </wc:paper>
    </wc:spacer>
</xsl:template>

<!-- so/gist/so_gist.xsl -->
    
    <xsl:template xmlns:wc="https://github.com/nin-jin/wc" match=" so:gist ">
        <wc:spacer>
            <wc:top-tool>
                <wc:top-tool_pane>
                    <form method="MOVE" action="?">
                        <wc:top-tool_item>
                            <input name="gist" value="{ so:gist_name }" placeholder="gist"/>
                        </wc:top-tool_item>
                        <wc:top-tool_hidden>
                            <input name="from" value="{ so:gist_uri }" type="hidden"/>
                            <input type="submit" value="&#x418;&#x437;&#x43C;&#x435;&#x43D;&#x438;&#x442;&#x44C;"/>
                        </wc:top-tool_hidden>
                    </form>
                    <xsl:apply-templates select="." mode="so:gist_permalink"/>
                </wc:top-tool_pane>
            </wc:top-tool>
            <wc:paper>
                <wc:spacer>
                    <wc:net-bridge wc:net-bridge_resource="{ so:gist_uri }" wc:net-bridge_field="content">
                        <wc:editor wc:editor_hlight="md">
                            <xsl:apply-templates/>
                        </wc:editor>
                    </wc:net-bridge>
                </wc:spacer>
            </wc:paper>
        </wc:spacer>
    </xsl:template>
    
    <xsl:template match=" so:gist " mode="so:gist_permalink"/>
    <xsl:template xmlns:wc="https://github.com/nin-jin/wc" match=" so:gist[ so:gist_uri ] " mode="so:gist_permalink">
        <wc:top-tool_item>
            <wc:permalink title="&#x421;&#x441;&#x44B;&#x43B;&#x43A;&#x430; &#x43D;&#x430; &#x44D;&#x442;&#x443; &#x437;&#x430;&#x43F;&#x438;&#x441;&#x44C;">
                <a href="{ so:gist_uri }">#</a>
            </wc:permalink>
        </wc:top-tool_item>
    </xsl:template>
    
    <xsl:template match=" so:gist_uri "/>
    <xsl:template match=" so:gist_name "/>
    <xsl:template match=" so:gist_author "/>

    <xsl:template match=" so:gist_content ">
        <xsl:apply-templates/>
    </xsl:template>
    
<!-- so/gist/so_gist_aside.xsl -->
    
    <xsl:template match=" so:gist_aside ">
        <xsl:apply-templates mode="so:gist_aside"/>
    </xsl:template>
    
    <xsl:template match=" html:include " mode="so:gist_aside">
        <xsl:apply-templates select=" document( @href, . ) / * " mode="so:gist_aside"/>
    </xsl:template>
    
    <xsl:template xmlns:wc="https://github.com/nin-jin/wc" match=" so:gist " mode="so:gist_aside">
    
        <wc:sidebar class=" align=left ">
            <wc:net-bridge wc:net-bridge_resource="{ so:gist_uri }">
                <wc:editor class=" hlight=md ">
                    <xsl:apply-templates select=" so:gist_content / node() "/>
                </wc:editor>
            </wc:net-bridge>
        </wc:sidebar>
        
    </xsl:template>

<!-- so/gist/so_gist_creator.xsl -->
    
    <xsl:template match=" so:gist_creator ">
        <form method="GET" action="?">
            <input name="gist" value="{ so:gist_name }" placeholder="gist"/>
            <input name="author" value="{ so:gist_author }" type="hidden"/>
            <input type="submit" value="&#x421;&#x43E;&#x437;&#x434;&#x430;&#x442;&#x44C;"/>
        </form>
    </xsl:template>

<!-- so/page/so_page.xsl -->
    
    <xsl:template xmlns:wc="https://github.com/nin-jin/wc" match=" so:page ">
        
        <html>
            <head>
                
                <title xml:space="preserve">
                    <xsl:value-of select=" so:page_title "/>
                </title>
                
                <meta http-equiv="content-type" content="text/html;charset=utf-8"/>
                <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1"/>
                
                <xsl:apply-templates select=" so:page_stylesheet " mode="so:page_special"/>
                
            </head>
            <body>
                <wc:desktop>
                    
                    <a href="?gist"><wc:logo>Gist!</wc:logo></a>
                    
                    <xsl:apply-templates select=" so:page_aside " mode="so:page_special"/>
                    
                    <xsl:apply-templates select=" node()[ name() ] "/>
                    
                    <xsl:apply-templates select=" so:page_script " mode="so:page_special"/>
                    
                </wc:desktop>
            </body>
        </html>
        
    </xsl:template>

    <xsl:template match=" so:page_stylesheet "/>
    <xsl:template match=" so:page_stylesheet " mode="so:page_special">
        <link href="{ . }" rel="stylesheet"/>
    </xsl:template>

    <xsl:template match=" so:page_script "/>
    <xsl:template match=" so:page_script " mode="so:page_special">
        <script src="{ . }">//</script>
    </xsl:template>

    <xsl:template match=" so:page_title "/>
    
    <xsl:template match=" so:page_aside "/>
    <xsl:template xmlns:wc="https://github.com/nin-jin/wc" match=" so:page_aside " mode="so:page_special">
        <wc:sidebar wc:sidebar_align="right">
            <wc:editor wc:editor_hlight="tags">
                <xsl:text> </xsl:text>
            </wc:editor>
        </wc:sidebar>
    </xsl:template>
    
<!-- so/path/so_path.xsl -->
    
    <xsl:template xmlns:wc="https://github.com/nin-jin/wc" match=" so:path ">
        <wc:path>
            <xsl:apply-templates/>
        </wc:path>
    </xsl:template>

    <xsl:template xmlns:wc="https://github.com/nin-jin/wc" match=" so:path_item ">
        <xsl:text>/</xsl:text>
        <wc:path_item>
            <a href="{ so:path_link }">
                <xsl:apply-templates select=" so:path_title "/>
            </a>
        </wc:path_item>
    </xsl:template>

    <xsl:template match=" so:path_title ">
        <xsl:apply-templates/>
    </xsl:template>

</xsl:stylesheet>