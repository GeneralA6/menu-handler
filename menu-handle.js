const menuHandler = {
   menus: [],
   actions: [], // a temporary storage for keys of occuring actions. 
             // it is to make sure only one action is occuring at a time and only for one menu.
             // several menus can't be active at a time.
   init(passedMenus) {
      const self = this;
      
      if ( !Array.isArray(passedMenus) || !passedMenus.length ) {
         console.error('[menuHandler] [general] Initialization requires an array of menus to be passed as an argument. see documentation');
         console.trace();
         return;
      }

      const style = document.createElement('style');
      style.innerHTML = `.mh-hidden {display: none !important;}`;
      document.head.appendChild(style);

      passedMenus.forEach(function(menu) {
         const createMenu = {
            open: null,
            close: null,
            mobileOpen: null,
            mobileClose: null,
            activeOpen: null,
            activeClose: null,
            enterFocus: null,
            exitFocus: null,
            container: null,
            innerContainer: null,
            loop: false, // TODO: only ,if close is not empty
            isOpen: false,
            isMobile: false,
            closeDelay: 0,
            openOnHover: false,
            submenu: {
               isEnabled: false,
               menuFunc: self.submenuFunc,
               openOnHover: false,
               on: {
                  beforeOpen: null,
                  afterOpen: null,
                  beforeClose: null,
                  afterClose: null,
               }
            },
            menuFunc: self.menuFunc,
            mobileBreakpoint: '667px',
            on: {
               beforeInit: null,
               afterInit: null,
               beforeOpen: null,
               afterOpen: null,
               beforeClose: null,
               afterClose: null,
            },
         };

         if ( !menu.elements ) {
            console.error(`[menuHandler] [menu:${menu.name}] Error: menu elements object is missing`);
            console.trace();
            return;
         }
         
         self.initMenuElements(createMenu, menu.elements);
         self.initMenuOptions(createMenu, menu);

         if ( self.checkRequiredElement(createMenu) ) {
            self.menus.push(createMenu);
         }
      });

      if ( !self.menus.length ) {
         console.error(`[menuHandler] [general] Error: no menus initialized`);
         console.trace();
         return;
      }

      self.initMenus();
   },

   initMenuOptions(createMenu, options) {
      const self = this;

      delete options.elements;

      for ( key in options ) {
         if ( key == 'on' ) {
            for ( event in options.on ) {
               if ( event in createMenu.on && typeof options.on[event] === 'function' ) {
                  createMenu.on[event] = options.on[event];
               }
            }

         } else if ( key == 'submenu' ) {
            self.initSubmenuOptions(createMenu, options[key]);

         } else {
            if ( key in createMenu && key != 'isOpen' && key != 'activeOpen' && key != 'activeClose' ) {
               createMenu[key] = options[key];
            }
         }
      }

      createMenu.name = Math.random().toString(36).substr(2); //  create menu name from a random number converted to base 36.
   },

   initSubmenuOptions(createMenu, options) {
      for ( key in options ) {
         if ( key == 'on' ) {
            for ( event in options.on ) {
               if ( event in createMenu.submenu.on && typeof options.on[event] === 'function' ) {
                  createMenu.submenu.on[event] = options.on[event];
               }
            }
            
         } else {
            if ( key in createMenu.submenu ) {
               createMenu.submenu[key] = options[key];
            }
         }
      }
   },

   initMenuElements(createMenu, options) {
      const self = this;
      
      for ( key in options ) {
         el = document.querySelector(options[key]);
         createMenu[key] = el;
      }

      if ( !createMenu.enterFocus && createMenu.innerContainer ) {
         const focusable = createMenu.innerContainer.querySelectorAll('[tabindex]:not([tabindex="-1"]), button, [href], input:not([type="hidden"]) ,select, textarea');
         const firstFocusable = focusable[0];
         createMenu.enterFocus = firstFocusable;
      }

      if ( !createMenu.close ) createMenu.close = createMenu.open;
      if ( !createMenu.exitFocus ) createMenu.exitFocus = createMenu.open;

      if ( !createMenu.mobileBreakpoint.includes('px') ) {
         createMenu.mobileBreakpoint += 'px';
      }

      createMenu.isMobile = window.matchMedia(`(max-width: ${createMenu.mobileBreakpoint})`).matches;
      self.setActiveTriggers(createMenu);
      
      window.addEventListener('resize', self.debounce(() => {
         createMenu.isMobile = window.matchMedia(`(max-width: ${createMenu.mobileBreakpoint})`).matches;
         self.setActiveTriggers(createMenu);
      }, 20));
   },

   checkRequiredElement(menu) {
      const self = this;
      const requiredElements = ['open', 'container', 'innerContainer'];
      let status = true;

      requiredElements.forEach(el => {
         if ( !menu[el] ) {
            console.error(`[menuHandler] [menu:${menu.name}] Error: required ${el} element is missing`);
            console.trace();
            status = false;
         }
      });

      return status;
   },

   loopMenus(func, e) {
      const self = this;

      self.menus.forEach(function(menu) {
         func(menu, e);
      });
   },

   closeMenusOnEscPress(menu, e) { // On ESC press close menus.
      if ( menu.isOpen ) {
         menuHandler.closeMenuContainer(menu); // note: there are situations where we get to this function from other functions, so the "this" changes to window. that's why we specify explicitly the direction to the function.
      }
   },

   closeMenusOnBlur(menu, e) { // On Blur close menus.
      if ( e.target && menu.isOpen && e.target != menu.activeOpen && !menu.activeOpen.contains(e.target) && !menu.container.contains(e.target) ){
         if ( menu.loop && e.type !== 'click' && menu.enterFocus ) {
            menu.enterFocus.focus();
            
         } else {
            menuHandler.closeMenuContainer(menu); // there are situations where we get to this function from other functions, so the "this" changes to window. that's why we specify explicitly the direction to the function.
         }
      }
   },

   closeMenuContainer(menu) { // Close Menu.
      const self = this;

      if ( !menu.activeClose ) {
         menu.menuFunc(menu);

      } else {
         menu.activeClose.click();
         menu.exitFocus.focus();
      }
   },

   checkIsBusy() { // checks for menu name, if any present, than a menu is open and has action related to it running. prevents conflicts of several actions running at the same time.
      const self = this;
      let isRunning = false;

      self.actions.forEach(action => {
         self.menus.forEach(menu => {
            if ( menu.name === action ) {
               isRunning = true;
            }
         });
      });

      return isRunning;
   },

   menuFunc(menu, e) {
      if (e) e.preventDefault();

      document.body.classList.toggle(`mh-${menu.name}-open`);
      menu.container.classList.toggle('mh-open');
      menu.isOpen = menu.container.classList.contains('mh-open');

      if ( menu.isOpen ) {
         if ( menu.on.beforeOpen ) menu.on.beforeOpen(menu);

         menu.container.setAttribute('aria-expanded', true);
         menu.container.setAttribute('aria-hidden', false);
         menu.innerContainer.classList.remove('mh-hidden');
         menu.enterFocus.focus();

         if ( menu.on.afterOpen ) menu.on.afterOpen(menu);
      } else {

         setTimeout(() => {
            if ( menu.on.beforeClose ) menu.on.beforeClose(menu);

            menu.container.setAttribute('aria-expanded', false);
            menu.container.setAttribute('aria-hidden', true);
            menu.innerContainer.classList.add('mh-hidden');

            if ( menu.on.afterClose ) menu.on.afterClose(menu);
         }, menu.closeDelay);
      }
   },

   submenuFunc(menu, submenu, toggle, e) {

      if (e) e.preventDefault;

      if ( toggle.classList.contains('mh-open') ) {
         if ( menu.submenu.on.beforeOpen ) menu.submenu.on.beforeOpen(menu, submenu, toggle);

         submenu.classList.add('mh-open');
         submenu.classList.remove('mh-hidden');
         submenu.setAttribute('aria-expanded', true);
         submenu.setAttribute('aria-hidden', false);

         if ( menu.submenu.on.afterOpen ) menu.submenu.on.afterOpen(menu, submenu, toggle);
         
      } else {
         if ( menu.submenu.on.beforeClose ) menu.submenu.on.beforeClose(menu, submenu, toggle);

         submenu.classList.add('mh-hidden');
         submenu.classList.remove('mh-open');
         submenu.setAttribute('aria-expanded', false);
         submenu.setAttribute('aria-hidden', true);

         if ( menu.submenu.on.afterClose ) menu.submenu.on.afterClose(menu, submenu, toggle);
      }
   },

   preventBodyScroll() {
      const body = document.body;
      const self = this;
      let isOpen = false;

      self.menus.forEach(menu => {
         if ( menu.isOpen ) isOpen = true;
      });

      if ( isOpen && !body.classList.contains('prevent-body-scroll') ) {

         const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
         body.style.left = '0';
         body.style.right = '0';
         body.style.width = '100%';
         body.style.position = 'fixed'; 
         body.style.top = `-${scrollY}`;
         body.classList.add('prevent-body-scroll');

      } else if ( body.classList.contains('prevent-body-scroll') ) {

         const scrollY = body.style.top;
         body.style.top = '';
         body.style.position = '';
         window.scrollTo(0, parseInt(scrollY || '0') * -1);
         body.classList.remove('prevent-body-scroll');
      }
   },

   // closes menu on click / tab / escape
   onInteraction(e) {
      const self = this;
      const isBusy = self.checkIsBusy();
     
      if ( (e.type === 'click' || e.type === 'keydown' && e.keyCode == 9) && self.actions.indexOf('clicktab') === -1 && !isBusy ) {
         
         self.actions.push('clicktab');
         setTimeout(() => {
            self.loopMenus(self.closeMenusOnBlur, e);
            self.actions.splice(self.actions.indexOf('clicktab'), 1);
         });

      } else if ( e.type === 'keydown' && e.keyCode == 27 && self.actions.indexOf('escape') === -1 && !isBusy ) {
         
         self.actions.push('escape');

         setTimeout(() => {
            self.loopMenus(self.closeMenusOnEscPress, e);
            self.actions.splice(self.actions.indexOf('escape'), 1);
         });
      }
   },

   toggleMenu(menu, e) {
      const self = this;

      if ( self.actions.indexOf(menu.name) !== -1 ) return;

      self.actions.push(menu.name);

      setTimeout(() => {
         e.preventDefault(e);
         
         if ( !menu.container.classList.contains('mh-open') ) {
            self.loopMenus(self.closeMenusOnBlur, e);
         }

         menu.menuFunc(menu, e);

         self.actions.splice(self.actions.indexOf(menu.name), 1);
         self.preventBodyScroll();
      });
   },

   toggleSubmenu(menu, submenuLists, e) {
      let toggle = e.target;

      if ( !toggle.dataset.mhSubmenuToggle ) {
         toggle = toggle.closest('[data-mh-submenu-toggle]');
      }

      const submenu = [...submenuLists].filter(list => list.dataset.mhSubmenuList === toggle.dataset.mhSubmenuToggle)[0];

      if ( !submenu ) {
         console.error(`[menuHandler] [menu:${menu.name}] Error: submenu, ${toggle.dataset.mhSubmenuToggle} not found`);
         console.trace();
         return;
      };

      toggle.classList.toggle('mh-open');

      menu.submenu.menuFunc(menu, submenu, toggle, e);
   },

   initMenus() {
      const self = this;

      self.menus.forEach(menu => {

         if ( menu.on.beforeInit ) menu.on.beforeInit(menu);

         const svgs = menu.innerContainer.querySelectorAll('svg');
         const images = menu.innerContainer.querySelectorAll('img');

         svgs.forEach(el => {
            if ( !el.getAttribute('role') ) el.setAttribute('role', 'presentation');
            if ( !el.getAttribute('aria-hidden') ) el.setAttribute('aria-hidden', true);
         });

         images.forEach(el => {
            if ( !el.getAttribute('role') ) el.setAttribute('role', 'presentation');
            if ( !el.getAttribute('aria-hidden') ) el.setAttribute('aria-hidden', true);
         });
         
         if ( !menu.innerContainer.classList.contains('mh-hidden') ) menu.innerContainer.classList.add('mh-hidden');
         if ( !menu.innerContainer.getAttribute('aria-hidden') ) menu.innerContainer.setAttribute('aria-hidden', true)
         if ( !menu.innerContainer.getAttribute('aria-expanded') ) menu.innerContainer.setAttribute('aria-expanded', false);
         
         if ( menu.enterFocus.tabIndex == -1 ) {
            menu.enterFocus.tabIndex = 0;
         }

         if ( menu.submenu.isEnabled ) {
            self.initSubmenus(menu);
         }

         menu.activeOpen.addEventListener('click', e => self.toggleMenu(menu, e));
         menu.activeClose.addEventListener('click', e => self.toggleMenu(menu, e));

         if ( menu.openOnHover ) {
            menu.activeOpen.addEventListener('mouseenter', e => self.toggleMenu(menu, e));
         }

         if ( menu.on.afterInit ) menu.on.afterInit(menu);
      });

      document.addEventListener('keydown', e => self.onInteraction(e));
      document.addEventListener('click', e => self.onInteraction(e));

      window.addEventListener('scroll', self.debounce(() => { // preventBodyScroll listener
         document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
      }), 20);
   },

   initSubmenus(menu) {
      const self = this;

      if ( menu.submenu.on.beforeOpen ) menu.submenu.on.beforeOpen(menu);

      const submenuToggles = menu.innerContainer.querySelectorAll('[data-mh-submenu-toggle]'); 
      const submenuLists = menu.innerContainer.querySelectorAll(`[data-mh-submenu-list]`);

      if ( !submenuToggles.length ) {
         console.error(`[menuHandler] [menu:${menu.name}] Error: submenu toggles not found, consider disabling submenu, if submenu functionality is not being used`);
         console.trace();
         return;
      }

      if ( !submenuLists.length ) {
         console.error(`[menuHandler] [menu:${menu.name}] Error: submenu lists not found, consider disabling submenu, if submenu functionality is not being used`);
         console.trace();
         return;
      }

      submenuToggles.forEach(btn => {
         if ( !btn.getAttribute('title') ) btn.setAttribute('title', 'opens sub menu');
      });

      submenuLists.forEach(list => {
         if ( !list.classList.contains('mh-hidden') ) list.classList.add('mh-hidden');
         if ( !list.getAttribute('aria-label') ) list.setAttribute('aria-label', hidden);
         if ( !list.getAttribute('aria-expanded') ) list.setAttribute('aria-expanded', false);
      });

      submenuToggles.forEach(toggle => {
         toggle.addEventListener('click', e => self.toggleSubmenu(menu, submenuLists, e));

         if ( menu.submenu.openOnHover ) {
            toggle.addEventListener('mouseenter', e => self.toggleSubmenu(menu, submenuLists, e));
         }
      });
   },

   setActiveTriggers(menu) { 
      menu.activeOpen = menu.open;
      menu.activeClose = menu.close;
     
      if (menu.isMobile) {
         if ( menu.mobileOpen ) {
            menu.activeOpen = menu.mobileOpen;
         }
         if ( menu.mobileClose ) {
            menu.activeClose = menu.mobileClose;
         }
      }
   },
   
   debounce(func, wait, immediate) {
      var timeout;
      return function() {
         var context = this, args = arguments;
         var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
         };
         var callNow = immediate && !timeout;
         clearTimeout(timeout);
         timeout = setTimeout(later, wait);
         if (callNow) func.apply(context, args);
      };
   }
}