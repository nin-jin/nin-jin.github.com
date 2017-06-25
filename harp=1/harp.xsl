<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:output method="xml" />

    <xsl:template match="/harp">
		<html>
			<head>
				<link rel="stylesheet" href="harp.css" />
			</head>
			<body harp_response="{ local-name() }">
				<xsl:apply-templates select="*" />
			</body>
		</html>
    </xsl:template>

    <xsl:template match="/harp/*">
		<div harp_resource="{ local-name() }" id="{ @id }">
            <div harp_resource_header="{ local-name() }">
    			<a harp_resource_uri="{ local-name() }" href="{ @id }">
    				<xsl:value-of select="@id" />
    			</a>
                <span harp_indent="{ local-name() }" xml:space='preserve'> </span>
    			<a harp_resource_type="{ local-name() }" href="{ scheme }">
    				<xsl:value-of select="local-name()" />
    			</a>
            </div>
			<xsl:apply-templates select="*" />
		</div>
    </xsl:template>

    <xsl:template match="/harp/*/*">
		<xsl:variable name="fieldName" select="local-name()" />
		<xsl:variable name="fieldType" select=" document( ../scheme , . ) /*/*/*[ local-name() = $fieldName ] " />
		<a harp_field="{ $fieldName }">
			<span harp_indent="{$fieldName}" xml:space='preserve'>&#9;</span>
			<xsl:choose>
                <xsl:when test=" starts-with( $fieldType , 'scheme=' ) ">
                    <a harp_field_name="{ $fieldName }" href="{ $fieldType }">
                        <xsl:value-of select="$fieldName" />
                    </a>
                </xsl:when>
				<xsl:when test=" $fieldType ">
                    <a harp_field_name="{ $fieldName }">
						<xsl:value-of select="$fieldName" />
					</a>
				</xsl:when>
				<xsl:otherwise>
					<a harp_field_name="{ $fieldName }" harp_field_invalid="" title="Undefined type">
						<xsl:value-of select="$fieldName" />
					</a>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test=" starts-with( $fieldType , 'scheme=' ) ">
                    <span harp_space="{$fieldName}" xml:space='preserve'> </span>
                    <span>
    					<a harp_field_value="{.}" href="{.}">
    						<xsl:value-of select="." />
    					</a>
                    </span>
				</xsl:when>
				<xsl:otherwise>
                    <span harp_space="{$fieldName}" xml:space='preserve'> \</span>
					<span harp_field_value="{.}">
                        <xsl:value-of select="." />
                    </span>
				</xsl:otherwise>
			</xsl:choose>
		</a>
    </xsl:template>

</xsl:stylesheet>
