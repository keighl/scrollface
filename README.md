# Scrollface

A super basic jQuery slideshow plugin.

## Usage

### Javascript

```js
$('#slideshow').scrollface({
  next  : $('#next'),
  prev  : $('#prev'),
  pager : $('#pager')
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
  height:300px;
}

#slideshow {
  margin:0;
  padding:0;
  position:absolute;
  width:9999em;
  height:140px;
}

#slideshow .slide {
  position:absolute;
  width:640px;
  height:300px;
}

#pager a.active {
  background:orange;
}
```

## Options

`auto`               - `true`,
`interval`           - `2000`,
`speed`              - `300`,
`easing`             - `linear`,
`next`               - `null`,
`prev`               - `null`,
`pager`              - `null`,
`pager_builder`      - `function (pager, index, slide) {}`
`active_pager_class` - `active`,
`transition`         - `horizontal`, (vertical, random),
`before`             - `function (old_slide, new_slide) {}`,
`after`              - `function (old_slide, new_slide) {}`

# Methods

`init`      - `$('#slideshow).scrollface({})`
`destroy`   - `$('#slideshow).scrollface('destroy')`
`step_to`   - `$('#slideshow).scrollface('step_to', SLIDE_IDX, DIRECTION, TRANSITION)`
`next`      - `$('#slideshow).scrollface('next', DIRECTION, TRANSITION)`
`prev`      - `$('#slideshow).scrollface('prev', DIRECTION, TRANSITION)`
`start`     - `$('#slideshow).scrollface('start')`
`stop`      - `$('#slideshow).scrollface('stop')`
`interrupt` - `$('#slideshow).scrollface('interrupt', DELAY)`

## Custom Pager

## Transitions

## Directions

## Callbacks

## TODO

* Options << Reverse default direction 



