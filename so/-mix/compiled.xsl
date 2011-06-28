<?xml version="1.0"?>
<stylesheet xmlns="http://www.w3.org/1999/XSL/Transform" version="1.0">

<!-- so/XStyle/so_XStyle_Base.xsl -->

<t:output xmlns:t="http://www.w3.org/1999/XSL/Transform" method="html"/>

<t:template xmlns:t="http://www.w3.org/1999/XSL/Transform" match=" @* | node() ">
    <t:copy>
        <t:apply-templates select=" @* "/>
        <t:apply-templates select=" node() "/>
    </t:copy>
</t:template>
<t:template xmlns:t="http://www.w3.org/1999/XSL/Transform" match=" processing-instruction() "/>

</stylesheet>
