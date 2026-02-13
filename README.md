# bb-img

Lightweight lazy-loading image component. Subtle placeholder, smooth transition.

## Install

```bash
npm install @bbki.ng/bbimg
```

CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@bbki.ng/bbimg@latest/dist/index.js"></script>
```

## Usage

```html
<bb-img src="image.jpg" alt="Description"></bb-img>
```

## Attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `src` | required | Image URL |
| `alt` | "" | Accessibility text |
| `max-width` | "100%" | CSS max-width value |
| `placeholder` | "#f5f5f5" | Loading background color |
| `root-margin` | "50px" | Preload distance |

## Features

- IntersectionObserver lazy loading
- 3% opacity skeleton animation
- 1.2s cubic-bezier fade transition
- Race condition protection
- Zero dependencies

## Example

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@bbki.ng/bbimg@latest/dist/index.js"></script>
</head>
<body>
  <bb-img src="image.jpg" max-width="800px"></bb-img>
</body>
</html>
```

See `example/` directory for full demo.

## Development

```bash
npm install
npm run prepare
```

## License

MIT