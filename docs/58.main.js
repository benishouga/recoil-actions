(window.webpackJsonp=window.webpackJsonp||[]).push([[58,120,124],{143:function(e,n,t){"use strict";var a=t(62),o=t(35);function r(e){e.register(a),e.register(o),function(e){e.languages.etlua={delimiter:{pattern:/^<%[-=]?|-?%>$/,alias:"punctuation"},"language-lua":{pattern:/[\s\S]+/,inside:e.languages.lua}},e.hooks.add("before-tokenize",(function(n){e.languages["markup-templating"].buildPlaceholders(n,"etlua",/<%[\s\S]+?%>/g)})),e.hooks.add("after-tokenize",(function(n){e.languages["markup-templating"].tokenizePlaceholders(n,"etlua")}))}(e)}e.exports=r,r.displayName="etlua",r.aliases=[]},35:function(e,n,t){"use strict";function a(e){!function(e){function n(e,n){return"___"+e.toUpperCase()+n+"___"}Object.defineProperties(e.languages["markup-templating"]={},{buildPlaceholders:{value:function(t,a,o,r){if(t.language===a){var i=t.tokenStack=[];t.code=t.code.replace(o,(function(e){if("function"==typeof r&&!r(e))return e;for(var o,u=i.length;-1!==t.code.indexOf(o=n(a,u));)++u;return i[u]=e,o})),t.grammar=e.languages.markup}}},tokenizePlaceholders:{value:function(t,a){if(t.language===a&&t.tokenStack){t.grammar=e.languages[a];var o=0,r=Object.keys(t.tokenStack);!function i(u){for(var s=0;s<u.length&&!(o>=r.length);s++){var l=u[s];if("string"==typeof l||l.content&&"string"==typeof l.content){var c=r[o],p=t.tokenStack[c],g="string"==typeof l?l:l.content,f=n(a,c),d=g.indexOf(f);if(d>-1){++o;var k=g.substring(0,d),m=new e.Token(a,e.tokenize(p,t.grammar),"language-"+a,p),b=g.substring(d+f.length),h=[];k&&h.push.apply(h,i([k])),h.push(m),b&&h.push.apply(h,i([b])),"string"==typeof l?u.splice.apply(u,[s,1].concat(h)):l.content=h}}else l.content&&i(l.content)}return u}(t.tokens)}}}})}(e)}e.exports=a,a.displayName="markupTemplating",a.aliases=[]},62:function(e,n,t){"use strict";function a(e){e.languages.lua={comment:/^#!.+|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,string:{pattern:/(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[\s\S]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,greedy:!0},number:/\b0x[a-f\d]+\.?[a-f\d]*(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|\.?\d*(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,keyword:/\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,function:/(?!\d)\w+(?=\s*(?:[({]))/,operator:[/[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/,{pattern:/(^|[^.])\.\.(?!\.)/,lookbehind:!0}],punctuation:/[\[\](){},;]|\.+|:+/}}e.exports=a,a.displayName="lua",a.aliases=[]}}]);