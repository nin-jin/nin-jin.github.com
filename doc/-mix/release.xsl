<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><!-- ../../wc/demo/wc-demo.xsl?MEM2FZ -->

<xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" match=" wc_demo/text() ">
    <textarea>
        <xsl:copy/>
    </textarea>
</xsl:template>

<!-- ../list/doc_list.xsl?MF5YSW -->

<xsl:output xmlns:xsl="http://www.w3.org/1999/XSL/Transform" method="html"/>

<xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" match=" doc_list ">
    <html wc_reset="true">
        <head>

            <title>
                <xsl:value-of select=" @doc_title "/>
            </title>
            <meta charset="utf-8"/>
            <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1"/>

            <link href="../-mix/release.css" rel="stylesheet"/>
            <script src="../-mix/release.js?">//</script>

            <script src="../../doc/-mix/bundle.js?">//</script>

        </head>
        <body wc_reset="true">
            
            <wc_desktop>
                
                <xsl:apply-templates select=" . " mode="doc_list_links"/>
                
                <xsl:apply-templates select=" * "/>
                
                <wc_footer>
                    <xsl:text>License: </xsl:text>
                    <a wc_link="true" href="http://ru.wikipedia.org/wiki/%D0%9E%D0%B1%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5_%D0%B4%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B5">
                        <xsl:text>Public Domain</xsl:text>
                    </a>
                </wc_footer>
                
            </wc_desktop>
            
        </body>
    </html>
</xsl:template>

<xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" match=" doc_list / doc_root ">
    <wc_spacer>
        <wc_paper>
            <wc_article id="{ @doc_link }">
                <wc_article_title>
                    <h1 wc_reset="true">
                        <a href="{ @doc_link }" wc_reset="true">
                            <xsl:value-of select=" @doc_title "/>
                        </a>
                    </h1>
                </wc_article_title>
                <wc_article_content>
                    <xsl:apply-templates/>
                </wc_article_content>
            </wc_article>
        </wc_paper>
    </wc_spacer>
</xsl:template>

<xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" match=" doc_list " mode="doc_list_links">
    <wc_sidebar>
        <wc_sidebar_panel wc_sidebar_edge="left">
            <wc_vmenu_root>
                <a wc_reset="true" href="../-mix/release.doc.xhtml">
                    <wc_vmenu_leaf>
                        <xsl:value-of select=" 'MIX' "/>
                    </wc_vmenu_leaf>
                </a>
                <xsl:apply-templates select=" doc_root " mode="doc_list_links"/>
            </wc_vmenu_root>
        </wc_sidebar_panel>
    </wc_sidebar>
</xsl:template>

<xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" match=" doc_list / doc_root " mode="doc_list_links">
    <a href="{ @doc_link }" wc_reset="true">
        <wc_vmenu_leaf>
            <xsl:value-of select=" @doc_title "/>
        </wc_vmenu_leaf>
    </a>
</xsl:template>

<!-- ../root/doc_root.xsl?MF5YPQ -->

<xsl:output xmlns:xsl="http://www.w3.org/1999/XSL/Transform" method="html"/>

<xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" match=" doc_root ">
    <html wc_reset="true">
        <head>
        
            <title>
                <xsl:value-of select=" @doc_title "/>
            </title>
            <meta charset="utf-8"/>
            <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1"/>
            
            <link href="../-mix/dev.css" rel="stylesheet"/>
            <script src="../-mix/dev.js?">//</script>

            <link href="../../doc/-mix/dev.css" rel="stylesheet"/>
            <script src="../../doc/-mix/dev.js?">//</script>
            
        </head>
        <body wc_reset="true">
            <wc_desktop>
                
                <xsl:apply-templates select=" document( '../-mix/release.doc.xhtml', . ) / doc_list " mode="doc_list_links"/>
                
                <wc_spacer>
                    <wc_paper>
                        <wc_article>
                            <wc_article_title>
                                <h1 wc_reset="true">
                                    <xsl:value-of select=" @doc_title "/>
                                </h1>
                            </wc_article_title>
                            <wc_article_content>
                                <xsl:apply-templates/>
                            </wc_article_content>
                        </wc_article>
                    </wc_paper>
                </wc_spacer>
                
                <wc_footer>
                    <xsl:text>License: </xsl:text>
                    <a wc_link="true" href="http://ru.wikipedia.org/wiki/%D0%9E%D0%B1%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5_%D0%B4%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B5">
                        <xsl:text>Public Domain</xsl:text>
                    </a>
                </wc_footer>
                
            </wc_desktop>
        </body>
    </html>
</xsl:template>

<xsl:template xmlns:xsl="http://www.w3.org/1999/XSL/Transform" match=" doc_root // * ">
    <xsl:element name="{ local-name() }">
        <xsl:copy-of select=" @* "/>
        <xsl:apply-templates select=" node() "/>
    </xsl:element>
</xsl:template>

</xsl:stylesheet>