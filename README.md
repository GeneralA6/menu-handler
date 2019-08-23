# menu-handler

  ## Description
  
  Menu Handler is a library to handle the dirty javascript work of developing menus, dropdowns, popups. <br>
  All you have to care about is HTML and CSS.
  
  // TODO: not dependencies, vanilla javascript, explorer not supported.

  library functionality:
  
 - open
 - close
 - close on esc press
 - close on blur
 - prevent body scroll when a menu is open
 - prevent body swipe when a menu is open
 - accessiblity
    
*for more functionality and information see Options section*

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
     openOnHover: true,
     loop: true,
     submenu: {
        isEnabled: true,
        openOnHover: true,
        on: {
              afterOpen: function(menu) {
                 console.log('after open', menu);
              },
        }
     },
     on: {
        afterInit: function(menu) {
              console.log('after init', menu);
        },
     },
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
   **[note]** : inner container should have class **mh-hidden**.  



### Submenu

submenu toggle button element should have data attribute **data-mh-submenu-toggle** and it's value a unique identifier for the submenu.  

```html
<button data-mh-submenu-toggle="catalog">
  ...
</button>
```
      
  
submenu list element should have data attribue **data-mh-submenu-list** and it's value the same submenu identifier as the submenu toggle button.  
**note** : submenu list element should have class **mh-hidden**.

```html
<ul class="mh-hidden" data-mh-submenu-list="catalog">
  ...
</ul>
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

              <ul class="mh-hidden" data-mh-submenu-list="submenu-a">
                <li>
                  <button data-mh-submenu-toggle="submenu-a-1">
                    submenu-a-1 trigger button
                  </button>

                  <ul class="mh-hidden" data-mh-submenu-list="submenu-a-1"> 
                    ...
                  </ul>
                </li>
              </ul>
            </li>
        </ul>
        
      </nav>

      <button id="menu-close">
        menu toggle button
      </button>
   </div>
</div>
```  
      

  
## Options
  
