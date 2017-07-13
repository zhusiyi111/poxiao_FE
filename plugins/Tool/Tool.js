/**
 * @function：数据模板渲染
 * @description：loadMustache方法依赖mustache.min.js，其他是另外一种模板渲染
 * @author：cdwanchuan@jd.com 2016-08-22
*/


    window.Tool = {};
    /**
     * 去除字符串前后空格字符
     * @param  {String} str 需要去除前后空格的源字符串
     * @return {String}     去除前后空格后的新字符串
     */
    Tool.trim = function(str) {
        return str.replace(/(^\s+)|(\s+$)/g, '');
    };
    /**
     * 前端模板渲染方法，将json数据动态渲染为HTML结构
     * @param  {[Object, Array, String, Number]} data 模板渲染所需数据
     * @param  {String} template 模板字符串，包含模板语法
     * @return {String}          整合了json数据的HTML完整片段
     */
    Tool.render = function(data, template) {
        var mod = null,
            funcBody = 'var breads=[];',
            index = 0,
            logic = '',
            rTpl = /{{(.*?)}}/g,
            sub = '';
        if (!data || !template) {
            return '';
        }
        template = template.replace(/\n|\r/g, '');
        while (mod = rTpl.exec(template)) {
            sub = template.slice(index, mod.index).replace(/"/g, '\\"');
            if (sub) {
                funcBody += 'breads.push("' + sub + '");';
            }
            logic = this.trim(mod[1]);
            if (/^(var|if|for|switch|else|case|while|do|break|continue|\{|\}|\[|\])/.test(logic)) {
                funcBody += logic;
            } else {
                funcBody += 'breads.push(' + logic + ');';
            }
            index = mod.index + mod[0].length;
        }
        sub = template.slice(index).replace(/"/g, '\\"');
        if (sub) {
            funcBody += 'breads.push("' + sub + '");';
        }
        funcBody += 'return breads.join("");';
        return new Function('data', funcBody)(data);
    };
    /**
     * 根据规则格式化hash数据，并以json格式返回
     * @param  {String} rule 指定格式化的规则，例：/{type}/{page}/{sort}
     * @return {Object}      返回规则名称-hash值的k-v数据，例：{type:1,page:2:sort:"utd"}
     */
    Tool.parseHash = function(rule) {
        var rp = /[^{]+(?=\})/g,
            hash = (location.hash || '#').slice(1),
            qs = {},
            attrs = rule.match(rp),
            vs = hash.split('/');
        for (var i = 0; attrs[i]; i++) {
            qs[attrs[i]] = vs[i] || undefined;
        }
        return qs;
    };
    /**
     * 格式化数字，个位数前置"0"
     * @param  {Number} num 需要格式化的源数字
     * @return {[String, Number]} 格式化后的数字字符串或源多位数字
     */
    Tool.parseNumber = function(num) {
        return num < 10 ? "0" + num : num;
    };
    /**
     * 日期时间格式化方法，根据特定格式返回所需格式的时间字符串
     * @param  {Date} date 用于格式化的日期数据
     * @param  {String} formatStr 格式化规则，例："{Y}-{MM}-{DD} {hh}:{ii}:{ss}"
     * @return {String} 返回指定格式的时间字符串
     */
    Tool.dateFormat = function(date, formatStr) {
        var dateObj = {},
            rStr = /\{([^}]{1,2})\}/;

        dateObj["Y"] = date.getFullYear();
        dateObj["M"] = date.getMonth() + 1;
        dateObj["MM"] = this.parseNumber(dateObj["M"]);
        dateObj["D"] = date.getDate();
        dateObj["DD"] = this.parseNumber(dateObj["D"]);
        dateObj["h"] = date.getHours();
        dateObj["hh"] = this.parseNumber(dateObj["h"]);
        dateObj["i"] = date.getMinutes();
        dateObj["ii"] = this.parseNumber(dateObj["i"]);
        dateObj["s"] = date.getSeconds();
        dateObj["ss"] = this.parseNumber(dateObj["s"]);

        while(rStr.test(formatStr)) {
            formatStr = formatStr.replace(rStr, dateObj[RegExp.$1]);
        }
        return formatStr;
    };
    /**
     * 将rgb(a)格式颜色值，转换为十六进制（hex）格式
     * @param  {String} rgb rgb(a)格式的颜色值
     * @return {Object}     包含十六进制格式颜色值和Alpha透明度的JSON对象
     */
    Tool.rgbToHex = function(rgb) {
        var rRgba = /rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,([.\d]+))?\)/,
            r, g, b, a,
            rsa = rgb.replace(/\s+/g, "").match(rRgba);
        if (rsa) {
            r = (+rsa[1]).toString(16);
            r = r.length == 1 ? "0" + r : r;
            g = (+rsa[2]).toString(16);
            g = g.length == 1 ? "0" + g : g;
            b = (+rsa[3]).toString(16);
            b = b.length == 1 ? "0" + b : b;
            a = (+(rsa[5] ? rsa[5] : 1)) * 100
            return {hex: "#" + r + g + b, alpha: Math.ceil(a)};
        } else {
            return {hex: rgb, alpha: 100};
        }
    };

    Tool.guid = function(prefix) {
        return (prefix + '_') + (new Date().getTime().toString(32));
    };

    /**
     * 将非标准JSON格式的字符串格式化输出JSON对象
     * @param str 待格式化字符串
     * @returns {Object} 格式化后的JSON数据
     */
    Tool.stringToJSONByEval = function(str) {
        return eval('(' + str + ')');
    };
    
    /**
     * @function：使用Mustache模板引擎
     * @decsription：依赖Mustache.js
     * @param： template：模板字符串；data：数据；container：填充容器
     * @Author：cdwanchuan@jd.com 20160818
     */
    Tool.loadMustache = function(template,data,container) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        container.html(rendered);
    }

