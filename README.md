# bb-img

A lightweight, lazy-loading image web component with automatic placeholder.

## Features

- 🚀 Lazy loading by default using IntersectionObserver
- 🎨 Light gray placeholder with 2:3 aspect ratio while loading
- 🔄 Smooth fade-in transition when image loads
- 📦 Minimal and lightweight
- 💪 Built with TypeScript
- 🌐 Works with npm or CDN

## Installation

### Via npm

```bash
npm install @bbki.ng/bbimg
```

Then import in your JavaScript/TypeScript:

```javascript
import '@bbki.ng/bbimg';
```

### Via CDN

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@bbki.ng/bbimg@latest/dist/index.js"></script>
```

## Usage

Simply use the `<bb-img>` custom element with a `src` attribute:

```html
<bb-img src="path/to/your/image.jpg"></bb-img>
```

### Example

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@bbki.ng/bbimg@latest/dist/index.js"></script>
</head>
<body>
  <bb-img src="https://picsum.photos/400/600"></bb-img>
</body>
</html>
```

## How it Works

1. **Placeholder**: Shows a light gray box with 2:3 aspect ratio before the image loads
2. **Lazy Loading**: Uses IntersectionObserver to only load images when they're about to enter the viewport
3. **Fade-in**: Smoothly transitions from placeholder to the actual image
4. **Fallback**: Falls back to immediate loading if IntersectionObserver is not supported

## Browser Support

Works in all modern browsers that support:
- Custom Elements (Web Components)
- Shadow DOM
- IntersectionObserver (with graceful fallback)

## Development

```bash
# Install dependencies
npm install

# Build the component
npm run prepare

# Watch mode for development
npm start
```

## Example

Check out the `example` directory for a live demo showing various use cases including:
- Single image display
- Grid layouts
- Lazy loading demonstration

To run the example locally:

```bash
npm install
npm run prepare
# Then open example/index.html in your browser
```

## License

MIT
