# menu-handler

## Description

Menu Handler is a javascript tool that adds logic and functionality to side menus, dropdowns and popups while emphasizing on accessibility.

es6, no dependencies.  
_internet explorer not supported._

functionality added to the menus by the library:  
- open
- close
- close on esc press
- close on blur
- close all menus on menu open
- close all submenus on submenu open
- close submenus on blur
- close submenus on mouseleave
- prevent body scroll when a menu is open
- accessiblity
- events
- pin menu to keep it open for specific breakpoints and hide at another breakpoint unless opened.
- mobile options
- replacing specific menu's functionality with custom functionality by passing custom function
- and more...

## Table of contents

### Init

- [init](#init---section) - init with array of menu objects

### CSS

- [css](#css---section) - add the following css

### HTML

#### Menu

- [menu container](#container---html) - **required** - element that holds nothing, but the inner container.
- [menu inner container](#inner-container---html) - **required** - element that holds all the menu elements.
- [menu list](#menu-list---html) - **required** - element that holds all the menu items.

#### Submenu

- [submenu toggle](#submenu-toggle---html) - **required** - element to trigger open / close of the submenu list.
- [submenu list](#submenu-list---html) - **required** - element that holds the submenu items.
- [submenu container](#submenu-container---html) - element that wraps the submenu list.

#### Complete example

- [html example](#html-example---html) - a complete example of a menu structure with submenus

### Options

#### Menu Options

- [name](#name) - a unique menu name that will be used for the menu.
- [container](#container) - **required** - menu container element that contains inner menu container.
- [innerContainer](#innerContainer) - **required** - element that holds all menu elements.
- [open](#open) - **required** - element that triggers opening of the menu.
- [close](#close) - element that triggers menu closing of the menu.
- [enterFocus](#enterFocus) - element to focus first when menu opens, will make any provided element focusable.
- [exitFocus](#exitFocus) - element to focus after menu closes.
- [pin](#pin) - pin menu to keep it open at desktop media queries.
- [loop](#loop) - loop all elements inside the innerContainer using Tab key.
- [preventBodyScroll](#preventBodyScroll) - disables the ability to scroll the body.
- [openDelay](#openDelay) - sets delay in miliseconds before menu starts opening.
- [closeDelay](#closeDelay) - sets delay in miliseconds before menu starts closing.
- [debounce](#debounce) - sets debounce treshhold in miliseconds on menu liseteners.
- [openOnMouseEnter](#openOnMouseEnter) - triggers opening of a menu by mouse enter.
- [menuFunc](#menuFunc) - function to handle on your own of the specific menu.
   
#### Menu Mobile Options

- [breakpoint](#breakpoint---mobile) - max width breakpoint to switch between mobile and desktop options.
- [open](#open---mobile) - element that triggers opening of the menu at mobile breakpoint.
- [close](#close---mobile) - element that triggers closing of the menu at mobile breakpoint.
- [enterFocus](#enterFocus---mobile) - element to focus first when menu opens, will make any provided element focusable at mobile breakpoint.
- [exitFocus](#exitFocus---mobile) - element to focus after menu closes at mobile breakpoint.
- [pin](#pin---mobile) - pin menu to keep it open at mobile media breakpoint.
- [preventBodyScroll](#preventBodyScroll) - disables the ability to scroll the body at mobile breakpoint.

#### Submenu Options

- [isEnabled](#isEnabled---submenu) - enables handling of submenus.
- [openOnMouseEnter](#openOnMouseEnter---submenu) - triggers opening of a submenu on mouse enter.
- [closeOnBlur](#closeOnBlur---submenu) - triggers closing of a submenu on blur.   
- [closeOnMouseLeave](#closeOnMouseLeave---submenu) - triggers closing of a submenu on mouseleave. 
- [closeDelay](#closeDelay---submenu) - sets delay in miliseconds before submenu starts closing.
- [closeSubmenusOnOpen](#closeSubmenusOnOpen---submenu) - triggers closing of other submenus on opening of a submenu. 
- [menuFunc](#menuFunc---submenu) - function to handle submenus on your own the specific menu.
   
#### Submenu Mobile Options
   
- [closeOnBlur](#closeOnBlur---submenu---mobile) - triggers closing of a submenu on blur at mobile breakpoint.  
- [closeDelay](#closeDelay---submenu---mobile) - sets delay in miliseconds before submenu starts closing at mobile breakpoint.
- [closeSubmenusOnOpen](#closeSubmenusOnOpen---submenu) - triggers closing of other submenus on opening of a submenu at mobile breakpoint.
   
### Events

#### Menu Events

- [beforeInit](#beforeInit) - triggered before the specific menu is initialized.
- [afterInit](#afterInit) - triggered after the specific menu is initialized.
- [beforeOpen](#beforeOpen) - triggered before the specific menu is opened.
- [afterOpen](#afterOpen) - triggered after the specific menu finished transition and is opened.
- [beforeClose](#beforeClose) - triggered before the specific menu is closed.
- [afterClose](#afterClose) - triggered after the specific menu finished transition and is closed.
- [beforePinOpen](#beforePinOpen) - triggered before the specific menu is pinned.
- [afterPinOpen](#afterPinOpen) - triggered after the specific menu finished transition and is pinned.
- [beforePinClose](#beforePinClose) - triggered before the specific menu is unpinned.
- [afterPinClose](#afterPinClose) - triggered after the specific menu finished transition and is unpinned.

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
- [isPinned](#isPinned) - Shows if menu is pinned at run time
- [isMobile](#isMobile---mobile) - Shows the status of menu mobile state at run time

#### Submenu params

- [isOpen](#isOpen---submenu) - Shows the status of the submenu at run time

## Init - section

init with array of menu objects.

&#10071; **note**: it is possible to initialize menuHandler in several files. it is not creating new instance, but merging the menus in one instance to work with each others.

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

## CSS - section

add the following css:

```css
.mh-hidden {
  display: none !important;
}
```

## HTML - section
   
&#10071; **note**: the aim of the library is purely handle the functionality of side menus, popups and dropdowns. the html and css aspects differ from project to project, so it is something you should do on your side. we give a guideline on a solid html structure that is the minimum required for a valid sidemenu, dropdown and popup to be implemented.
   
### Menu

#### container - html

element that holds nothing, but the inner container.  
  
**required**  

```html
<div id="menu-container">
  <div class="mh-hidden" id="menu-inner-container">
    ...
  </div>
</div>
```

---

#### inner container - html

element that holds all the menu elements.

**required**  
&#10071; **note**: inner container should have class **mh-hidden**.  

```html
<div id="menu-container">
  <div class="mh-hidden" id="menu-inner-container">
    ...
  </div>
</div>
```

---

#### menu list - html

element that holds all the menu items.

**required**  
&#10071; **note**: menu list should have attribute **data-mh-menu-list="true"**.  

```html
<div id="menu-container">
  <div class="mh-hidden" id="menu-inner-container">
    <ul data-mh-menu-list="true">
      ...
    </ul>

    <ul data-mh-menu-list="true">
      ...
    </ul>
  </div>
</div>
```

---

### Submenu

#### submenu toggle - html

element to trigger open / close of the submenu list  
  
**required**  
&#10071; **note**: submenu toggle button element should have data attribute **data-mh-submenu-toggle** and it's value the submenu name ( a unique identifier ).

```html
<button data-mh-submenu-toggle="submenu-a">
  ...
</button>
```

---

#### submenu list - html

element that holds the submenu items  
  
**required**  
&#10071; **note** : submenu list element should have data attribue **data-mh-submenu-list** and it's value the submenu name ( same as the submenu toggle identifier ).  
&#10071; **note** : submenu list element should have class **mh-hidden**.

```html
<ul class="mh-hidden" data-mh-submenu-list="submenu-a">
  ...
</ul>
```

---

#### submenu container - html

element that wraps the submenu list.  
  
**optional**  
&#10071; **note** : submenu container should have data attribute **data-mh-submenu-container** and it's value the submenu name ( same as the submenu toggle identifier ).  
&#10071; **note**: if present ,submenu container will get `mh-open` class when submenu is opened.

```html
<div data-mh-submenu-container="submenu-a">
  ...
</div>
```

&#10071; submenu container is handy for situations when you want to do an opening and closing animation for the submenu.  

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

#### HTML Example - html

complete example of a menu structure with submenus

```html
<div id="menu-container" aria-hidden="true">
  <div class="mh-hidden" id="menu-inner-container">
    <nav id="menu-enter-focus">
      <ul class="menu" data-mh-menu-list="true">
        <li>
          <button data-mh-submenu-toggle="submenu-a" aria-expanded="false" aria-controls="mh-submenu-submenu-a" title="">
            submenu-a trigger button
          </button>

          <div data-mh-submenu-container="submenu-a">
            <ul id="mh-submenu-submenu-a" class="mh-hidden" data-mh-submenu-list="submenu-a" aria-hidden="true">
              <li>
                <button data-mh-submenu-toggle="submenu-a-1" aria-expanded="false" aria-controls="mh-submenu-submenu-a-1" title="">
                  submenu-a-1 trigger button
                </button>

                <div data-mh-submenu-container="submenu-a-1">
                  <ul id="mh-submenu-submenu-a-1" class="mh-hidden" data-mh-submenu-list="submenu-a-1" aria-hidden="true">
                    ...
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>

    <button id="menu-close" aria-controls="menu-container" aria-expanded="false" title="">
      menu toggle button
    </button>
  </div>
</div>
```

---

## Options - section

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
&#10071; **note**: holds nothing, but the inner container.

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
&#10071; **note**: gets class `mh-hidden` when menu is closed

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
&#10071; **note**: required ,if [loop](#loop) is set to `true` for accessibility reasons.

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

```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: ...,
      open: ...,
      enterFocus: "#menu-enter-focus"
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

#### pin

pin menu to keep it open at desktop media queries.
a
  
type: `css selector`  
default: `false`   
&#10071; **note**: adds class `mh-pinned` to [elements.container](#container) when menu is pinned.   
&#10071; **note**: if [pin](#pin) is set to `true` ,then the following functionalities of the menu are disabled: [open](#open), [close](#close).   
&#10071; **note**: adds class `mh-hidden` to menu toggle buttons ([elements.open](#open),[elements.close](#close),[elements.mobile.open](#open---mobile),[elements.mobile.close](#close---mobile)) when menu is pinned.    
&#10071; **note**: blur and ESC press events won't close a pinned menu, but will close all submenus.   

```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: ...,
      open: ...,
    },
    pin: true
  }
];
menuHandler.init(menus);
```
   
---

#### loop

loop all elements inside the [elements.innerContainer](#innerContainer) using Tab key for accessibility purposes until a [elements.close](#close) or ESC key are pressed  

type: `boolean`  
default: `false`  
&#10071; **note**: if [loop](#loop) is `true`, [elements.close](#close) has is `required`, because a person using tabs will never escape out of the menu and make sure you put the [elements.close](#close) element inside the [elements.innerContainer](#innerContainer)

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

#### preventBodyScroll
   
disables the ability to scroll the body.   
   
type: `boolean`  
default: `true`  

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open",
    },
    preventBodyScroll: false, // to disable the feature
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

#### debounce

sets debounce treshhold in miliseconds on menu liseteners.

type: `integer`  
default: `20`
&#10071; **note**: to disable debounce set value to `0` (not recommended).

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    debounce: 30
  }
];
menuHandler.init(menus);
```

---

#### openOnMouseEnter

triggers opening of a menu on mouse enter  

type: `boolean`  
default: `false`  
&#10071; **note**: disabled ,if screen viewport is less ,than [mobile.breakpoint](#breakpoint---mobile).  

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    openOnMouseEnter: true
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
  &#10071; **note**: on open, close events related to the menu will need to be included in the [custom function](#menuFunc) in order for them to work which can be accessed from the menu object

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

&#10071; **note**: default code  

```javascript
function(menu, e) {
   if (menu.isOpen) {

      menu.open.setAttribute('aria-expanded', true);
      if (menu.mobile.open) menu.mobile.open.setAttribute('aria-expanded', true);

      menu.container.setAttribute('aria-hidden', false);
      menu.innerContainer.classList.remove('mh-hidden');
      
      menu.activeEnterFocus.focus();
   } else {

      menu.open.setAttribute('aria-expanded', false);
      if (menu.mobile.open) menu.mobile.open.setAttribute('aria-expanded', false);

      menu.container.setAttribute('aria-hidden', true);
      menu.innerContainer.classList.add('mh-hidden');

   }
}
```
   
### Menu Mobile Options
   
---

#### breakpoint - mobile

max width breakpoint to switch between mobile and desktop options.    

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
    mobile: {
      breakpoint: "991px"
    }
  }
];
menuHandler.init(menus);
``` 
---   

#### open - mobile   
   
element that triggers opening of the menu at [mobile.breakpoint](#breakpoint---mobile).  
  
type: `css selector`  
default: `elements.open`  
&#10071; **note**: if [pin](#pin) is set to `true` at desktop media queries ,then you don't need to pass this selector ,just pass [open](#open).   
&#10071; **note**: if both [mobile.elements.open](#open---mobile) and [open](#open) are passed ,then [mobile.elements.open](#open---mobile) is the one that will trigger open in [mobile.breakpoint](#breakpoint---mobile) and [open](#open) in larger media queries.

```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: ...,
      open: ...,
    },
    mobile: {
      elements: {
        open: "#menu-mobile-toggle-open"
      }
    }
  }
];
menuHandler.init(menus);
```

---

#### close - mobile   
   
element that triggers closing of the menu at [mobile.breakpoint](#breakpoint---mobile).  

type: `css selector`  
default: `elements.close`  
&#10071; **note**: [close](#close) is required, if using [mobile.close](#close---mobile).   
&#10071; **note**: if both [mobile.elements.close](#close---mobile) and [close](#close) are passed ,then [mobile.elements.close](#close---mobile) is the one that will trigger close in [mobile.breakpoint](#breakpoint---mobile) and [close](#close) in larger media queries.

```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: ...,
      open: ...,
      close: ...,
    },
    mobile: {
      elements: {
        close: "#menu-mobile-toggle-close"
      }
    }
  }
];
menuHandler.init(menus);
```  
   
---

#### enterFocus - mobile

element to focus first when menu opens, will make any provided element focusable at [mobile.breakpoint](#breakpoint---mobile).   
  
type: `css selector`  
default: `elements.enterFocus`   
&#10071; **note**: if both [mobile.elements.enterFocus](#enterFocus---mobile) and [enterFocus](#enterFocus) are passed ,then [mobile.elements.enterFocus](#enterFocus---mobile) is the one that will get focused in [mobile.breakpoint](#breakpoint---mobile) and [close](#close) in larger media queries.   
   
```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: ...,
      open: ...,
    },
    mobile: {
      elements: {
        enterFocus: "#menu-enter-focus"
      }
    }
  }
];
menuHandler.init(menus);
```

---

#### exitFocus - mobile

element to focus after menu closes at [mobile.breakpoint](#breakpoint---mobile).
  
type: `css selector`  
default: `elements.exitFocus`   
&#10071; **note**: if both [mobile.elements.exitFocus](#exitFocus---mobile) and [exitFocus](#exitFocus) are passed ,then [mobile.elements.exitFocus](#exitFocus---mobile) is the one that will get focused in [mobile.breakpoint](#breakpoint---mobile) and [close](#close) in larger media queries.  

```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: ...,
      open: ...,
    },
    mobile: {
      elements: {
        exitFocus: "#menu-exit-focus"
      }
    }
  }
];
menuHandler.init(menus);
```
   
---

#### pin - mobile

pin menu to keep it open at [mobile.breakpoint](#breakpoint---mobile).
  
type: `css selector`  
default: `false`  
&#10071; **note**: adds class `mh-pinned` to [elements.container](#container) when menu is pinned.    
&#10071; **note**: if [mobile.pin](#pin--mobile) is set to `true` ,then the following functionalities of the menu are disabled: [open](#open), [close](#close).  
&#10071; **note**: adds class `mh-hidden` to menu toggle buttons ([elements.open](#open),[elements.close](#close),[elements.mobile.open](#open---mobile),[elements.mobile.close](#close---mobile)) when menu is pinned.   
&#10071; **note**: blur and ESC press events won't close a pinned menu, but will close all submenus.    

```javascript
const menus = [
  {
    elements: {
      container: ...,
      innerContainer: ...,
      open: ...,
    },
    mobile: {
      pin: true,
    }
  }
];
menuHandler.init(menus);
```
   
---   
   
#### preventBodyScroll - mobile
   
disables the ability to scroll the body at [mobile.breakpoint](#breakpoint---mobile).    
   
type: `boolean`  
default: `true`  

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open",
    },
    mobile: {
      preventBodyScroll: false, // to disable the feature
    },
  }
];
menuHandler.init(menus);
```
   
---


### Submenu Options
   
#### isEnabled - submenu

enables handling of submenus  
   
type: `boolean`  
default: `true`
   
```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      isEnabled: false // to disable submenus
    }
  }
];
menuHandler.init(menus);
```
   
---
   
#### openOnMouseEnter - submenu

triggers opening of a submenu on mouse enter  

type: `boolean`  
default: `false`  
&#10071; **note**: disabled at mobile viewport (if screen viewport is less ,than [mobile.breakpoint](#breakpoint---mobile)).   
&#10071; **note**: to disable openOnMouseEnter of a specific submenu ,just add `data-mh-mouseenter-disabled="true"` attribute to the submenu toggle.  

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      openOnMouseEnter: true 
    }
  }
];
menuHandler.init(menus);
```
   
---

#### closeOnBlur - submenu

triggers closing of a submenu on blur.

type: `boolean`  
default: `true`   

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      closeOnBlur: false, // to disable
    }
  }
];
menuHandler.init(menus);
```
   
---
   
#### closeOnMouseLeave - submenu

triggers closing of a submenu on mouseleave of the submenu [toggle button](#submenu-toggle), [submenu container](#submenu-container) or [submenu list](#submenu-list).

type: `boolean`  
default: `false`   
&#10071; **note**: disabled at mobile viewport (if screen viewport is less ,than [mobile.breakpoint](#breakpoint---mobile)).  
&#10071; **note**: to disable closeOnMouseLeave of a specific submenu ,just add `data-mh-mouseleave-disabled="true"` attribute to the submenu toggle.  
   
```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      openOnMouseEnter: true, // suggested to use it in par with closeOnMouseLeave for a good user experience.
      closeOnMouseLeave: true,
    }
  }
];
menuHandler.init(menus);
```
   
---   
   
#### closeDelay - submenu

sets delay in miliseconds before submenu starts closing.

type: `integer`  
default: `0`   
&#10071; **note**: if used with [submenuOptions.closeOnMouseLeave](#submenuOptions.closeOnMouseLeave) it will give a timeout window for the user to return back with the pointer into the [toggle button](#submenu-toggle), [submenu container](#submenu-container) or [submenu list](#submenu-list) and it will cancel the closing action.
   
```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      openOnMouseEnter: true, // suggested to use it in par with closeOnMouseLeave for a good user experience.
      closeOnMouseLeave: true,
      closeDelay: 700,
    }
  }
];
menuHandler.init(menus);
```
   
--- 
   
#### closeSubmenusOnOpen - submenu

triggers closing of other submenus on opening of a submenu.

type: `boolean`  
default: `true`   
   
```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      closeSubmenusOnOpen: false, // to keep submenus open
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
      menuFunc: function(menu, e) {
        console.log(menu);
      }
    }
  }
];
menuHandler.init(menus);
```

&#10071; **note**: default code  

```javascript
function(menu, submenu, e) {

   if (submenu.toggle.classList.contains('mh-open')) {

      submenu.list.classList.remove('mh-hidden');
      submenu.list.setAttribute('aria-hidden', false);
      submenu.toggle.setAttribute('aria-expanded', true);

      if (submenu.container) {
         submenu.container.classList.add('mh-open');
      } else {
         submenu.list.classList.add('mh-open');
      }

   } else {

      submenu.list.classList.add('mh-hidden');
      submenu.list.setAttribute('aria-hidden', true);
      submenu.toggle.setAttribute('aria-expanded', false);

      if (submenu.container) {
         submenu.container.classList.remove('mh-open');
      } else {
         submenu.list.classList.remove('mh-open');
      }

   }
}
```
      
---
   
### Submenu Mobile Options
   
#### closeOnBlur - submenu - mobile

triggers closing of a submenu on blur at mobile [mobile.breakpoint](#breakpoint---mobile).

type: `boolean`  
default: `true`   

```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open",
    },
    submenuOptions: {
      mobile: {
        closeOnBlur: false, // to disable
      }
    }
  }
];
menuHandler.init(menus);
```

---
   
#### closeDelay - submenu - mobile

sets delay in miliseconds before submenu starts closing at mobile [mobile.breakpoint](#breakpoint---mobile).

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
    submenuOptions: {
      openOnMouseEnter: true, // suggested to use it in par with closeOnMouseLeave for a good user experience.
      closeOnMouseLeave: true,
      mobile: {
        closeDelay: 700,
      }
    }
  }
];
menuHandler.init(menus);
```
   
---
   
#### closeSubmenusOnOpen - submenu - mobile

triggers closing of other submenus on opening of a submenu at mobile [mobile.breakpoint](#breakpoint---mobile).

type: `boolean`  
default: `true`  
   
```javascript
const menus = [
  {
    elements: {
      container: "#menu-container",
      innerContainer: "#menu-inner-container",
      open: "#menu-toggle-open"
    },
    submenuOptions: {
      mobile: {
        closeSubmenusOnOpen: false, // to keep submenus open
      }
    }
  }
];
menuHandler.init(menus);
```
   
---

## Events - section

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

#### beforePinOpen

triggered before the specific menu is pinned  

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
      beforePinOpen: function(menu) {
        console.log(menu);
      }
    }
  }
];
menuHandler.init(menus);
```
   
---
   
#### afterPinOpen

triggered after the specific menu finished transition and is pinned  

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
      afterPinOpen: function(menu) {
        console.log(menu);
      }
    }
  }
];
menuHandler.init(menus); 
```
   
---
     
#### beforePinClose

triggered before the specific menu is unpinned.

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
      beforePinClose: function(menu) {
        console.log(menu);
      }
    }
  }
];
menuHandler.init(menus);
```
   
---
   
#### afterPinClose

triggered after the specific menu is finished transition and is unpinned.

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
      afterPinClose: function(menu) {
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

&#10071; **note**: e is `null` when the closing action was on the parent.

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

&#10071; **note**: e is `null` when the closing action was on the parent.

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

## API - section

important menu parameters accessible via menu object  

### Menu

#### activeOpen

the active element which triggers opening of the menu

type: `html element`  
default: `elements.open` ,if [mobile.open](#open---mobile) is not empty and [mobile.breakpoint](#breakpoint---mobile) query returns true ,then default is [mobile.open](#open---mobile).
&#10071; **note**: use this ,if you need it in the custom function you pass. **don't use [elements.open](#open) or [mobile.elements.open](#open---mobile)**

---

#### activeClose

the active element which triggers closing of the menu  

type: `html element`  
default: `elements.close` ,if [mobile.elements.close](#close---mobile) is not empty and [mobile.breakpoint](#breakpoint---mobile) query returns true ,then default is [mobile.elements.close](#close---mobile).   

&#10071; **note**: use this ,if you need it in the custom function you pass. **don't use [elements.close](#close) or [mobile.elements.close](#close---mobile)**

---

#### isOpen

Shows the status of a menu at run time   

type: `boolean`  
default: `false`   
   
&#10071; **note**: when menu isOpened a class `mh-<<menu name>>-open` is added to the body.
   
---   
   
#### isPinned

Shows if menu is pinned at run time   

type: `boolean`  
default: `false`   
   
&#10071; **note**: when menu isPinned a class `mh-pinned` is added to [elements.container](#container).   
&#10071; **note**: when menu isPinned a class  class `mh-hidden` is added to menu toggle buttons ([elements.open](#open),[elements.close](#close),[elements.mobile.open](#open---mobile),[elements.mobile.close](#close---mobile)).   
   
---   

#### isMobile - mobile

Shows the status of menu mobile state at run time.  
   
type: `boolean`   
   
&#10071; **note**: affected by [mobile.breakpoint](#breakpoint---mobile) and viewport width.

---   

### Submenu

#### isOpen - submenu

Shows the status of a submenu at run time   

type: `boolean`  
default: `false`   
   
&#10071; **note**: when submenu isOpen a class `mh-open` is added to [data-mh-submenu-toggle](#submenu-toggle) and [data-mh-submenu-list](#submenu-list).   
&#10071; **note**: if [data-mh-submenu-container](#submenu-container) is being used to contain the [data-mh-submenu-list](#submenu-list) ,then [data-mh-submenu-container](#submenu-container) will have `mh-open` instead of [data-mh-submenu-list](#submenu-list).   
