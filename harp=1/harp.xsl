<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:output method="xml" />

    <xsl:template match="/response">
		<html>
			<head>
				<title>harp=1</title>
				<link rel="stylesheet" href="harp.css" />
				<script src="harp.js"></script>
			</head>
			<body harp_response="{local-name()}">
				<xsl:apply-templates select="*" />
			</body>
		</html>
    </xsl:template>
	
    <xsl:template match="/response/*">
		<a harp_resource="{local-name()}" id="{@id}">
			<a harp_resource_uri="{local-name()}" href="{@id}.xml">
				<xsl:value-of select="@id" />
			</a>
			<a harp_resource_type="{local-name()}">
				<xsl:value-of select="local-name()" />
			</a>
			<!--<a harp_field_list="{local-name()}">-->
				<xsl:apply-templates select="*" />
			<!--</a>-->
		</a>
    </xsl:template>

    <xsl:template match="/response/*/*">
		<xsl:variable name="fieldName" select="local-name()" />
		<xsl:variable name="fieldType" select=" document( concat( ../scheme , '.xml' ) , . ) /*/*/*[ local-name() = $fieldName ] " />
		<a harp_field="{$fieldName}">
			<a harp_indent="{$fieldName}" xml:space='preserve'>&#9;</a>
			<xsl:choose>
				<xsl:when test=" $fieldType ">
					<a harp_field_name="{$fieldName}">
						<xsl:value-of select="$fieldName" />
					</a>
				</xsl:when>
				<xsl:otherwise>
					<a harp_field_name="{$fieldName}" harp_field_invalid="" title="Undefined type">
						<xsl:value-of select="$fieldName" />
					</a>
				</xsl:otherwise>
			</xsl:choose>
			<a harp_space="{$fieldName}" xml:space='preserve'> =</a>
			<xsl:choose>
				<xsl:when test=" starts-with( $fieldType , 'scheme=' ) ">
					<a harp_field_value="{.}" href="{.}.xml">
						<xsl:value-of select="." />
					</a>
				</xsl:when>
				<xsl:otherwise>
					<a harp_field_value="{.}">
						<xsl:value-of select="." />
					</a>
				</xsl:otherwise>
			</xsl:choose>
		</a>
    </xsl:template>

</xsl:stylesheet>