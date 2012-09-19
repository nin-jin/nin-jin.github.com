(function() {

    var cmpNN = yr.cmpNN;
    var cmpSN = yr.cmpSN;
    var nodeset2xml = yr.nodeset2xml;
    var nodeset2boolean = yr.nodeset2boolean;
    var nodeset2attrvalue = yr.nodeset2attrvalue;
    var nodeset2scalar = yr.nodeset2scalar;
    var scalar2attrvalue = yr.scalar2attrvalue;
    var scalar2xml = yr.scalar2xml;
    var simpleScalar = yr.simpleScalar;
    var simpleBoolean = yr.simpleBoolean;
    var selectNametest = yr.selectNametest;
    var closeAttrs = yr.closeAttrs;

    var M = new yr.Module();

    //  var static : scalar
    M.v0 = "http://mailstatic.yandex.net/neo2/2.12.0/static";

    var j0 = [ 0, 'page', 0, 'page-params' ];

    //  var params : nodeset
    M.v1 = function(m, c0, i0, l0) {
        return m.s(j0, c0.root);
    };

    var j1 = [ 0, '_page' ];

    //  var page : nodeset
    M.v2 = function(m, c0, i0, l0) {
        return m.n(j1, m.v('v1', c0));
    };

    var j2 = [ 0, 'page', 0, 'folders', 0, 'folder' ];

    //  var folders : nodeset
    M.v3 = function(m, c0, i0, l0) {
        return m.s(j2, c0.root);
    };

    var j3 = [ 0, 'page', 0, 'labels', 0, 'label' ];

    //  var labels : nodeset
    M.v4 = function(m, c0, i0, l0) {
        return m.s(j3, c0.root);
    };

    var j4 = [ 0, 'symbol' ];

    var j5 = [ 0, 'id' ];

    var j6 = [ 1, 0 ];

    M.k0 = {};
    M.k0.n = function k0n(m, c0, i0, l0) {
        return m.v('v4', c0);
    };
    //  nodeset
    M.k0.u = function k0u(m, c0, i0, l0) {
        return (selectNametest('symbol', c0, [])).concat(selectNametest('id', c0, []));
    };
    //  nodeset
    M.k0.b = function k0b(m, c0, i0, l0, a0) {
        return [ c0 ];
    };
    M.k0.ut = 'nodeset';
    M.k0.bt = 'nodeset';

    M.k1 = {};
    M.k1.n = function k1n(m, c0, i0, l0) {
        return m.v('v4', c0);
    };
    //  nodeset
    M.k1.u = function k1u(m, c0, i0, l0) {
        return selectNametest('id', c0, []);
    };
    //  xml
    M.k1.b = function k1b(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += m.a(m, [ c0 ], 'href-content', a0);

        return r0;
    };
    M.k1.ut = 'nodeset';
    M.k1.bt = 'xml';

    M.k2 = {};
    M.k2.n = function k2n(m, c0, i0, l0) {
        return m.v('v3', c0);
    };
    //  nodeset
    M.k2.u = function k2u(m, c0, i0, l0) {
        return selectNametest('id', c0, []);
    };
    //  xml
    M.k2.b = function k2b(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += m.a(m, [ c0 ], 'href-content', a0);

        return r0;
    };
    M.k2.ut = 'nodeset';
    M.k2.bt = 'xml';

    //  var label-important : nodeset
    M.v5 = function(m, c0, i0, l0) {
        return m.k('k0', "priority_high", c0.root);
    };

    //  var label-important-id : nodeset
    M.v6 = function(m, c0, i0, l0) {
        return m.n(j5, m.v('v5', c0));
    };

    var j7 = [ ];

    var j8 = [ 0, 'page' ];

    var j9 = [ 0, 'page-blocks', 0, '*' ];

    var j10 = [ 0, '*' ];

    var j11 = [ 0, 'app' ];

    var j12 = [ 0, 'left-box' ];

    var j13 = [ 0, 'right-box' ];

    var j14 = [ 0, 'search' ];

    var j15 = [ 0, 'labels-actions' ];

    var j16 = [ 0, 'folders-actions' ];

    var j17 = [ 0, 'page', 0, 'toolbar', 0, 'item' ];

    var j18 = [ 0, 'item' ];

    function p0(m, c0, i0, l0) {
        return cmpNN(selectNametest('id', c0, []), m.v('v2', c0));
    }

    var j19 = [ 0, 'page', 2, p0 ];

    function p1(m, c0, i0, l0) {
        return nodeset2boolean( m.s(j19, c0) );
    }

    var j20 = [ 0, 'item', 2, p1 ];

    var j21 = [ 0, 'icon' ];

    var j22 = [ 0, 'action' ];

    var j23 = [ 0, 'url' ];

    var j24 = [ 0, 'name' ];

    var j25 = [ 0, 'user' ];

    function p2(m, c0, i0, l0) {
        return simpleBoolean('user', c0);
    }

    var j26 = [ 0, 'labels', 2, p2 ];

    var j27 = [ 0, 'label' ];

    var j28 = [ 0, 'color' ];

    var j29 = [ 0, 'folder' ];

    var j30 = [ 0, 'folders' ];

    var j31 = [ 0, 'page', 0, 'folders' ];

    var j32 = [ 0, 'count' ];

    var j33 = [ 0, 'new' ];

    var j34 = [ 0, 'current_folder' ];

    var j35 = [ 0, 'clear' ];

    function p3(m, c0, i0, l0) {
        return cmpSN("outbox", selectNametest('symbol', c0, []));
    }

    var j36 = [ 0, 'folder', 2, p3 ];

    function p4(m, c0, i0, l0) {
        return simpleBoolean('symbol', c0);
    }

    var j37 = [ 0, 'folder', 2, p4 ];

    var j38 = [ 0, 'labels' ];

    var j39 = [ 0, 'page', 0, 'labels' ];

    var j40 = [ 0, 'page', 0, 'folders', 0, 'new' ];

    var j41 = [ 0, 'label', 2, p2 ];

    var j42 = [ 0, 'messages' ];

    var j43 = [ 0, 'page', 0, 'messages' ];

    var j44 = [ 0, 'details', 0, 'pager' ];

    var j45 = [ 0, 'list', 0, 'message' ];

    var j46 = [ 0, 'message' ];

    function p5(m, c0, i0, l0) {
        return cmpNN([ c0 ], m.v('v6', c0));
    }

    var j47 = [ 2, p5 ];

    var j48 = [ 0, 'date', 0, 'full' ];

    var j49 = [ 0, 'date', 0, 'short' ];

    var j50 = [ 0, 'from', 0, 'email' ];

    var j51 = [ 0, 'from', 0, 'name' ];

    var j52 = [ 0, 'subject' ];

    var j53 = [ 0, 'firstline' ];

    var j54 = [ 0, 'social' ];

    function p6(m, c0, i0, l0) {
        return simpleBoolean('social', c0);
    }

    var j55 = [ 0, 'label', 2, p6 ];

    var j56 = [ 0, 'title' ];

    function p7(m, c0, i0, l0) {
        return simpleScalar('count', c0) > 0;
    }

    var j57 = [ 0, 'message', 2, p7 ];

    var j58 = [ 0, 'pager' ];

    var j59 = [ 0, 'prev' ];

    var j60 = [ 0, 'next' ];

    var j61 = [ 0, 'n' ];

    function p8(m, c0, i0, l0) {
        return simpleBoolean('n', c0);
    }

    var j62 = [ 0, 'prev', 2, p8 ];

    var j63 = [ 0, 'next', 2, p8 ];

    // match
    M.t0 = function t0(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<html>';
        r0 += '<head>';
        r0 += '<meta http-equiv="' + "Content-Type" + '" content="' + "text/html; charset=utf-8" + '"/>';
        r0 += '<link rel="' + "stylesheet" + '" type="' + "text/css" + '" href="' + scalar2attrvalue( ( m.v('v0', c0) ) ) + "/css/_mac.css" + '"/>';
        r0 += '<title>' + "Яндекс.Почта" + '</title>';
        r0 += '</head>';
        r0 += '<body';
        a0.a = {
        };
        a0.s = 'body';
        r0 += m.a(m, selectNametest('page', c0, []), '', a0);
        r0 += closeAttrs(a0);
        r0 += '</body>';
        r0 += '</html>';

        return r0;
    };
    M.t0.j = 1;
    M.t0.a = 1;

    // match .page
    M.t1 = function t1(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div class="' + "b-page" + '">';
        r0 += '<div';
        a0.a = {
            'class': "b-page__content"
        };
        a0.s = 'div';
        r0 += m.a(m, m.s(j9, c0), 'block', a0);
        r0 += closeAttrs(a0);
        r0 += '</div>';
        r0 += '</div>';

        return r0;
    };
    M.t1.j = j8;
    M.t1.a = 0;

    // match .* : block
    M.t2 = function t2(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div';
        a0.a = {
            'class': "block-" + ( c0.name )
        };
        a0.s = 'div';
        r0 += m.a(m, [ c0 ], 'block-content', a0);
        r0 += closeAttrs(a0);
        r0 += '</div>';

        return r0;
    };
    M.t2.j = j10;
    M.t2.a = 0;

    // match .* : block-content
    M.t3 = function t3(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += m.a(m, selectNametest('*', c0, []), 'block', a0);

        return r0;
    };
    M.t3.j = j10;
    M.t3.a = 0;

    // match .* : href
    M.t4 = function t4(m, c0, i0, l0, a0) {
        var r0 = '';

        var r1 = '';
        var a1 = { a: {} };
        r1 += m.a(m, [ c0 ], 'href-content', a1);
        a0.a[ "href" ] = r1;

        return r0;
    };
    M.t4.j = j10;
    M.t4.a = 0;

    // match .app : block-content
    M.t5 = function t5(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<img alt="' + "-" + '" title="' + "Компактный вид" + '" action="' + "common.minify" + '" class="' + "b-mail-icon b-mail-icon_minify b-mail-icon_full-head-hide daria-action" + '" src="' + scalar2attrvalue( ( m.v('v0', c0) ) ) + "/blocks/b-mail-icon/_type/b-mail-icon_full-head-hide.png" + '"/>';
        r0 += '<div class="' + "b-layout" + '">';
        r0 += '<div';
        a0.a = {
            'class': "b-layout__left"
        };
        a0.s = 'div';
        r0 += m.a(m, selectNametest('left-box', c0, []), 'block', a0);
        r0 += closeAttrs(a0);
        r0 += '</div>';
        r0 += '<div class="' + "b-layout__right" + '">';
        r0 += '<div';
        a0.a = {
            'class': "b-layout__right__content"
        };
        a0.s = 'div';
        r0 += m.a(m, [ c0 ], 'service-tabs', a0);
        r0 += m.a(m, [ c0 ], 'toolbar', a0);
        r0 += m.a(m, selectNametest('right-box', c0, []), 'block', a0);
        r0 += closeAttrs(a0);
        r0 += '</div>';
        r0 += '</div>';
        r0 += '</div>';

        return r0;
    };
    M.t5.j = j11;
    M.t5.a = 0;

    // match .app : service-tabs
    M.t6 = function t6(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div class="' + "b-service-tabs" + '">';
        r0 += '<a href="' + "#inbox" + '" class="' + "b-service-tabs__item b-service-tabs__item_current b-service-tabs__item_mail" + '">' + "Письма" + '</a>';
        r0 += '<a href="' + "#contacts" + '" class="' + "b-service-tabs__item b-service-tabs__item_contacts" + '">' + "Контакты" + '</a>';
        r0 += '<a href="' + "#lenta" + '" class="' + "b-service-tabs__item b-service-tabs__item_lenta" + '">' + "Подписки" + '<span class="' + "b-mail-counter" + '">' + "682" + '</span></a>';
        r0 += '<a class="' + "b-service-tabs__item" + '" href="' + "//calendar.yandex.ru/" + '">' + "Календарь" + '</a>';
        r0 += '</div>';

        return r0;
    };
    M.t6.j = j11;
    M.t6.a = 0;

    // match .app : toolbar
    M.t7 = function t7(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div class="' + "b-toolbar" + '">';
        r0 += '<div class="' + "b-toolbar__i" + '">';
        r0 += '<div';
        a0.a = {
            'class': "b-toolbar__block b-toolbar__block_right"
        };
        a0.s = 'div';
        r0 += m.a(m, selectNametest('search', c0, []), 'block', a0);
        r0 += closeAttrs(a0);
        r0 += '<div';
        a0.a = {
            'class': "b-toolbar-dropdowns"
        };
        a0.s = 'div';
        r0 += m.a(m, selectNametest('labels-actions', c0, []), 'block', a0);
        r0 += m.a(m, selectNametest('folders-actions', c0, []), 'block', a0);
        r0 += closeAttrs(a0);
        r0 += '</div>';
        r0 += '</div>';
        r0 += '<div';
        a0.a = {
            'class': "b-toolbar__block b-toolbar__block_chevron"
        };
        a0.s = 'div';
        r0 += m.a(m, m.s(j17, c0.root), 'toolbar', a0);
        r0 += closeAttrs(a0);
        r0 += '</div>';
        r0 += '</div>';
        r0 += '</div>';

        return r0;
    };
    M.t7.j = j11;
    M.t7.a = 0;

    // match .item : toolbar
    M.t8 = function t8(m, c0, i0, l0, a0) {
        var r0 = '';

        return r0;
    };
    M.t8.j = j18;
    M.t8.a = 0;

    // match .item[ .page[ .id == page ] ] : toolbar
    M.t9 = function t9(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<a';
        a0.a = {
            'href': "#compose",
            'class': "b-toolbar__item b-toolbar__item_" + nodeset2scalar( ( selectNametest('icon', c0, []) ) ) + " daria-action",
            'action': nodeset2scalar( ( selectNametest('action', c0, []) ) )
        };
        a0.s = 'a';
        if (simpleBoolean('url', c0)) {
            a0.a[ "href" ] = simpleScalar('url', c0);
        }
        r0 += closeAttrs(a0);
        r0 += '<img src="' + scalar2attrvalue( ( m.v('v0', c0) ) ) + "/lego/blocks/b-ico/b-ico.gif" + '" class="' + "b-ico b-ico_" + nodeset2attrvalue( ( selectNametest('icon', c0, []) ) ) + '"/>';
        r0 += '<span class="' + "b-toolbar__item__label" + '">' + nodeset2xml( ( selectNametest('name', c0, []) ) ) + '</span>';
        r0 += '<span class="' + "b-toolbar__item__selected b-toolbar__item__selected_left-border" + '"></span>';
        r0 += '<span class="' + "b-toolbar__item__selected b-toolbar__item__selected_right-border" + '"></span>';
        r0 += '</a>';

        return r0;
    };
    M.t9.j = j20;
    M.t9.a = 0;

    // match .search : block-content
    M.t10 = function t10(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<form class="' + "b-toolbar__search" + '" style="' + "margin: 0pt;" + '">';
        r0 += '<table class="' + "b-search" + '">';
        r0 += '<tr>';
        r0 += '<td class="' + "b-search__input" + '">';
        r0 += '<span class="' + "b-mail-icon b-mail-icon_ajax-loader g-hidden" + '"></span>';
        r0 += '<div class="' + "b-input" + '">';
        r0 += '<input type="' + "text" + '" name="' + "text" + '" class="' + "b-input__text" + '" tabindex="' + "1" + '" autocomplete="' + "off" + '" placeholder="' + "Поиск писем" + '"/>';
        r0 += '</div>';
        r0 += '</td>';
        r0 += '<td class="' + "b-search__button" + '">';
        r0 += '<span class="' + "b-mail-button b-mail-button_default b-mail-button_button b-mail-button_grey-22px b-mail-button_22px" + '">';
        r0 += '<span class="' + "b-mail-button__inner" + '">';
        r0 += '<span class="' + "b-mail-button__text" + '">' + "Найти" + '</span>';
        r0 += '</span>';
        r0 += '<input type="' + "submit" + '" class="' + "b-mail-button__button b-search__submit" + '" tabindex="' + "2" + '"/>';
        r0 += '</span>';
        r0 += '</td>';
        r0 += '</tr>';
        r0 += '</table>';
        r0 += '</form>';

        return r0;
    };
    M.t10.j = j14;
    M.t10.a = 0;

    // match .labels-actions : block-content
    M.t11 = function t11(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div class="' + "b-mail-dropdown b-mail-dropdown_disabled" + '">';
        r0 += '<span class="' + "b-mail-dropdown__handle" + '">';
        r0 += '<a class="' + "b-toolbar__item daria-action" + '" action="' + "dropdown.toggle" + '">';
        r0 += '<span class="' + "b-toolbar__item__label" + '">' + "Поставить метку" + '</span>';
        r0 += '</a>';
        r0 += '</span>';
        r0 += '<div class="' + "b-mail-dropdown__box__content" + '">';
        r0 += '<div class="' + "b-mail-dropdown__item read" + '"><a class="' + "b-mail-dropdown__item__content daria-action" + '" action="' + "mark" + '" href="' + "#" + '">' + "Прочитано" + '</a></div>';
        r0 += '<div class="' + "b-mail-dropdown__item unread" + '"><a class="' + "b-mail-dropdown__item__content daria-action" + '" action="' + "unmark" + '" href="' + "#" + '">' + "Не прочитано" + '</a></div>';
        r0 += '<div class="' + "b-mail-dropdown__separator" + '"></div>';
        r0 += '<div class="' + "b-mail-dropdown__item label-" + nodeset2attrvalue( ( m.v('v6', c0) ) ) + '">';
        r0 += '<a href="' + scalar2attrvalue( ( m.k('k1', m.v('v6', c0), c0.root, true) ) ) + '" class="' + "b-mail-dropdown__item__content daria-action" + '" action="' + "label" + '">';
        r0 += "Важные";
        r0 += '<img class="' + "b-mail-icon b-mail-icon_important" + '" src="' + scalar2attrvalue( ( m.v('v0', c0) ) ) + "/blocks/b-mail-icon/_type/b-mail-icon_important.gif" + '"/>';
        r0 += '</a>';
        r0 += '</div>';
        r0 += m.a(m, m.s(j26, c0), 'labels-actions', a0);
        r0 += '<div class="' + "b-mail-dropdown__separator label-separator" + '"></div>';
        r0 += '<div class="' + "b-mail-dropdown__header unlabel-title" + '">' + "Снять метку:" + '</div>';
        r0 += '<div class="' + "b-mail-dropdown__item unlabel-" + nodeset2attrvalue( ( m.v('v6', c0) ) ) + '">';
        r0 += '<a href="' + scalar2attrvalue( ( m.k('k1', m.v('v6', c0), c0.root, true) ) ) + '" class="' + "b-mail-dropdown__item__content daria-action" + '" action="' + "unlabel" + '">';
        r0 += "Важные";
        r0 += '<img class="' + "b-mail-icon b-mail-icon_important" + '" src="' + scalar2attrvalue( ( m.v('v0', c0) ) ) + "/blocks/b-mail-icon/_type/b-mail-icon_important.gif" + '"/>';
        r0 += '</a>';
        r0 += '</div>';
        r0 += m.a(m, m.s(j26, c0), 'labels-actions', a0, "unlabel");
        r0 += '<div class="' + "b-mail-dropdown__separator unlabel-separator" + '"></div>';
        r0 += '<div class="' + "b-mail-dropdown__item" + '">';
        r0 += '<a href="' + "" + '" class="' + "b-mail-dropdown__item__content daria-action" + '" action="' + "labels.add" + '">' + "Новая метка…" + '</a>';
        r0 += '</div>';
        r0 += '</div>';
        r0 += '</div>';

        return r0;
    };
    M.t11.j = j15;
    M.t11.a = 0;

    // match .label : labels-actions
    M.t12 = function t12(m, c0, i0, l0, a0, v7) {
        v7 = (v7 === undefined) ? "label" : v7;
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div class="' + "b-mail-dropdown__item b-mail-dropdown__item_simple label-" + nodeset2attrvalue( ( selectNametest('id', c0, []) ) ) + '">';
        r0 += '<a href="' + scalar2attrvalue( ( m.k('k1', selectNametest('id', c0, []), c0.root, true) ) ) + '" class="' + "b-mail-dropdown__item__content daria-action" + '" action="' + scalar2attrvalue( ( v7 ) ) + '">';
        r0 += '<span class="' + "b-mail-dropdown__item__content__wrapper" + '">';
        r0 += '<span class="' + "b-label__first-letter" + '" style="' + "background: #" + nodeset2attrvalue( ( selectNametest('color', c0, []) ) ) + '">' + scalar2xml( ( yr.slice(simpleScalar('name', c0), 0, 1) ) ) + '</span>';
        r0 += '<span class="' + "b-label__content" + '">' + scalar2xml( ( yr.slice(simpleScalar('name', c0), 1) ) ) + '</span>';
        r0 += '</span>';
        r0 += '</a>';
        r0 += '</div>';

        return r0;
    };
    M.t12.j = j27;
    M.t12.a = 0;

    // match .folders-actions : block-content
    M.t13 = function t13(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div class="' + "b-mail-dropdown b-mail-dropdown_disabled" + '">';
        r0 += '<span class="' + "b-mail-dropdown__handle" + '">';
        r0 += '<a class="' + "b-toolbar__item daria-action" + '" action="' + "dropdown.toggle" + '"><span class="' + "b-toolbar__item__label" + '">' + "Переложить в папку" + '</span></a>';
        r0 += '</span>';
        r0 += '<div class="' + "b-mail-dropdown__box__content" + '">';
        r0 += '<div';
        a0.a = {
            'class': "b-folders b-folders_dropdown"
        };
        a0.s = 'div';
        r0 += m.a(m, m.v('v3', c0), 'folders-actions', a0);
        r0 += closeAttrs(a0);
        r0 += '<div class="' + "b-mail-dropdown__separator" + '"></div>';
        r0 += '<div class="' + "b-mail-dropdown__item" + '">';
        r0 += '<a class="' + "b-mail-dropdown__item__content daria-action" + '" action="' + "folders.add" + '">' + "Новая папка…" + '</a>';
        r0 += '</div>';
        r0 += '</div>';
        r0 += '</div>';
        r0 += '</div>';

        return r0;
    };
    M.t13.j = j16;
    M.t13.a = 0;

    // match .folder : folders-actions
    M.t14 = function t14(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div class="' + "b-folders__folder folder-" + nodeset2attrvalue( ( selectNametest('id', c0, []) ) ) + " b-folders__folder_custom" + '">';
        r0 += '<span class="' + "b-folders__folder__name" + '">';
        r0 += '<a href="' + scalar2attrvalue( ( m.k('k2', selectNametest('id', c0, []), c0.root, true) ) ) + '" class="' + "b-folders__folder__link daria-action" + '" title="' + nodeset2attrvalue( ( selectNametest('name', c0, []) ) ) + '" action="' + "move" + '">';
        r0 += '<span class="' + "b-folders__folder__marker" + '">' + "•" + '</span>';
        r0 += nodeset2xml( selectNametest('name', c0, []) );
        r0 += '</a>';
        r0 += '</span>';
        r0 += '</div>';

        return r0;
    };
    M.t14.j = j29;
    M.t14.a = 0;

    // match .folders : block-content
    M.t15 = function t15(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += m.a(m, m.s(j31, c0.root), '', a0);

        return r0;
    };
    M.t15.j = j30;
    M.t15.a = 0;

    // match .folders
    M.t16 = function t16(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div';
        a0.a = {
            'class': "b-folders"
        };
        a0.s = 'div';
        r0 += m.a(m, selectNametest('folder', c0, []), '', a0);
        r0 += closeAttrs(a0);
        r0 += '<div class="' + "b-folders__setup" + '"><a href="' + "#setup/folders" + '" class="' + "b-folders__setup__link" + '">' + "настроить…" + '</a></div>';
        r0 += '</div>';

        return r0;
    };
    M.t16.j = j30;
    M.t16.a = 0;

    // match .folder
    M.t17 = function t17(m, c0, i0, l0, a0) {
        var r0 = '';

        //  var is-count : boolean
        var v8 = simpleScalar('count', c0) > 0;

        //  var is-new : boolean
        var v9 = simpleScalar('new', c0) > 0 && !(cmpSN("sent", selectNametest('symbol', c0, [])) || cmpSN("trash", selectNametest('symbol', c0, [])) || cmpSN("draft", selectNametest('symbol', c0, [])));

        //  var href : xml
        var v10 = m.k('k2', selectNametest('id', c0, []), c0.root, true);

        r0 += closeAttrs(a0);
        r0 += '<div';
        a0.a = {
        };
        a0.s = 'div';
        var r1 = '';
        var a1 = { a: {} };
        r1 += "b-folders__folder fid-" + nodeset2scalar( ( selectNametest('id', c0, []) ) );
        if (v9) {
            r1 += " b-folders__folder_unread";
        }
        if (cmpNN(selectNametest('id', c0, []), m.n(j34, m.v('v1', c0)))) {
            r1 += " b-folders__folder_current";
        }
        if (simpleBoolean('clear', c0)) {
            r1 += " b-folders__folder_cleanable";
        }
        a0.a[ "class" ] = r1;
        r0 += closeAttrs(a0);
        r0 += '<span class="' + "b-folders__folder__info" + '">';
        if (simpleBoolean('clear', c0) && v8) {
            r0 += '<img class="' + "b-folders__folder__clean daria-action" + '" action="' + "folder.clear" + '" params="' + "fid=" + nodeset2attrvalue( ( selectNametest('id', c0, []) ) ) + '" alt="' + "[x]" + '" title="' + "Очистить" + '" src="' + scalar2attrvalue( ( m.v('v0', c0) ) ) + "/blocks/b-folders/folder/b-folders__folder__clean.gif" + '"/>';
        }
        r0 += '<span class="' + "b-folders__counters" + '">';
        if (v8) {
            if (v9) {
                r0 += '<a class="' + "b-folders__folder__link" + '" href="' + scalar2attrvalue( ( v10 ) ) + "/extra_cond=only_new" + '">';
                r0 += '<span class="' + "b-folders__folder__link__i" + '"><span class="' + "b-folders__folder__link__i" + '"></span></span>';
                r0 += nodeset2xml( selectNametest('new', c0, []) );
                r0 += '</a>';
            }
            r0 += '<span class="' + "b-folders__folder__counters__total" + '">';
            if (v9) {
                r0 += " / ";
            }
            r0 += nodeset2xml( selectNametest('count', c0, []) );
            r0 += '</span>';
        }
        r0 += '</span>';
        r0 += '</span>';
        r0 += '<span class="' + "b-folders__folder__name" + '">';
        r0 += '<a class="' + "b-folders__folder__link" + '" title="' + "Входящие" + '" params="' + "current_folder=" + nodeset2attrvalue( ( selectNametest('id', c0, []) ) ) + '" href="' + scalar2attrvalue( ( v10 ) ) + '">';
        r0 += nodeset2xml( selectNametest('name', c0, []) );
        r0 += '</a>';
        r0 += '</span>';
        r0 += '</div>';

        return r0;
    };
    M.t17.j = j29;
    M.t17.a = 0;

    // match .folder[ .symbol == "outbox" ]
    M.t18 = function t18(m, c0, i0, l0, a0) {
        var r0 = '';

        return r0;
    };
    M.t18.j = j36;
    M.t18.a = 0;

    // match .folder : href-content
    M.t19 = function t19(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += "#folder/" + nodeset2xml( ( selectNametest('id', c0, []) ) );

        return r0;
    };
    M.t19.j = j29;
    M.t19.a = 0;

    // match .folder[ .symbol ] : href-content
    M.t20 = function t20(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += "#" + nodeset2xml( ( selectNametest('symbol', c0, []) ) );

        return r0;
    };
    M.t20.j = j37;
    M.t20.a = 0;

    // match .labels : block-content
    M.t21 = function t21(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += m.a(m, m.s(j39, c0.root), '', a0);

        return r0;
    };
    M.t21.j = j38;
    M.t21.a = 0;

    // match .labels
    M.t22 = function t22(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div class="' + "b-labels" + '">';
        r0 += '<a class="' + "b-label b-label_important lid-" + nodeset2attrvalue( ( m.v('v6', c0) ) ) + '" action="' + "label" + '" href="' + scalar2attrvalue( ( m.k('k1', m.v('v6', c0), c0.root, true) ) ) + '">';
        r0 += '<img class="' + "b-mail-icon b-mail-icon_important" + '" alt="' + "" + '" src="' + scalar2attrvalue( ( m.v('v0', c0) ) ) + "/blocks/b-mail-icon/_type/b-mail-icon_important.gif" + '"/>';
        r0 += '<span class="' + "b-label__content" + '">' + "Важные" + '</span>';
        r0 += '<span class="' + "b-label__count" + '">' + nodeset2xml( ( m.n(j32, m.v('v5', c0)) ) ) + '</span>';
        r0 += '</a>';
        r0 += '<a class="' + "b-label b-label_unread lid-only_new" + '" action="' + "unmark" + '" href="' + "#unread" + '">';
        r0 += '<span class="' + "b-label__content" + '">' + "Непрочитанные" + '</span>';
        r0 += '<span class="' + "b-label__count" + '">' + nodeset2xml( ( m.s(j40, c0.root) ) ) + '</span>';
        r0 += '</a>';
        r0 += '<a class="' + "b-label b-label_attach lid-only_atta" + '" href="' + "#attachments" + '">';
        r0 += '<img class="' + "b-ico b-ico_attach-small" + '" alt="' + "" + '" src="' + scalar2attrvalue( ( m.v('v0', c0) ) ) + "/lego/blocks/b-ico/b-ico.gif" + '"/>';
        r0 += '<span class="' + "b-label__content" + '">' + "С вложениями" + '</span>';
        r0 += '</a>';
        r0 += '<div';
        a0.a = {
            'class': "b-labels__users"
        };
        a0.s = 'div';
        r0 += m.a(m, m.s(j41, c0), '', a0);
        r0 += closeAttrs(a0);
        r0 += '</div>';
        r0 += '</div>';

        return r0;
    };
    M.t22.j = j38;
    M.t22.a = 0;

    // match .label
    M.t23 = function t23(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<a href="' + scalar2attrvalue( ( m.k('k1', selectNametest('id', c0, []), c0.root, true) ) ) + '" class="' + "b-label b-label_user lid-" + nodeset2attrvalue( ( selectNametest('id', c0, []) ) ) + '" action="' + "label" + '">';
        r0 += '<span class="' + "b-label__first-letter" + '" style="' + "background: #" + nodeset2attrvalue( ( selectNametest('color', c0, []) ) ) + '">' + scalar2xml( ( yr.slice(simpleScalar('name', c0), 0, 1) ) ) + '</span>';
        r0 += '<span class="' + "b-label__content" + '">' + scalar2xml( ( yr.slice(simpleScalar('name', c0), 1) ) ) + '</span>';
        if (simpleScalar('count', c0) > 0) {
            r0 += '<span class="' + "b-label__count" + '">' + nodeset2xml( ( selectNametest('count', c0, []) ) ) + '</span>';
        }
        r0 += '</a>';

        return r0;
    };
    M.t23.j = j27;
    M.t23.a = 0;

    // match .label : href-content
    M.t24 = function t24(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += "#label/" + nodeset2xml( ( selectNametest('id', c0, []) ) );

        return r0;
    };
    M.t24.j = j27;
    M.t24.a = 0;

    // match .messages : block-content
    M.t25 = function t25(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += m.a(m, m.s(j43, c0.root), '', a0);

        return r0;
    };
    M.t25.j = j42;
    M.t25.a = 0;

    // match .messages
    M.t26 = function t26(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div';
        a0.a = {
            'class': "b-layout__inner"
        };
        a0.s = 'div';
        r0 += m.a(m, [ c0 ], 'head', a0);
        r0 += closeAttrs(a0);
        r0 += '<i class="' + "b-toolbar-hr" + '"></i>';
        r0 += m.a(m, [ c0 ], 'list', a0);
        r0 += m.a(m, m.s(j44, c0), '', a0);
        r0 += '</div>';

        return r0;
    };
    M.t26.j = j42;
    M.t26.a = 0;

    // match .messages : head
    M.t27 = function t27(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div class="' + "b-messages-head b-messages-head_threaded" + '">';
        r0 += '<label class="' + "b-messages-head__title" + '"><input type="' + "checkbox" + '" class="' + "b-messages-head__checkbox" + '" value="' + "0" + '"/>' + "Входящие" + '</label>';
        r0 += '<span class="' + "b-messages-head__action" + '">';
        r0 += "Упорядочить: ";
        r0 += '<div class="' + "b-mail-dropdown" + '">';
        r0 += '<span class="' + "b-mail-dropdown__handle daria-action" + '" action="' + "dropdown.toggle" + '">';
        r0 += '<span class="' + "b-pseudo-link" + '">' + "по дате" + '</span>';
        r0 += '</span>';
        r0 += '<div class="' + "b-mail-dropdown__box__content" + '">';
        r0 += '<div class="' + "b-mail-dropdown__item b-mail-dropdown__item_selected" + '">';
        r0 += '<span class="' + "b-mail-dropdown__item__content" + '"><span class="' + "b-mail-dropdown__item__marker" + '">' + "•" + '</span>' + "сначала новые" + '</span>';
        r0 += '</div>';
        r0 += '<div class="' + "b-mail-dropdown__item" + '"><a class="' + "b-mail-dropdown__item__content" + '" href="' + "#inbox/sort_type=date1" + '">' + "сначала старые" + '</a></div>';
        r0 += '<div class="' + "b-mail-dropdown__separator" + '"></div>';
        r0 += '<div class="' + "b-mail-dropdown__item" + '"><a class="' + "b-mail-dropdown__item__content" + '" href="' + "#inbox/sort_type=from" + '">' + "по отправителю" + '</a></div>';
        r0 += '<div class="' + "b-mail-dropdown__item" + '"><a class="' + "b-mail-dropdown__item__content" + '" href="' + "#inbox/sort_type=subject" + '">' + "по теме" + '</a></div>';
        r0 += '<div class="' + "b-mail-dropdown__item b-mail-dropdown__item_selected" + '">';
        r0 += '<span class="' + "b-mail-dropdown__item__content" + '"><span class="' + "b-mail-dropdown__item__marker" + '">' + "•" + '</span>' + "по дате" + '</span>';
        r0 += '</div>';
        r0 += '<div class="' + "b-mail-dropdown__item" + '"><a class="' + "b-mail-dropdown__item__content" + '" href="' + "#inbox/sort_type=size" + '">' + "по размеру" + '</a></div>';
        r0 += '</div>';
        r0 += '</div>';
        r0 += '</span>';
        r0 += '<span class="' + "b-messages-head__action b-messages-head__action_checkbox daria-action" + '" action="' + "messages.threaded" + '">';
        r0 += '<img class="' + "b-mail-icon b-mail-icon_checkbox" + '" alt="' + "[x]" + '" title="' + "" + '" src="' + scalar2attrvalue( ( m.v('v0', c0) ) ) + "/blocks/b-mail-icon/_type/b-mail-icon_checkbox.gif" + '"/>';
        r0 += "группировать по теме";
        r0 += '</span>';
        r0 += '<span class="' + "b-messages-head__infoline" + '"></span>';
        r0 += '</div>';

        return r0;
    };
    M.t27.j = j42;
    M.t27.a = 0;

    // match .messages : list
    M.t28 = function t28(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div';
        a0.a = {
            'class': "b-messages b-messages_threaded"
        };
        a0.s = 'div';
        r0 += m.a(m, m.s(j45, c0), '', a0);
        r0 += closeAttrs(a0);
        r0 += '</div>';

        return r0;
    };
    M.t28.j = j42;
    M.t28.a = 0;

    // match .message
    M.t29 = function t29(m, c0, i0, l0, a0) {
        var r0 = '';

        //  var is-thread : boolean
        var v11 = simpleScalar('count', c0) > 0;

        //  var message-labels : nodeset
        var v12 = selectNametest('label', c0, []);

        //  var is-important : nodeset
        var v13 = m.n(j47, v12);

        //  var href : xml
        var r1 = '';
        var a1 = { a: {} };
        r1 += m.a(m, [ c0 ], 'href-content', a1);
        var v14 = r1;

        //  var important-params : scalar
        var r1 = '';
        var a1 = { a: {} };
        r1 += "current_label=" + nodeset2scalar( ( m.v('v6', c0) ) ) + "&";
        if (v11) {
            r1 += "thread-id=";
        } else {
            r1 += "message-id=";
        }
        r1 += simpleScalar('id', c0);
        var v15 = r1;

        r0 += closeAttrs(a0);
        r0 += '<div';
        a0.a = {
            'class': "b-messages__message mid-" + nodeset2scalar( ( selectNametest('id', c0, []) ) )
        };
        a0.s = 'div';
        if (simpleBoolean('new', c0)) {
            a0.a[ "class" ] = (a0.a[ "class" ] || '') + " b-messages__message_unread";
        }
        if (v11) {
            a0.a[ "class" ] = (a0.a[ "class" ] || '') + " b-messages__message_thread";
            a0.a[ "count" ] = simpleScalar('count', c0);
            r0 += closeAttrs(a0);
            r0 += '<a href="' + scalar2attrvalue( ( v14 ) ) + '" class="' + "b-messages__thread-count daria-action" + '" action="' + "thread.toggle" + '">';
            r0 += '<img class="' + "b-ico b-ico_closed" + '" alt="' + "" + '" src="' + scalar2attrvalue( ( m.v('v0', c0) ) ) + "/lego/blocks/b-ico/b-ico.gif" + '"/>';
            r0 += '</a>';
        }
        r0 += closeAttrs(a0);
        r0 += '<label class="' + "b-messages__message__checkbox" + '"><input type="' + "checkbox" + '" value="' + nodeset2attrvalue( ( selectNametest('id', c0, []) ) ) + '" class="' + "b-messages__message__checkbox__input" + '"/></label>';
        if (nodeset2boolean( v13 )) {
            r0 += '<img class="' + "b-mail-icon_important daria-action" + '" action="' + "unlabel" + '" params="' + scalar2attrvalue( ( v15 ) ) + '" src="' + scalar2attrvalue( ( m.v('v0', c0) ) ) + "/blocks/b-mail-icon/_type/b-mail-icon_important.gif" + '"/>';
        } else {
            r0 += '<img class="' + "b-mail-icon_unimportant daria-action" + '" action="' + "label" + '" params="' + scalar2attrvalue( ( v15 ) ) + '" src="' + scalar2attrvalue( ( m.v('v0', c0) ) ) + "/blocks/b-mail-icon/_type/b-mail-icon_unimportant.gif" + '"/>';
        }
        r0 += '<span class="' + "b-messages__date" + '" title="' + "Отправлено " + nodeset2attrvalue( ( m.s(j48, c0) ) ) + '">' + nodeset2xml( ( m.s(j49, c0) ) ) + '</span>';
        r0 += '<span';
        a0.a = {
            'class': "b-messages__message__left"
        };
        a0.s = 'span';
        var items0 = v12;
        for (var i1 = 0, l1 = items0.length; i1 < l1; i1++) {
            var c1 = items0[ i1 ];
            r0 += m.a(m, m.k('k0', [ c1 ], c1.root, true), 'message-social-label', a0);
        }
        var items0 = v12;
        for (var i1 = 0, l1 = items0.length; i1 < l1; i1++) {
            var c1 = items0[ i1 ];
            r0 += m.a(m, m.k('k0', [ c1 ], c1.root, true), 'message-user-label', a0);
        }
        r0 += closeAttrs(a0);
        r0 += " ";
        r0 += '<a href="' + scalar2attrvalue( ( v14 ) ) + '" class="' + "b-messages__message__link daria-action" + '" action="' + "thread.toggle" + '">';
        r0 += '<span class="' + "b-messages__from" + '">';
        r0 += '<span class="' + "b-messages__from__text" + '" title="' + nodeset2attrvalue( ( m.s(j50, c0) ) ) + '">' + nodeset2xml( ( m.s(j51, c0) ) ) + '</span>';
        r0 += '</span>';
        r0 += '<span class="' + "b-messages__subject" + '" title="' + nodeset2attrvalue( ( selectNametest('subject', c0, []) ) ) + '">' + nodeset2xml( ( selectNametest('subject', c0, []) ) ) + '</span>';
        r0 += '<span class="' + "b-messages__firstline" + '">';
        if (v11) {
            r0 += nodeset2xml( ( selectNametest('count', c0, []) ) ) + " писем";
        } else {
            r0 += nodeset2xml( selectNametest('firstline', c0, []) );
        }
        r0 += '</span>';
        r0 += "&#160;";
        r0 += '</a>';
        r0 += '</span>';
        r0 += '</div>';

        return r0;
    };
    M.t29.j = j46;
    M.t29.a = 0;

    // match .label : message-social-label
    M.t30 = function t30(m, c0, i0, l0, a0) {
        var r0 = '';

        return r0;
    };
    M.t30.j = j27;
    M.t30.a = 0;

    // match .label[ .social ] : message-social-label
    M.t31 = function t31(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<a href="' + scalar2attrvalue( ( m.k('k1', selectNametest('id', c0, []), c0.root, true) ) ) + '" class="' + "b-messages__service-icon" + '">';
        r0 += '<img alt="' + "" + '" class="' + "b-site-icon" + '" src="' + scalar2attrvalue( ( m.v('v0', c0) ) ) + "/blocks/b-site-icon/_type/b-site-icon_" + nodeset2attrvalue( ( selectNametest('name', c0, []) ) ) + ".png" + '" title="' + "Все письма от сайта " + nodeset2attrvalue( ( selectNametest('title', c0, []) ) ) + '"/>';
        r0 += '</a>';

        return r0;
    };
    M.t31.j = j55;
    M.t31.a = 0;

    // match .label : message-user-label
    M.t32 = function t32(m, c0, i0, l0, a0) {
        var r0 = '';

        return r0;
    };
    M.t32.j = j27;
    M.t32.a = 0;

    // match .label[ .user ] : message-user-label
    M.t33 = function t33(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += " ";
        r0 += '<a href="' + scalar2attrvalue( ( m.k('k1', selectNametest('id', c0, []), c0.root, true) ) ) + '" class="' + "b-label b-label_rounded lid-" + nodeset2attrvalue( ( selectNametest('id', c0, []) ) ) + '" style="' + "background: #" + nodeset2attrvalue( ( selectNametest('color', c0, []) ) ) + '">';
        r0 += nodeset2xml( selectNametest('name', c0, []) );
        r0 += '</a>';

        return r0;
    };
    M.t33.j = j41;
    M.t33.a = 0;

    // match .message : href-content
    M.t34 = function t34(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += "#message/" + nodeset2xml( ( selectNametest('id', c0, []) ) );

        return r0;
    };
    M.t34.j = j46;
    M.t34.a = 0;

    // match .message[ .count > 0 ] : href-content
    M.t35 = function t35(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += "#thread/" + nodeset2xml( ( selectNametest('id', c0, []) ) );

        return r0;
    };
    M.t35.j = j57;
    M.t35.a = 0;

    // match .pager
    M.t36 = function t36(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<div class="' + "b-pager" + '">';
        r0 += '<b class="' + "b-pager__title" + '">' + "Страницы" + '</b>';
        r0 += m.a(m, (selectNametest('prev', c0, [])).concat(selectNametest('next', c0, [])), 'pager', a0);
        r0 += '</div>';

        return r0;
    };
    M.t36.j = j58;
    M.t36.a = 0;

    // match .prev : pager
    M.t37 = function t37(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<span class="' + "b-pager__inactive" + '">';
        r0 += '<i class="' + "b-pager__key" + '"><i class="' + "b-pager__arr" + '">' + "←" + '</i>' + " Ctrl" + '</i>';
        r0 += " предыдущая";
        r0 += '</span>';

        return r0;
    };
    M.t37.j = j59;
    M.t37.a = 0;

    // match .prev[ .n ] : pager
    M.t38 = function t38(m, c0, i0, l0, a0) {
        var r0 = '';

        return r0;
    };
    M.t38.j = j62;
    M.t38.a = 0;

    // match .next : pager
    M.t39 = function t39(m, c0, i0, l0, a0) {
        var r0 = '';

        return r0;
    };
    M.t39.j = j60;
    M.t39.a = 0;

    // match .next[ .n ] : pager
    M.t40 = function t40(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<span class="' + "b-pager__active" + '">';
        r0 += '<a href="' + "#inbox/sort_type=date&amp;page_number=" + nodeset2attrvalue( ( selectNametest('n', c0, []) ) ) + '" class="' + "b-pager__next" + '">' + "следующая" + '</a>';
        r0 += " ";
        r0 += '<i class="' + "b-pager__key" + '">' + "Ctrl " + '<i class="' + "b-pager__arr" + '">' + "→" + '</i></i>';
        r0 += '</span>';

        return r0;
    };
    M.t40.j = j63;
    M.t40.a = 0;

    M.matcher = {
        "": {
            "": [
                "t0"
            ],
            "page": [
                "t1"
            ],
            "folders": [
                "t16"
            ],
            "folder": [
                "t18",
                "t17"
            ],
            "labels": [
                "t22"
            ],
            "label": [
                "t23"
            ],
            "messages": [
                "t26"
            ],
            "message": [
                "t29"
            ],
            "pager": [
                "t36"
            ]
        },
        "block": {
            "*": [
                "t2"
            ]
        },
        "block-content": {
            "*": [
                "t3"
            ],
            "app": [
                "t5",
                "t3"
            ],
            "search": [
                "t10",
                "t3"
            ],
            "labels-actions": [
                "t11",
                "t3"
            ],
            "folders-actions": [
                "t13",
                "t3"
            ],
            "folders": [
                "t15",
                "t3"
            ],
            "labels": [
                "t21",
                "t3"
            ],
            "messages": [
                "t25",
                "t3"
            ]
        },
        "href": {
            "*": [
                "t4"
            ]
        },
        "service-tabs": {
            "app": [
                "t6"
            ]
        },
        "toolbar": {
            "app": [
                "t7"
            ],
            "item": [
                "t9",
                "t8"
            ]
        },
        "labels-actions": {
            "label": [
                "t12"
            ]
        },
        "folders-actions": {
            "folder": [
                "t14"
            ]
        },
        "href-content": {
            "folder": [
                "t20",
                "t19"
            ],
            "label": [
                "t24"
            ],
            "message": [
                "t35",
                "t34"
            ]
        },
        "head": {
            "messages": [
                "t27"
            ]
        },
        "list": {
            "messages": [
                "t28"
            ]
        },
        "message-social-label": {
            "label": [
                "t31",
                "t30"
            ]
        },
        "message-user-label": {
            "label": [
                "t33",
                "t32"
            ]
        },
        "pager": {
            "prev": [
                "t38",
                "t37"
            ],
            "next": [
                "t40",
                "t39"
            ]
        }
    };
    M.imports = [ ];

    yr.register('main', M);

})();
