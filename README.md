# Scrollface

A super basic jQuery slideshow plugin.

## Usage

### Javascript

```js
$('#slideshow').scrollface({
  next   : $('#next'),
  prev   : $('#prev'),
  pager  : $('#pager'),
  speed  : 400,
  easing : 'easeOutExpo'
});
```

### HTML

```html
<div id="slideshow_mask">
  <div id="slideshow">
    <div class="slide">...</div>
    <div class="slide">...</div>
    <div class="slide">...</div>
  </div>
</div>
<div id="pager"></div>
<a id="prev"></a>
<a id="next"></a>
```
### CSS

```css
#slideshow_mask {
  position:relative;
  overflow:hidden;
  margin:0 auto;
  width:640px;
  height:320px;
}

#slideshow {
  position:absolute;
  left:0px;
  top:0px;
  width:640px;
  height:320px;
}

#slideshow .slide {
  position:absolute;
  width:640px;
  height:320px;
}

#pager a.active {
  background:orange;
}

```

## Init Options

* auto               - `true`,
* interval           - `2000`,
* speed              - `300`,
* easing             - `linear`,
* next               - `null`,
* prev               - `null`,
* pager              - `null`,
* pager_builder      - `function (pager, index, slide) {}`
* active_pager_class - `active`,
* transition         - `horizontal`, `vertical`, `fade`, `random`
* before             - `function (old_slide, new_slide) {}`,
* after              - `function (old_slide, new_slide) {}`

## Methods

* init      - `$('#slideshow).scrollface(OPTIONS)`
* destroy   - `$('#slideshow).scrollface('destroy')`
* step_to   - `$('#slideshow).scrollface('step_to', INDEX, OPTIONS)`
* next      - `$('#slideshow).scrollface('next', OPTIONS)`
* prev      - `$('#slideshow).scrollface('prev', OPTIONS)`
* start     - `$('#slideshow).scrollface('start')`
* stop      - `$('#slideshow).scrollface('stop')`
* interrupt - `$('#slideshow).scrollface('interrupt', DELAY)`

## Override Init Options

You may also specify per-transition options for the `step_to`, `next`, and `prev` methods. This gives you granular control over every transition you might run. The options are passed as an object literal, and allows these attributes:

```js
$('#slideshow).scrollface('next', {
  speed      : 2000,
  easing     : "easeInCubic",
  direction  : "retreat",
  transition : "random"
});
```

## Custom Pager

By deafult, scrollface will add anchor tags to your pager like this:

```html
<a href="#">1</a>
```

If that doesn't work for you, scrollface will defer to a custom method if you provide one via `pager_builder`. It will fire for each item in your slide show. The callback provides you with some core arguments:

* `this` - jQuery object of the whole slideshow.
* `pager` - jQuery object of the pager box you defined.
* `index` - The current slide index that scrollface is building (number).
* `slide` - jQuery object of the current slide that scrollface is building.

In order for scrollface to work, you MUST return the anchor object you're adding to the pager. Otherwise, scrollface won't know what to bind.

```js
$('#slideshow').scrollface({
  next          : $('#next'),
  prev          : $('#prev'),
  pager         : $('#pager'),
  speed         : 400,
  pager_builder : function (pager, index, slide) {

    var anchor = $(document.createElement('a'))
      .html(index + 1)
      .appendTo($(pager));

    return anchor;

  }
});
```

You don't necessarily need to create new DOM element here; Scrollface will accept an existing element on the page too. For example:

```js
$('#slideshow').scrollface({
  // ...
  pager_builder : function (pager, index, slide) {

    return $('a', pager).eq(index); // an element that already exists!

  }
});
```

## Transitions

You may choose one of three transitions (hopefully this number will grow) as the default movement for scrollface. Optionally, if you call `next`, `prev`, or `step_to` directly on the slideshow, you may explicitly set a one time transition to override the default.

* `horizontal` - left to right
* `vertical` - top to bottom
* `fade` - fade in the next slide over the current one
* `random` - each transition is randomly assigned to `horizontal`, `vertical` or `fade`

## Callbacks

Scrollface will fire optional callbacks before and after each slide transition. Each method receives the same arguments:

```js
$('#slideshow').scrollface({
  next   : $('#next'),
  prev   : $('#prev'),
  pager  : $('#pager'),
  speed  : 400,
  before : function (old_slide, new_slide) {
    // do stuff ...
  },
  after  : function (old_slide, new_slide) {
    // do stuff ...
  }
});
```

The `old_slide` and `new_slide` arguments are constructed like this:

```js
old_slide = {
  idx   : #,  // index of the slide that's exiting
  slide : $() // jQuery object of the slide that's exiting
}

new_slide = {
  idx   : #,  // index of the incomming slide
  slide : $() // jQuery object of the incomming slide
}
```

## Directions

For any transition, the direction represents the **physical** direction that next slide will come from. It doesn't represent the next slide index. The defaults are as such:

* `advance`
  * `horizontal` - left to right
  * `vertical` - top to bottom
* `retreat`
  * `horizontal` - right to left
  * `vertical` - bottom to top

These will just happen automatically, but if you want to explicitly force a certain direction, you may override it when calling `prev`, `next`, `step_to` on a slideshow.

## TODO

* Reverse default directions
* Fade in/out transition