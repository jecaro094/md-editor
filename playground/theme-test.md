# Theme test

```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-opus-5",
    max_tokens=1000,
    messages=[{"role": "user", "content": "hello"}],
)

for block in message.content:
    if block.type == "text":
        print(block.text)
```

```ts
export interface Renderer {
  render(markdown: string): Promise<string>;
  renderBlocks?(sources: string[]): Promise<string[]>;
}

const count = 42;
// remap each token group to its own hue
export const shikiTheme = { name: "tech-docs-accent" } as const;
```

```bash
npm run typecheck && npm run playground
```

```json
{
  "name": "tech-docs-accent",
  "type": "dark",
  "max_tokens": 1000
}
```
