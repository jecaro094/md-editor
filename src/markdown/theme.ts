/**
 * Shiki theme for fenced code blocks: VS Code's "Dark Modern" theme with every
 * token's hue remapped into the green/lime/emerald band (roughly 60-172deg)
 * that matches the site's accent palette (--accent, --accent-strong, --lime
 * in theme.css), so code reads as part of the same visual family as the rest
 * of the page instead of the stock blue/orange VS Code palette. Saturation
 * and lightness are kept from the source Dark Modern theme so token types
 * (strings, keywords, numbers, comments, …) stay distinguishable from one
 * another — only the hue moved. `invalid` (syntax errors) is the one
 * exception, kept red since an error losing its alarm color would hurt
 * legibility more than it helps consistency.
 */
import type { ThemeRegistrationAny } from '@shikijs/types';

export const shikiTheme: ThemeRegistrationAny = {
  "name": "dark-modern",
  "type": "dark",
  "colors": {
    "editor.background": "#000000",
    "editor.foreground": "#d9e6dc"
  },
  "bg": "#000000",
  "fg": "#d9e6dc",
  "tokenColors": [
    {
      "scope": [
        "meta.embedded",
        "source.groovy.embedded",
        "string meta.image.inline.markdown"
      ],
      "settings": {
        "foreground": "#d9d9cf"
      }
    },
    {
      "scope": "emphasis",
      "settings": {
        "fontStyle": "italic"
      }
    },
    {
      "scope": "strong",
      "settings": {
        "fontStyle": "bold"
      }
    },
    {
      "scope": "header",
      "settings": {
        "foreground": "#00801f"
      }
    },
    {
      "scope": "comment",
      "settings": {
        "foreground": "#759955"
      }
    },
    {
      "scope": "constant.language",
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "constant.numeric",
      "settings": {
        "foreground": "#bacea8"
      }
    },
    {
      "scope": "constant.regexp",
      "settings": {
        "foreground": "#64956f"
      }
    },
    {
      "scope": "entity.name.tag",
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "entity.name.tag.css",
      "settings": {
        "foreground": "#c4d77d"
      }
    },
    {
      "scope": "entity.other.attribute-name",
      "settings": {
        "foreground": "#9cfea0"
      }
    },
    {
      "scope": [
        "entity.other.attribute-name.class.css",
        "entity.other.attribute-name.class.mixin.css",
        "entity.other.attribute-name.id.css",
        "entity.other.attribute-name.parent-selector.css",
        "entity.other.attribute-name.pseudo-class.css",
        "entity.other.attribute-name.pseudo-element.css",
        "source.css.less entity.other.attribute-name.id",
        "entity.other.attribute-name.scss"
      ],
      "settings": {
        "foreground": "#c4d77d"
      }
    },
    {
      "scope": "invalid",
      "settings": {
        "foreground": "#f44747"
      }
    },
    {
      "scope": "markup.underline",
      "settings": {
        "fontStyle": "underline"
      }
    },
    {
      "scope": "markup.bold",
      "settings": {
        "fontStyle": "bold",
        "foreground": "#56d660"
      }
    },
    {
      "scope": "markup.heading",
      "settings": {
        "fontStyle": "bold",
        "foreground": "#56d660"
      }
    },
    {
      "scope": "markup.italic",
      "settings": {
        "fontStyle": "italic"
      }
    },
    {
      "scope": "markup.strikethrough",
      "settings": {
        "fontStyle": "strikethrough"
      }
    },
    {
      "scope": "markup.inserted",
      "settings": {
        "foreground": "#bacea8"
      }
    },
    {
      "scope": "markup.deleted",
      "settings": {
        "foreground": "#c6ce78"
      }
    },
    {
      "scope": "markup.changed",
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "punctuation.definition.quote.begin.markdown",
      "settings": {
        "foreground": "#759955"
      }
    },
    {
      "scope": "punctuation.definition.list.begin.markdown",
      "settings": {
        "foreground": "#67e677"
      }
    },
    {
      "scope": "markup.inline.raw",
      "settings": {
        "foreground": "#c6ce78"
      }
    },
    {
      "scope": "punctuation.definition.tag",
      "settings": {
        "foreground": "#8f8f71"
      }
    },
    {
      "scope": "meta.preprocessor",
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "meta.preprocessor.string",
      "settings": {
        "foreground": "#c6ce78"
      }
    },
    {
      "scope": "meta.preprocessor.numeric",
      "settings": {
        "foreground": "#bacea8"
      }
    },
    {
      "scope": "meta.structure.dictionary.key.python",
      "settings": {
        "foreground": "#9cfea0"
      }
    },
    {
      "scope": "meta.diff.header",
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "storage",
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "storage.type",
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "storage.modifier",
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "string",
      "settings": {
        "foreground": "#c6ce78"
      }
    },
    {
      "scope": "string.tag",
      "settings": {
        "foreground": "#c6ce78"
      }
    },
    {
      "scope": "string.value",
      "settings": {
        "foreground": "#c6ce78"
      }
    },
    {
      "scope": "string.regexp",
      "settings": {
        "foreground": "#d1d169"
      }
    },
    {
      "scope": [
        "punctuation.definition.template-expression.begin",
        "punctuation.definition.template-expression.end",
        "punctuation.section.embedded"
      ],
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "meta.template.expression",
      "settings": {
        "foreground": "#d9d9cf"
      }
    },
    {
      "scope": [
        "support.type.vendored.property-name",
        "support.type.property-name",
        "variable.css",
        "variable.scss",
        "variable.other.less",
        "source.coffee.embedded"
      ],
      "settings": {
        "foreground": "#9cfea0"
      }
    },
    {
      "scope": "keyword",
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "keyword.control",
      "settings": {
        "foreground": "#86c5ab"
      }
    },
    {
      "scope": "keyword.operator",
      "settings": {
        "foreground": "#d9d9cf"
      }
    },
    {
      "scope": [
        "keyword.operator.new",
        "keyword.operator.expression",
        "keyword.operator.cast",
        "keyword.operator.sizeof",
        "keyword.operator.alignof",
        "keyword.operator.typeid",
        "keyword.operator.alignas",
        "keyword.operator.instanceof",
        "keyword.operator.logical.python",
        "keyword.operator.wordlike"
      ],
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "keyword.other.unit",
      "settings": {
        "foreground": "#bacea8"
      }
    },
    {
      "scope": [
        "punctuation.section.embedded.begin.php",
        "punctuation.section.embedded.end.php"
      ],
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "support.function.git-rebase",
      "settings": {
        "foreground": "#9cfea0"
      }
    },
    {
      "scope": "constant.sha.git-rebase",
      "settings": {
        "foreground": "#bacea8"
      }
    },
    {
      "scope": [
        "storage.modifier.import.java",
        "variable.language.wildcard.java",
        "storage.modifier.package.java"
      ],
      "settings": {
        "foreground": "#d9d9cf"
      }
    },
    {
      "scope": "variable.language",
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": [
        "entity.name.function",
        "support.function",
        "support.constant.handlebars",
        "source.powershell variable.other.member",
        "entity.name.operator.custom-literal"
      ],
      "settings": {
        "foreground": "#ccdcaa"
      }
    },
    {
      "scope": [
        "support.class",
        "support.type",
        "entity.name.type",
        "entity.name.namespace",
        "entity.other.attribute",
        "entity.name.scope-resolution",
        "entity.name.class",
        "storage.type.numeric.go",
        "storage.type.byte.go",
        "storage.type.boolean.go",
        "storage.type.string.go",
        "storage.type.uintptr.go",
        "storage.type.error.go",
        "storage.type.rune.go",
        "storage.type.cs",
        "storage.type.generic.cs",
        "storage.type.modifier.cs",
        "storage.type.variable.cs",
        "storage.type.annotation.java",
        "storage.type.generic.java",
        "storage.type.java",
        "storage.type.object.array.java",
        "storage.type.primitive.array.java",
        "storage.type.primitive.java",
        "storage.type.token.java",
        "storage.type.groovy",
        "storage.type.annotation.groovy",
        "storage.type.parameters.groovy",
        "storage.type.generic.groovy",
        "storage.type.object.array.groovy",
        "storage.type.primitive.array.groovy",
        "storage.type.primitive.groovy"
      ],
      "settings": {
        "foreground": "#5ec94e"
      }
    },
    {
      "scope": [
        "meta.type.cast.expr",
        "meta.type.new.expr",
        "support.constant.math",
        "support.constant.dom",
        "support.constant.json",
        "entity.other.inherited-class"
      ],
      "settings": {
        "foreground": "#5ec94e"
      }
    },
    {
      "scope": [
        "variable",
        "meta.definition.variable.name",
        "support.variable",
        "entity.name.variable"
      ],
      "settings": {
        "foreground": "#9cfea0"
      }
    },
    {
      "scope": "meta.object-literal.key",
      "settings": {
        "foreground": "#9cfea0"
      }
    },
    {
      "scope": [
        "support.constant.property-value",
        "support.constant.font-name",
        "support.constant.media-type",
        "support.constant.media",
        "constant.other.color.rgb-value",
        "constant.other.rgb-value",
        "support.constant.color"
      ],
      "settings": {
        "foreground": "#c6ce78"
      }
    },
    {
      "scope": [
        "punctuation.definition.group.regexp",
        "punctuation.definition.group.assertion.regexp",
        "punctuation.definition.character-class.regexp",
        "punctuation.character.set.begin.regexp",
        "punctuation.character.set.end.regexp",
        "keyword.operator.negation.regexp",
        "support.other.parenthesis.regexp"
      ],
      "settings": {
        "foreground": "#c6ce78"
      }
    },
    {
      "scope": [
        "constant.character.character-class.regexp",
        "constant.other.character-class.set.regexp",
        "constant.other.character-class.regexp",
        "constant.character.set.regexp"
      ],
      "settings": {
        "foreground": "#d1d169"
      }
    },
    {
      "scope": "keyword.operator.quantifier.regexp",
      "settings": {
        "foreground": "#c4d77d"
      }
    },
    {
      "scope": "keyword.operator.or.regexp",
      "settings": {
        "foreground": "#ccdcaa"
      }
    },
    {
      "scope": "keyword.control.anchor.regexp",
      "settings": {
        "foreground": "#ccdcaa"
      }
    },
    {
      "scope": "constant.character",
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "constant.character.escape",
      "settings": {
        "foreground": "#c4d77d"
      }
    },
    {
      "scope": "entity.name.label",
      "settings": {
        "foreground": "#cfcfc1"
      }
    },
    {
      "scope": "entity.name.type.class",
      "settings": {
        "foreground": "#5ec94e"
      }
    },
    {
      "scope": [
        "punctuation.section.class.begin",
        "punctuation.section.class.end"
      ],
      "settings": {
        "foreground": "#d9d9cf"
      }
    },
    {
      "scope": "entity.name.function.member",
      "settings": {
        "foreground": "#ccdcaa"
      }
    },
    {
      "scope": "punctuation.definition.variable.php",
      "settings": {
        "foreground": "#56d660"
      }
    },
    {
      "scope": "keyword.operator.other.powershell",
      "settings": {
        "foreground": "#cfcfc1"
      }
    },
    {
      "scope": "keyword.other.statement-separator.powershell",
      "settings": {
        "foreground": "#cfcfc1"
      }
    },
    {
      "scope": "entity.name.section.markdown",
      "settings": {
        "foreground": "#56d660"
      }
    }
  ]
} as const;
