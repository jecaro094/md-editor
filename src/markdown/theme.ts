/**
 * Custom Shiki theme for fenced code blocks: a hue-shifted derivative of the
 * bundled "night-owl" theme where every token color is remapped into the
 * green/lime band (roughly hue 70-165) that matches the site's accent palette
 * (--accent, --lime in global.css), while keeping each token type's relative
 * lightness/saturation so strings, keywords, numbers, etc. stay visually
 * distinct from one another. Generated once from @shikijs/themes/night-owl by
 * converting each color to HSL, remapping hue, and converting back to hex.
 */
import type { ThemeRegistrationAny } from '@shikijs/types';

export const shikiTheme: ThemeRegistrationAny = {
  "name": "tech-docs-green",
  "type": "dark",
  "colors": {
    "editor.background": "#12151b",
    "editor.foreground": "#dcece2"
  },
  "bg": "#12151b",
  "fg": "#dcece2",
  "tokenColors": [
    {
      "scope": [
        "markup.changed",
        "meta.diff.header.git",
        "meta.diff.header.from-file",
        "meta.diff.header.to-file"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": "#a0fead"
      }
    },
    {
      "scope": "markup.deleted.diff",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#d6f34c90"
      }
    },
    {
      "scope": "markup.inserted.diff",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#ade775ff"
      }
    },
    {
      "settings": {
        "foreground": "#dcece2"
      }
    },
    {
      "scope": [
        "comment",
        "punctuation.definition.comment"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": "#647763"
      }
    },
    {
      "scope": "string",
      "settings": {
        "foreground": "#cfee8b"
      }
    },
    {
      "scope": [
        "string.quoted",
        "variable.other.readwrite.js"
      ],
      "settings": {
        "foreground": "#cfee8b"
      }
    },
    {
      "scope": "support.constant.math",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": [
        "constant.numeric",
        "constant.character.numeric"
      ],
      "settings": {
        "fontStyle": "",
        "foreground": "#d9fa69"
      }
    },
    {
      "scope": [
        "constant.language",
        "punctuation.definition.constant",
        "variable.other.constant"
      ],
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": [
        "constant.character",
        "constant.other"
      ],
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": "constant.character.escape",
      "settings": {
        "foreground": "#d9fa69"
      }
    },
    {
      "scope": [
        "string.regexp",
        "string.regexp keyword.other"
      ],
      "settings": {
        "foreground": "#59e764"
      }
    },
    {
      "scope": "meta.function punctuation.separator.comma",
      "settings": {
        "foreground": "#5e9862"
      }
    },
    {
      "scope": "variable",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": [
        "punctuation.accessor",
        "keyword"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": [
        "storage",
        "meta.var.expr",
        "meta.class meta.method.declaration meta.var.expr storage.type.js",
        "storage.type.property.js",
        "storage.type.property.ts",
        "storage.type.property.tsx"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "storage.type",
      "settings": {
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "storage.type.function.arrow.js",
      "settings": {
        "fontStyle": ""
      }
    },
    {
      "scope": [
        "entity.name.class",
        "meta.class entity.name.type.class"
      ],
      "settings": {
        "foreground": "#dbff8b"
      }
    },
    {
      "scope": "entity.other.inherited-class",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": "entity.name.function",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": [
        "punctuation.definition.tag",
        "meta.tag"
      ],
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": [
        "entity.name.tag",
        "meta.tag.other.html",
        "meta.tag.other.js",
        "meta.tag.other.tsx",
        "entity.name.tag.tsx",
        "entity.name.tag.js",
        "entity.name.tag",
        "meta.tag.js",
        "meta.tag.tsx",
        "meta.tag.html"
      ],
      "settings": {
        "fontStyle": "",
        "foreground": "#ccedc9"
      }
    },
    {
      "scope": "entity.other.attribute-name",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#ade775"
      }
    },
    {
      "scope": "entity.name.tag.custom",
      "settings": {
        "foreground": "#d9fa69"
      }
    },
    {
      "scope": [
        "support.function",
        "support.constant"
      ],
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": "support.constant.meta.property-value",
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": [
        "support.type",
        "support.class"
      ],
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": "support.variable.dom",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": "invalid",
      "settings": {
        "foreground": "#ffffff"
      }
    },
    {
      "scope": "invalid.deprecated",
      "settings": {
        "foreground": "#ffffff"
      }
    },
    {
      "scope": "keyword.operator",
      "settings": {
        "fontStyle": "",
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": "keyword.operator.relational",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "keyword.operator.assignment",
      "settings": {
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "keyword.operator.arithmetic",
      "settings": {
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "keyword.operator.bitwise",
      "settings": {
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "keyword.operator.increment",
      "settings": {
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "keyword.operator.ternary",
      "settings": {
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "comment.line.double-slash",
      "settings": {
        "foreground": "#647763"
      }
    },
    {
      "scope": "object",
      "settings": {
        "foreground": "#ccf8cd"
      }
    },
    {
      "scope": "constant.language.null",
      "settings": {
        "foreground": "#58ffce"
      }
    },
    {
      "scope": "meta.brace",
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": "meta.delimiter.period",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "punctuation.definition.string",
      "settings": {
        "foreground": "#e0f6d8"
      }
    },
    {
      "scope": "punctuation.definition.string.begin.markdown",
      "settings": {
        "foreground": "#58ffce"
      }
    },
    {
      "scope": "constant.language.boolean",
      "settings": {
        "foreground": "#58ffce"
      }
    },
    {
      "scope": "object.comma",
      "settings": {
        "foreground": "#ffffff"
      }
    },
    {
      "scope": "variable.parameter.function",
      "settings": {
        "fontStyle": "",
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": [
        "support.type.vendor.property-name",
        "support.constant.vendor.property-value",
        "support.type.property-name",
        "meta.property-list entity.name.tag"
      ],
      "settings": {
        "fontStyle": "",
        "foreground": "#83cd7e"
      }
    },
    {
      "scope": "meta.property-list entity.name.tag.reference",
      "settings": {
        "foreground": "#58f553"
      }
    },
    {
      "scope": "constant.other.color.rgb-value punctuation.definition.constant",
      "settings": {
        "foreground": "#d9fa69"
      }
    },
    {
      "scope": "constant.other.color",
      "settings": {
        "foreground": "#d7ff95"
      }
    },
    {
      "scope": "keyword.other.unit",
      "settings": {
        "foreground": "#d7ff95"
      }
    },
    {
      "scope": "meta.selector",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "entity.other.attribute-name.id",
      "settings": {
        "foreground": "#aeff2b"
      }
    },
    {
      "scope": "meta.property-name",
      "settings": {
        "foreground": "#83cd7e"
      }
    },
    {
      "scope": [
        "entity.name.tag.doctype",
        "meta.tag.sgml.doctype"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "punctuation.definition.parameters",
      "settings": {
        "foreground": "#e0f6d8"
      }
    },
    {
      "scope": "keyword.control.operator",
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": "keyword.operator.logical",
      "settings": {
        "fontStyle": "",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": [
        "variable.instance",
        "variable.other.instance",
        "variable.readwrite.instance",
        "variable.other.readwrite.instance",
        "variable.other.property"
      ],
      "settings": {
        "foreground": "#bdecb9"
      }
    },
    {
      "scope": [
        "variable.other.object.property"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": "#d5fc9d"
      }
    },
    {
      "scope": [
        "variable.other.object.js"
      ],
      "settings": {
        "fontStyle": ""
      }
    },
    {
      "scope": [
        "entity.name.function"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": "#82ff93"
      }
    },
    {
      "scope": [
        "variable.language.this.js"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": "#4ff23d"
      }
    },
    {
      "scope": [
        "keyword.operator.comparison",
        "keyword.control.flow.js",
        "keyword.control.flow.ts",
        "keyword.control.flow.tsx",
        "keyword.control.ruby",
        "keyword.control.module.ruby",
        "keyword.control.class.ruby",
        "keyword.control.def.ruby",
        "keyword.control.loop.js",
        "keyword.control.loop.ts",
        "keyword.control.import.js",
        "keyword.control.import.ts",
        "keyword.control.import.tsx",
        "keyword.control.from.js",
        "keyword.control.from.ts",
        "keyword.control.from.tsx",
        "keyword.operator.instanceof.js",
        "keyword.operator.expression.instanceof.ts",
        "keyword.operator.expression.instanceof.tsx"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": [
        "keyword.control.conditional.js",
        "keyword.control.conditional.ts",
        "keyword.control.switch.js",
        "keyword.control.switch.ts"
      ],
      "settings": {
        "fontStyle": "",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": [
        "support.constant",
        "keyword.other.special-method",
        "keyword.other.new",
        "keyword.other.debugger",
        "keyword.control"
      ],
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": "support.function",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": "invalid.broken",
      "settings": {
        "foreground": "#021402"
      }
    },
    {
      "scope": "invalid.unimplemented",
      "settings": {
        "foreground": "#ffffff"
      }
    },
    {
      "scope": "invalid.illegal",
      "settings": {
        "foreground": "#ffffff"
      }
    },
    {
      "scope": "variable.language",
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": "support.variable.property",
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": "variable.function",
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": "variable.interpolation",
      "settings": {
        "foreground": "#5bf0c8"
      }
    },
    {
      "scope": "meta.function-call",
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": "punctuation.section.embedded",
      "settings": {
        "foreground": "#bcd73a"
      }
    },
    {
      "scope": [
        "punctuation.terminator.expression",
        "punctuation.definition.arguments",
        "punctuation.definition.array",
        "punctuation.section.array",
        "meta.array"
      ],
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": [
        "punctuation.definition.list.begin",
        "punctuation.definition.list.end",
        "punctuation.separator.arguments",
        "punctuation.definition.list"
      ],
      "settings": {
        "foreground": "#e0f6d8"
      }
    },
    {
      "scope": "string.template meta.template.expression",
      "settings": {
        "foreground": "#bcd73a"
      }
    },
    {
      "scope": "string.template punctuation.definition.string",
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": "italic",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "bold",
      "settings": {
        "fontStyle": "bold",
        "foreground": "#ade775"
      }
    },
    {
      "scope": "quote",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#689971"
      }
    },
    {
      "scope": "raw",
      "settings": {
        "foreground": "#83cd7e"
      }
    },
    {
      "scope": "variable.assignment.coffee",
      "settings": {
        "foreground": "#32f02c"
      }
    },
    {
      "scope": "variable.parameter.function.coffee",
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": "variable.assignment.coffee",
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": "variable.other.readwrite.cs",
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": [
        "entity.name.type.class.cs",
        "storage.type.cs"
      ],
      "settings": {
        "foreground": "#dbff8b"
      }
    },
    {
      "scope": "entity.name.type.namespace.cs",
      "settings": {
        "foreground": "#b1d7b2"
      }
    },
    {
      "scope": "string.unquoted.preprocessor.message.cs",
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": [
        "punctuation.separator.hash.cs",
        "keyword.preprocessor.region.cs",
        "keyword.preprocessor.endregion.cs"
      ],
      "settings": {
        "fontStyle": "bold",
        "foreground": "#dbff8b"
      }
    },
    {
      "scope": "variable.other.object.cs",
      "settings": {
        "foreground": "#b1d7b2"
      }
    },
    {
      "scope": "entity.name.type.enum.cs",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": [
        "string.interpolated.single.dart",
        "string.interpolated.double.dart"
      ],
      "settings": {
        "foreground": "#dbff8b"
      }
    },
    {
      "scope": "support.class.dart",
      "settings": {
        "foreground": "#dbff8b"
      }
    },
    {
      "scope": [
        "entity.name.tag.css",
        "entity.name.tag.less",
        "entity.name.tag.custom.css",
        "support.constant.property-value.css"
      ],
      "settings": {
        "fontStyle": "",
        "foreground": "#e5ff63"
      }
    },
    {
      "scope": [
        "entity.name.tag.wildcard.css",
        "entity.name.tag.wildcard.less",
        "entity.name.tag.wildcard.scss",
        "entity.name.tag.wildcard.sass"
      ],
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": "keyword.other.unit.css",
      "settings": {
        "foreground": "#d7ff95"
      }
    },
    {
      "scope": [
        "meta.attribute-selector.css entity.other.attribute-name.attribute",
        "variable.other.readwrite.js"
      ],
      "settings": {
        "foreground": "#d9fa69"
      }
    },
    {
      "scope": [
        "source.elixir support.type.elixir",
        "source.elixir meta.module.elixir entity.name.class.elixir"
      ],
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": "source.elixir entity.name.function",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": [
        "source.elixir constant.other.symbol.elixir",
        "source.elixir constant.other.keywords.elixir"
      ],
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": "source.elixir punctuation.definition.string",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": [
        "source.elixir variable.other.readwrite.module.elixir",
        "source.elixir variable.other.readwrite.module.elixir punctuation.definition.variable.elixir"
      ],
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": "source.elixir .punctuation.binary.elixir",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "constant.keyword.clojure",
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": "source.go meta.function-call.go",
      "settings": {
        "foreground": "#dddddd"
      }
    },
    {
      "scope": [
        "source.go keyword.package.go",
        "source.go keyword.import.go",
        "source.go keyword.function.go",
        "source.go keyword.type.go",
        "source.go keyword.struct.go",
        "source.go keyword.interface.go",
        "source.go keyword.const.go",
        "source.go keyword.var.go",
        "source.go keyword.map.go",
        "source.go keyword.channel.go",
        "source.go keyword.control.go"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": [
        "source.go constant.language.go",
        "source.go constant.other.placeholder.go"
      ],
      "settings": {
        "foreground": "#58ffce"
      }
    },
    {
      "scope": [
        "entity.name.function.preprocessor.cpp",
        "entity.scope.name.cpp"
      ],
      "settings": {
        "foreground": "#85dd7dff"
      }
    },
    {
      "scope": [
        "meta.namespace-block.cpp"
      ],
      "settings": {
        "foreground": "#d5e1c5"
      }
    },
    {
      "scope": [
        "storage.type.language.primitive.cpp"
      ],
      "settings": {
        "foreground": "#58ffce"
      }
    },
    {
      "scope": [
        "meta.preprocessor.macro.cpp"
      ],
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": [
        "variable.parameter"
      ],
      "settings": {
        "foreground": "#dbff8b"
      }
    },
    {
      "scope": [
        "variable.other.readwrite.powershell"
      ],
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": [
        "support.function.powershell"
      ],
      "settings": {
        "foreground": "#85dd7dff"
      }
    },
    {
      "scope": "entity.other.attribute-name.id.html",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": "punctuation.definition.tag.html",
      "settings": {
        "foreground": "#6bf367"
      }
    },
    {
      "scope": "meta.tag.sgml.doctype.html",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "meta.class entity.name.type.class.js",
      "settings": {
        "foreground": "#dbff8b"
      }
    },
    {
      "scope": "meta.method.declaration storage.type.js",
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": "terminator.js",
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": "meta.js punctuation.definition.js",
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": [
        "entity.name.type.instance.jsdoc",
        "entity.name.type.instance.phpdoc"
      ],
      "settings": {
        "foreground": "#5e9862"
      }
    },
    {
      "scope": [
        "variable.other.jsdoc",
        "variable.other.phpdoc"
      ],
      "settings": {
        "foreground": "#75f37a"
      }
    },
    {
      "scope": [
        "variable.other.meta.import.js",
        "meta.import.js variable.other",
        "variable.other.meta.export.js",
        "meta.export.js variable.other"
      ],
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": "variable.parameter.function.js",
      "settings": {
        "foreground": "#76ea8c"
      }
    },
    {
      "scope": [
        "variable.other.object.js",
        "variable.other.object.jsx",
        "variable.object.property.js",
        "variable.object.property.jsx"
      ],
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": [
        "variable.js",
        "variable.other.js"
      ],
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": [
        "entity.name.type.js",
        "entity.name.type.module.js"
      ],
      "settings": {
        "fontStyle": "",
        "foreground": "#dbff8b"
      }
    },
    {
      "scope": "support.class.js",
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": "support.type.property-name.json",
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": "support.constant.json",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": "meta.structure.dictionary.value.json string.quoted.double",
      "settings": {
        "foreground": "#87d8aa"
      }
    },
    {
      "scope": "string.quoted.double.json punctuation.definition.string.json",
      "settings": {
        "foreground": "#83cd7e"
      }
    },
    {
      "scope": "meta.structure.dictionary.json meta.structure.dictionary.value constant.language",
      "settings": {
        "foreground": "#58ffce"
      }
    },
    {
      "scope": "variable.other.object.js",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": [
        "variable.other.ruby"
      ],
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": [
        "entity.name.type.class.ruby"
      ],
      "settings": {
        "foreground": "#cfee8b"
      }
    },
    {
      "scope": "constant.language.symbol.hashkey.ruby",
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": "constant.language.symbol.ruby",
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": "entity.name.tag.less",
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": "keyword.other.unit.css",
      "settings": {
        "foreground": "#d7ff95"
      }
    },
    {
      "scope": "meta.attribute-selector.less entity.other.attribute-name.attribute",
      "settings": {
        "foreground": "#d9fa69"
      }
    },
    {
      "scope": [
        "markup.heading",
        "markup.heading.setext.1",
        "markup.heading.setext.2"
      ],
      "settings": {
        "foreground": "#82ff91"
      }
    },
    {
      "scope": "markup.italic",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": "markup.bold",
      "settings": {
        "fontStyle": "bold",
        "foreground": "#ade775"
      }
    },
    {
      "scope": "markup.quote",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#689971"
      }
    },
    {
      "scope": "markup.inline.raw",
      "settings": {
        "foreground": "#83cd7e"
      }
    },
    {
      "scope": [
        "markup.underline.link",
        "markup.underline.link.image"
      ],
      "settings": {
        "foreground": "#86ffdb"
      }
    },
    {
      "scope": [
        "string.other.link.title.markdown",
        "string.other.link.description.markdown"
      ],
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": [
        "punctuation.definition.string.markdown",
        "punctuation.definition.string.begin.markdown",
        "punctuation.definition.string.end.markdown",
        "meta.link.inline.markdown punctuation.definition.string"
      ],
      "settings": {
        "foreground": "#82ff91"
      }
    },
    {
      "scope": [
        "punctuation.definition.metadata.markdown"
      ],
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": [
        "beginning.punctuation.definition.list.markdown"
      ],
      "settings": {
        "foreground": "#82ff91"
      }
    },
    {
      "scope": "markup.inline.raw.string.markdown",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": [
        "variable.other.php",
        "variable.other.property.php"
      ],
      "settings": {
        "foreground": "#bdd5c1"
      }
    },
    {
      "scope": "support.class.php",
      "settings": {
        "foreground": "#dbff8b"
      }
    },
    {
      "scope": "meta.function-call.php punctuation",
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": "variable.other.global.php",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": "variable.other.global.php punctuation.definition.variable",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": "constant.language.python",
      "settings": {
        "foreground": "#58ffce"
      }
    },
    {
      "scope": [
        "variable.parameter.function.python",
        "meta.function-call.arguments.python"
      ],
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": [
        "meta.function-call.python",
        "meta.function-call.generic.python"
      ],
      "settings": {
        "foreground": "#b1d7b2"
      }
    },
    {
      "scope": "punctuation.python",
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": "entity.name.function.decorator.python",
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": "source.python variable.language.special",
      "settings": {
        "foreground": "#8ce597"
      }
    },
    {
      "scope": "keyword.control",
      "settings": {
        "fontStyle": "italic",
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": [
        "variable.scss",
        "variable.sass",
        "variable.parameter.url.scss",
        "variable.parameter.url.sass"
      ],
      "settings": {
        "foreground": "#ade775"
      }
    },
    {
      "scope": [
        "source.css.scss meta.at-rule variable",
        "source.css.sass meta.at-rule variable"
      ],
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": [
        "source.css.scss meta.at-rule variable",
        "source.css.sass meta.at-rule variable"
      ],
      "settings": {
        "foreground": "#bdd5c1"
      }
    },
    {
      "scope": [
        "meta.attribute-selector.scss entity.other.attribute-name.attribute",
        "meta.attribute-selector.sass entity.other.attribute-name.attribute"
      ],
      "settings": {
        "foreground": "#d9fa69"
      }
    },
    {
      "scope": [
        "entity.name.tag.scss",
        "entity.name.tag.sass"
      ],
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": [
        "keyword.other.unit.scss",
        "keyword.other.unit.sass"
      ],
      "settings": {
        "foreground": "#d7ff95"
      }
    },
    {
      "scope": [
        "variable.other.readwrite.alias.ts",
        "variable.other.readwrite.alias.tsx",
        "variable.other.readwrite.ts",
        "variable.other.readwrite.tsx",
        "variable.other.object.ts",
        "variable.other.object.tsx",
        "variable.object.property.ts",
        "variable.object.property.tsx",
        "variable.other.ts",
        "variable.other.tsx",
        "variable.tsx",
        "variable.ts"
      ],
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": [
        "entity.name.type.ts",
        "entity.name.type.tsx"
      ],
      "settings": {
        "foreground": "#dbff8b"
      }
    },
    {
      "scope": [
        "support.class.node.ts",
        "support.class.node.tsx"
      ],
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": [
        "meta.type.parameters.ts entity.name.type",
        "meta.type.parameters.tsx entity.name.type"
      ],
      "settings": {
        "foreground": "#5e9862"
      }
    },
    {
      "scope": [
        "meta.import.ts punctuation.definition.block",
        "meta.import.tsx punctuation.definition.block",
        "meta.export.ts punctuation.definition.block",
        "meta.export.tsx punctuation.definition.block"
      ],
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": [
        "meta.decorator punctuation.decorator.ts",
        "meta.decorator punctuation.decorator.tsx"
      ],
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": "meta.tag.js meta.jsx.children.tsx",
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": "entity.name.tag.yaml",
      "settings": {
        "foreground": "#85dd7d"
      }
    },
    {
      "scope": [
        "variable.other.readwrite.js",
        "variable.parameter"
      ],
      "settings": {
        "foreground": "#d7e0d8"
      }
    },
    {
      "scope": [
        "support.class.component.js",
        "support.class.component.tsx"
      ],
      "settings": {
        "fontStyle": "",
        "foreground": "#d9fa69"
      }
    },
    {
      "scope": [
        "meta.jsx.children",
        "meta.jsx.children.js",
        "meta.jsx.children.tsx"
      ],
      "settings": {
        "foreground": "#d5ecd8"
      }
    },
    {
      "scope": "meta.class entity.name.type.class.tsx",
      "settings": {
        "foreground": "#dbff8b"
      }
    },
    {
      "scope": [
        "entity.name.type.tsx",
        "entity.name.type.module.tsx"
      ],
      "settings": {
        "foreground": "#dbff8b"
      }
    },
    {
      "scope": [
        "meta.class.ts meta.var.expr.ts storage.type.ts",
        "meta.class.tsx meta.var.expr.tsx storage.type.tsx"
      ],
      "settings": {
        "foreground": "#90ecb3"
      }
    },
    {
      "scope": [
        "meta.method.declaration storage.type.ts",
        "meta.method.declaration storage.type.tsx"
      ],
      "settings": {
        "foreground": "#82ff93"
      }
    },
    {
      "scope": "markup.deleted",
      "settings": {
        "foreground": "#d4ff00"
      }
    },
    {
      "scope": "markup.inserted",
      "settings": {
        "foreground": "#206d00"
      }
    },
    {
      "scope": "markup.underline",
      "settings": {
        "fontStyle": "underline"
      }
    },
    {
      "scope": [
        "meta.property-list.css meta.property-value.css variable.other.less",
        "meta.property-list.scss variable.scss",
        "meta.property-list.sass variable.sass",
        "meta.brace",
        "keyword.operator.operator",
        "keyword.operator.or.regexp",
        "keyword.operator.expression.in",
        "keyword.operator.relational",
        "keyword.operator.assignment",
        "keyword.operator.comparison",
        "keyword.operator.type",
        "keyword.operator",
        "keyword",
        "punctuation.definintion.string",
        "punctuation",
        "variable.other.readwrite.js",
        "storage.type",
        "source.css",
        "string.quoted"
      ],
      "settings": {
        "fontStyle": ""
      }
    }
  ]
} as const;