### Reference
// TODO menu options
- [name](#name) - a name that will be used for the menu
- [open](#open) - element that triggers opening of the menu
- [close](#close) - element that triggers menu closing of the menu
- [container](#container) - menu container element that contains inner menu container
- [innerContainer](#innerContainer) - element that holds all menu elements
- [enterFocus](#enterFocus) - element to focus first when menu opens, will make any provided element focusable
- [exitFocus](#exitFocus) - element to focus after menu closes  
- [mobileOpen](#mobileOpen) - **TODO: description**
- [mobileClose](#mobileClose) - **TODO: description**
- [mobileBreakpoint](#mobileBreakpoint) - max width breakpoint to to switch open/close toggles
- [loop](#loop) - loop all elements inside the innerContainer using Tab key
- [openDelay](#openDelay) - **TODO: description**
- [closeDelay](#closeDelay) - sets delay in miliseconds before innerContainer is hidden
- [openOnHover](#openOnHover) - triggers opening of a menu by mouse enter
- [menuFunc](#menuFunc) - function to handle on your own of the specific menu

// TODO menu events
- [beforeInit](#beforeInit) - triggered before the specific menu is initialized  
- [afterInit](#afterInit) - triggered after the specific menu is initialized  
- [beforeOpen](#beforeOpen) - triggered before the specific menu is opened
- [afterOpen](#afterOpen) - triggered after the specific menu opened
- [beforeClose](#beforeClose) - triggered before the specific menu is closed    
- [afterClose](#afterClose) - triggered after the specific menu is closed 

// TODO submenu options reference
- [isEnabled](#isEnabled) - enables handling of submenus
- [openOnHover](#openOnHover) - triggers opening of a menu by mouse enter
- [menuFunc](#menuFunc) - function to handle submenus on your own the specific menu

// TODO submenu events
- [beforeOpen](#beforeOpen) - triggered before the specific submenu is opened
- [afterOpen](#afterOpen) - triggered after the specific submenu is opened
- [beforeClose](#beforeClose) - triggered before the specific submenu is closed
- [afterClose](#afterClose) - triggered after the specific submenu is closed

### Menu Options

#### name

a name that will be used for the menu  
  
default: `randomly generated name`  
type: `string`

#### open

element that triggers opening of the menu  
  
**required**  
type: `css selector`

#### close

element that triggers closing of the menu  
  
default:  `element.open`
type: `css selector`  
note: required ,if [loop](#loop) is set to `true`

#### container

menu container element that contains inner menu container  
  
**required**  
type: `css selector`  
note: holds nothing, but the inner container  

#### innerContainer

element that holds all menu elements  
  
**required**
type: `css selector`  
note:  will be set to display none when menu is closed  

#### enterFocus

element to focus first when menu opens, will make any provided element focusable  
  
type: `css selector`  
default: `first focusable element`  
note:  will be set to display none when menu is closed  

#### exitFocus

element to focus after menu closes  
    
type: `css selector`  
default: `elements.open`  

#### mobileOpen

TODO
  
type: `css selector`  
default: `elements.open`  

#### mobileClose

TODO
  
type: `css selector`  
default: `elements.close`  

#### mobileBreakpoint
        
max width breakpoint to to switch open/close toggles  
  
type: `string`  
default: `667px`  

#### loop
        
loop all elements inside the innerContainer using Tab key for accessibility purposes until a close button or ESC key are pressed
  
type: `boolean`  
default: `false`  
note: if [loop](#loop) is `true`, elements.close has is required, because a person using tabs will never escape out of the menu and make sure you put the elements.close element inside the innerContainer

#### openDelay
        
sets delay in miliseconds before menu starts opening
  
type: `integer`  
default: `0` 

#### closeDelay
        
sets delay in miliseconds before menu starts closing
  
type: `integer`  
default: `0` 

#### openOnHover
        
triggers opening of a menu by mouse enter
  
type: `boolean`  
default: `false` 

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

#### openOnHover
        
triggers opening of a menu by mouse enter
  
type: `boolean`  
default: `false` 

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
  
#### afterInit
        
triggered after the specific menu is initialized
  
type: `function`  
arguments:   
  `menu` type: `object` 

#### beforeOpen
        
triggered before the specific menu is opened
  
type: `function`  
arguments:   
  `menu` type: `object`  
  `e` type: `event`
  
#### afterOpen
        
triggered after the specific menu opened
  
type: `function`  
arguments:   
  `menu` type: `object` 
  `e` type: `event`
  
#### beforeClose
        
triggered before the specific menu is closed
  
type: `function`  
arguments:   
  `menu` type: `object` 
  `e` type: `event`
  
#### afterClose
        
triggered after the specific menu closed
  
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
  `submenu` type: `HTML Element` 
  `toggle` type: `HTML Element` 
  `e` type: `event`
  
#### afterOpen
        
triggered after the specific submenu opened
  
type: `function`  
arguments:   
  `menu` type: `object` 
  `submenu` type: `HTML Element` 
  `toggle` type: `HTML Element` 
  `e` type: `event`

#### beforeClose
        
triggered before the specific submenu is closed
  
type: `function`  
arguments:   
  `menu` type: `object` 
  `submenu` type: `HTML Element` 
  `toggle` type: `HTML Element` 
  `e` type: `event`
   
#### afterClose
        
triggered after the specific submenu is closed
  
type: `function`  
arguments:   
  `menu` type: `object` 
  `submenu` type: `HTML Element` 
  `toggle` type: `HTML Element`  
  `e` type: `event`   
        
  
## API

menu important parameters accessed via menu object

#### activeOpen
        
the active element which triggers opening of the menu

type: `read only`  
default: `element.open` ,if element.mobileOpen is not empty and mobile breakpoint query returns true ,then `element.mobileOpen`
note: use this ,if you need it in the custom function you pass. **don't use element.open or element.mobileOpen**
  
#### activeClose
        
the active element which triggers closing of the menu

type: `read only`  
default: `element.open` ,if element.mobileClose is not empty and mobile breakpoint query returns true ,then `element.mobileClose`
note: use this ,if you need it in the custom function you pass. **don't use element.close or element.mobileClose**  
      
#### isOpen
        
Shows the status of a menu at run time

type: `read only`  
default: `element.open` ,if element.mobileClose is not empty and mobile breakpoint query returns true ,then `element.mobileClose` 




