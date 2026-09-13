/**
 * Shiki theme for fenced code blocks: VS Code's "Dark Modern" theme with every
 * token's hue remapped into the green/lime/emerald band (roughly 60-172deg)
 * that matches the site's accent palette (--accent, --accent-strong, --lime
 * in theme.css), so code reads as part of the same visual family as the rest
 * of the page instead of the stock blue/orange VS Code palette. `invalid`
 * (syntax errors) is the one exception, kept red since an error losing its
 * alarm color would hurt legibility more than it helps consistency.
 *
 * Hue is kept from the first recolor pass, but saturation/lightness were
 * pulled down a step from the raw hue-shift values: the frequent token
 * scopes (variable/attribute-name, keyword, tag) landed at near-maximum
 * saturation on a black background, which reads as glare over long reading
 * sessions rather than as emphasis. `bg` matches theme.css's near-black
 * `--bg` for the same reason.
 */
import type { ThemeRegistrationAny } from '@shikijs/types';

export const shikiTheme: ThemeRegistrationAny = {
  "name": "dark-modern",
  "type": "dark",
  "colors": {
    "editor.background": "#090c0a",
    "editor.foreground": "#d9e6dc"
  },
  "bg": "#090c0a",
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
        "foreground": "#51c25b"
      }
    },
    {
      "scope": "constant.numeric",
      "settings": {
        "foreground": "#b1c69f"
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
        "foreground": "#51c25b"
      }
    },
    {
      "scope": "entity.name.tag.css",
      "settings": {
        "foreground": "#b7cb72"
      }
    },
    {
      "scope": "entity.other.attribute-name",
      "settings": {
        "foreground": "#90df93"
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
        "foreground": "#b7cb72"
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
        "foreground": "#51c25b"
      }
    },
    {
      "scope": "markup.heading",
      "settings": {
        "fontStyle": "bold",
        "foreground": "#51c25b"
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
        "foreground": "#b1c69f"
      }
    },
    {
      "scope": "markup.deleted",
      "settings": {
        "foreground": "#bbc46e"
      }
    },
    {
      "scope": "markup.changed",
      "settings": {
        "foreground": "#51c25b"
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
        "foreground": "#5ec96d"
      }
    },
    {
      "scope": "markup.inline.raw",
      "settings": {
        "foreground": "#bbc46e"
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
        "foreground": "#51c25b"
      }
    },
    {
      "scope": "meta.preprocessor.string",
      "settings": {
        "foreground": "#bbc46e"
      }
    },
    {
      "scope": "meta.preprocessor.numeric",
      "settings": {
        "foreground": "#b1c69f"
      }
    },
    {
      "scope": "meta.structure.dictionary.key.python",
      "settings": {
        "foreground": "#90df93"
      }
    },
    {
      "scope": "meta.diff.header",
      "settings": {
        "foreground": "#51c25b"
      }
    },
    {
      "scope": "storage",
      "settings": {
        "foreground": "#51c25b"
      }
    },
    {
      "scope": "storage.type",
      "settings": {
        "foreground": "#51c25b"
      }
    },
    {
      "scope": "storage.modifier",
      "settings": {
        "foreground": "#51c25b"
      }
    },
    {
      "scope": "string",
      "settings": {
        "foreground": "#bbc46e"
      }
    },
    {
      "scope": "string.tag",
      "settings": {
        "foreground": "#bbc46e"
      }
    },
    {
      "scope": "string.value",
      "settings": {
        "foreground": "#bbc46e"
      }
    },
    {
      "scope": "string.regexp",
      "settings": {
        "foreground": "#c5c563"
      }
    },
    {
      "scope": [
        "punctuation.definition.template-expression.begin",
        "punctuation.definition.template-expression.end",
        "punctuation.section.embedded"
      ],
      "settings": {
        "foreground": "#51c25b"
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
        "foreground": "#90df93"
      }
    },
    {
      "scope": "keyword",
      "settings": {
        "foreground": "#51c25b"
      }
    },
    {
      "scope": "keyword.control",
      "settings": {
        "foreground": "#78ba9e"
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
        "foreground": "#51c25b"
      }
    },
    {
      "scope": "keyword.other.unit",
      "settings": {
        "foreground": "#b1c69f"
      }
    },
    {
      "scope": [
        "punctuation.section.embedded.begin.php",
        "punctuation.section.embedded.end.php"
      ],
      "settings": {
        "foreground": "#51c25b"
      }
    },
    {
      "scope": "support.function.git-rebase",
      "settings": {
        "foreground": "#90df93"
      }
    },
    {
      "scope": "constant.sha.git-rebase",
      "settings": {
        "foreground": "#b1c69f"
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
        "foreground": "#51c25b"
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
        "foreground": "#c2d39c"
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
        "foreground": "#55b946"
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
        "foreground": "#55b946"
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
        "foreground": "#90df93"
      }
    },
    {
      "scope": "meta.object-literal.key",
      "settings": {
        "foreground": "#90df93"
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
        "foreground": "#bbc46e"
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
        "foreground": "#bbc46e"
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
        "foreground": "#c5c563"
      }
    },
    {
      "scope": "keyword.operator.quantifier.regexp",
      "settings": {
        "foreground": "#b7cb72"
      }
    },
    {
      "scope": "keyword.operator.or.regexp",
      "settings": {
        "foreground": "#c2d39c"
      }
    },
    {
      "scope": "keyword.control.anchor.regexp",
      "settings": {
        "foreground": "#c2d39c"
      }
    },
    {
      "scope": "constant.character",
      "settings": {
        "foreground": "#51c25b"
      }
    },
    {
      "scope": "constant.character.escape",
      "settings": {
        "foreground": "#b7cb72"
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
        "foreground": "#55b946"
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
        "foreground": "#c2d39c"
      }
    },
    {
      "scope": "punctuation.definition.variable.php",
      "settings": {
        "foreground": "#51c25b"
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
        "foreground": "#51c25b"
      }
    }
  ]
} as const;
