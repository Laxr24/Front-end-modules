(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

  // node_modules/highlight.js/lib/core.js
  var require_core = __commonJS({
    "node_modules/highlight.js/lib/core.js"(exports, module) {
      function deepFreeze(obj) {
        Object.freeze(obj);
        var objIsFunction = typeof obj === "function";
        Object.getOwnPropertyNames(obj).forEach(function(prop) {
          if (Object.hasOwnProperty.call(obj, prop) && obj[prop] !== null && (typeof obj[prop] === "object" || typeof obj[prop] === "function") && (objIsFunction ? prop !== "caller" && prop !== "callee" && prop !== "arguments" : true) && !Object.isFrozen(obj[prop])) {
            deepFreeze(obj[prop]);
          }
        });
        return obj;
      }
      var Response = class {
        constructor(mode) {
          if (mode.data === void 0)
            mode.data = {};
          this.data = mode.data;
        }
        ignoreMatch() {
          this.ignore = true;
        }
      };
      function escapeHTML(value) {
        return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
      }
      function inherit(original, ...objects) {
        var result = {};
        for (const key in original) {
          result[key] = original[key];
        }
        objects.forEach(function(obj) {
          for (const key in obj) {
            result[key] = obj[key];
          }
        });
        return result;
      }
      function tag(node) {
        return node.nodeName.toLowerCase();
      }
      function nodeStream(node) {
        var result = [];
        (function _nodeStream(node2, offset) {
          for (var child = node2.firstChild; child; child = child.nextSibling) {
            if (child.nodeType === 3) {
              offset += child.nodeValue.length;
            } else if (child.nodeType === 1) {
              result.push({
                event: "start",
                offset,
                node: child
              });
              offset = _nodeStream(child, offset);
              if (!tag(child).match(/br|hr|img|input/)) {
                result.push({
                  event: "stop",
                  offset,
                  node: child
                });
              }
            }
          }
          return offset;
        })(node, 0);
        return result;
      }
      function mergeStreams(original, highlighted, value) {
        var processed = 0;
        var result = "";
        var nodeStack = [];
        function selectStream() {
          if (!original.length || !highlighted.length) {
            return original.length ? original : highlighted;
          }
          if (original[0].offset !== highlighted[0].offset) {
            return original[0].offset < highlighted[0].offset ? original : highlighted;
          }
          return highlighted[0].event === "start" ? original : highlighted;
        }
        function open(node) {
          function attr_str(attr) {
            return " " + attr.nodeName + '="' + escapeHTML(attr.value) + '"';
          }
          result += "<" + tag(node) + [].map.call(node.attributes, attr_str).join("") + ">";
        }
        function close(node) {
          result += "</" + tag(node) + ">";
        }
        function render(event) {
          (event.event === "start" ? open : close)(event.node);
        }
        while (original.length || highlighted.length) {
          var stream = selectStream();
          result += escapeHTML(value.substring(processed, stream[0].offset));
          processed = stream[0].offset;
          if (stream === original) {
            nodeStack.reverse().forEach(close);
            do {
              render(stream.splice(0, 1)[0]);
              stream = selectStream();
            } while (stream === original && stream.length && stream[0].offset === processed);
            nodeStack.reverse().forEach(open);
          } else {
            if (stream[0].event === "start") {
              nodeStack.push(stream[0].node);
            } else {
              nodeStack.pop();
            }
            render(stream.splice(0, 1)[0]);
          }
        }
        return result + escapeHTML(value.substr(processed));
      }
      var utils = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        escapeHTML,
        inherit,
        nodeStream,
        mergeStreams
      });
      var SPAN_CLOSE = "</span>";
      var emitsWrappingTags = (node) => {
        return !!node.kind;
      };
      var HTMLRenderer = class {
        constructor(parseTree, options) {
          this.buffer = "";
          this.classPrefix = options.classPrefix;
          parseTree.walk(this);
        }
        addText(text) {
          this.buffer += escapeHTML(text);
        }
        openNode(node) {
          if (!emitsWrappingTags(node))
            return;
          let className = node.kind;
          if (!node.sublanguage) {
            className = `${this.classPrefix}${className}`;
          }
          this.span(className);
        }
        closeNode(node) {
          if (!emitsWrappingTags(node))
            return;
          this.buffer += SPAN_CLOSE;
        }
        value() {
          return this.buffer;
        }
        span(className) {
          this.buffer += `<span class="${className}">`;
        }
      };
      var TokenTree = class {
        constructor() {
          this.rootNode = { children: [] };
          this.stack = [this.rootNode];
        }
        get top() {
          return this.stack[this.stack.length - 1];
        }
        get root() {
          return this.rootNode;
        }
        add(node) {
          this.top.children.push(node);
        }
        openNode(kind) {
          const node = { kind, children: [] };
          this.add(node);
          this.stack.push(node);
        }
        closeNode() {
          if (this.stack.length > 1) {
            return this.stack.pop();
          }
          return void 0;
        }
        closeAllNodes() {
          while (this.closeNode())
            ;
        }
        toJSON() {
          return JSON.stringify(this.rootNode, null, 4);
        }
        walk(builder) {
          return this.constructor._walk(builder, this.rootNode);
        }
        static _walk(builder, node) {
          if (typeof node === "string") {
            builder.addText(node);
          } else if (node.children) {
            builder.openNode(node);
            node.children.forEach((child) => this._walk(builder, child));
            builder.closeNode(node);
          }
          return builder;
        }
        static _collapse(node) {
          if (typeof node === "string")
            return;
          if (!node.children)
            return;
          if (node.children.every((el) => typeof el === "string")) {
            node.children = [node.children.join("")];
          } else {
            node.children.forEach((child) => {
              TokenTree._collapse(child);
            });
          }
        }
      };
      var TokenTreeEmitter = class extends TokenTree {
        constructor(options) {
          super();
          this.options = options;
        }
        addKeyword(text, kind) {
          if (text === "") {
            return;
          }
          this.openNode(kind);
          this.addText(text);
          this.closeNode();
        }
        addText(text) {
          if (text === "") {
            return;
          }
          this.add(text);
        }
        addSublanguage(emitter, name) {
          const node = emitter.root;
          node.kind = name;
          node.sublanguage = true;
          this.add(node);
        }
        toHTML() {
          const renderer = new HTMLRenderer(this, this.options);
          return renderer.value();
        }
        finalize() {
          return true;
        }
      };
      function escape(value) {
        return new RegExp(value.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "m");
      }
      function source(re) {
        if (!re)
          return null;
        if (typeof re === "string")
          return re;
        return re.source;
      }
      function concat(...args) {
        const joined = args.map((x) => source(x)).join("");
        return joined;
      }
      function countMatchGroups(re) {
        return new RegExp(re.toString() + "|").exec("").length - 1;
      }
      function startsWith(re, lexeme) {
        var match = re && re.exec(lexeme);
        return match && match.index === 0;
      }
      function join(regexps, separator = "|") {
        var backreferenceRe = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
        var numCaptures = 0;
        var ret = "";
        for (var i2 = 0; i2 < regexps.length; i2++) {
          numCaptures += 1;
          var offset = numCaptures;
          var re = source(regexps[i2]);
          if (i2 > 0) {
            ret += separator;
          }
          ret += "(";
          while (re.length > 0) {
            var match = backreferenceRe.exec(re);
            if (match == null) {
              ret += re;
              break;
            }
            ret += re.substring(0, match.index);
            re = re.substring(match.index + match[0].length);
            if (match[0][0] === "\\" && match[1]) {
              ret += "\\" + String(Number(match[1]) + offset);
            } else {
              ret += match[0];
              if (match[0] === "(") {
                numCaptures++;
              }
            }
          }
          ret += ")";
        }
        return ret;
      }
      var IDENT_RE = "[a-zA-Z]\\w*";
      var UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
      var NUMBER_RE = "\\b\\d+(\\.\\d+)?";
      var C_NUMBER_RE = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
      var BINARY_NUMBER_RE = "\\b(0b[01]+)";
      var RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
      var SHEBANG = (opts = {}) => {
        const beginShebang = /^#![ ]*\//;
        if (opts.binary) {
          opts.begin = concat(beginShebang, /.*\b/, opts.binary, /\b.*/);
        }
        return inherit({
          className: "meta",
          begin: beginShebang,
          end: /$/,
          relevance: 0,
          "on:begin": (m, resp) => {
            if (m.index !== 0)
              resp.ignoreMatch();
          }
        }, opts);
      };
      var BACKSLASH_ESCAPE = {
        begin: "\\\\[\\s\\S]",
        relevance: 0
      };
      var APOS_STRING_MODE = {
        className: "string",
        begin: "'",
        end: "'",
        illegal: "\\n",
        contains: [BACKSLASH_ESCAPE]
      };
      var QUOTE_STRING_MODE = {
        className: "string",
        begin: '"',
        end: '"',
        illegal: "\\n",
        contains: [BACKSLASH_ESCAPE]
      };
      var PHRASAL_WORDS_MODE = {
        begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
      };
      var COMMENT = function(begin, end, modeOptions = {}) {
        var mode = inherit({
          className: "comment",
          begin,
          end,
          contains: []
        }, modeOptions);
        mode.contains.push(PHRASAL_WORDS_MODE);
        mode.contains.push({
          className: "doctag",
          begin: "(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):",
          relevance: 0
        });
        return mode;
      };
      var C_LINE_COMMENT_MODE = COMMENT("//", "$");
      var C_BLOCK_COMMENT_MODE = COMMENT("/\\*", "\\*/");
      var HASH_COMMENT_MODE = COMMENT("#", "$");
      var NUMBER_MODE = {
        className: "number",
        begin: NUMBER_RE,
        relevance: 0
      };
      var C_NUMBER_MODE = {
        className: "number",
        begin: C_NUMBER_RE,
        relevance: 0
      };
      var BINARY_NUMBER_MODE = {
        className: "number",
        begin: BINARY_NUMBER_RE,
        relevance: 0
      };
      var CSS_NUMBER_MODE = {
        className: "number",
        begin: NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
        relevance: 0
      };
      var REGEXP_MODE = {
        begin: /(?=\/[^/\n]*\/)/,
        contains: [{
          className: "regexp",
          begin: /\//,
          end: /\/[gimuy]*/,
          illegal: /\n/,
          contains: [
            BACKSLASH_ESCAPE,
            {
              begin: /\[/,
              end: /\]/,
              relevance: 0,
              contains: [BACKSLASH_ESCAPE]
            }
          ]
        }]
      };
      var TITLE_MODE = {
        className: "title",
        begin: IDENT_RE,
        relevance: 0
      };
      var UNDERSCORE_TITLE_MODE = {
        className: "title",
        begin: UNDERSCORE_IDENT_RE,
        relevance: 0
      };
      var METHOD_GUARD = {
        begin: "\\.\\s*" + UNDERSCORE_IDENT_RE,
        relevance: 0
      };
      var END_SAME_AS_BEGIN = function(mode) {
        return Object.assign(mode, {
          "on:begin": (m, resp) => {
            resp.data._beginMatch = m[1];
          },
          "on:end": (m, resp) => {
            if (resp.data._beginMatch !== m[1])
              resp.ignoreMatch();
          }
        });
      };
      var MODES = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        IDENT_RE,
        UNDERSCORE_IDENT_RE,
        NUMBER_RE,
        C_NUMBER_RE,
        BINARY_NUMBER_RE,
        RE_STARTERS_RE,
        SHEBANG,
        BACKSLASH_ESCAPE,
        APOS_STRING_MODE,
        QUOTE_STRING_MODE,
        PHRASAL_WORDS_MODE,
        COMMENT,
        C_LINE_COMMENT_MODE,
        C_BLOCK_COMMENT_MODE,
        HASH_COMMENT_MODE,
        NUMBER_MODE,
        C_NUMBER_MODE,
        BINARY_NUMBER_MODE,
        CSS_NUMBER_MODE,
        REGEXP_MODE,
        TITLE_MODE,
        UNDERSCORE_TITLE_MODE,
        METHOD_GUARD,
        END_SAME_AS_BEGIN
      });
      var COMMON_KEYWORDS = "of and for in not or if then".split(" ");
      function compileLanguage(language) {
        function langRe(value, global) {
          return new RegExp(source(value), "m" + (language.case_insensitive ? "i" : "") + (global ? "g" : ""));
        }
        class MultiRegex {
          constructor() {
            this.matchIndexes = {};
            this.regexes = [];
            this.matchAt = 1;
            this.position = 0;
          }
          addRule(re, opts) {
            opts.position = this.position++;
            this.matchIndexes[this.matchAt] = opts;
            this.regexes.push([opts, re]);
            this.matchAt += countMatchGroups(re) + 1;
          }
          compile() {
            if (this.regexes.length === 0) {
              this.exec = () => null;
            }
            const terminators = this.regexes.map((el) => el[1]);
            this.matcherRe = langRe(join(terminators), true);
            this.lastIndex = 0;
          }
          exec(s) {
            this.matcherRe.lastIndex = this.lastIndex;
            const match = this.matcherRe.exec(s);
            if (!match) {
              return null;
            }
            const i2 = match.findIndex((el, i3) => i3 > 0 && el !== void 0);
            const matchData = this.matchIndexes[i2];
            match.splice(0, i2);
            return Object.assign(match, matchData);
          }
        }
        class ResumableMultiRegex {
          constructor() {
            this.rules = [];
            this.multiRegexes = [];
            this.count = 0;
            this.lastIndex = 0;
            this.regexIndex = 0;
          }
          getMatcher(index) {
            if (this.multiRegexes[index])
              return this.multiRegexes[index];
            const matcher = new MultiRegex();
            this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
            matcher.compile();
            this.multiRegexes[index] = matcher;
            return matcher;
          }
          considerAll() {
            this.regexIndex = 0;
          }
          addRule(re, opts) {
            this.rules.push([re, opts]);
            if (opts.type === "begin")
              this.count++;
          }
          exec(s) {
            const m = this.getMatcher(this.regexIndex);
            m.lastIndex = this.lastIndex;
            const result = m.exec(s);
            if (result) {
              this.regexIndex += result.position + 1;
              if (this.regexIndex === this.count) {
                this.regexIndex = 0;
              }
            }
            return result;
          }
        }
        function buildModeRegex(mode) {
          const mm = new ResumableMultiRegex();
          mode.contains.forEach((term) => mm.addRule(term.begin, { rule: term, type: "begin" }));
          if (mode.terminator_end) {
            mm.addRule(mode.terminator_end, { type: "end" });
          }
          if (mode.illegal) {
            mm.addRule(mode.illegal, { type: "illegal" });
          }
          return mm;
        }
        function skipIfhasPrecedingOrTrailingDot(match, response) {
          const before = match.input[match.index - 1];
          const after = match.input[match.index + match[0].length];
          if (before === "." || after === ".") {
            response.ignoreMatch();
          }
        }
        function compileMode(mode, parent) {
          const cmode = mode;
          if (mode.compiled)
            return cmode;
          mode.compiled = true;
          mode.__beforeBegin = null;
          mode.keywords = mode.keywords || mode.beginKeywords;
          let kw_pattern = null;
          if (typeof mode.keywords === "object") {
            kw_pattern = mode.keywords.$pattern;
            delete mode.keywords.$pattern;
          }
          if (mode.keywords) {
            mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
          }
          if (mode.lexemes && kw_pattern) {
            throw new Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ");
          }
          cmode.keywordPatternRe = langRe(mode.lexemes || kw_pattern || /\w+/, true);
          if (parent) {
            if (mode.beginKeywords) {
              mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")(?=\\b|\\s)";
              mode.__beforeBegin = skipIfhasPrecedingOrTrailingDot;
            }
            if (!mode.begin)
              mode.begin = /\B|\b/;
            cmode.beginRe = langRe(mode.begin);
            if (mode.endSameAsBegin)
              mode.end = mode.begin;
            if (!mode.end && !mode.endsWithParent)
              mode.end = /\B|\b/;
            if (mode.end)
              cmode.endRe = langRe(mode.end);
            cmode.terminator_end = source(mode.end) || "";
            if (mode.endsWithParent && parent.terminator_end) {
              cmode.terminator_end += (mode.end ? "|" : "") + parent.terminator_end;
            }
          }
          if (mode.illegal)
            cmode.illegalRe = langRe(mode.illegal);
          if (mode.relevance === void 0)
            mode.relevance = 1;
          if (!mode.contains)
            mode.contains = [];
          mode.contains = [].concat(...mode.contains.map(function(c) {
            return expand_or_clone_mode(c === "self" ? mode : c);
          }));
          mode.contains.forEach(function(c) {
            compileMode(c, cmode);
          });
          if (mode.starts) {
            compileMode(mode.starts, parent);
          }
          cmode.matcher = buildModeRegex(cmode);
          return cmode;
        }
        if (language.contains && language.contains.includes("self")) {
          throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
        }
        return compileMode(language);
      }
      function dependencyOnParent(mode) {
        if (!mode)
          return false;
        return mode.endsWithParent || dependencyOnParent(mode.starts);
      }
      function expand_or_clone_mode(mode) {
        if (mode.variants && !mode.cached_variants) {
          mode.cached_variants = mode.variants.map(function(variant) {
            return inherit(mode, { variants: null }, variant);
          });
        }
        if (mode.cached_variants) {
          return mode.cached_variants;
        }
        if (dependencyOnParent(mode)) {
          return inherit(mode, { starts: mode.starts ? inherit(mode.starts) : null });
        }
        if (Object.isFrozen(mode)) {
          return inherit(mode);
        }
        return mode;
      }
      function compileKeywords(rawKeywords, case_insensitive) {
        var compiled_keywords = {};
        if (typeof rawKeywords === "string") {
          splitAndCompile("keyword", rawKeywords);
        } else {
          Object.keys(rawKeywords).forEach(function(className) {
            splitAndCompile(className, rawKeywords[className]);
          });
        }
        return compiled_keywords;
        function splitAndCompile(className, keywordList) {
          if (case_insensitive) {
            keywordList = keywordList.toLowerCase();
          }
          keywordList.split(" ").forEach(function(keyword) {
            var pair = keyword.split("|");
            compiled_keywords[pair[0]] = [className, scoreForKeyword(pair[0], pair[1])];
          });
        }
      }
      function scoreForKeyword(keyword, providedScore) {
        if (providedScore) {
          return Number(providedScore);
        }
        return commonKeyword(keyword) ? 0 : 1;
      }
      function commonKeyword(keyword) {
        return COMMON_KEYWORDS.includes(keyword.toLowerCase());
      }
      var version = "10.1.1";
      var escape$1 = escapeHTML;
      var inherit$1 = inherit;
      var { nodeStream: nodeStream$1, mergeStreams: mergeStreams$1 } = utils;
      var NO_MATCH = Symbol("nomatch");
      var HLJS = function(hljs2) {
        var ArrayProto = [];
        var languages = {};
        var aliases = {};
        var plugins2 = [];
        var SAFE_MODE = true;
        var fixMarkupRe = /(^(<[^>]+>|\t|)+|\n)/gm;
        var LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
        const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: "Plain text", contains: [] };
        var options = {
          noHighlightRe: /^(no-?highlight)$/i,
          languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
          classPrefix: "hljs-",
          tabReplace: null,
          useBR: false,
          languages: null,
          __emitter: TokenTreeEmitter
        };
        function shouldNotHighlight(languageName) {
          return options.noHighlightRe.test(languageName);
        }
        function blockLanguage(block) {
          var classes = block.className + " ";
          classes += block.parentNode ? block.parentNode.className : "";
          const match = options.languageDetectRe.exec(classes);
          if (match) {
            var language = getLanguage(match[1]);
            if (!language) {
              console.warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
              console.warn("Falling back to no-highlight mode for this block.", block);
            }
            return language ? match[1] : "no-highlight";
          }
          return classes.split(/\s+/).find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
        }
        function highlight2(languageName, code, ignoreIllegals, continuation) {
          var context = {
            code,
            language: languageName
          };
          fire("before:highlight", context);
          var result = context.result ? context.result : _highlight(context.language, context.code, ignoreIllegals, continuation);
          result.code = context.code;
          fire("after:highlight", result);
          return result;
        }
        function _highlight(languageName, code, ignoreIllegals, continuation) {
          var codeToHighlight = code;
          function keywordData(mode, match) {
            var matchText = language.case_insensitive ? match[0].toLowerCase() : match[0];
            return Object.prototype.hasOwnProperty.call(mode.keywords, matchText) && mode.keywords[matchText];
          }
          function processKeywords() {
            if (!top.keywords) {
              emitter.addText(mode_buffer);
              return;
            }
            let last_index = 0;
            top.keywordPatternRe.lastIndex = 0;
            let match = top.keywordPatternRe.exec(mode_buffer);
            let buf = "";
            while (match) {
              buf += mode_buffer.substring(last_index, match.index);
              const data = keywordData(top, match);
              if (data) {
                const [kind, keywordRelevance] = data;
                emitter.addText(buf);
                buf = "";
                relevance += keywordRelevance;
                emitter.addKeyword(match[0], kind);
              } else {
                buf += match[0];
              }
              last_index = top.keywordPatternRe.lastIndex;
              match = top.keywordPatternRe.exec(mode_buffer);
            }
            buf += mode_buffer.substr(last_index);
            emitter.addText(buf);
          }
          function processSubLanguage() {
            if (mode_buffer === "")
              return;
            var result2 = null;
            if (typeof top.subLanguage === "string") {
              if (!languages[top.subLanguage]) {
                emitter.addText(mode_buffer);
                return;
              }
              result2 = _highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]);
              continuations[top.subLanguage] = result2.top;
            } else {
              result2 = highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : null);
            }
            if (top.relevance > 0) {
              relevance += result2.relevance;
            }
            emitter.addSublanguage(result2.emitter, result2.language);
          }
          function processBuffer() {
            if (top.subLanguage != null) {
              processSubLanguage();
            } else {
              processKeywords();
            }
            mode_buffer = "";
          }
          function startNewMode(mode) {
            if (mode.className) {
              emitter.openNode(mode.className);
            }
            top = Object.create(mode, { parent: { value: top } });
            return top;
          }
          function endOfMode(mode, match, matchPlusRemainder) {
            let matched = startsWith(mode.endRe, matchPlusRemainder);
            if (matched) {
              if (mode["on:end"]) {
                const resp = new Response(mode);
                mode["on:end"](match, resp);
                if (resp.ignore)
                  matched = false;
              }
              if (matched) {
                while (mode.endsParent && mode.parent) {
                  mode = mode.parent;
                }
                return mode;
              }
            }
            if (mode.endsWithParent) {
              return endOfMode(mode.parent, match, matchPlusRemainder);
            }
          }
          function doIgnore(lexeme) {
            if (top.matcher.regexIndex === 0) {
              mode_buffer += lexeme[0];
              return 1;
            } else {
              continueScanAtSamePosition = true;
              return 0;
            }
          }
          function doBeginMatch(match) {
            var lexeme = match[0];
            var new_mode = match.rule;
            const resp = new Response(new_mode);
            const beforeCallbacks = [new_mode.__beforeBegin, new_mode["on:begin"]];
            for (const cb of beforeCallbacks) {
              if (!cb)
                continue;
              cb(match, resp);
              if (resp.ignore)
                return doIgnore(lexeme);
            }
            if (new_mode && new_mode.endSameAsBegin) {
              new_mode.endRe = escape(lexeme);
            }
            if (new_mode.skip) {
              mode_buffer += lexeme;
            } else {
              if (new_mode.excludeBegin) {
                mode_buffer += lexeme;
              }
              processBuffer();
              if (!new_mode.returnBegin && !new_mode.excludeBegin) {
                mode_buffer = lexeme;
              }
            }
            startNewMode(new_mode);
            return new_mode.returnBegin ? 0 : lexeme.length;
          }
          function doEndMatch(match) {
            var lexeme = match[0];
            var matchPlusRemainder = codeToHighlight.substr(match.index);
            var end_mode = endOfMode(top, match, matchPlusRemainder);
            if (!end_mode) {
              return NO_MATCH;
            }
            var origin = top;
            if (origin.skip) {
              mode_buffer += lexeme;
            } else {
              if (!(origin.returnEnd || origin.excludeEnd)) {
                mode_buffer += lexeme;
              }
              processBuffer();
              if (origin.excludeEnd) {
                mode_buffer = lexeme;
              }
            }
            do {
              if (top.className) {
                emitter.closeNode();
              }
              if (!top.skip && !top.subLanguage) {
                relevance += top.relevance;
              }
              top = top.parent;
            } while (top !== end_mode.parent);
            if (end_mode.starts) {
              if (end_mode.endSameAsBegin) {
                end_mode.starts.endRe = end_mode.endRe;
              }
              startNewMode(end_mode.starts);
            }
            return origin.returnEnd ? 0 : lexeme.length;
          }
          function processContinuations() {
            var list = [];
            for (var current = top; current !== language; current = current.parent) {
              if (current.className) {
                list.unshift(current.className);
              }
            }
            list.forEach((item) => emitter.openNode(item));
          }
          var lastMatch = {};
          function processLexeme(textBeforeMatch, match) {
            var lexeme = match && match[0];
            mode_buffer += textBeforeMatch;
            if (lexeme == null) {
              processBuffer();
              return 0;
            }
            if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
              mode_buffer += codeToHighlight.slice(match.index, match.index + 1);
              if (!SAFE_MODE) {
                const err = new Error("0 width match regex");
                err.languageName = languageName;
                err.badRule = lastMatch.rule;
                throw err;
              }
              return 1;
            }
            lastMatch = match;
            if (match.type === "begin") {
              return doBeginMatch(match);
            } else if (match.type === "illegal" && !ignoreIllegals) {
              const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || "<unnamed>") + '"');
              err.mode = top;
              throw err;
            } else if (match.type === "end") {
              var processed = doEndMatch(match);
              if (processed !== NO_MATCH) {
                return processed;
              }
            }
            if (match.type === "illegal" && lexeme === "") {
              return 1;
            }
            if (iterations > 1e5 && iterations > match.index * 3) {
              const err = new Error("potential infinite loop, way more iterations than matches");
              throw err;
            }
            mode_buffer += lexeme;
            return lexeme.length;
          }
          var language = getLanguage(languageName);
          if (!language) {
            console.error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
            throw new Error('Unknown language: "' + languageName + '"');
          }
          var md = compileLanguage(language);
          var result = "";
          var top = continuation || md;
          var continuations = {};
          var emitter = new options.__emitter(options);
          processContinuations();
          var mode_buffer = "";
          var relevance = 0;
          var index = 0;
          var iterations = 0;
          var continueScanAtSamePosition = false;
          try {
            top.matcher.considerAll();
            for (; ; ) {
              iterations++;
              if (continueScanAtSamePosition) {
                continueScanAtSamePosition = false;
              } else {
                top.matcher.lastIndex = index;
                top.matcher.considerAll();
              }
              const match = top.matcher.exec(codeToHighlight);
              if (!match)
                break;
              const beforeMatch = codeToHighlight.substring(index, match.index);
              const processedCount = processLexeme(beforeMatch, match);
              index = match.index + processedCount;
            }
            processLexeme(codeToHighlight.substr(index));
            emitter.closeAllNodes();
            emitter.finalize();
            result = emitter.toHTML();
            return {
              relevance,
              value: result,
              language: languageName,
              illegal: false,
              emitter,
              top
            };
          } catch (err) {
            if (err.message && err.message.includes("Illegal")) {
              return {
                illegal: true,
                illegalBy: {
                  msg: err.message,
                  context: codeToHighlight.slice(index - 100, index + 100),
                  mode: err.mode
                },
                sofar: result,
                relevance: 0,
                value: escape$1(codeToHighlight),
                emitter
              };
            } else if (SAFE_MODE) {
              return {
                illegal: false,
                relevance: 0,
                value: escape$1(codeToHighlight),
                emitter,
                language: languageName,
                top,
                errorRaised: err
              };
            } else {
              throw err;
            }
          }
        }
        function justTextHighlightResult(code) {
          const result = {
            relevance: 0,
            emitter: new options.__emitter(options),
            value: escape$1(code),
            illegal: false,
            top: PLAINTEXT_LANGUAGE
          };
          result.emitter.addText(code);
          return result;
        }
        function highlightAuto(code, languageSubset) {
          languageSubset = languageSubset || options.languages || Object.keys(languages);
          var result = justTextHighlightResult(code);
          var secondBest = result;
          languageSubset.filter(getLanguage).filter(autoDetection).forEach(function(name) {
            var current = _highlight(name, code, false);
            current.language = name;
            if (current.relevance > secondBest.relevance) {
              secondBest = current;
            }
            if (current.relevance > result.relevance) {
              secondBest = result;
              result = current;
            }
          });
          if (secondBest.language) {
            result.second_best = secondBest;
          }
          return result;
        }
        function fixMarkup(html) {
          if (!(options.tabReplace || options.useBR)) {
            return html;
          }
          return html.replace(fixMarkupRe, (match) => {
            if (match === "\n") {
              return options.useBR ? "<br>" : match;
            } else if (options.tabReplace) {
              return match.replace(/\t/g, options.tabReplace);
            }
            return match;
          });
        }
        function buildClassName(prevClassName, currentLang, resultLang) {
          var language = currentLang ? aliases[currentLang] : resultLang;
          var result = [prevClassName.trim()];
          if (!prevClassName.match(/\bhljs\b/)) {
            result.push("hljs");
          }
          if (!prevClassName.includes(language)) {
            result.push(language);
          }
          return result.join(" ").trim();
        }
        function highlightBlock(element) {
          let node = null;
          const language = blockLanguage(element);
          if (shouldNotHighlight(language))
            return;
          fire("before:highlightBlock", { block: element, language });
          if (options.useBR) {
            node = document.createElement("div");
            node.innerHTML = element.innerHTML.replace(/\n/g, "").replace(/<br[ /]*>/g, "\n");
          } else {
            node = element;
          }
          const text = node.textContent;
          const result = language ? highlight2(language, text, true) : highlightAuto(text);
          const originalStream = nodeStream$1(node);
          if (originalStream.length) {
            const resultNode = document.createElement("div");
            resultNode.innerHTML = result.value;
            result.value = mergeStreams$1(originalStream, nodeStream$1(resultNode), text);
          }
          result.value = fixMarkup(result.value);
          fire("after:highlightBlock", { block: element, result });
          element.innerHTML = result.value;
          element.className = buildClassName(element.className, language, result.language);
          element.result = {
            language: result.language,
            re: result.relevance,
            relavance: result.relevance
          };
          if (result.second_best) {
            element.second_best = {
              language: result.second_best.language,
              re: result.second_best.relevance,
              relavance: result.second_best.relevance
            };
          }
        }
        function configure(userOptions) {
          options = inherit$1(options, userOptions);
        }
        const initHighlighting = () => {
          if (initHighlighting.called)
            return;
          initHighlighting.called = true;
          var blocks = document.querySelectorAll("pre code");
          ArrayProto.forEach.call(blocks, highlightBlock);
        };
        function initHighlightingOnLoad() {
          window.addEventListener("DOMContentLoaded", initHighlighting, false);
        }
        function registerLanguage(languageName, languageDefinition) {
          var lang = null;
          try {
            lang = languageDefinition(hljs2);
          } catch (error) {
            console.error("Language definition for '{}' could not be registered.".replace("{}", languageName));
            if (!SAFE_MODE) {
              throw error;
            } else {
              console.error(error);
            }
            lang = PLAINTEXT_LANGUAGE;
          }
          if (!lang.name)
            lang.name = languageName;
          languages[languageName] = lang;
          lang.rawDefinition = languageDefinition.bind(null, hljs2);
          if (lang.aliases) {
            registerAliases(lang.aliases, { languageName });
          }
        }
        function listLanguages() {
          return Object.keys(languages);
        }
        function requireLanguage(name) {
          var lang = getLanguage(name);
          if (lang) {
            return lang;
          }
          var err = new Error("The '{}' language is required, but not loaded.".replace("{}", name));
          throw err;
        }
        function getLanguage(name) {
          name = (name || "").toLowerCase();
          return languages[name] || languages[aliases[name]];
        }
        function registerAliases(aliasList, { languageName }) {
          if (typeof aliasList === "string") {
            aliasList = [aliasList];
          }
          aliasList.forEach((alias) => {
            aliases[alias] = languageName;
          });
        }
        function autoDetection(name) {
          var lang = getLanguage(name);
          return lang && !lang.disableAutodetect;
        }
        function addPlugin(plugin) {
          plugins2.push(plugin);
        }
        function fire(event, args) {
          var cb = event;
          plugins2.forEach(function(plugin) {
            if (plugin[cb]) {
              plugin[cb](args);
            }
          });
        }
        Object.assign(hljs2, {
          highlight: highlight2,
          highlightAuto,
          fixMarkup,
          highlightBlock,
          configure,
          initHighlighting,
          initHighlightingOnLoad,
          registerLanguage,
          listLanguages,
          getLanguage,
          registerAliases,
          requireLanguage,
          autoDetection,
          inherit: inherit$1,
          addPlugin
        });
        hljs2.debugMode = function() {
          SAFE_MODE = false;
        };
        hljs2.safeMode = function() {
          SAFE_MODE = true;
        };
        hljs2.versionString = version;
        for (const key in MODES) {
          if (typeof MODES[key] === "object") {
            deepFreeze(MODES[key]);
          }
        }
        Object.assign(hljs2, MODES);
        return hljs2;
      };
      var highlight = HLJS({});
      module.exports = highlight;
    }
  });

  // node_modules/highlight.js/lib/languages/php.js
  var require_php = __commonJS({
    "node_modules/highlight.js/lib/languages/php.js"(exports, module) {
      function php2(hljs2) {
        var VARIABLE = {
          begin: "\\$+[a-zA-Z_\x7F-\xFF][a-zA-Z0-9_\x7F-\xFF]*"
        };
        var PREPROCESSOR = {
          className: "meta",
          variants: [
            { begin: /<\?php/, relevance: 10 },
            { begin: /<\?[=]?/ },
            { begin: /\?>/ }
          ]
        };
        var STRING = {
          className: "string",
          contains: [hljs2.BACKSLASH_ESCAPE, PREPROCESSOR],
          variants: [
            {
              begin: 'b"',
              end: '"'
            },
            {
              begin: "b'",
              end: "'"
            },
            hljs2.inherit(hljs2.APOS_STRING_MODE, { illegal: null }),
            hljs2.inherit(hljs2.QUOTE_STRING_MODE, { illegal: null })
          ]
        };
        var NUMBER = { variants: [hljs2.BINARY_NUMBER_MODE, hljs2.C_NUMBER_MODE] };
        var KEYWORDS = {
          keyword: "__CLASS__ __DIR__ __FILE__ __FUNCTION__ __LINE__ __METHOD__ __NAMESPACE__ __TRAIT__ die echo exit include include_once print require require_once array abstract and as binary bool boolean break callable case catch class clone const continue declare default do double else elseif empty enddeclare endfor endforeach endif endswitch endwhile eval extends final finally float for foreach from global goto if implements instanceof insteadof int integer interface isset iterable list new object or private protected public real return string switch throw trait try unset use var void while xor yield",
          literal: "false null true",
          built_in: "Error|0 AppendIterator ArgumentCountError ArithmeticError ArrayIterator ArrayObject AssertionError BadFunctionCallException BadMethodCallException CachingIterator CallbackFilterIterator CompileError Countable DirectoryIterator DivisionByZeroError DomainException EmptyIterator ErrorException Exception FilesystemIterator FilterIterator GlobIterator InfiniteIterator InvalidArgumentException IteratorIterator LengthException LimitIterator LogicException MultipleIterator NoRewindIterator OutOfBoundsException OutOfRangeException OuterIterator OverflowException ParentIterator ParseError RangeException RecursiveArrayIterator RecursiveCachingIterator RecursiveCallbackFilterIterator RecursiveDirectoryIterator RecursiveFilterIterator RecursiveIterator RecursiveIteratorIterator RecursiveRegexIterator RecursiveTreeIterator RegexIterator RuntimeException SeekableIterator SplDoublyLinkedList SplFileInfo SplFileObject SplFixedArray SplHeap SplMaxHeap SplMinHeap SplObjectStorage SplObserver SplObserver SplPriorityQueue SplQueue SplStack SplSubject SplSubject SplTempFileObject TypeError UnderflowException UnexpectedValueException ArrayAccess Closure Generator Iterator IteratorAggregate Serializable Throwable Traversable WeakReference Directory __PHP_Incomplete_Class parent php_user_filter self static stdClass"
        };
        return {
          aliases: ["php", "php3", "php4", "php5", "php6", "php7"],
          case_insensitive: true,
          keywords: KEYWORDS,
          contains: [
            hljs2.HASH_COMMENT_MODE,
            hljs2.COMMENT("//", "$", { contains: [PREPROCESSOR] }),
            hljs2.COMMENT("/\\*", "\\*/", {
              contains: [
                {
                  className: "doctag",
                  begin: "@[A-Za-z]+"
                }
              ]
            }),
            hljs2.COMMENT("__halt_compiler.+?;", false, {
              endsWithParent: true,
              keywords: "__halt_compiler"
            }),
            {
              className: "string",
              begin: /<<<['"]?\w+['"]?$/,
              end: /^\w+;?$/,
              contains: [
                hljs2.BACKSLASH_ESCAPE,
                {
                  className: "subst",
                  variants: [
                    { begin: /\$\w+/ },
                    { begin: /\{\$/, end: /\}/ }
                  ]
                }
              ]
            },
            PREPROCESSOR,
            {
              className: "keyword",
              begin: /\$this\b/
            },
            VARIABLE,
            {
              begin: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
            },
            {
              className: "function",
              beginKeywords: "fn function",
              end: /[;{]/,
              excludeEnd: true,
              illegal: "[$%\\[]",
              contains: [
                hljs2.UNDERSCORE_TITLE_MODE,
                {
                  className: "params",
                  begin: "\\(",
                  end: "\\)",
                  excludeBegin: true,
                  excludeEnd: true,
                  keywords: KEYWORDS,
                  contains: [
                    "self",
                    VARIABLE,
                    hljs2.C_BLOCK_COMMENT_MODE,
                    STRING,
                    NUMBER
                  ]
                }
              ]
            },
            {
              className: "class",
              beginKeywords: "class interface",
              end: "{",
              excludeEnd: true,
              illegal: /[:\(\$"]/,
              contains: [
                { beginKeywords: "extends implements" },
                hljs2.UNDERSCORE_TITLE_MODE
              ]
            },
            {
              beginKeywords: "namespace",
              end: ";",
              illegal: /[\.']/,
              contains: [hljs2.UNDERSCORE_TITLE_MODE]
            },
            {
              beginKeywords: "use",
              end: ";",
              contains: [hljs2.UNDERSCORE_TITLE_MODE]
            },
            {
              begin: "=>"
            },
            STRING,
            NUMBER
          ]
        };
      }
      module.exports = php2;
    }
  });

  // node_modules/yace/dist/plugins/isKey.js
  var require_isKey = __commonJS({
    "node_modules/yace/dist/plugins/isKey.js"(exports, module) {
      "use strict";
      var e2 = { backspace: 8, tab: 9, enter: 13, shift: 16, control: 17, alt: 18, pause: 19, capslock: 20, escape: 27, " ": 32, pageup: 33, pagedown: 34, end: 35, home: 36, arrowleft: 37, arrowup: 38, arrowright: 39, arrowdown: 40, insert: 45, delete: 46, meta: 91, numlock: 144, scrolllock: 145, ";": 186, "=": 187, ",": 188, "-": 189, ".": 190, "/": 191, "`": 192, "[": 219, "\\": 220, "]": 221, "'": 222, add: 187 };
      var t2 = { alt: "altKey", control: "ctrlKey", meta: "metaKey", shift: "shiftKey", "ctrl/cmd": typeof window != "undefined" && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform) ? "metaKey" : "ctrlKey" };
      module.exports = function(r2, o2) {
        var a2 = r2.split("+").reduce(function(r3, o3) {
          return t2[o3] ? (r3.modifiers[t2[o3]] = true, r3) : Object.assign({}, r3, { keyCode: (a3 = o3, e2[a3] || a3.toUpperCase().charCodeAt(0)) });
          var a3;
        }, { modifiers: { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false }, keyCode: null }), i2 = Object.keys(a2.modifiers).every(function(e3) {
          return a2.modifiers[e3] ? o2[e3] : !o2[e3];
        }), c = !a2.keyCode || o2.which === a2.keyCode;
        return i2 && c;
      };
    }
  });

  // node_modules/yace/dist/plugins/tab.js
  var require_tab = __commonJS({
    "node_modules/yace/dist/plugins/tab.js"(exports, module) {
      "use strict";
      var t2 = require_isKey();
      module.exports = function(n2) {
        return n2 === void 0 && (n2 = "  "), function(e2, i2) {
          var s = e2.value, r2 = e2.selectionStart, l = e2.selectionEnd;
          if (i2.type === "keydown") {
            if (t2("shift+tab", i2)) {
              i2.preventDefault();
              var u = s.substring(0, r2).split("\n"), a2 = u.length - 1, o2 = s.substring(0, l).split("\n").length - 1, g = s.split("\n").map(function(t3, e3) {
                return e3 >= a2 && e3 <= o2 && t3.startsWith(n2) ? t3.substring(n2.length) : t3;
              }).join("\n");
              return s !== g ? { value: g, selectionStart: u[a2].startsWith(n2) ? r2 - n2.length : r2, selectionEnd: l - (s.length - g.length) } : void 0;
            }
            if (t2("tab", i2)) {
              if (i2.preventDefault(), r2 === l) {
                var h = r2 + n2.length;
                return { value: s.substring(0, r2) + n2 + s.substring(l), selectionStart: h, selectionEnd: h };
              }
              var c = s.substring(0, r2).split("\n").length - 1, v = s.substring(0, l).split("\n").length - 1;
              return { value: s.split("\n").map(function(t3, e3) {
                return e3 >= c && e3 <= v ? n2 + t3 : t3;
              }).join("\n"), selectionStart: r2 + n2.length, selectionEnd: l + n2.length * (v - c + 1) };
            }
          }
        };
      };
    }
  });

  // node_modules/yace/dist/plugins/history.js
  var require_history = __commonJS({
    "node_modules/yace/dist/plugins/history.js"(exports, module) {
      "use strict";
      var t2 = require_isKey();
      module.exports = function() {
        var e2 = [], n2 = null, u = function(t3) {
          n2 = 0, e2.push(t3);
        }, r2 = function(t3) {
          (e2 = e2.slice(0, n2 + 1)).push(t3), n2 = e2.length - 1;
        }, l = function(t3) {
          return e2[n2].value !== t3.value || e2[n2].selectionStart !== t3.selectionStart || e2[n2].selectionEnd !== t3.selectionEnd;
        };
        return function(i2, c) {
          if (c.type === "keydown") {
            if (t2("ctrl/cmd+z", c) && (c.preventDefault(), n2 !== null)) {
              l(i2) && (e2.push(i2), n2++);
              var o2 = Math.max(0, n2 - 1);
              return n2 = o2, e2[o2];
            }
            if (t2("ctrl/cmd+shift+z", c) && (c.preventDefault(), n2 !== null)) {
              var s = Math.min(e2.length - 1, n2 + 1);
              return n2 = s, e2[s];
            }
            if (n2 === null)
              return void u(i2);
            if (l(i2))
              return void r2(i2);
          }
          c.type === "input" && (n2 === null ? u(i2) : r2(i2));
        };
      };
    }
  });

  // node_modules/yace/dist/plugins/cutLine.js
  var require_cutLine = __commonJS({
    "node_modules/yace/dist/plugins/cutLine.js"(exports, module) {
      "use strict";
      var n2 = require_isKey();
      module.exports = function(t2) {
        return function(i2, r2) {
          if (r2.type === "keydown" && (t2 || function(t3) {
            return n2("ctrl/cmd+x", t3);
          })(r2)) {
            r2.preventDefault();
            var e2 = i2.value, a2 = i2.selectionStart, o2 = i2.selectionEnd;
            if (o2 !== a2) {
              var l = e2.substring(0, a2) + e2.substring(o2);
              return navigator && navigator.clipboard && navigator.clipboard.writeText(e2.substring(a2, o2)).catch(function() {
              }), { value: l, selectionStart: a2, selectionEnd: a2 };
            }
            var u = e2.substring(0, a2).split("\n").slice(0, -1), c = u.length, s = e2.split("\n").map(function(n3, t3) {
              return t3 === c ? null : n3;
            }).filter(function(n3) {
              return n3 != null;
            }).join("\n");
            return navigator && navigator.clipboard && navigator.clipboard.writeText(e2.split("\n")[c]).catch(function() {
            }), { value: s, selectionStart: u.join("\n").length + 1, selectionEnd: u.join("\n").length + 1 };
          }
        };
      };
    }
  });

  // node_modules/yace/dist/plugins/preserveIndent.js
  var require_preserveIndent = __commonJS({
    "node_modules/yace/dist/plugins/preserveIndent.js"(exports, module) {
      "use strict";
      var e2 = require_isKey();
      module.exports = function() {
        return function(t2, n2) {
          var r2 = t2.value, s = t2.selectionStart, i2 = t2.selectionEnd;
          if (e2("enter", n2) && n2.type === "keydown") {
            var l = r2.substring(0, s).split("\n").length - 1, u = r2.split("\n")[l], a2 = /^\s+/.exec(u);
            if (a2) {
              n2.preventDefault();
              var o2 = "\n" + a2[0];
              return { value: r2.substring(0, s) + o2 + r2.substring(i2), selectionStart: s + o2.length, selectionEnd: s + o2.length };
            }
          }
        };
      };
    }
  });

  // node_modules/yace/dist/esm/index.esm.js
  var e = { position: "relative", boxSizing: "border-box", overflow: "hidden", fontSize: "16px", fontFamily: 'Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace' };
  var t = { lineHeight: "inherit", whiteSpace: "pre-wrap", wordBreak: "keep-all", background: "none", position: "absolute", width: "100%", height: "100%", zIndex: "1", resize: "none", caretColor: "black", padding: "inherit", outline: "none", fontSize: "inherit", fontFamily: "inherit", boxSizing: "border-box", border: "none", top: "0px", left: "0px", color: "inherit", overflow: "hidden", "-webkit-font-smoothing": "antialiased", "-webkit-text-fill-color": "transparent" };
  var i = { lineHeight: "inherit", position: "relative", whiteSpace: "pre-wrap", wordBreak: "keep-all", padding: "0", width: "100%", margin: "0", pointerEvents: "none", boxSizing: "border-box", overflowWrap: "break-word", fontFamily: "inherit" };
  var n = { lineHeight: "inherit", position: "absolute", width: "100%", height: "100%", whiteSpace: "pre-wrap", wordBreak: "keep-all", padding: "inherit", margin: "0", top: "0px", left: "0px", pointerEvents: "none", boxSizing: "border-box", overflowWrap: "break-word", fontFamily: "inherit" };
  var o = function(e2, t2) {
    if (t2 === void 0 && (t2 = {}), !e2)
      throw new Error("selector is not defined");
    if (this.root = document.querySelector(e2), !this.root)
      throw new Error('element with "' + e2 + '" selector is not exist');
    var i2 = { value: "", styles: {}, plugins: [], highlighter: function(e3) {
      return a(e3);
    } };
    this.options = Object.assign({}, i2, t2), this.init();
  };
  function r(e2, t2) {
    var i2 = t2.target, n2 = i2.value, o2 = i2.selectionStart, r2 = i2.selectionEnd;
    return e2.reduce(function(e3, i3) {
      return Object.assign({}, e3, i3(e3, t2));
    }, { value: n2, selectionStart: o2, selectionEnd: r2 });
  }
  function a(e2) {
    return e2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  o.prototype.init = function() {
    this.textarea = document.createElement("textarea"), this.pre = document.createElement("pre"), Object.assign(this.root.style, e, this.options.styles), Object.assign(this.textarea.style, t), Object.assign(this.pre.style, i), this.root.appendChild(this.textarea), this.root.appendChild(this.pre), this.addTextareaEvents(), this.update({ value: this.options.value }), this.updateLines();
  }, o.prototype.addTextareaEvents = function() {
    var e2 = this;
    this.handleInput = function(t2) {
      var i2 = r(e2.options.plugins, t2);
      e2.update(i2);
    }, this.handleKeydown = function(t2) {
      var i2 = r(e2.options.plugins, t2);
      e2.update(i2);
    }, this.textarea.addEventListener("input", this.handleInput), this.textarea.addEventListener("keydown", this.handleKeydown);
  }, o.prototype.update = function(e2) {
    var t2 = e2.value, i2 = e2.selectionStart, n2 = e2.selectionEnd;
    if (t2 != null && (this.textarea.value = t2), this.textarea.selectionStart = i2, this.textarea.selectionEnd = n2, t2 !== this.value && t2 != null) {
      this.value = t2;
      var o2 = this.options.highlighter(t2);
      this.pre.innerHTML = o2 + "<br/>", this.updateLines(), this.updateCallback && this.updateCallback(t2);
    }
  }, o.prototype.updateLines = function() {
    if (this.options.lineNumbers) {
      this.lines || (this.lines = document.createElement("pre"), this.root.appendChild(this.lines), Object.assign(this.lines.style, n));
      var e2 = this.value.split("\n"), t2 = e2.length.toString().length;
      this.root.style.paddingLeft = t2 + 1 + "ch", this.lines.innerHTML = e2.map(function(e3, t3) {
        return '<span class="yace-line" style="position: absolute; opacity: .3; left: 0">' + (1 + t3) + "</span>" + ('<span style="color: transparent; pointer-events: none">' + a(e3) + "</span>");
      }).join("\n");
    }
  }, o.prototype.destroy = function() {
    this.textarea.removeEventListener("input", this.handleInput), this.textarea.removeEventListener("keydown", this.handleKeydown);
  }, o.prototype.onUpdate = function(e2) {
    this.updateCallback = e2;
  };
  var index_esm_default = o;

  // app.js
  var import_core = __toESM(require_core());
  var import_php = __toESM(require_php());
  var import_tab = __toESM(require_tab());
  var import_history = __toESM(require_history());
  var import_cutLine = __toESM(require_cutLine());
  var import_preserveIndent = __toESM(require_preserveIndent());
  var plugins = [
    (0, import_history.default)(),
    (0, import_tab.default)(),
    (0, import_cutLine.default)(),
    (0, import_preserveIndent.default)()
  ];
  import_core.default.registerLanguage("php", import_php.default);
  function highlighter(value) {
    return import_core.default.highlight("php", value).value;
  }
  var editor = new index_esm_default("#editor", {
    value: "<?php \necho 'Hello friend';\n$val = 'Hallo w this new new temporals are the best of all in the sense of your new essensav of the new dodo mon adkf';\necho $val;\n?>",
    styles: {
      fontSize: "18px"
    },
    highlighter,
    plugins,
    lineNumbers: true
  });
  editor.textarea.spellcheck = false;
  var btn = document.getElementById("save");
  editor.onUpdate((value) => {
  });
  btn.onclick = () => {
    alert(editor.value);
    console.log(editor.value);
  };
})();
