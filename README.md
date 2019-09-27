# menu-handler

## Description

Menu Handler is a tool to speedup the development of side menus, dropdowns and popups while emphasizing on accessibility.

es6, no dependencies.  
_internet explorer not supported._

library functionality:

- open
- close
- close on esc press
- close on blur
- prevent body scroll when a menu is open
- prevent body swipe when a menu is open
- accessiblity

## Table of contents

### Init

- [init](#init) - init with array of menu objects

### CSS

- [css](#css) - add the following css

### HTML

#### Menu

- [container](#container) - **required** - element that holds nothing, but the inner container
- [inner container](#inner-container) - **required** - &#x21; - element that holds all the menu elements

#### Submenu

- [submenu toggle](#submenu-toggle) - **required** - &#x21; - toggle button element should have data attribute data-mh-submenu-toggle
- [submenu list](#submenu-list) - **required** - &#x21; - list element should have data attribue data-mh-submenu-list
- [submenu container](#submenu-container) - &#x21; - container should have data attribute data-mh-submenu-container

#### Complete example

- [html example](#html-example) - complete example of a menu structure with submenus

### Options

#### Menu Options

- [name](#name) - a unique menu name that will be used for the menu.
- [container](#container) - **required** - menu container element that contains inner menu container.
- [innerContainer](#innerContainer) - **required** - element that holds all menu elements.
- [open](#open) - **required** - element that triggers opening of the menu.
- [close](#close) - &#x21; - element that triggers menu closing of the menu.
- [enterFocus](#enterFocus) - element to focus first when menu opens, will make any provided element focusable.
- [exitFocus](#exitFocus) - element to focus after menu closes.
- [mobileOpen](#mobileOpen) - element that triggers opening of the menu in mobile breakpoint.
- [mobileClose](#mobileClose) - &#x21; - element that triggers closing of the menu in mobile breakpoint.
- [mobileBreakpoint](#mobileBreakpoint) - max width breakpoint to switch between mobile and desktop open and/or close toggles.
- [loop](#loop) - &#x21; - loop all elements inside the innerContainer using Tab key.
- [openDelay](#openDelay) - sets delay in miliseconds before menu starts opening.
- [closeDelay](#closeDelay) - sets delay in miliseconds before menu starts closing.
- [openOnHover](#openOnHover) - triggers opening of a menu by mouse enter.
- [menuFunc](#menuFunc) - &#x21; - function to handle on your own of the specific menu.

#### Submenu Options

- [isEnabled](#isEnabled---submenu) - enables handling of submenus.
- [openOnHover](#openOnHover---submenu) - triggers opening of a menu by mouse enter.
- [menuFunc](#menuFunc---submenu) - &#x21; - function to handle submenus on your own the specific menu.

### Events

#### Menu Events

- [beforeInit](#beforeInit) - triggered before the specific menu is initialized.
- [afterInit](#afterInit) - triggered after the specific menu is initialized.
- [beforeOpen](#beforeOpen) - triggered before the specific menu is opened.
- [afterOpen](#afterOpen) - triggered after the specific menu finished transition and is opened
- [beforeClose](#beforeClose) - triggered before the specific menu is closed.
- [afterClose](#afterClose) - triggered after the specific menu finished transition and is closed

#### Submenu Events

- [beforeOpen](#beforeOpen---submenu) - triggered before the specific submenu is opened.
- [afterOpen](#afterOpen---submenu) - triggered after the specific submenu finished transition and is opened
- [beforeClose](#beforeClose---submenu) - triggered before the specific submenu is closed.
- [afterClose](#afterClose---submenu) - triggered after the specific submenu finished transition and is closed

### API

#### Menu params

- [activeOpen](#activeOpen) - the active element which triggers opening of the menu
- [activeClose](#activeClose) - the active element which triggers closing of the menu
- [isOpen](#isOpen) - Shows the status of the menu at run time
- [isMobile](#isMobile) - Shows the status of menu mobile state at run time

#### Submenu params

- [isOpen](#isOpen---submenu) - Shows the status of the submenu at run time

## Init

init with array of menu objects.

```javascript
const menus = [
  {
    elements: {
      open: "#menu-open",
      close: "#menu-close",
      container: "#menu-container",
      innerContainer: "#menu-inner-container"
    },
    loop: true
  }
];
menuHandler.init(menus);
```

## CSS

add the following css:

```css
.mh-hidden {
  display: none !important;
}
```

## HTML

### Menu

#### container

**required**
element that holds nothing, but the inner container.

```html
<div id="menu-container">
  <div class="mh-hidden" id="menu-inner-container">
    '...'
  </div>
</div>
```

---

#### inner container

**required**
element that holds all the menu elements.

**note**: inner container should have class **mh-hidden**.

```html
<div id="menu-container">
  <div class="mh-hidden" id="menu-inner-container">
    '...'
  </div>
</div>
```

---

### Submenu

#### submenu toggle

**required**
submenu toggle button element should have data attribute **data-mh-submenu-toggle** and it's value the submenu name ( a unique identifier ).

```html
<button data-mh-submenu-toggle="submenu-a">
  '...'
</button>
```

---

#### submenu list

**required**
submenu list element should have data attribue **data-mh-submenu-list** and it's value the submenu name ( same as the submenu toggle identifier ).

**note** : submenu list element should have class **mh-hidden**.

```html
<ul class="mh-hidden" data-mh-submenu-list="submenu-a">
  '...'
</ul>
```

---

#### submenu container

**optional**
submenu container should have data attribute **data-mh-submenu-container** and it's value the submenu name ( same as the submenu toggle identifier ).

**note**: if present ,submenu container will get `mh-open` class when submenu is opened.

```html
<div data-mh-submenu-container="submenu-a">
  '...'
</div>
```

submenu container is good for situations when you want to do an opening and closing animation to the submenu.

scss example:

```scss
[data-mh-submenu-container] {
  height: auto;
  max-height: 0;
  overflow: hidden;
  transition: 0.3s max-height ease-in-out;
  &.mh-open {
    max-height: 1000px; // just some high number that the submenu height will never get to it.
  }
}
```

---

#### HTML Example

complete example of a menu structure with submenus

```html
<div id="menu-container">
  <div class="mh-hidden" id="menu-inner-container">
    <nav id="menu-focus-enter">
      <ul class="menu">
        <li>
          <button data-mh-submenu-toggle="submenu-a">
            submenu-a trigger button
          </button>

          <div data-mh-submenu-container="submenu-a">
            <ul class="mh-hidden" data-mh-submenu-list="submenu-a">
              <li>
                <button data-mh-submenu-toggle="submenu-a-1">
                  submenu-a-1 trigger button
                </button>

                <div data-mh-submenu-container="submenu-a-1">
                  <ul class="mh-hidden" data-mh-submenu-list="submenu-a-1">
                    '...'
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>

    <button id="menu-close">
      menu toggle button
    </button>
  </div>
</div>
```

---

## Options

### Menu Options

#### name

a unique menu name that will be used for the menu

default: `randomly generated name`  
type: `string`

---

#### container

menu container element that contains inner menu container. [see example](#html-example)

**required**  
type: `css selector`  
**note**: holds nothing, but the inner container.

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: ...,
      open: ...
    }
  }
];
menuHandler.init(menus);
```

---

#### innerContainer

element that holds all menu elements. [see example](#html-example)

**required**
type: `css selector`  
**note**: gets class `mh-hidden` when menu is closed

```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: "#menu-inner-container",
      open: ...
    }
  }
];
menuHandler.init(menus);
```

---

#### open

element that triggers opening of the menu

**required**  
type: `css selector`

```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: ...,
      open: "#menu-toggle-open"
    }
  }
];
menuHandler.init(menus);
```

---

#### close

element that triggers closing of the menu

type: `css selector`  
default: `element.close`  
**note**: required ,if [loop](#loop) is set to `true` for accessibility reasons.

```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: ...,
      open: ...,
      close: "#menu-toggle-close"
    }
  }
];
menuHandler.init(menus);
```

---

#### enterFocus

element to focus first when menu opens, will make any provided element focusable

type: `css selector`  
default: `first focusable element`  
**note**: will be set to display none when menu is closed

```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: ...,
      open: ...,
      enterFocus: "#menu-focus-enter"
    }
  }
];
menuHandler.init(menus);
```

---

#### exitFocus

element to focus after menu closes

type: `css selector`  
default: `elements.open`

```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: ...,
      open: ...,
      exitFocus: "#menu-exit-focus"
    }
  }
];
menuHandler.init(menus);
```

---

#### mobileOpen

element that triggers opening of the menu in [mobileBreakpoint](#mobileBreakpoint).
if both [mobileOpen](#mobileOpen) and [open](#open) are passed ,then [mobileOpen](#mobileOpen) is the one that will trigger open in [mobileBreakpoint](#mobileBreakpoint) and [open](#open) in larger screens.

type: `css selector`  
default: `null`

```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: ...,
      open: ...,
      mobileOpen: "#menu-mobile-toggle-open"
    }
  }
];
menuHandler.init(menus);
```

---

#### mobileClose

element that triggers closing of the menu in [mobileBreakpoint](#mobileBreakpoint).
if both [mobileClose](#mobileClose) and [close](#close) are passed ,then [mobileClose](#mobileClose) is the one that will trigger close in [mobileBreakpoint](#mobileBreakpoint) and [close](#close) in larger screens.

type: `css selector`  
default: `null`  
**note**: [close](#close) is required, if using mobileClose.

```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: ...,
      open: ...,
      close: ...,
      mobileClose: "#menu-mobile-toggle-close"
    }
  }
];
menuHandler.init(menus);
```

---

#### mobileBreakpoint

max width breakpoint to switch between mobile and desktop open and/or close toggles.

type: `string`  
default: `667px`

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    mobileBreakpoint: "991px"
  }
];
menuHandler.init(menus);
```

---

#### loop

loop all elements inside the [innerContainer](#innerContainer) using Tab key for accessibility purposes until a [close button](#close) or ESC key are pressed

type: `boolean`  
default: `false`  
**note**: if [loop](#loop) is `true`, [close](#close) has is required, because a person using tabs will never escape out of the menu and make sure you put the [close](#close) element inside the [innerContainer](#innerContainer)

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open",
      close: "#menu-toggle-close"
    },
    loop: true
  }
];
menuHandler.init(menus);
```

---

#### openDelay

sets delay in miliseconds before menu starts opening

type: `integer`  
default: `0`

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    openDelay: 2000
  }
];
menuHandler.init(menus);
```

---

#### closeDelay

sets delay in miliseconds before menu starts closing

type: `integer`  
default: `0`

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    closeDelay: 1000
  }
];
menuHandler.init(menus);
```

---

#### openOnHover

triggers opening of a menu by mouse enter

type: `boolean`  
default: `false`
**note**: disabled ,if screen view port is less ,than the [mobileBreakpoint](#mobileBreakpoint)

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    openOnHover: true
  }
];
menuHandler.init(menus);
```

---

#### menuFunc

function to handle on your own of the specific menu

type: `function`  
arguments:

- `menu` type: `object`
- `e` type: `event`  
  **note**: on open, close events related to the menu will need to be included in the [custom function](#menuFunc-[menu]) in order for them to work which can be accessed from the menu object

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    menuFunc: function(menu, e) {
      console.log(menu);
    }
  }
];
menuHandler.init(menus);
```

**_default code_**:

```javascript
menuFunc(menu, e) {

   if ( menu.isOpen ) {

      menu.container.setAttribute('aria-expanded', true);
      menu.container.setAttribute('aria-hidden', false);
      menu.innerContainer.classList.remove('mh-hidden');
      menu.enterFocus.focus();

   } else {

      menu.container.setAttribute('aria-expanded', false);
      menu.container.setAttribute('aria-hidden', true);
      menu.innerContainer.classList.add('mh-hidden');

   }
}
```

---

### Submenu Options

#### isEnabled - submenu

enables handling of submenus

type: `boolean`  
default: `false`

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      isEnabled: true
    }
  }
];
menuHandler.init(menus);
```

---

#### openOnHover - submenu

triggers opening of a menu by mouse enter

type: `boolean`  
default: `false`
**note**: disabled ,if screen view port is less ,than the submenu.[mobileBreakpoint](#mobileBreakpoint-[submenu])

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      isEnabled: true,
      openOnHover: true
    }
  }
];
menuHandler.init(menus);
```

---

#### menuFunc - submenu

function to handle submenus on your own the specific menu

type: `function`  
arguments:

- `menu` type: `object`

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      isEnabled: true,
      menuFunc: function(menu, e) {
        console.log(menu);
      }
    }
  }
];
menuHandler.init(menus);
```

**_default code_**:

```javascript
submenuFunc(menu, submenu, e) {

   if ( submenu.toggle.classList.contains('mh-open') ) {

      submenu.list.classList.remove('mh-hidden');
      submenu.list.setAttribute('aria-hidden', false);

      if ( submenu.container ) {
         submenu.container.classList.add('mh-open');
         submenu.container.setAttribute('aria-expanded', true);
      } else {
         submenu.list.classList.add('mh-open');
         submenu.list.setAttribute('aria-expanded', true);
      }

   } else {
      submenu.list.classList.add('mh-hidden');
      submenu.list.setAttribute('aria-hidden', true);

      if ( submenu.container ) {
         submenu.container.classList.remove('mh-open');
         submenu.container.setAttribute('aria-expanded', false);
      } else {
         submenu.list.classList.remove('mh-open');
         submenu.list.setAttribute('aria-expanded', false);
      }

   }
}
```

---

## Events

### Menu Events

#### beforeInit

triggered before the specific menu is initialized

type: `function`  
arguments:

- `menu` type: `object`

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    on: {
      beforeInit: function(menu) {
        console.log(menu);
      }
    }
  }
];
menuHandler.init(menus);
```

---

#### afterInit

triggered after the specific menu is initialized

type: `function`  
arguments:

- `menu` type: `object`

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    on: {
      afterInit: function(menu) {
        console.log(menu);
      }
    }
  }
];
menuHandler.init(menus);
```

---

#### beforeOpen

triggered before the specific menu is opened

type: `function`  
arguments:

- `menu` type: `object`
- `e` type: `event`

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    on: {
      beforeOpen: function(menu, e) {
        console.log(menu);
      }
    }
  }
];
menuHandler.init(menus);
```

---

#### afterOpen

triggered after the specific menu finished transition and is opened

type: `function`  
arguments:

- `menu` type: `object`
- `e` type: `event`

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    on: {
      afterOpen: function(menu, e) {
        console.log(menu);
      }
    }
  }
];
menuHandler.init(menus);
```

---

#### beforeClose

triggered before the specific menu is closed

type: `function`  
arguments:

- `menu` type: `object`
- `e` type: `event`

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    on: {
      beforeClose: function(menu, e) {
        console.log(menu);
      }
    }
  }
];
menuHandler.init(menus);
```

---

#### afterClose

triggered after the specific menu finished transition and is closed

type: `function`  
arguments:

- `menu` type: `object`
- `e` type: `event`

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    on: {
      afterClose: function(menu, e) {
        console.log(menu);
      }
    }
  }
];
menuHandler.init(menus);
```

---

### Submenu Events

#### beforeOpen - submenu

triggered before the specific submenu is opened

type: `function`  
arguments:

- `menu` type: `object`
- `submenu` type: `object`
- `e` type: `event`

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      on: {
        beforeOpen: function(menu, submenu, e) {
          console.log(menu);
        }
      }
    }
  }
];
menuHandler.init(menus);
```

---

#### afterOpen - submenu

triggered after the specific submenu finished transition and is opened

type: `function`  
arguments:

- `menu` type: `object`
- `submenu` type: `object`
- `e` type: `event`

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      on: {
        afterOpen: function(menu, submenu, e) {
          console.log(menu);
        }
      }
    }
  }
];
menuHandler.init(menus);
```

---

#### beforeClose - submenu

triggered before the specific submenu is closed

type: `function`  
arguments:

- `menu` type: `object`
- `submenu` type: `object`
- `e` type: `event`

**note**: e is `null` when the closing action was on the parent.

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      on: {
        beforeClose: function(menu, submenu, e) {
          console.log(menu);
        }
      }
    }
  }
];
menuHandler.init(menus);
```

---

#### afterClose - submenu

triggered after the specific submenu finished transition and is closed

type: `function`  
arguments:

- `menu` type: `object`
- `submenu` type: `object`
- `e` type: `event`

**note**: e is `null` when the closing action was on the parent.

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      on: {
        afterClose: function(menu, submenu, e) {
          console.log(menu);
        }
      }
    }
  }
];
menuHandler.init(menus);
```

---

## API

important menu parameters accessible via menu object

### Menu

#### activeOpen

the active element which triggers opening of the menu

type: `html element`  
default: `elements.open` ,if [mobileOpen](#mobileOpen) is not empty and [mobileBreakpoint](#mobileBreakpoint) query returns true ,then default is [mobileOpen](#mobileOpen).
**note**: use this ,if you need it in the custom function you pass. **don't use elements.open or elements.mobileOpen**

---

#### activeClose

the active element which triggers closing of the menu

type: `html element`  
default: `elements.close` ,if [mobileClose](#mobileClose-[menu]) is not empty and [mobile breakpoint](#mobileBreakpoint-[menu]) query returns true ,then drfault is [mobileClose](#mobileClose).
**note**: use this ,if you need it in the custom function you pass. **don't use elements.close or elements.mobileClose**

---

#### isOpen

Shows the status of a menu at run time

type: `boolean`  
default: `false`

---

#### isMobile

Shows the status of menu mobile state at run time.  
**note**: affected by mobileBreakpoint and viewport width.

type: `boolean`

---

### Submenu

#### isOpen - submenu

Shows the status of a submenu at run time

type: `boolean`  
default: `false`
