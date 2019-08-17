# menu-handler

<section>
  <h2>Description</h2>
  
  <h3>a library to handle the dirty work of developing menus, dropdowns, popups for you</h3>
  
  <p> library functionality: </p>
  <ul>
    <li>open</li>
    <li>close</li>
    <li>close on esc press</li>
    <li>close on blur</li>
    <li>prevent body scroll when a menu is open</li>
    <li>prevent body swipe when a menu is open</li>
    <li>accessiblity</li>
  </ul>
  <p>for more functionality and information see Options section</p>
</section>


<section>
  <h2>HTML Structure</h2>
  
  <p>Example of a menu</p>

  <div>
  
      <div class="menu-wrap" id="menu-wrap"> 
         <div class="menu-inner-wrap mh-hidden" id="menu-inner-wrap">
            <nav class="nav" id="menu-focus-enter">

               <ul class="menu">

                  <li>
                    <button class="button" title="some title" data-mh-submenu-toggle="menu-a">
                      <span>submenu trigger button</span>
                      <svg aria-hidden="true" role="presentation"><use xlink:href="#svg-plus"></use></svg>
                    </button>

                    <ul class="sub-menu mh-hidden" aria-label="hidden" aria-expanded="false" data-mh-submenu-list="menu-a">

                      <li>
                        <button class="button sub-link" title="some title" data-mh-submenu-toggle="menu-b">
                          submenu trigger button
                          <svg aria-hidden="true" role="presentation"><use xlink:href="#svg-plus"></use></svg>
                        </button>

                        <ul class="sub-menu mh-hidden" aria-label="hidden" aria-expanded="false" data-mh-submenu-list="menu-b>

                          <li>
                            <a class="sub-link" href="#" title="some title">link</a>
                          </li>

                        </ul>
                      </li>

                    </ul>
                  </li>

               </ul>

            </nav>

            <button class="button menu-close" id="menu-close" title="some title">
               <svg aria-hidden="true" role="presentation"><use xlink:href="#svg-close"></use></svg>
            </button>
         </div>
      </div>
  
  </div>
  
  <h3>menu</h3> 
  <div>
    <p>
      <strong>the following menu structure is required:<br></strong>
      <strong>container</strong> element that holds nothing, but the inner container.<br>
      <strong>inner container</strong> element that holds all the elements.<br>
      <strong>[note]</strong> : inner container should have class <strong>mh-hidden</strong>.
    </p>
  </div>
  
  <h3>submenu</h3>
  
  <p>
    submenu toggle button element should have data attribute <strong>data-mh-submenu-toggle</strong> and it's value a unique identifier for the submenu.
  </p>
  
  <strong>[example]</strong> :
  
      <button data-mh-submenu-toggle="catalog">
        ...
      </button>
      
  <p>
    submenu list element should have data attribue <strong>data-mh-submenu-list</strong> and it's value the same submenu identifier as the submenu toggle button.<br>
    <strong>[note]</strong> : submenu list element should have class <strong>mh-hidden</strong>.
  </p>
  
  <strong>[example]</strong> : 

      <ul class="mh-hidden" data-mh-submenu-list="catalog">
        ...
      </ul>
  
</section>


<section>
  <h2>Init Example</h2>
  
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
                    beforeOpen: function(menu) {
                       console.log('before open', menu);
                    },
                    afterOpen: function(menu) {
                       console.log('after open', menu);
                    },
                    beforeClose: function(menu) {
                       console.log('before close', menu);
                    },
                    afterClose: function(menu) {
                       console.log('after close', menu);
                    },
              }
           },
           on: {
              beforeInit: function(menu) {
                    console.log('before init', menu);
              },
              afterInit: function(menu) {
                    console.log('after init', menu);
              },
              beforeOpen: function(menu) {
                    console.log('before open', menu);
              },
              afterOpen: function(menu) {
                    console.log('after open', menu);
              },
              beforeClose: function(menu) {
                    console.log('before close', menu);
              },
              afterClose: function(menu) {
                    console.log('after close', menu);
              },
           },
        },
      ];
      menuHandler.init(menus);

</section>
      
