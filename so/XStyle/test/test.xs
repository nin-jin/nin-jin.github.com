<?xml version="1.0" encoding="UTF-8"?>
<xstyle>
    <?include ./test-inc.xs ?>
    <?match- MATCH/XPATH \ MODE_NAME ?>
        <?param NAME \ XPATH ?>
        <?param- NAME ?>
            VALUE
        <?param.?>
        <?if- TEST/XPATH ?>
            <?if TEST/XPATH \ VALUE/XPATH ?>
            <?if TEST/VALUE/XPATH ?>
            <?val VALUE/XPATH ?>
        <?if.?>
        <?call NAME ?>
        <?call- NAME ?>
            <?arg NAME \ XPATH ?>
            <?arg- NAME ?>
                VALUE
            <?arg.?>
        <?call.?>
        <?text ANY&TEXT?>
        <?text-?>
            ANY TEXT
        <?text.?>
    <?match. ?>
    <?template- NAME ?>
        <?var NAME \ XPATH ?>
        <?var- NAME ?>
            VALUE
        <?var.?>
        <?apply ?>
        <?apply SELECT/XPATH ?>
        <?apply \ MODE_NAME ?>
        <?apply- SELECT/XPATH \ MODE_NAME ?>
            <?sort- XPATH ORDER TYPE LANG CASE_ORDER ?>
        <?apply.?>
        <?copy XPATH ?>
        <?copy- ATTRIBUTE SETS ?>
            VALUE
        <?copy.?>
        <?choose-?>
            <?when TEST \ XPATH ?>
            <?when- TEST ?>
                VALUE
            <?when.?>
            <?other XPATH ?>
            <?other-?>
                VALUE
            <?other.?>
        <?choose.?>
    <?template.?>
</xstyle>
