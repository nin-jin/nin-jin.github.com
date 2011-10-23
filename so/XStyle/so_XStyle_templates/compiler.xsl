<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:output method="xml" />

    <xsl:template match=" node() | @* ">
        <xsl:copy>
            <xsl:apply-templates select=" node() | @*" />
        </xsl:copy>
    </xsl:template>

    <xsl:template match=" xstyle ">
        <xsl:element name="xsl:stylesheet">
            <xsl:apply-templates select=" @* " />
            <xsl:attribute name="version">1.0</xsl:attribute>
            <xsl:apply-templates select=" node() " />
        </xsl:element>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'val' ] ">
        <xsl:element name="xsl:value-of">
            <xsl:attribute name="select">
                <xsl:value-of select="." />
            </xsl:attribute>
        </xsl:element>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'copy' ] ">
        <xsl:element name="xsl:copy-of">
            <xsl:attribute name="select">
                <xsl:value-of select="." />
            </xsl:attribute>
        </xsl:element>
    </xsl:template>
    <xsl:template match=" processing-instruction()[ name() = 'copy-' ] ">
        <xsl:text disable-output-escaping="yes">&lt;xsl:copy attribute-sets="</xsl:text>
            <xsl:value-of select=" normalize-space( . ) " />
        <xsl:text disable-output-escaping="yes">" &gt;</xsl:text>
    </xsl:template>
    <xsl:template match=" processing-instruction()[ name() = 'copy.' ] ">
        <xsl:text disable-output-escaping="yes">&lt;/xsl:copy&gt;</xsl:text>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'if' ] ">
        <xsl:variable name="test" select=" substring-before( concat( ., '\' ), '\' ) " />
        <xsl:variable name="xpath">
            <xsl:choose>
                <xsl:when test=" $test = . ">
                    <xsl:value-of select=" . " />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select=" substring-after( ., '\' ) " />
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:element name="xsl:if" >
            <xsl:attribute name="test">
                <xsl:value-of select=" $test " />
            </xsl:attribute>
            <xsl:element name="xsl:value-of" >
                <xsl:attribute name="select">
                    <xsl:value-of select=" $xpath " />
                </xsl:attribute>
            </xsl:element>
        </xsl:element>
    </xsl:template>
    <xsl:template match=" processing-instruction()[ name() = 'if-' ] ">
        <xsl:text disable-output-escaping="yes">&lt;xsl:if test=" </xsl:text>
            <xsl:value-of select="." />
        <xsl:text disable-output-escaping="yes">"&gt;</xsl:text>
    </xsl:template>
    <xsl:template match=" processing-instruction()[ name() = 'if.' ] ">
        <xsl:text disable-output-escaping="yes">&lt;/xsl:if&gt;</xsl:text>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'match-' ] ">
        <xsl:variable name="match" select=" substring-before( concat( ., '\' ), '\' ) " />
        <xsl:variable name="mode" select=" normalize-space( substring-after( ., '\' ) ) " />
        <xsl:text disable-output-escaping="yes">&lt;xsl:template match=" </xsl:text>
            <xsl:value-of select=" $match " />
        <xsl:text> "</xsl:text>
        <xsl:if test=" $mode ">
            <xsl:text> mode="</xsl:text>
                <xsl:value-of select=" $mode " />
            <xsl:text>"</xsl:text>
        </xsl:if>
        <xsl:text disable-output-escaping="yes"> &gt;</xsl:text>
    </xsl:template>
    <xsl:template match=" processing-instruction()[ name() = 'template-' ] ">
        <xsl:text disable-output-escaping="yes">&lt;xsl:template name="</xsl:text>
            <xsl:value-of select=" substring-before( ., ' ' )" />
        <xsl:text disable-output-escaping="yes">"&gt;</xsl:text>
    </xsl:template>
    <xsl:template match=" processing-instruction()[ name() = 'match.' or name() = 'template.' ] ">
        <xsl:text disable-output-escaping="yes">&lt;/xsl:template&gt;</xsl:text>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'call' or name() = 'call-' ] ">
        <xsl:text disable-output-escaping="yes">&lt;xsl:call-template </xsl:text>
            <xsl:text>name="</xsl:text>
                <xsl:value-of select=" normalize-space( . ) " />
            <xsl:text>" </xsl:text>
            <xsl:if test=" name() = 'call' ">/</xsl:if>
        <xsl:text disable-output-escaping="yes">&gt;</xsl:text>
    </xsl:template>
    <xsl:template match=" processing-instruction()[ name() = 'call.' ] ">
        <xsl:text disable-output-escaping="yes">&lt;/xsl:call-template&gt;</xsl:text>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'apply' or name() = 'apply-' ] ">
        <xsl:variable name="select" select=" substring-before( concat( ., '\' ), '\' ) " />
        <xsl:variable name="mode" select=" normalize-space( substring-after( ., '\' ) ) " />
        <xsl:text disable-output-escaping="yes">&lt;xsl:apply-templates </xsl:text>
            <xsl:if test=" $select ">
                <xsl:text>select=" </xsl:text>
                    <xsl:value-of select=" $select " />
                <xsl:text>" </xsl:text>
            </xsl:if>
            <xsl:if test=" $mode ">
                <xsl:text>mode="</xsl:text>
                    <xsl:value-of select=" $mode " />
                <xsl:text>" </xsl:text>
            </xsl:if>
            <xsl:if test=" name() = 'apply' ">/</xsl:if>
        <xsl:text disable-output-escaping="yes">&gt;</xsl:text>
    </xsl:template>
    <xsl:template match=" processing-instruction()[ name() = 'apply.' ] ">
        <xsl:text disable-output-escaping="yes">&lt;/xsl:apply-templates&gt;</xsl:text>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'arg' or name() = 'param' or name() = 'var' ] ">
        <xsl:variable name="name" select=" normalize-space( substring-before( ., '\' ) ) " />
        <xsl:variable name="select" select=" substring-after( ., '\' ) " />
        <xsl:text disable-output-escaping="yes">&lt;</xsl:text>
            <xsl:apply-templates select=" . " mode="tag-name" />
            <xsl:text> name="</xsl:text>
                <xsl:value-of select=" $name " />
            <xsl:text>" </xsl:text>
            <xsl:if test=" $select ">
                <xsl:text>select=" </xsl:text>
                    <xsl:value-of select=" $select " />
                <xsl:text>" </xsl:text>
            </xsl:if>
        <xsl:text disable-output-escaping="yes">/&gt;</xsl:text>
    </xsl:template>
    <xsl:template match=" processing-instruction()[ name() = 'arg-' or name() = 'param-' or name() = 'var-' ] ">
        <xsl:text disable-output-escaping="yes">&lt;</xsl:text>
            <xsl:apply-templates select=" . " mode="tag-name" />
        <xsl:text disable-output-escaping="yes"> name="</xsl:text>
            <xsl:value-of select=" normalize-space( . ) " />
        <xsl:text disable-output-escaping="yes">" &gt;</xsl:text>
    </xsl:template>
    <xsl:template match=" processing-instruction()[ name() = 'arg.' or name() = 'param.' or name() = 'var.' ] ">
        <xsl:text disable-output-escaping="yes">&lt;/</xsl:text>
            <xsl:apply-templates select=" . " mode="tag-name" />
        <xsl:text disable-output-escaping="yes">&gt;</xsl:text>
    </xsl:template>
    <xsl:template match=" processing-instruction() " mode="tag-name">
        <xsl:text>xsl:</xsl:text><xsl:value-of select=" translate( name(), '-.', '' ) " />
    </xsl:template>
    <xsl:template match=" processing-instruction()[ translate( name(), '-.', '' ) = 'arg' ] " mode="tag-name">xsl:with-param</xsl:template>
    <xsl:template match=" processing-instruction()[ translate( name(), '-.', '' ) = 'var' ] " mode="tag-name">xsl:variable</xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'include' ] ">
        <xsl:variable name="uri" select=" normalize-space( . ) " />
        <xsl:text disable-output-escaping="yes">&#10;</xsl:text>
            <xsl:comment>
                <xsl:text>from </xsl:text>
                <xsl:value-of select=" $uri " />
            </xsl:comment>
                <xsl:apply-templates select=" document( $uri )/*/node()" />
            <xsl:comment>
                <xsl:text>/from </xsl:text>
                <xsl:value-of select=" $uri " />
            </xsl:comment>
        <xsl:text disable-output-escaping="yes">&#10;</xsl:text>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'strip-space' ] ">
        <xsl:text disable-output-escaping="yes">&lt;xsl:strip-space elements=" </xsl:text>
            <xsl:value-of select=" normalize-space( . ) " />
        <xsl:text disable-output-escaping="yes"> " /&gt;</xsl:text>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'preserve-space' ] ">
        <xsl:text disable-output-escaping="yes">&lt;xsl:preserve-space elements=" </xsl:text>
            <xsl:value-of select=" normalize-space( . ) " />
        <xsl:text disable-output-escaping="yes"> " /&gt;</xsl:text>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'key' ] ">
        <xsl:variable name="name" select=" normalize-space( substring-before( ., ' \ ' ) ) " />
        <xsl:variable name="tail" select=" substring-after( ., ' \ ' ) " />
        <xsl:variable name="match" select=" substring-before( $tail, ' \ ' ) " />
        <xsl:variable name="use" select=" substring-after( $tail, ' \ ' ) " />
        <xsl:text disable-output-escaping="yes">&lt;xsl:key name="</xsl:text>
            <xsl:value-of select=" $name " />
        <xsl:text>" match=" </xsl:text>
            <xsl:value-of select=" $match " />
        <xsl:text> " use=" </xsl:text>
            <xsl:value-of select=" $use " />
        <xsl:text disable-output-escaping="yes"> " /&gt;</xsl:text>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'text-' ] ">
        <xsl:text disable-output-escaping="yes">&lt;xsl:text&gt;</xsl:text>
    </xsl:template>
    <xsl:template match=" processing-instruction()[ name() = 'text.' ] ">
        <xsl:text disable-output-escaping="yes">&lt;/xsl:text&gt;</xsl:text>
    </xsl:template>
    <xsl:template match=" processing-instruction()[ name() = 'text' ] ">
        <xsl:element name="xsl:text">
            <xsl:value-of select=" . " />
        </xsl:element>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'space' ] ">
        <xsl:element name="xsl:text">
            <xsl:text> </xsl:text>
        </xsl:element>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'attr-' ] ">
        <xsl:text disable-output-escaping="yes">&lt;xsl:attribute name="</xsl:text>
            <xsl:value-of select=" normalize-space( . )" />
        <xsl:text disable-output-escaping="yes">"&gt;</xsl:text>
    </xsl:template>
    <xsl:template match=" processing-instruction()[ name() = 'attr.' ] ">
        <xsl:text disable-output-escaping="yes">&lt;/xsl:attribute&gt;</xsl:text>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'DOCTYPE' or name() = 'doctype' ] ">
        <xsl:variable name="system" select=" substring-before( substring-after( ., '&quot; &quot;' ), '&quot;' ) " />
        <xsl:variable name="public" select=" substring-after( substring-before( ., '&quot; &quot;' ), '&quot;' ) " />
        <xsl:element name="xsl:output">
            <xsl:if test=" $public ">
                <xsl:attribute name="doctype-public">
                    <xsl:value-of select=" $public " />
                </xsl:attribute>
            </xsl:if>
            <xsl:if test=" $system ">
                <xsl:attribute name="doctype-system">
                    <xsl:value-of select=" $system " />
                </xsl:attribute>
            </xsl:if>
        </xsl:element>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'comment' ] ">
        <xsl:element name="xsl:comment">
            <xsl:value-of select=" . " />
        </xsl:element>
    </xsl:template>

    <xsl:template match=" processing-instruction()[ name() = 'pi' ] ">
        <xsl:variable name="name" select=" normalize-space( substring-before( ., ' \ ' ) ) " />
        <xsl:variable name="content" select=" substring-after( ., ' \ ' ) " />
        <xsl:element name="xsl:processing-instruction">
            <xsl:attribute name="name">
                <xsl:value-of select=" $name " />
            </xsl:attribute>
            <xsl:value-of select=" $content " />
        </xsl:element>
    </xsl:template>

</xsl:stylesheet>