<section>
  
  <h2>Options</h2>
  
  <ul>
    <li>
      <strong>name</strong> - (String) <strong>[optional]</strong> a name that will be used for the menu.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : randomly generated name.
    </li>
    <br>
    <li>
      <strong>elements</strong> - (Object) containing the following options:
      <ul>
        <li>
          <strong>open</strong> - (HTML Element) <strong>[required]</strong> triggers opening of the menu.
        </li>
        <br>
        </li>
          <strong>close</strong> - (HTML Element) <strong>[optional]</strong> triggers closing of the menu.<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : element.open<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[note]</strong> : required ,if loop is set to true.
        </li>
        <br>
        <li>
          <strong>container</strong> - (HTML Element) <strong>[required]</strong> menu container element that contains inner menu container.
        </li>
        <br>
        <li>
          <strong>innerContainer</strong> - (HTMLElHTML Element) <strong>[required]</strong> menu inner container element:<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[note]</strong> : element that holds all menu elements <br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[note]</strong> : will be set to display none when menu is closed.
        </li>
        <br>
        <li>
          <strong>enterFocus</strong> - (HTML Element) <strong>[optional]</strong> element to focus first when menu opens, will make any provided element focusable<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : first focusable element.
        </li>
        <br>
        <li>
          <strong>exitFocus</strong> - (HTML Element) <strong>[optional]</strong> element to focus after menu closes.<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : elements.open
        </li>
        <br>
        <li>
          <strong>mobileOpen</strong> - (HTML Element) <strong>[optional]</strong><br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : elements.open
        </li>
        <br>
        <li>
          <strong>mobileClose</strong> - (HTML Element) <strong>[optional]</strong><br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : element.close
        </li>
        <br>
        <li>
          <strong>activeOpen</strong> - (HTML Element) <strong>[read only]</strong><br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : element.open ,if element.mobileOpen is passed and isMobile is true, then element.mobileOpen<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[note]</strong> : use this ,if you need it in the custom function you pass. don't use element.open or element.mobileOpen
        </li>
        <br>
        <li>
          <strong>activeClose</strong> - (HTML Element) <strong>[read only]</strong><br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : element.close<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[note]</strong> : use this ,if you need it in the custom function you pass. don't use element.close or element.mobileOpen
        </li>
      </ul>
    </li>
    <br>
    <li>
      <strong>isOpen</strong> - (Boolean) <strong>[read only]</strong> Shows the status of a menu at run time.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<strong>[note]</strong> : internal use
    </li>
    <br>
    <li>
      <strong>mobileBreakpoint</strong> - (String) <strong>[optional]</strong> a max width beakpoint for mobile triggers, if exist.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : 667px
    </li>
    <br>
    <li>
      <strong>loop</strong> - (Boolean) <strong>[optional]</strong> will loop all elements inside the innerContainer while using Tab for accessibility purposes until a close button is pressed.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : false<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<strong>[note]</strong> : if loop is true, elements.close has to be passed, because a person using tabs will never escape out of the menu and make sure you put the elements.close element inside the innerContainer.
    </li>
    <br>
    <li>
      <strong>closeDelay</strong> - (Integer) <strong>[optional]</strong> sets delay in miliseconds before innerContainer is hidden.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : 0
    </li>
    <br>
    <li>
      <strong>openOnHover</strong> - (Boolean) <strong>[optional]</strong> triggers opening of a menu by mouse enter<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : false
    </li>
    <br>
    <li>
    <strong>menuFunc</strong> - (Function) <strong>[optional]</strong> function to handle on your own of the specific menu.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<strong>[arguments]</strong> : menu (Object), e (Event)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<strong>[note]</strong> : on open, close events related to the menu will need to be included in the custom function in order for them to work which can be access from the menu object.
    </li>
    <br>
    <li>
      <strong>on</strong> - (Object) containing the following events options:<br>
      <ul>
        <li>
         <strong>beforeInit</strong> - (Function) <strong>[optional]</strong> triggered before the specific menu is initialized.<br>
         &nbsp;&nbsp;&nbsp;&nbsp;<strong>[arguments]</strong> : menu (Object)
        </li>
        <br>
        <li>
          <strong>afterInit</strong> - (Function) <strong>[optional]</strong> triggered after the specific menu is initialized.<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[arguments]</strong> : menu (Object)
        </li>
        <br>
        <li>
         <strong>beforeOpen</strong> - (Function) <strong>[optional]</strong> triggered before the specific menu is opened.<br>
         &nbsp;&nbsp;&nbsp;&nbsp;<strong>[arguments]</strong> : menu (Object)
        </li>
        <br>
        <li>
         <strong>afterOpen</strong> - (Function) <strong>[optional]</strong> triggered after the specific menu opened.<br>
         &nbsp;&nbsp;&nbsp;&nbsp;<strong>[arguments]</strong> : menu (Object)
        </li>
        <br>
        <li>
          <strong>beforeClose</strong> - (Function) <strong>[optional]</strong> triggered before the specific menu is closed.<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[arguments]</strong> : menu (Object)
        </li>
        <br>
        <li>
          <strong>afterClose</strong> - (Function) <strong>[optional]</strong> triggered after the specific menu closed.<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[arguments]</strong> : menu (Object)
        </li>
      </ul>
    </li>
    <br>
    <li>
    <strong>submenu</strong> - (Object) containing the following submenu options:
      <ul>
        <li>
          <strong>isEnabled</strong> - (Boolean) <strong>[optional]</strong> enables handling of submenus.<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : false
        </li>
        <br>
        <li>
          <strong>openOnHover</strong> - (Boolean) <strong>[optional]</strong> triggers opening of a menu by mouse enter<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[default]</strong> : false
        </li>
        <br>
        <li>
          <strong>menuFunc</strong> - (Function) <strong>[optional]</strong> function to handle submenus on your own the specific menu.<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<strong>[arguments]</strong> : menu (Object)
        </li>
        <br>
        <li>
         <strong>on</strong> - (Object) containing the following events options:
          <ul>
            <li>
             <strong>beforeOpen</strong> - (Function) <strong>[optional]</strong> triggered before the specific submenu is opened.<br>
             &nbsp;&nbsp;&nbsp;&nbsp;<strong>[arguments]</strong> : menu (Object), submenu (HTML Element), toggle (HTML Element)
            </li>
            <br>
            <li>
              <strong>afterOpen</strong> - (Function) <strong>[optional]</strong> triggered after the specific submenu opened.<br>
              &nbsp;&nbsp;&nbsp;&nbsp;<strong>[arguments]</strong> : menu (Object), submenu (HTML Element), toggle (HTML Element)
            </li>
            <br>
            <li>
              <strong>beforeClose</strong> - (Function) <strong>[optional]</strong> triggered before the specific submenu is closed.<br>
              &nbsp;&nbsp;&nbsp;&nbsp;<strong>[arguments]</strong> : menu (Object), submenu (HTML Element), toggle (HTML Element)
            </li>
            <br>
            <li>
              <strong>afterClose</strong> - (Function) <strong>[optional]</strong> triggered after the specific submenu closed.<br>
              &nbsp;&nbsp;&nbsp;&nbsp;<strong>[arguments]</strong> : menu (Object), submenu (HTML Element), toggle (HTML Element)
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</section>


