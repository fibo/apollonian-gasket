# Apollonian Gasket

> is a WebComponent that implements and animated [Apollonian Gasket](https://en.wikipedia.org/wiki/Apollonian_gasket)

## Usage

Add an `<apollonian-gasket></apollonian-gasket>` element to your HTML.
Style its container with the desired width and height; it must have `position: relative`.
Optionally set CSS custom properties:
- `--apollonian-gasket-background-color`
- `--apollonian-gasket-color`

```html
<style>
  .container {
    position: relative;
    min-height: 600px;
    width: 100%;
  }
  /* Optionally set CSS props.
  :root {
    --apollonian-gasket-background-color: #242b24;
    --apollonian-gasket-color: #fff9d8;
  }
  */
</style>

<div class="container">
  <apollonian-gasket></apollonian-gasket>
</div>
```

Call the `ApollonianGasket.defineHTMLElement()` function when your page is loaded.

```
<script type="module">
  import {ApollonianGasket} from 'https://fibo.github.io/apollonian-gasket/abcd-i.js';

  addEventListener('load', () => {
    ApollonianGasket.defineHTMLElement();
  })
</script>
```

## License

[MIT](https://fibo.github.io/mit-license)
