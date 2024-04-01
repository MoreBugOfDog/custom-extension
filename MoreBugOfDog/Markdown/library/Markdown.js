/**
 * marked v12.0.1 - a markdown parser
 * Copyright (c) 2011-2024, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

// 本支持库 原作者: Christopher Jeffrey ，由 多bug的啸天犬 压缩文件并作为 Gandi-IDE 拓展支持库使用。
// 由于上传时，market使用的是MIT协议，所以使用此文件为合法行为。
// 感谢market的开发团队！

! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t((e = "undefined" != typeof globalThis ? globalThis : e || self).marked = {})
}(this, (function(e) {
    "use strict";

    function t() {
        return {
            async: !1,
            breaks: !1,
            extensions: null,
            gfm: !0,
            hooks: null,
            pedantic: !1,
            renderer: null,
            silent: !1,
            tokenizer: null,
            walkTokens: null
        }
    }

    function n(t) {
        e.defaults = t
    }
    e.defaults = {
        async: !1,
        breaks: !1,
        extensions: null,
        gfm: !0,
        hooks: null,
        pedantic: !1,
        renderer: null,
        silent: !1,
        tokenizer: null,
        walkTokens: null
    };
    const s = /[&<>"']/,
        r = new RegExp(s.source, "g"),
        i = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
        l = new RegExp(i.source, "g"),
        o = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        },
        a = e => o[e];

    function c(e, t) {
        if (t) {
            if (s.test(e)) return e.replace(r, a)
        } else if (i.test(e)) return e.replace(l, a);
        return e
    }
    const h = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;

    function p(e) {
        return e.replace(h, ((e, t) => "colon" === (t = t.toLowerCase()) ? ":" : "#" === t.charAt(0) ? "x" === t.charAt(1) ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode(+t.substring(1)) : ""))
    }
    const u = /(^|[^\[])\^/g;

    function k(e, t) {
        let n = "string" == typeof e ? e : e.source;
        t = t || "";
        const s = {
            replace: (e, t) => {
                let r = "string" == typeof t ? t : t.source;
                return r = r.replace(u, "$1"), n = n.replace(e, r), s
            },
            getRegex: () => new RegExp(n, t)
        };
        return s
    }

    function g(e) {
        try {
            e = encodeURI(e).replace(/%25/g, "%")
        } catch (e) {
            return null
        }
        return e
    }
    const f = {
        exec: () => null
    };

    function d(e, t) {
        const n = e.replace(/\|/g, ((e, t, n) => {
            let s = !1,
                r = t;
            for (; --r >= 0 && "\\" === n[r];) s = !s;
            return s ? "|" : " |"
        })).split(/ \|/);
        let s = 0;
        if (n[0].trim() || n.shift(), n.length > 0 && !n[n.length - 1].trim() && n.pop(), t)
            if (n.length > t) n.splice(t);
            else
                for (; n.length < t;) n.push("");
        for (; s < n.length; s++) n[s] = n[s].trim().replace(/\\\|/g, "|");
        return n
    }

    function x(e, t, n) {
        const s = e.length;
        if (0 === s) return "";
        let r = 0;
        for (; r < s;) {
            const i = e.charAt(s - r - 1);
            if (i !== t || n) {
                if (i === t || !n) break;
                r++
            } else r++
        }
        return e.slice(0, s - r)
    }

    function b(e, t, n, s) {
        const r = t.href,
            i = t.title ? c(t.title) : null,
            l = e[1].replace(/\\([\[\]])/g, "$1");
        if ("!" !== e[0].charAt(0)) {
            s.state.inLink = !0;
            const e = {
                type: "link",
                raw: n,
                href: r,
                title: i,
                text: l,
                tokens: s.inlineTokens(l)
            };
            return s.state.inLink = !1, e
        }
        return {
            type: "image",
            raw: n,
            href: r,
            title: i,
            text: c(l)
        }
    }
    class w {
        options;
        rules;
        lexer;
        constructor(t) {
            this.options = t || e.defaults
        }
        space(e) {
            const t = this.rules.block.newline.exec(e);
            if (t && t[0].length > 0) return {
                type: "space",
                raw: t[0]
            }
        }
        code(e) {
            const t = this.rules.block.code.exec(e);
            if (t) {
                const e = t[0].replace(/^ {1,4}/gm, "");
                return {
                    type: "code",
                    raw: t[0],
                    codeBlockStyle: "indented",
                    text: this.options.pedantic ? e : x(e, "\n")
                }
            }
        }
        fences(e) {
            const t = this.rules.block.fences.exec(e);
            if (t) {
                const e = t[0],
                    n = function(e, t) {
                        const n = e.match(/^(\s+)(?:```)/);
                        if (null === n) return t;
                        const s = n[1];
                        return t.split("\n").map((e => {
                            const t = e.match(/^\s+/);
                            if (null === t) return e;
                            const [n] = t;
                            return n.length >= s.length ? e.slice(s.length) : e
                        })).join("\n")
                    }(e, t[3] || "");
                return {
                    type: "code",
                    raw: e,
                    lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
                    text: n
                }
            }
        }
        heading(e) {
            const t = this.rules.block.heading.exec(e);
            if (t) {
                let e = t[2].trim();
                if (/#$/.test(e)) {
                    const t = x(e, "#");
                    this.options.pedantic ? e = t.trim() : t && !/ $/.test(t) || (e = t.trim())
                }
                return {
                    type: "heading",
                    raw: t[0],
                    depth: t[1].length,
                    text: e,
                    tokens: this.lexer.inline(e)
                }
            }
        }
        hr(e) {
            const t = this.rules.block.hr.exec(e);
            if (t) return {
                type: "hr",
                raw: t[0]
            }
        }
        blockquote(e) {
            const t = this.rules.block.blockquote.exec(e);
            if (t) {
                const e = x(t[0].replace(/^ *>[ \t]?/gm, ""), "\n"),
                    n = this.lexer.state.top;
                this.lexer.state.top = !0;
                const s = this.lexer.blockTokens(e);
                return this.lexer.state.top = n, {
                    type: "blockquote",
                    raw: t[0],
                    tokens: s,
                    text: e
                }
            }
        }
        list(e) {
            let t = this.rules.block.list.exec(e);
            if (t) {
                let n = t[1].trim();
                const s = n.length > 1,
                    r = {
                        type: "list",
                        raw: "",
                        ordered: s,
                        start: s ? +n.slice(0, -1) : "",
                        loose: !1,
                        items: []
                    };
                n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]");
                const i = new RegExp(`^( {0,3}${n})((?:[\t ][^\\n]*)?(?:\\n|$))`);
                let l = "",
                    o = "",
                    a = !1;
                for (; e;) {
                    let n = !1;
                    if (!(t = i.exec(e))) break;
                    if (this.rules.block.hr.test(e)) break;
                    l = t[0], e = e.substring(l.length);
                    let s = t[2].split("\n", 1)[0].replace(/^\t+/, (e => " ".repeat(3 * e.length))),
                        c = e.split("\n", 1)[0],
                        h = 0;
                    this.options.pedantic ? (h = 2, o = s.trimStart()) : (h = t[2].search(/[^ ]/), h = h > 4 ? 1 : h, o = s.slice(h), h += t[1].length);
                    let p = !1;
                    if (!s && /^ *$/.test(c) && (l += c + "\n", e = e.substring(c.length + 1), n = !0), !n) {
                        const t = new RegExp(`^ {0,${Math.min(3,h-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`),
                            n = new RegExp(`^ {0,${Math.min(3,h-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
                            r = new RegExp(`^ {0,${Math.min(3,h-1)}}(?:\`\`\`|~~~)`),
                            i = new RegExp(`^ {0,${Math.min(3,h-1)}}#`);
                        for (; e;) {
                            const a = e.split("\n", 1)[0];
                            if (c = a, this.options.pedantic && (c = c.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), r.test(c)) break;
                            if (i.test(c)) break;
                            if (t.test(c)) break;
                            if (n.test(e)) break;
                            if (c.search(/[^ ]/) >= h || !c.trim()) o += "\n" + c.slice(h);
                            else {
                                if (p) break;
                                if (s.search(/[^ ]/) >= 4) break;
                                if (r.test(s)) break;
                                if (i.test(s)) break;
                                if (n.test(s)) break;
                                o += "\n" + c
                            }
                            p || c.trim() || (p = !0), l += a + "\n", e = e.substring(a.length + 1), s = c.slice(h)
                        }
                    }
                    r.loose || (a ? r.loose = !0 : /\n *\n *$/.test(l) && (a = !0));
                    let u, k = null;
                    this.options.gfm && (k = /^\[[ xX]\] /.exec(o), k && (u = "[ ] " !== k[0], o = o.replace(/^\[[ xX]\] +/, ""))), r.items.push({
                        type: "list_item",
                        raw: l,
                        task: !!k,
                        checked: u,
                        loose: !1,
                        text: o,
                        tokens: []
                    }), r.raw += l
                }
                r.items[r.items.length - 1].raw = l.trimEnd(), r.items[r.items.length - 1].text = o.trimEnd(), r.raw = r.raw.trimEnd();
                for (let e = 0; e < r.items.length; e++)
                    if (this.lexer.state.top = !1, r.items[e].tokens = this.lexer.blockTokens(r.items[e].text, []), !r.loose) {
                        const t = r.items[e].tokens.filter((e => "space" === e.type)),
                            n = t.length > 0 && t.some((e => /\n.*\n/.test(e.raw)));
                        r.loose = n
                    } if (r.loose)
                    for (let e = 0; e < r.items.length; e++) r.items[e].loose = !0;
                return r
            }
        }
        html(e) {
            const t = this.rules.block.html.exec(e);
            if (t) {
                return {
                    type: "html",
                    block: !0,
                    raw: t[0],
                    pre: "pre" === t[1] || "script" === t[1] || "style" === t[1],
                    text: t[0]
                }
            }
        }
        def(e) {
            const t = this.rules.block.def.exec(e);
            if (t) {
                const e = t[1].toLowerCase().replace(/\s+/g, " "),
                    n = t[2] ? t[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "",
                    s = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
                return {
                    type: "def",
                    tag: e,
                    raw: t[0],
                    href: n,
                    title: s
                }
            }
        }
        table(e) {
            const t = this.rules.block.table.exec(e);
            if (!t) return;
            if (!/[:|]/.test(t[2])) return;
            const n = d(t[1]),
                s = t[2].replace(/^\||\| *$/g, "").split("|"),
                r = t[3] && t[3].trim() ? t[3].replace(/\n[ \t]*$/, "").split("\n") : [],
                i = {
                    type: "table",
                    raw: t[0],
                    header: [],
                    align: [],
                    rows: []
                };
            if (n.length === s.length) {
                for (const e of s) /^ *-+: *$/.test(e) ? i.align.push("right") : /^ *:-+: *$/.test(e) ? i.align.push("center") : /^ *:-+ *$/.test(e) ? i.align.push("left") : i.align.push(null);
                for (const e of n) i.header.push({
                    text: e,
                    tokens: this.lexer.inline(e)
                });
                for (const e of r) i.rows.push(d(e, i.header.length).map((e => ({
                    text: e,
                    tokens: this.lexer.inline(e)
                }))));
                return i
            }
        }
        lheading(e) {
            const t = this.rules.block.lheading.exec(e);
            if (t) return {
                type: "heading",
                raw: t[0],
                depth: "=" === t[2].charAt(0) ? 1 : 2,
                text: t[1],
                tokens: this.lexer.inline(t[1])
            }
        }
        paragraph(e) {
            const t = this.rules.block.paragraph.exec(e);
            if (t) {
                const e = "\n" === t[1].charAt(t[1].length - 1) ? t[1].slice(0, -1) : t[1];
                return {
                    type: "paragraph",
                    raw: t[0],
                    text: e,
                    tokens: this.lexer.inline(e)
                }
            }
        }
        text(e) {
            const t = this.rules.block.text.exec(e);
            if (t) return {
                type: "text",
                raw: t[0],
                text: t[0],
                tokens: this.lexer.inline(t[0])
            }
        }
        escape(e) {
            const t = this.rules.inline.escape.exec(e);
            if (t) return {
                type: "escape",
                raw: t[0],
                text: c(t[1])
            }
        }
        tag(e) {
            const t = this.rules.inline.tag.exec(e);
            if (t) return !this.lexer.state.inLink && /^<a /i.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && /^<\/a>/i.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
                type: "html",
                raw: t[0],
                inLink: this.lexer.state.inLink,
                inRawBlock: this.lexer.state.inRawBlock,
                block: !1,
                text: t[0]
            }
        }
        link(e) {
            const t = this.rules.inline.link.exec(e);
            if (t) {
                const e = t[2].trim();
                if (!this.options.pedantic && /^</.test(e)) {
                    if (!/>$/.test(e)) return;
                    const t = x(e.slice(0, -1), "\\");
                    if ((e.length - t.length) % 2 == 0) return
                } else {
                    const e = function(e, t) {
                        if (-1 === e.indexOf(t[1])) return -1;
                        let n = 0;
                        for (let s = 0; s < e.length; s++)
                            if ("\\" === e[s]) s++;
                            else if (e[s] === t[0]) n++;
                        else if (e[s] === t[1] && (n--, n < 0)) return s;
                        return -1
                    }(t[2], "()");
                    if (e > -1) {
                        const n = (0 === t[0].indexOf("!") ? 5 : 4) + t[1].length + e;
                        t[2] = t[2].substring(0, e), t[0] = t[0].substring(0, n).trim(), t[3] = ""
                    }
                }
                let n = t[2],
                    s = "";
                if (this.options.pedantic) {
                    const e = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(n);
                    e && (n = e[1], s = e[3])
                } else s = t[3] ? t[3].slice(1, -1) : "";
                return n = n.trim(), /^</.test(n) && (n = this.options.pedantic && !/>$/.test(e) ? n.slice(1) : n.slice(1, -1)), b(t, {
                    href: n ? n.replace(this.rules.inline.anyPunctuation, "$1") : n,
                    title: s ? s.replace(this.rules.inline.anyPunctuation, "$1") : s
                }, t[0], this.lexer)
            }
        }
        reflink(e, t) {
            let n;
            if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
                const e = t[(n[2] || n[1]).replace(/\s+/g, " ").toLowerCase()];
                if (!e) {
                    const e = n[0].charAt(0);
                    return {
                        type: "text",
                        raw: e,
                        text: e
                    }
                }
                return b(n, e, n[0], this.lexer)
            }
        }
        emStrong(e, t, n = "") {
            let s = this.rules.inline.emStrongLDelim.exec(e);
            if (!s) return;
            if (s[3] && n.match(/[\p{L}\p{N}]/u)) return;
            if (!(s[1] || s[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
                const n = [...s[0]].length - 1;
                let r, i, l = n,
                    o = 0;
                const a = "*" === s[0][0] ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
                for (a.lastIndex = 0, t = t.slice(-1 * e.length + n); null != (s = a.exec(t));) {
                    if (r = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !r) continue;
                    if (i = [...r].length, s[3] || s[4]) {
                        l += i;
                        continue
                    }
                    if ((s[5] || s[6]) && n % 3 && !((n + i) % 3)) {
                        o += i;
                        continue
                    }
                    if (l -= i, l > 0) continue;
                    i = Math.min(i, i + l + o);
                    const t = [...s[0]][0].length,
                        a = e.slice(0, n + s.index + t + i);
                    if (Math.min(n, i) % 2) {
                        const e = a.slice(1, -1);
                        return {
                            type: "em",
                            raw: a,
                            text: e,
                            tokens: this.lexer.inlineTokens(e)
                        }
                    }
                    const c = a.slice(2, -2);
                    return {
                        type: "strong",
                        raw: a,
                        text: c,
                        tokens: this.lexer.inlineTokens(c)
                    }
                }
            }
        }
        codespan(e) {
            const t = this.rules.inline.code.exec(e);
            if (t) {
                let e = t[2].replace(/\n/g, " ");
                const n = /[^ ]/.test(e),
                    s = /^ /.test(e) && / $/.test(e);
                return n && s && (e = e.substring(1, e.length - 1)), e = c(e, !0), {
                    type: "codespan",
                    raw: t[0],
                    text: e
                }
            }
        }
        br(e) {
            const t = this.rules.inline.br.exec(e);
            if (t) return {
                type: "br",
                raw: t[0]
            }
        }
        del(e) {
            const t = this.rules.inline.del.exec(e);
            if (t) return {
                type: "del",
                raw: t[0],
                text: t[2],
                tokens: this.lexer.inlineTokens(t[2])
            }
        }
        autolink(e) {
            const t = this.rules.inline.autolink.exec(e);
            if (t) {
                let e, n;
                return "@" === t[2] ? (e = c(t[1]), n = "mailto:" + e) : (e = c(t[1]), n = e), {
                    type: "link",
                    raw: t[0],
                    text: e,
                    href: n,
                    tokens: [{
                        type: "text",
                        raw: e,
                        text: e
                    }]
                }
            }
        }
        url(e) {
            let t;
            if (t = this.rules.inline.url.exec(e)) {
                let e, n;
                if ("@" === t[2]) e = c(t[0]), n = "mailto:" + e;
                else {
                    let s;
                    do {
                        s = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? ""
                    } while (s !== t[0]);
                    e = c(t[0]), n = "www." === t[1] ? "http://" + t[0] : t[0]
                }
                return {
                    type: "link",
                    raw: t[0],
                    text: e,
                    href: n,
                    tokens: [{
                        type: "text",
                        raw: e,
                        text: e
                    }]
                }
            }
        }
        inlineText(e) {
            const t = this.rules.inline.text.exec(e);
            if (t) {
                let e;
                return e = this.lexer.state.inRawBlock ? t[0] : c(t[0]), {
                    type: "text",
                    raw: t[0],
                    text: e
                }
            }
        }
    }
    const m = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
        y = /(?:[*+-]|\d{1,9}[.)])/,
        $ = k(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, y).replace(/blockCode/g, / {4}/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex(),
        z = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
        T = /(?!\s*\])(?:\\.|[^\[\]\\])+/,
        R = k(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label", T).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),
        _ = k(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, y).getRegex(),
        A = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",
        S = /<!--(?:-?>|[\s\S]*?(?:-->|$))/,
        I = k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))", "i").replace("comment", S).replace("tag", A).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),
        E = k(z).replace("hr", m).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", A).getRegex(),
        q = {
            blockquote: k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", E).getRegex(),
            code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
            def: R,
            fences: /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
            heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
            hr: m,
            html: I,
            lheading: $,
            list: _,
            newline: /^(?: *(?:\n|$))+/,
            paragraph: E,
            table: f,
            text: /^[^\n]+/
        },
        Z = k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", m).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", A).getRegex(),
        L = {
            ...q,
            table: Z,
            paragraph: k(z).replace("hr", m).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Z).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", A).getRegex()
        },
        P = {
            ...q,
            html: k("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", S).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
            def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
            heading: /^(#{1,6})(.*)(?:\n+|$)/,
            fences: f,
            lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
            paragraph: k(z).replace("hr", m).replace("heading", " *#{1,6} *[^\n]").replace("lheading", $).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
        },
        Q = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
        v = /^( {2,}|\\)\n(?!\s*$)/,
        B = "\\p{P}\\p{S}",
        C = k(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, B).getRegex(),
        M = k(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, B).getRegex(),
        O = k("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, B).getRegex(),
        D = k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, B).getRegex(),
        j = k(/\\([punct])/, "gu").replace(/punct/g, B).getRegex(),
        H = k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),
        U = k(S).replace("(?:--\x3e|$)", "--\x3e").getRegex(),
        X = k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", U).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),
        F = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,
        N = k(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", F).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),
        G = k(/^!?\[(label)\]\[(ref)\]/).replace("label", F).replace("ref", T).getRegex(),
        J = k(/^!?\[(ref)\](?:\[\])?/).replace("ref", T).getRegex(),
        K = {
            _backpedal: f,
            anyPunctuation: j,
            autolink: H,
            blockSkip: /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g,
            br: v,
            code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
            del: f,
            emStrongLDelim: M,
            emStrongRDelimAst: O,
            emStrongRDelimUnd: D,
            escape: Q,
            link: N,
            nolink: J,
            punctuation: C,
            reflink: G,
            reflinkSearch: k("reflink|nolink(?!\\()", "g").replace("reflink", G).replace("nolink", J).getRegex(),
            tag: X,
            text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
            url: f
        },
        V = {
            ...K,
            link: k(/^!?\[(label)\]\((.*?)\)/).replace("label", F).getRegex(),
            reflink: k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", F).getRegex()
        },
        W = {
            ...K,
            escape: k(Q).replace("])", "~|])").getRegex(),
            url: k(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
            _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
            del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
            text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
        },
        Y = {
            ...W,
            br: k(v).replace("{2,}", "*").getRegex(),
            text: k(W.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
        },
        ee = {
            normal: q,
            gfm: L,
            pedantic: P
        },
        te = {
            normal: K,
            gfm: W,
            breaks: Y,
            pedantic: V
        };
    class ne {
        tokens;
        options;
        state;
        tokenizer;
        inlineQueue;
        constructor(t) {
            this.tokens = [], this.tokens.links = Object.create(null), this.options = t || e.defaults, this.options.tokenizer = this.options.tokenizer || new w, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
                inLink: !1,
                inRawBlock: !1,
                top: !0
            };
            const n = {
                block: ee.normal,
                inline: te.normal
            };
            this.options.pedantic ? (n.block = ee.pedantic, n.inline = te.pedantic) : this.options.gfm && (n.block = ee.gfm, this.options.breaks ? n.inline = te.breaks : n.inline = te.gfm), this.tokenizer.rules = n
        }
        static get rules() {
            return {
                block: ee,
                inline: te
            }
        }
        static lex(e, t) {
            return new ne(t).lex(e)
        }
        static lexInline(e, t) {
            return new ne(t).inlineTokens(e)
        }
        lex(e) {
            e = e.replace(/\r\n|\r/g, "\n"), this.blockTokens(e, this.tokens);
            for (let e = 0; e < this.inlineQueue.length; e++) {
                const t = this.inlineQueue[e];
                this.inlineTokens(t.src, t.tokens)
            }
            return this.inlineQueue = [], this.tokens
        }
        blockTokens(e, t = []) {
            let n, s, r, i;
            for (e = this.options.pedantic ? e.replace(/\t/g, "    ").replace(/^ +$/gm, "") : e.replace(/^( *)(\t+)/gm, ((e, t, n) => t + "    ".repeat(n.length))); e;)
                if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((s => !!(n = s.call({
                        lexer: this
                    }, e, t)) && (e = e.substring(n.raw.length), t.push(n), !0)))))
                    if (n = this.tokenizer.space(e)) e = e.substring(n.raw.length), 1 === n.raw.length && t.length > 0 ? t[t.length - 1].raw += "\n" : t.push(n);
                    else if (n = this.tokenizer.code(e)) e = e.substring(n.raw.length), s = t[t.length - 1], !s || "paragraph" !== s.type && "text" !== s.type ? t.push(n) : (s.raw += "\n" + n.raw, s.text += "\n" + n.text, this.inlineQueue[this.inlineQueue.length - 1].src = s.text);
            else if (n = this.tokenizer.fences(e)) e = e.substring(n.raw.length), t.push(n);
            else if (n = this.tokenizer.heading(e)) e = e.substring(n.raw.length), t.push(n);
            else if (n = this.tokenizer.hr(e)) e = e.substring(n.raw.length), t.push(n);
            else if (n = this.tokenizer.blockquote(e)) e = e.substring(n.raw.length), t.push(n);
            else if (n = this.tokenizer.list(e)) e = e.substring(n.raw.length), t.push(n);
            else if (n = this.tokenizer.html(e)) e = e.substring(n.raw.length), t.push(n);
            else if (n = this.tokenizer.def(e)) e = e.substring(n.raw.length), s = t[t.length - 1], !s || "paragraph" !== s.type && "text" !== s.type ? this.tokens.links[n.tag] || (this.tokens.links[n.tag] = {
                href: n.href,
                title: n.title
            }) : (s.raw += "\n" + n.raw, s.text += "\n" + n.raw, this.inlineQueue[this.inlineQueue.length - 1].src = s.text);
            else if (n = this.tokenizer.table(e)) e = e.substring(n.raw.length), t.push(n);
            else if (n = this.tokenizer.lheading(e)) e = e.substring(n.raw.length), t.push(n);
            else {
                if (r = e, this.options.extensions && this.options.extensions.startBlock) {
                    let t = 1 / 0;
                    const n = e.slice(1);
                    let s;
                    this.options.extensions.startBlock.forEach((e => {
                        s = e.call({
                            lexer: this
                        }, n), "number" == typeof s && s >= 0 && (t = Math.min(t, s))
                    })), t < 1 / 0 && t >= 0 && (r = e.substring(0, t + 1))
                }
                if (this.state.top && (n = this.tokenizer.paragraph(r))) s = t[t.length - 1], i && "paragraph" === s.type ? (s.raw += "\n" + n.raw, s.text += "\n" + n.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = s.text) : t.push(n), i = r.length !== e.length, e = e.substring(n.raw.length);
                else if (n = this.tokenizer.text(e)) e = e.substring(n.raw.length), s = t[t.length - 1], s && "text" === s.type ? (s.raw += "\n" + n.raw, s.text += "\n" + n.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = s.text) : t.push(n);
                else if (e) {
                    const t = "Infinite loop on byte: " + e.charCodeAt(0);
                    if (this.options.silent) {
                        console.error(t);
                        break
                    }
                    throw new Error(t)
                }
            }
            return this.state.top = !0, t
        }
        inline(e, t = []) {
            return this.inlineQueue.push({
                src: e,
                tokens: t
            }), t
        }
        inlineTokens(e, t = []) {
            let n, s, r, i, l, o, a = e;
            if (this.tokens.links) {
                const e = Object.keys(this.tokens.links);
                if (e.length > 0)
                    for (; null != (i = this.tokenizer.rules.inline.reflinkSearch.exec(a));) e.includes(i[0].slice(i[0].lastIndexOf("[") + 1, -1)) && (a = a.slice(0, i.index) + "[" + "a".repeat(i[0].length - 2) + "]" + a.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))
            }
            for (; null != (i = this.tokenizer.rules.inline.blockSkip.exec(a));) a = a.slice(0, i.index) + "[" + "a".repeat(i[0].length - 2) + "]" + a.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
            for (; null != (i = this.tokenizer.rules.inline.anyPunctuation.exec(a));) a = a.slice(0, i.index) + "++" + a.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
            for (; e;)
                if (l || (o = ""), l = !1, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((s => !!(n = s.call({
                        lexer: this
                    }, e, t)) && (e = e.substring(n.raw.length), t.push(n), !0)))))
                    if (n = this.tokenizer.escape(e)) e = e.substring(n.raw.length), t.push(n);
                    else if (n = this.tokenizer.tag(e)) e = e.substring(n.raw.length), s = t[t.length - 1], s && "text" === n.type && "text" === s.type ? (s.raw += n.raw, s.text += n.text) : t.push(n);
            else if (n = this.tokenizer.link(e)) e = e.substring(n.raw.length), t.push(n);
            else if (n = this.tokenizer.reflink(e, this.tokens.links)) e = e.substring(n.raw.length), s = t[t.length - 1], s && "text" === n.type && "text" === s.type ? (s.raw += n.raw, s.text += n.text) : t.push(n);
            else if (n = this.tokenizer.emStrong(e, a, o)) e = e.substring(n.raw.length), t.push(n);
            else if (n = this.tokenizer.codespan(e)) e = e.substring(n.raw.length), t.push(n);
            else if (n = this.tokenizer.br(e)) e = e.substring(n.raw.length), t.push(n);
            else if (n = this.tokenizer.del(e)) e = e.substring(n.raw.length), t.push(n);
            else if (n = this.tokenizer.autolink(e)) e = e.substring(n.raw.length), t.push(n);
            else if (this.state.inLink || !(n = this.tokenizer.url(e))) {
                if (r = e, this.options.extensions && this.options.extensions.startInline) {
                    let t = 1 / 0;
                    const n = e.slice(1);
                    let s;
                    this.options.extensions.startInline.forEach((e => {
                        s = e.call({
                            lexer: this
                        }, n), "number" == typeof s && s >= 0 && (t = Math.min(t, s))
                    })), t < 1 / 0 && t >= 0 && (r = e.substring(0, t + 1))
                }
                if (n = this.tokenizer.inlineText(r)) e = e.substring(n.raw.length), "_" !== n.raw.slice(-1) && (o = n.raw.slice(-1)), l = !0, s = t[t.length - 1], s && "text" === s.type ? (s.raw += n.raw, s.text += n.text) : t.push(n);
                else if (e) {
                    const t = "Infinite loop on byte: " + e.charCodeAt(0);
                    if (this.options.silent) {
                        console.error(t);
                        break
                    }
                    throw new Error(t)
                }
            } else e = e.substring(n.raw.length), t.push(n);
            return t
        }
    }
    class se {
        options;
        constructor(t) {
            this.options = t || e.defaults
        }
        code(e, t, n) {
            const s = (t || "").match(/^\S*/)?.[0];
            return e = e.replace(/\n$/, "") + "\n", s ? '<pre><code class="language-' + c(s) + '">' + (n ? e : c(e, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? e : c(e, !0)) + "</code></pre>\n"
        }
        blockquote(e) {
            return `<blockquote>\n${e}</blockquote>\n`
        }
        html(e, t) {
            return e
        }
        heading(e, t, n) {
            return `<h${t}>${e}</h${t}>\n`
        }
        hr() {
            return "<hr>\n"
        }
        list(e, t, n) {
            const s = t ? "ol" : "ul";
            return "<" + s + (t && 1 !== n ? ' start="' + n + '"' : "") + ">\n" + e + "</" + s + ">\n"
        }
        listitem(e, t, n) {
            return `<li>${e}</li>\n`
        }
        checkbox(e) {
            return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">'
        }
        paragraph(e) {
            return `<p>${e}</p>\n`
        }
        table(e, t) {
            return t && (t = `<tbody>${t}</tbody>`), "<table>\n<thead>\n" + e + "</thead>\n" + t + "</table>\n"
        }
        tablerow(e) {
            return `<tr>\n${e}</tr>\n`
        }
        tablecell(e, t) {
            const n = t.header ? "th" : "td";
            return (t.align ? `<${n} align="${t.align}">` : `<${n}>`) + e + `</${n}>\n`
        }
        strong(e) {
            return `<strong>${e}</strong>`
        }
        em(e) {
            return `<em>${e}</em>`
        }
        codespan(e) {
            return `<code>${e}</code>`
        }
        br() {
            return "<br>"
        }
        del(e) {
            return `<del>${e}</del>`
        }
        link(e, t, n) {
            const s = g(e);
            if (null === s) return n;
            let r = '<a href="' + (e = s) + '"';
            return t && (r += ' title="' + t + '"'), r += ">" + n + "</a>", r
        }
        image(e, t, n) {
            const s = g(e);
            if (null === s) return n;
            let r = `<img src="${e=s}" alt="${n}"`;
            return t && (r += ` title="${t}"`), r += ">", r
        }
        text(e) {
            return e
        }
    }
    class re {
        strong(e) {
            return e
        }
        em(e) {
            return e
        }
        codespan(e) {
            return e
        }
        del(e) {
            return e
        }
        html(e) {
            return e
        }
        text(e) {
            return e
        }
        link(e, t, n) {
            return "" + n
        }
        image(e, t, n) {
            return "" + n
        }
        br() {
            return ""
        }
    }
    class ie {
        options;
        renderer;
        textRenderer;
        constructor(t) {
            this.options = t || e.defaults, this.options.renderer = this.options.renderer || new se, this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new re
        }
        static parse(e, t) {
            return new ie(t).parse(e)
        }
        static parseInline(e, t) {
            return new ie(t).parseInline(e)
        }
        parse(e, t = !0) {
            let n = "";
            for (let s = 0; s < e.length; s++) {
                const r = e[s];
                if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[r.type]) {
                    const e = r,
                        t = this.options.extensions.renderers[e.type].call({
                            parser: this
                        }, e);
                    if (!1 !== t || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(e.type)) {
                        n += t || "";
                        continue
                    }
                }
                switch (r.type) {
                    case "space":
                        continue;
                    case "hr":
                        n += this.renderer.hr();
                        continue;
                    case "heading": {
                        const e = r;
                        n += this.renderer.heading(this.parseInline(e.tokens), e.depth, p(this.parseInline(e.tokens, this.textRenderer)));
                        continue
                    }
                    case "code": {
                        const e = r;
                        n += this.renderer.code(e.text, e.lang, !!e.escaped);
                        continue
                    }
                    case "table": {
                        const e = r;
                        let t = "",
                            s = "";
                        for (let t = 0; t < e.header.length; t++) s += this.renderer.tablecell(this.parseInline(e.header[t].tokens), {
                            header: !0,
                            align: e.align[t]
                        });
                        t += this.renderer.tablerow(s);
                        let i = "";
                        for (let t = 0; t < e.rows.length; t++) {
                            const n = e.rows[t];
                            s = "";
                            for (let t = 0; t < n.length; t++) s += this.renderer.tablecell(this.parseInline(n[t].tokens), {
                                header: !1,
                                align: e.align[t]
                            });
                            i += this.renderer.tablerow(s)
                        }
                        n += this.renderer.table(t, i);
                        continue
                    }
                    case "blockquote": {
                        const e = r,
                            t = this.parse(e.tokens);
                        n += this.renderer.blockquote(t);
                        continue
                    }
                    case "list": {
                        const e = r,
                            t = e.ordered,
                            s = e.start,
                            i = e.loose;
                        let l = "";
                        for (let t = 0; t < e.items.length; t++) {
                            const n = e.items[t],
                                s = n.checked,
                                r = n.task;
                            let o = "";
                            if (n.task) {
                                const e = this.renderer.checkbox(!!s);
                                i ? n.tokens.length > 0 && "paragraph" === n.tokens[0].type ? (n.tokens[0].text = e + " " + n.tokens[0].text, n.tokens[0].tokens && n.tokens[0].tokens.length > 0 && "text" === n.tokens[0].tokens[0].type && (n.tokens[0].tokens[0].text = e + " " + n.tokens[0].tokens[0].text)) : n.tokens.unshift({
                                    type: "text",
                                    text: e + " "
                                }) : o += e + " "
                            }
                            o += this.parse(n.tokens, i), l += this.renderer.listitem(o, r, !!s)
                        }
                        n += this.renderer.list(l, t, s);
                        continue
                    }
                    case "html": {
                        const e = r;
                        n += this.renderer.html(e.text, e.block);
                        continue
                    }
                    case "paragraph": {
                        const e = r;
                        n += this.renderer.paragraph(this.parseInline(e.tokens));
                        continue
                    }
                    case "text": {
                        let i = r,
                            l = i.tokens ? this.parseInline(i.tokens) : i.text;
                        for (; s + 1 < e.length && "text" === e[s + 1].type;) i = e[++s], l += "\n" + (i.tokens ? this.parseInline(i.tokens) : i.text);
                        n += t ? this.renderer.paragraph(l) : l;
                        continue
                    }
                    default: {
                        const e = 'Token with "' + r.type + '" type was not found.';
                        if (this.options.silent) return console.error(e), "";
                        throw new Error(e)
                    }
                }
            }
            return n
        }
        parseInline(e, t) {
            t = t || this.renderer;
            let n = "";
            for (let s = 0; s < e.length; s++) {
                const r = e[s];
                if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[r.type]) {
                    const e = this.options.extensions.renderers[r.type].call({
                        parser: this
                    }, r);
                    if (!1 !== e || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(r.type)) {
                        n += e || "";
                        continue
                    }
                }
                switch (r.type) {
                    case "escape": {
                        const e = r;
                        n += t.text(e.text);
                        break
                    }
                    case "html": {
                        const e = r;
                        n += t.html(e.text);
                        break
                    }
                    case "link": {
                        const e = r;
                        n += t.link(e.href, e.title, this.parseInline(e.tokens, t));
                        break
                    }
                    case "image": {
                        const e = r;
                        n += t.image(e.href, e.title, e.text);
                        break
                    }
                    case "strong": {
                        const e = r;
                        n += t.strong(this.parseInline(e.tokens, t));
                        break
                    }
                    case "em": {
                        const e = r;
                        n += t.em(this.parseInline(e.tokens, t));
                        break
                    }
                    case "codespan": {
                        const e = r;
                        n += t.codespan(e.text);
                        break
                    }
                    case "br":
                        n += t.br();
                        break;
                    case "del": {
                        const e = r;
                        n += t.del(this.parseInline(e.tokens, t));
                        break
                    }
                    case "text": {
                        const e = r;
                        n += t.text(e.text);
                        break
                    }
                    default: {
                        const e = 'Token with "' + r.type + '" type was not found.';
                        if (this.options.silent) return console.error(e), "";
                        throw new Error(e)
                    }
                }
            }
            return n
        }
    }
    class le {
        options;
        constructor(t) {
            this.options = t || e.defaults
        }
        static passThroughHooks = new Set(["preprocess", "postprocess", "processAllTokens"]);
        preprocess(e) {
            return e
        }
        postprocess(e) {
            return e
        }
        processAllTokens(e) {
            return e
        }
    }
    class oe {
        defaults = {
            async: !1,
            breaks: !1,
            extensions: null,
            gfm: !0,
            hooks: null,
            pedantic: !1,
            renderer: null,
            silent: !1,
            tokenizer: null,
            walkTokens: null
        };
        options = this.setOptions;
        parse = this.#e(ne.lex, ie.parse);
        parseInline = this.#e(ne.lexInline, ie.parseInline);
        Parser = ie;
        Renderer = se;
        TextRenderer = re;
        Lexer = ne;
        Tokenizer = w;
        Hooks = le;
        constructor(...e) {
            this.use(...e)
        }
        walkTokens(e, t) {
            let n = [];
            for (const s of e) switch (n = n.concat(t.call(this, s)), s.type) {
                case "table": {
                    const e = s;
                    for (const s of e.header) n = n.concat(this.walkTokens(s.tokens, t));
                    for (const s of e.rows)
                        for (const e of s) n = n.concat(this.walkTokens(e.tokens, t));
                    break
                }
                case "list": {
                    const e = s;
                    n = n.concat(this.walkTokens(e.items, t));
                    break
                }
                default: {
                    const e = s;
                    this.defaults.extensions?.childTokens?.[e.type] ? this.defaults.extensions.childTokens[e.type].forEach((s => {
                        const r = e[s].flat(1 / 0);
                        n = n.concat(this.walkTokens(r, t))
                    })) : e.tokens && (n = n.concat(this.walkTokens(e.tokens, t)))
                }
            }
            return n
        }
        use(...e) {
            const t = this.defaults.extensions || {
                renderers: {},
                childTokens: {}
            };
            return e.forEach((e => {
                const n = {
                    ...e
                };
                if (n.async = this.defaults.async || n.async || !1, e.extensions && (e.extensions.forEach((e => {
                        if (!e.name) throw new Error("extension name required");
                        if ("renderer" in e) {
                            const n = t.renderers[e.name];
                            t.renderers[e.name] = n ? function(...t) {
                                let s = e.renderer.apply(this, t);
                                return !1 === s && (s = n.apply(this, t)), s
                            } : e.renderer
                        }
                        if ("tokenizer" in e) {
                            if (!e.level || "block" !== e.level && "inline" !== e.level) throw new Error("extension level must be 'block' or 'inline'");
                            const n = t[e.level];
                            n ? n.unshift(e.tokenizer) : t[e.level] = [e.tokenizer], e.start && ("block" === e.level ? t.startBlock ? t.startBlock.push(e.start) : t.startBlock = [e.start] : "inline" === e.level && (t.startInline ? t.startInline.push(e.start) : t.startInline = [e.start]))
                        }
                        "childTokens" in e && e.childTokens && (t.childTokens[e.name] = e.childTokens)
                    })), n.extensions = t), e.renderer) {
                    const t = this.defaults.renderer || new se(this.defaults);
                    for (const n in e.renderer) {
                        if (!(n in t)) throw new Error(`renderer '${n}' does not exist`);
                        if ("options" === n) continue;
                        const s = n,
                            r = e.renderer[s],
                            i = t[s];
                        t[s] = (...e) => {
                            let n = r.apply(t, e);
                            return !1 === n && (n = i.apply(t, e)), n || ""
                        }
                    }
                    n.renderer = t
                }
                if (e.tokenizer) {
                    const t = this.defaults.tokenizer || new w(this.defaults);
                    for (const n in e.tokenizer) {
                        if (!(n in t)) throw new Error(`tokenizer '${n}' does not exist`);
                        if (["options", "rules", "lexer"].includes(n)) continue;
                        const s = n,
                            r = e.tokenizer[s],
                            i = t[s];
                        t[s] = (...e) => {
                            let n = r.apply(t, e);
                            return !1 === n && (n = i.apply(t, e)), n
                        }
                    }
                    n.tokenizer = t
                }
                if (e.hooks) {
                    const t = this.defaults.hooks || new le;
                    for (const n in e.hooks) {
                        if (!(n in t)) throw new Error(`hook '${n}' does not exist`);
                        if ("options" === n) continue;
                        const s = n,
                            r = e.hooks[s],
                            i = t[s];
                        le.passThroughHooks.has(n) ? t[s] = e => {
                            if (this.defaults.async) return Promise.resolve(r.call(t, e)).then((e => i.call(t, e)));
                            const n = r.call(t, e);
                            return i.call(t, n)
                        } : t[s] = (...e) => {
                            let n = r.apply(t, e);
                            return !1 === n && (n = i.apply(t, e)), n
                        }
                    }
                    n.hooks = t
                }
                if (e.walkTokens) {
                    const t = this.defaults.walkTokens,
                        s = e.walkTokens;
                    n.walkTokens = function(e) {
                        let n = [];
                        return n.push(s.call(this, e)), t && (n = n.concat(t.call(this, e))), n
                    }
                }
                this.defaults = {
                    ...this.defaults,
                    ...n
                }
            })), this
        }
        setOptions(e) {
            return this.defaults = {
                ...this.defaults,
                ...e
            }, this
        }
        lexer(e, t) {
            return ne.lex(e, t ?? this.defaults)
        }
        parser(e, t) {
            return ie.parse(e, t ?? this.defaults)
        }
        #e(e, t) {
            return (n, s) => {
                const r = {
                        ...s
                    },
                    i = {
                        ...this.defaults,
                        ...r
                    };
                !0 === this.defaults.async && !1 === r.async && (i.silent || console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."), i.async = !0);
                const l = this.#t(!!i.silent, !!i.async);
                if (null == n) return l(new Error("marked(): input parameter is undefined or null"));
                if ("string" != typeof n) return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
                if (i.hooks && (i.hooks.options = i), i.async) return Promise.resolve(i.hooks ? i.hooks.preprocess(n) : n).then((t => e(t, i))).then((e => i.hooks ? i.hooks.processAllTokens(e) : e)).then((e => i.walkTokens ? Promise.all(this.walkTokens(e, i.walkTokens)).then((() => e)) : e)).then((e => t(e, i))).then((e => i.hooks ? i.hooks.postprocess(e) : e)).catch(l);
                try {
                    i.hooks && (n = i.hooks.preprocess(n));
                    let s = e(n, i);
                    i.hooks && (s = i.hooks.processAllTokens(s)), i.walkTokens && this.walkTokens(s, i.walkTokens);
                    let r = t(s, i);
                    return i.hooks && (r = i.hooks.postprocess(r)), r
                } catch (e) {
                    return l(e)
                }
            }
        }
        #t(e, t) {
            return n => {
                if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
                    const e = "<p>An error occurred:</p><pre>" + c(n.message + "", !0) + "</pre>";
                    return t ? Promise.resolve(e) : e
                }
                if (t) return Promise.reject(n);
                throw n
            }
        }
    }
    const ae = new oe;

    function ce(e, t) {
        return ae.parse(e, t)
    }
    ce.options = ce.setOptions = function(e) {
        return ae.setOptions(e), ce.defaults = ae.defaults, n(ce.defaults), ce
    }, ce.getDefaults = t, ce.defaults = e.defaults, ce.use = function(...e) {
        return ae.use(...e), ce.defaults = ae.defaults, n(ce.defaults), ce
    }, ce.walkTokens = function(e, t) {
        return ae.walkTokens(e, t)
    }, ce.parseInline = ae.parseInline, ce.Parser = ie, ce.parser = ie.parse, ce.Renderer = se, ce.TextRenderer = re, ce.Lexer = ne, ce.lexer = ne.lex, ce.Tokenizer = w, ce.Hooks = le, ce.parse = ce;
    const he = ce.options,
        pe = ce.setOptions,
        ue = ce.use,
        ke = ce.walkTokens,
        ge = ce.parseInline,
        fe = ce,
        de = ie.parse,
        xe = ne.lex;
    e.Hooks = le, e.Lexer = ne, e.Marked = oe, e.Parser = ie, e.Renderer = se, e.TextRenderer = re, e.Tokenizer = w, e.getDefaults = t, e.lexer = xe, e.marked = ce, e.options = he, e.parse = fe, e.parseInline = ge, e.parser = de, e.setOptions = pe, e.use = ue, e.walkTokens = ke
}));