<t:stylesheet
    version="1.0"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:h="http://www.w3.org/1999/xhtml"
    xmlns:t="http://www.w3.org/1999/XSL/Transform"
    xmlns:wc="https://github.com/nin-jin/wc"
    xmlns:doc="https://github.com/nin-jin/doc"
    >

<t:template match=" doc:pack ">
    <wc:vmenu-branch>
        <t:apply-templates />
    </wc:vmenu-branch>
</t:template>

<t:template match=" doc:file ">
    <a href="{ doc:link }" class=" reset=true ">
        <wc:vmenu-leaf>
            <t:value-of select=" doc:title " />
        </wc:vmenu-leaf>
    </a>
</t:template>

<t:variable name="wc:root-uri">
    <t:value-of select=" substring-before( substring-after( /processing-instruction()[ name() = 'xml-stylesheet' ], 'href=&quot;' ), '&quot;' ) " />
    <t:text>/../..</t:text>
</t:variable>
    
<t:template match=" /doc:root ">
    <html>
        <head>
        
            <title>
                <t:value-of select=" . // h:h1[ 1 ] " />
            </title>
            <meta http-equiv="content-type" content="text/html;charset=utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1"/>
            <link href="{$wc:root-uri}/-mix+doc/index.css" rel="stylesheet" />
            <!-- $wc:root-uri не подставляется <t:comment><![CDATA[[if IE ]><script src="{$wc:root-uri}/-mix+doc/compiled.vml.js">//</script><![endif]]]></t:comment>-->
            <script src="{$wc:root-uri}/-mix+doc/index.js?">//</script>

        </head>
        <body>
            <t:copy>
                <t:apply-templates select=" @* " />
                <wc:desktop>
                    <wc:sidebar class=" align=left ">
                        <wc:vmenu-root>
                            <t:apply-templates select=" document( '../-mix/index.doc.xml', / ) / * / node() " />
                        </wc:vmenu-root>
                    </wc:sidebar>
                
                    <wc:sidebar class=" align=right ">
                        <wc:vmenu-root>
                            <a href="../-mix/compiled.js" class=" reset=true ">
                                <wc:vmenu-leaf>compiled.js</wc:vmenu-leaf>
                            </a>
                            <a href="../-mix/compiled.vml.js" class=" reset=true ">
                                <wc:vmenu-leaf>compiled.vml.js</wc:vmenu-leaf>
                            </a>
                            <a href="../-mix/compiled.css" class=" reset=true ">
                                <wc:vmenu-leaf>compiled.css</wc:vmenu-leaf>
                            </a>
                            <a href="../-mix/compiled.xsl" class=" reset=true ">
                                <wc:vmenu-leaf>compiled.xsl</wc:vmenu-leaf>
                            </a>
                        </wc:vmenu-root>
                    </wc:sidebar>
                    
                    <wc:spacer>
                        <wc:paper>
                            <wc:spacer>
                            
                                <t:apply-templates />
                                
                            </wc:spacer>
                        </wc:paper>
                    </wc:spacer>
                    
                    <wc:footer>
                        License: <a href="http://ru.wikipedia.org/wiki/%D0%9E%D0%B1%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5_%D0%B4%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B5">Public Domain</a>
                    </wc:footer>

                </wc:desktop>
            </t:copy>
            
        </body>
    </html>
</t:template>

</t:stylesheet>
