We will need to implemented tables for character (actor) and content sheets. Due to difficulties with making HTML tables interactive and responsive (to screen changes) we may want to avoid HTML tables for sheets and use <divs> with CSS Grid instead. To make sure screen readers can still understand them as tables we can use aria roles. Example:

```html
<div class="grid grid-cols-4 gap-4" role="table" aria-rowcount="1">
  <div>01</div>
  <!-- ... -->
  <div>09</div>
</div>
```
