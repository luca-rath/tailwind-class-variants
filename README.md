# tailwind-class-variants

A tailwindcss plugin that makes it possible to add conditional styling to an element only if that element has a specific class.

## Installation

> Note that `tailwind-class-variants` is designed for Tailwind CSS v2.2 with JIT mode enabled.

Install the plugin from npm:

```sh
# Using npm
npm install tailwind-class-variants

# Using Yarn
yarn add tailwind-class-variants
```

Then add the plugin to your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  mode: 'jit',
  // ...
  plugins: [
    require('tailwind-class-variants')({
      classes: ['is-active'],
    }),
    // ...
  ],
}
```

This will then generate the following variants:

- `is-active`
- `group-is-active`
- `peer-is-active`

It's also possible to add more complex variants like in the following example:

```js
// tailwind.config.js
require('tailwind-class-variants')({
  variants: [
      // ...
      ['aria-expanded', 'is([aria-expanded]:not([aria-expanded="false"]))'],
  ],
})
```

## Basic usage

```html
<ul id="list">
    <li class="is-active:font-bold is-active">Foo</li>
    <li class="is-active:font-bold">Bar</li>
    <li class="is-active:font-bold">Baz</li>
</ul>

<script>
    const list = document.querySelector('#list');
    const items = list.querySelectorAll('li');

    const handleClick = (event) => {
        items.forEach((item) => {
            if (item === event.currentTarget) {
                item.classList.add('is-active');
            } else {
                item.classList.remove('is-active');
            }
        })
    }

    items.forEach((item) => {
        item.addEventListener('click', handleClick);
    });
</script>
```
