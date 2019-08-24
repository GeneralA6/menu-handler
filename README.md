# menu-handler

## Description

Menu Handler is a library to handle the dirty javascript work of developing menus, dropdowns, popups.  
All you have to care about is HTML and CSS.

es6, no dependencies.  
*internet explorer not supported.*  

library functionality:
  
 - open
 - close
 - close on esc press
 - close on blur
 - prevent body scroll when a menu is open
 - prevent body swipe when a menu is open
 - accessiblity
    
for more functionality and information see [table of contents section](#Table-of-contents)

## Init

```javascript
const menus = [
  {
     elements: {
        open:           '#menu-open',
        close:          '#menu-close',
        enterFocus:     '#menu-focus-enter',
        container:      '#menu-wrap',
        innerContainer: '#menu-inner-wrap',
     },
     loop: true,
  },
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

## HTML Structure
  
### Menu
  
The following menu structure is required:

1. **container** element that holds nothing, but the inner container.  
2. **inner container** element that holds all the elements.  
   **[note]**: inner container should have class **mh-hidden**.  



### Submenu

submenu toggle button element should have data attribute **data-mh-submenu-toggle** and it's value the submenu name ( a unique identifier ).  

```html
<button data-mh-submenu-toggle="catalog">
  ...
</button>
```
  
submenu list element should have data attribue **data-mh-submenu-list** and it's value the submenu name ( same as the submenu toggle identifier ).  
**note** : submenu list element should have class **mh-hidden**.

```html
<ul class="mh-hidden" data-mh-submenu-list="catalog">
  ...
</ul>
```

**optional**
submenu container should have data attribute **data-mh-submenu-container** and it's value the submenu name ( same as the submenu toggle identifier ). 
**[note]**: if present ,submenu container will get `mh-open` class when submenu is opened. 
  
submenu container is good for situations when you want to do an opening and closing animation to the submenu.
  
example:  

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


### HTML Example

```html
<div id="menu-wrap"> 
  <div class="mh-hidden" id="menu-inner-wrap">
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
                      ...
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



## Table of contents

### Options

#### Menu Options
- [name](#name) - a unique menu name that will be used for the menu.
- [container](#container) - menu container element that contains inner menu container.
- [innerContainer](#innerContainer) - element that holds all menu elements.
- [open](#open) - element that triggers opening of the menu.
- [close](#close) - element that triggers menu closing of the menu.
- [enterFocus](#enterFocus) - element to focus first when menu opens, will make any provided element focusable.
- [exitFocus](#exitFocus) - element to focus after menu closes.
- [mobileOpen](#mobileOpen) - element that triggers opening of the menu in mobile breakpoint.
- [mobileClose](#mobileClose) - element that triggers closing of the menu in mobile breakpoint.
- [mobileBreakpoint](#mobileBreakpoint) - max width breakpoint to switch between mobile and desktop open and/or close toggles.
- [loop](#loop) - loop all elements inside the innerContainer using Tab key.
- [openDelay](#openDelay) - sets delay in miliseconds before menu starts opening.
- [closeDelay](#closeDelay) - sets delay in miliseconds before menu starts closing.
- [openOnHover](#openOnHover) - triggers opening of a menu by mouse enter.
- [menuFunc](#menuFunc) - function to handle on your own of the specific menu.

#### Submenu Options
- [isEnabled](#isEnabled) - enables handling of submenus.
- [openOnHover](#openOnHover) - triggers opening of a menu by mouse enter.
- [menuFunc](#menuFunc) - function to handle submenus on your own the specific menu.

### Events

#### Menu Events
- [beforeInit](#beforeInit) - triggered before the specific menu is initialized.
- [afterInit](#afterInit) - triggered after the specific menu is initialized.
- [beforeOpen](#beforeOpen) - triggered before the specific menu is opened.
- [afterOpen](#afterOpen) - triggered after the specific menu finished transition and is opened
- [beforeClose](#beforeClose) - triggered before the specific menu is closed.   
- [afterClose](#afterClose) - triggered after the specific menu finished transition and is closed

#### Submenu Events
- [beforeOpen](#beforeOpen) - triggered before the specific submenu is opened.
- [afterOpen](#afterOpen) - triggered after the specific submenu finished transition and is opened
- [beforeClose](#beforeClose) - triggered before the specific submenu is closed.
- [afterClose](#afterClose) - triggered after the specific submenu finished transition and is closed



## Options

### Menu Options

#### name

a unique menu name that will be used for the menu  
  
default: `randomly generated name`  
type: `string`

___

#### container

menu container element that contains inner menu container  

**required**  
type: `css selector`  
note: holds nothing, but the inner container  

___

#### innerContainer

element that holds all menu elements  

**required**
type: `css selector`  
note:  get class `mh-hidden` when menu is closed 

___

#### open

element that triggers opening of the menu  
  
**required**  
type: `css selector`

___

#### close

element that triggers closing of the menu  
  
default:  `element.open`
type: `css selector`  
note: required ,if [loop](#loop) is set to `true`

___

#### enterFocus

element to focus first when menu opens, will make any provided element focusable  
  
type: `css selector`  
default: `first focusable element`  
note:  will be set to display none when menu is closed 

___

#### exitFocus

element to focus after menu closes  
    
type: `css selector`  
default: `elements.open`  

___

#### mobileOpen

element that triggers opening of the menu in mobile breakpoint.
if both element.mobileOpen and element.open are passed ,then element.mobileOpen is the one that will trigger open in mobile breakpoint and element.open in larger screens.
  
type: `css selector`  
default: `null`  

___

#### mobileClose

element that triggers closing of the menu in mobile breakpoint.
if both element.mobileClose and element.close are passed ,then element.mobileClose is the one that will trigger close in mobile breakpoint and element.close in larger screens.
  
type: `css selector`  
default: `element.`  

___

#### mobileBreakpoint
        
max width breakpoint to switch between mobile and desktop open and/or close toggles.  
  
type: `string`  
default: `667px`  

___

#### loop
        
loop all elements inside the innerContainer using Tab key for accessibility purposes until a close button or ESC key are pressed
  
type: `boolean`  
default: `false`  
note: if [loop](#loop) is `true`, elements.close has is required, because a person using tabs will never escape out of the menu and make sure you put the elements.close element inside the innerContainer

___

#### openDelay
        
sets delay in miliseconds before menu starts opening
  
type: `integer`  
default: `0` 

___

#### closeDelay
        
sets delay in miliseconds before menu starts closing
  
type: `integer`  
default: `0` 

___

#### openOnHover
        
triggers opening of a menu by mouse enter
  
type: `boolean`  
default: `false` 

___

#### menuFunc
        
function to handle on your own of the specific menu
  
type: `function`  
arguments:   
  `menu` type: `object`  
  `e` type: `event`  
note: on open, close events related to the menu will need to be included in the custom function in order for them to work which can be access from the menu object


### Submenu Options

#### isEnabled
        
enables handling of submenus
  
type: `boolean`  
default: `false` 

___

#### openOnHover
        
triggers opening of a menu by mouse enter
  
type: `boolean`  
default: `false` 

___

#### menuFunc
        
function to handle submenus on your own the specific menu
  
type: `function`  
arguments:   
  `menu` type: `object`  
 


## Events

### Menu Events

#### beforeInit
        
triggered before the specific menu is initialized  
  
type: `function`  
arguments:   
  `menu` type: `object`  
  
___

#### afterInit
        
triggered after the specific menu is initialized
  
type: `function`  
arguments:   
  `menu` type: `object` 

___

#### beforeOpen
        
triggered before the specific menu is opened
  
type: `function`  
arguments:   
  `menu` type: `object`  
  `e` type: `event`
  
___

#### afterOpen
        
triggered after the specific menu finished transition and is opened
  
type: `function`  
arguments:   
  `menu` type: `object` 
  `e` type: `event`
  
___

#### beforeClose
        
triggered before the specific menu is closed
  
type: `function`  
arguments:   
  `menu` type: `object` 
  `e` type: `event`
  
___

#### afterClose
        
triggered after the specific menu finished transition and is closed
  
type: `function`  
arguments:   
  `menu` type: `object` 
  `e` type: `event`


### Submenu Events

#### beforeOpen
        
triggered before the specific submenu is opened
  
type: `function`  
arguments:   
  `menu` type: `object` 
  `submenu` type: `object` 
  `e` type: `event`

___

#### afterOpen
        
triggered after the specific submenu finished transition and is opened
  
type: `function`  
arguments:   
  `menu` type: `object` 
  `submenu` type: `object` 
  `e` type: `event`

___

#### beforeClose
        
triggered before the specific submenu is closed
  
type: `function`  
arguments:   
  `menu` type: `object` 
  `submenu` type: `object` 
  `e` type: `event`

___

#### afterClose
        
triggered after the specific submenu finished transition and is closed
  
type: `function`  
arguments:   
  `menu` type: `object` 
  `submenu` type: `object`  
  `e` type: `event`   
        
  

## API

important menu parameters accessible via menu object

### Menu

#### activeOpen
        
the active element which triggers opening of the menu

type: `read only`  
default: `element.open` ,if element.mobileOpen is not empty and mobile breakpoint query returns true ,then `element.mobileOpen`
note: use this ,if you need it in the custom function you pass. **don't use element.open or element.mobileOpen**

___

#### activeClose
        
the active element which triggers closing of the menu

type: `read only`  
default: `element.open` ,if element.mobileClose is not empty and mobile breakpoint query returns true ,then `element.mobileClose`
note: use this ,if you need it in the custom function you pass. **don't use element.close or element.mobileClose**  

___
   
#### isOpen
        
Shows the status of a menu at run time

type: `read only`  
default: `element.open` ,if element.mobileClose is not empty and mobile breakpoint query returns true ,then `element.mobileClose` 

### Submenu




