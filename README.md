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
| `max-width` | "100%" | CSS max-width value. Pure numbers are treated as px (e.g., `max-width="500"` becomes `500px`) |
| `aspect-ratio` | "3/2" | Aspect ratio for placeholder sizing (e.g., `16/9`, `4/3`, `1/1`) |
| `placeholder` | "#f5f5f5" | Loading background color |
| `root-margin` | "50px" | Preload distance |

## Features

- IntersectionObserver lazy loading
- 3% opacity skeleton animation
- 1.2s cubic-bezier fade transition
- Race condition protection
- WebP-friendly min-height calculation
- Zero dependencies

## Examples

### Basic usage

```html
<bb-img src="image.jpg" alt="Description"></bb-img>
```

### Fixed width (pure number = px)

```html
<bb-img src="image.webp" max-width="500" alt="500px wide image"></bb-img>
```

### Custom aspect ratio

```html
<!-- 16:9 video thumbnail -->
<bb-img src="video-thumb.webp" max-width="800" aspect-ratio="16/9"></bb-img>

<!-- Square avatar -->
<bb-img src="avatar.webp" max-width="200" aspect-ratio="1/1"></bb-img>
```

### Full example

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@bbki.ng/bbimg@latest/dist/index.js"></script>
</head>
<body>
  <bb-img 
    src="image.webp" 
    max-width="800" 
    aspect-ratio="16/9"
    placeholder="#e0e0e0"
    alt="Responsive image">
  </bb-img>
</body>
</html>
```

See `example/` directory for full demo.

## Why min-height?

WebP images decode asynchronously, which can cause layout shift before the browser determines the image dimensions. `bb-img` calculates and applies a `min-height` based on `max-width` and `aspect-ratio` to ensure the placeholder maintains correct proportions during loading.

## Development

```bash
npm install
npm run prepare
```

## License

MIT