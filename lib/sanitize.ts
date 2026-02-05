import sanitizeHtml from 'sanitize-html'

export function sanitizePostHtml(html: string): string {
    return sanitizeHtml(html, {
        allowedTags: [
            // basic blocks
            'p',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'blockquote',
            'hr',
            'br',

            // code blocks
            'pre',
            'code',

            // tables
            'table',
            'thead',
            'tbody',
            'tfoot',
            'tr',
            'th',
            'td',
            'caption',
            'colgroup',
            'col',

            // lists
            'ul',
            'ol',
            'li',

            // inline marks
            'strong',
            'b',
            'em',
            'i',
            'u',
            's',
            'del',
            'strike',
            'sub',
            'sup',
            'kbd',
            'mark',

            // links
            'a',

            // layout & structure
            'div',
            'span',
            'section',
            'article',

            // toggle/details
            'details',
            'summary',

            // toc/navigation
            'nav',

            // image
            'img',
            'figure',
            'figcaption',
        ],

        allowedAttributes: {
            '*': [
                'class',
                'id',
                'style',
                'dir',
                'lang',
                'aria-*',
                'role',
                'tabindex',
                'data-*',
            ],

            a: ['href', 'target', 'rel', 'title'],
            img: ['src', 'alt', 'width', 'height', 'loading', 'title'],
            code: ['class'],
            pre: ['class'],
            th: ['scope', 'colspan', 'rowspan', 'headers'],
            td: ['colspan', 'rowspan', 'headers'],
            col: ['span'],
            colgroup: ['span'],
            ol: ['start', 'type', 'reversed'],
            li: ['value'],
        },

        allowedStyles: {
            '*': {
                color: [/^#[0-9a-fA-F]{3,6}$/, /^rgb/, /^hsl/, /^\w+$/],
                'background-color': [
                    /^#[0-9a-fA-F]{3,6}$/,
                    /^rgb/,
                    /^hsl/,
                    /^\w+$/,
                ],
                'font-size': [/^\d+(?:px|em|rem|pt|%)$/],
                'font-family': [/.*/],
                'font-weight': [/^\d+$/, /^bold$/, /^normal$/],
                'font-style': [/^italic$/, /^normal$/, /^oblique$/],
                'text-align': [/^left$/, /^center$/, /^right$/, /^justify$/],
                'line-height': [/^\d+(?:\.\d+)?(?:px|em|rem|%)?$/],
                'margin-left': [/^\d+(?:px|em|rem)$/],
                'margin-right': [/^\d+(?:px|em|rem)$/],
                'padding-left': [/^\d+(?:px|em|rem)$/],
                'padding-right': [/^\d+(?:px|em|rem)$/],
                'list-style-type': [
                    /^disc$/,
                    /^circle$/,
                    /^square$/,
                    /^decimal$/,
                    /^lower-alpha$/,
                    /^upper-alpha$/,
                    /^lower-roman$/,
                    /^upper-roman$/,
                    /^none$/,
                ],
                'text-decoration': [
                    /^underline$/,
                    /^line-through$/,
                    /^none$/,
                    /^overline$/,
                ],
                'vertical-align': [/^sub$/, /^super$/, /^baseline$/],
                display: [
                    /^block$/,
                    /^inline$/,
                    /^inline-block$/,
                    /^flex$/,
                    /^grid$/,
                ],
                'flex-direction': [/^row$/, /^column$/],
                'align-items': [
                    /^center$/,
                    /^flex-start$/,
                    /^flex-end$/,
                    /^stretch$/,
                ],
                'justify-content': [
                    /^center$/,
                    /^flex-start$/,
                    /^flex-end$/,
                    /^space-between$/,
                    /^space-around$/,
                ],
                gap: [/^\d+(?:px|em|rem)$/],
                width: [/^\d+(?:px|em|rem|%)$/],
                'max-width': [/^\d+(?:px|em|rem|%)$/],
                border: [/.*/],
                'border-width': [/^\d+(?:px)$/],
                'border-style': [/^solid$/, /^dashed$/, /^dotted$/, /^none$/],
                'border-color': [
                    /^#[0-9a-fA-F]{3,6}$/,
                    /^rgb/,
                    /^hsl/,
                    /^\w+$/,
                ],
                'border-radius': [/^\d+(?:px|em|rem|%)$/],
                margin: [/^\d+(?:px|em|rem|%)(?:\s+\d+(?:px|em|rem|%))*$/],
                padding: [/^\d+(?:px|em|rem|%)(?:\s+\d+(?:px|em|rem|%))*$/],
            },
        },

        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        allowedSchemesByTag: {
            img: ['http', 'https', 'data'],
        },

        selfClosing: [
            'img',
            'br',
            'hr',
            'area',
            'base',
            'col',
            'embed',
            'link',
            'meta',
            'param',
            'source',
            'track',
            'wbr',
        ],
        allowProtocolRelative: true,
    })
}
