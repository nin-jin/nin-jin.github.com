<t:stylesheet
    version="1.0"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:h="http://www.w3.org/1999/xhtml"
    xmlns:t="http://www.w3.org/1999/XSL/Transform"
    xmlns:wc="https://github.com/nin-jin/wc"
    xmlns:doc="https://github.com/nin-jin/doc"
    >

<t:output method="html" />

<t:template match=" @* | node() ">
    <t:copy>
        <t:apply-templates select=" @* " />
        <t:apply-templates select=" node() " />
    </t:copy>
</t:template>
<t:template match=" processing-instruction() " />

</t:stylesheet>
