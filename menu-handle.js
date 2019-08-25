const menuHandler = {
   menus: [],
   actions: [], // a temporary storage for keys of occuring actions. 
                // it is to make sure only one action is occuring at a time and only for one menu.
                // several menus can't be active at a time.
   init(passedMenus) {
      const self = this;
      
      if ( !Array.isArray(passedMenus) || !passedMenus.length ) {
         self.menuError('[menuHandler] [general] Initialization requires an array of menus to be passed as an argument. see documentation', 1);
      } 

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
            loop: false,
            isOpen: false,
            isMobile: false,
            openDelay: 0,
            closeDelay: 0,
            openOnHover: false,
            transitionDelay: null,
            transitionDuration: null,
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
            submenuOptions: {
               isEnabled: false,
               menuFunc: self.submenuFunc,
               openOnHover: false,
               transitionDelay: null,
               transitionDuration: null,
               on: {
                  beforeOpen: null,
                  afterOpen: null,
                  beforeClose: null,
                  afterClose: null,
               }
            },
            submenus: [],
         };

         if ( !menu.elements ) {
            self.menuError(`[menuHandler] [menu:${menu.name}] Error: menu elements object is missing`, 1);
         }
         
         self.initMenuElements(createMenu, menu.elements);
         self.initMenuOptions(createMenu, menu);

         if ( self.checkRequiredElement(createMenu) ) {
            self.menus.push(createMenu);
         }
      });

      if ( !self.menus.length ) {
         self.menuError(`[menuHandler] [general] Error: no menus initialized`, 1);
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

         } else if ( key == 'submenuOptions' ) {
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
               if ( event in createMenu.submenuOptions.on && typeof options.on[event] === 'function' ) {
                  createMenu.submenuOptions.on[event] = options.on[event];
               }
            }
            
         } else {
            if ( key in createMenu.submenuOptions ) {
               createMenu.submenuOptions[key] = options[key];
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

   initMenus() {
      const self = this;

      self.menus.forEach(menu => {

         if ( menu.on.beforeInit ) menu.on.beforeInit(menu);

         self.initMenuAccessibility(menu);
         self.initMenuToggleEvents(menu);

         if ( menu.submenuOptions.isEnabled ) {
            self.initSubmenus(menu); 
         }
         
         if ( menu.on.afterInit ) menu.on.afterInit(menu);
      });

      self.initMenuWindowEvents();   
   },

   initSubmenus(menu) {
      const self = this;

      const submenuToggles = menu.innerContainer.querySelectorAll('[data-mh-submenu-toggle]'); // important: the NodeList is ordered, the order is parent -> children -> next parent.

      if ( !submenuToggles.length ) {
         self.menuError(`[menuHandler] [menu:${menu.name}] Error: submenu toggles not found, consider disabling submenu, if submenu functionality is not being used`, 1);
      }

      submenuToggles.forEach(toggle => {
         const submenu = {
            name: toggle.dataset.mhSubmenuToggle,
            toggle: toggle,
            list: null,
            container: null,
            parent: null,
            children: [],
            transitionDelay: null,
            transitionDuration: null,
         }
         
         submenu.list = menu.innerContainer.querySelector(`[data-mh-submenu-list="${submenu.name}"]`);
         if ( !submenu.list ) {
            self.menuError(`[menuHandler] [menu:${menu.name}] Error: submenu, ${submenu.name} not found`, 1);
         }

         submenu.container = menu.innerContainer.querySelector(`[data-mh-submenu-container="${submenu.name}"]`);
         
         submenu.parent = self.getSubmenuParent(submenu.list);

         self.initSubmenuAccessibility(submenu);
         self.initSubmenuToggleEvents(menu, submenu);
         self.calcTransition(submenu);
         
         if ( !submenu.toggle.getAttribute('title') ) submenu.toggle.setAttribute('title', 'opens sub menu');

         if ( submenu.parent ) {
            menu.submenus[submenu.parent].children.push(submenu.name); // important: there always be a menu.submenus[submenu.parent] ,becuase the NodeList is ordered.
         }     

         menu.submenus[submenu.name] = submenu;
      });
   },

   initMenuAccessibility(menu) {
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
   },

   initSubmenuAccessibility(submenu) {
      if ( !submenu.list.classList.contains('mh-hidden') ) submenu.list.classList.add('mh-hidden');
      if ( !submenu.list.getAttribute('aria-hidden') ) submenu.list.setAttribute('aria-hidden', true);
      if ( !submenu.list.getAttribute('aria-expanded') ) submenu.list.setAttribute('aria-expanded', false);
   },

   initMenuWindowEvents() {
      const self = this;
      
      window.addEventListener('keydown', e => self.onInteraction(e));
      window.addEventListener('click', e => self.onInteraction(e));

      window.addEventListener('scroll', self.debounce(() => { // preventBodyScroll listener.
         document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
      }), 20);
   },

   initMenuToggleEvents(menu) {
      const self = this;

      menu.activeOpen.addEventListener('click', e => self.toggleMenu(menu, e));
      menu.activeClose.addEventListener('click', e => self.toggleMenu(menu, e));

      if ( menu.openOnHover ) {
         menu.activeOpen.addEventListener('mouseenter', e => self.toggleMenu(menu, e));
      }
   },

   initSubmenuToggleEvents(menu, submenu) {
      const self = this;

      submenu.toggle.addEventListener('click', e => self.toggleSubmenu(menu, submenu, e));
         
      if ( menu.submenuOptions.openOnHover ) {
         submenu.toggle.addEventListener('mouseenter', e => self.toggleSubmenu(menu, submenu, e));
      } 
   },

   toggleMenu(menu, e) {
      const self = this;

      console.log(menu);

      if ( e ) e.preventDefault(e);
      if ( e && e.type == 'mouseenter' && menu.isOpen || e.type == 'mouseenter' && menu.isMobile ) return; // prevent closing an open menu by hovering over a toggle open button.

      if ( self.actions.indexOf(menu.name) !== -1 ) return; // don't allow, another action of this menu while action is running.

      self.actions.push(menu.name);

      const transitionTimeCombined = menu.transitionDelay + menu.transitionDuration; // combined time in seconds.
      
      setTimeout(() => {
         if ( !menu.container.classList.contains('mh-open') ) {
            self.loopMenus(self.closeMenusOnBlur, e);
         }

         document.body.classList.toggle(`mh-${menu.name}-open`);
         menu.container.classList.toggle('mh-open');
         menu.isOpen = menu.container.classList.contains('mh-open');

         if ( menu.isOpen ) {
            setTimeout(() => {
               if ( menu.on.beforeOpen ) menu.on.beforeOpen(menu, e); // before open
               
               menu.menuFunc(menu, e);

               if ( menu.on.afterOpen ) {  // after open
                  setTimeout(() => menu.on.afterOpen(menu, e), transitionTimeCombined * 1000); // fire after menu's container transition ends
               }
            }, menu.openDelay);

         } else {
            setTimeout(() => {
               if ( menu.on.beforeClose ) menu.on.beforeClose(menu, e); // before close
               
               menu.menuFunc(menu, e);

               for ( name in menu.submenus ) { // close all submenus
                  self.toggleSubmenu(menu, menu.submenus[name])
               }
            
               if ( menu.on.afterClose ) {  // after close
                  setTimeout(() => menu.on.afterClose(menu, e), transitionTimeCombined * 1000); // fire after menu's container transition ends
               }
            }, menu.closeDelay);
         }

         self.actions.splice(self.actions.indexOf(menu.name), 1);
         self.preventBodyScroll();
      });
   },

   toggleSubmenu(menu, submenu, e) {
      const self = this;

      if ( e && e.type == 'mouseenter' && submenu.toggle.classList.contains('mh-open') || e.type == 'mouseenter' && menu.isMobile ) return; // prevent closing an open submenu by hovering over a toggle open button.

      const transitionTimeCombined = submenu.transitionDelay + submenu.transitionDuration; // combined time in seconds.
      const parentSubmenu = menu.submenus[submenu.parent] || null;   
      const options = menu.submenuOptions

      if ( menu.isOpen && ( !parentSubmenu || parentSubmenu.toggle.classList.contains('mh-open') ) ) { // if parentSubmenu is null ,then it's the top parent and just behave normally.
         submenu.toggle.classList.toggle('mh-open');
      } else { // if parent is closed ,then close this submenu
         submenu.toggle.classList.remove('mh-open');
      }
      
      if ( submenu.toggle.classList.contains('mh-open') ) {
         if ( options.on.beforeOpen ) options.on.beforeOpen(menu, submenu, e); // before open.

         options.menuFunc(menu, submenu, e);

         if ( options.on.afterOpen ) { // after open.
            setTimeout(() => options.on.afterOpen(menu, submenu, e), transitionTimeCombined * 1000); // fire after submenu's container transition ends.
         }

      } else {
         if ( options.on.beforeClose ) options.on.beforeClose(menu, submenu, e); // before close.

         options.menuFunc(menu, submenu, e);

         submenu.children.forEach((child) => self.toggleSubmenu(menu, menu.submenus[child])); // close child submenu

         if ( options.on.afterClose ) { // after close.
            setTimeout(() => options.on.afterClose(menu, submenu, e), transitionTimeCombined * 1000); // fire after submenu's container transition ends.
         }
      }
   },

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
   },

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
   },

   checkRequiredElement(menu) {
      const self = this;
      const requiredElements = ['open', 'container', 'innerContainer'];
      let status = true;

      requiredElements.forEach(el => {
         if ( !menu[el] ) {
            self.menuError(`[menuHandler] [menu:${menu.name}] Error: required ${el} element is missing`);
            status = false;
         }
      });

      // other edge cases
      if ( menu.loop === true && !menu.close ) {
         self.menuError(`[menuHandler] [menu:${menu.name}] Error: in order to use loop option elements.close is required`);
         status = false; 
      }

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
         if ( menu.loop === true && e.type !== 'click' && e.type !== 'mouseenter' && menu.enterFocus ) { // loop inside menu
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

   preventBodyScroll() { // prevents scrolling of the body while a menu is open.
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

   onInteraction(e) { // closes menu on click / tab / escape.
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

   calcTransition(obj) { // calc menu or submenu transition duration.

      if ( obj.container ) {
         obj.transitionDelay = parseFloat( getComputedStyle(obj.container).transitionDelay );
         obj.transitionDuration = parseFloat( getComputedStyle(obj.container).transitionDuration );
         
      } else {
         obj.transitionDelay = parseFloat( getComputedStyle(obj.list).transitionDelay );
         obj.transitionDuration = parseFloat( getComputedStyle(obj.list).transitionDuration );
      }
   },

   getSubmenuParent(el) {
      const parentSubmenu = el.parentElement.closest(`[data-mh-submenu-list]`); // important: start from parent to exclude itself

      return parentSubmenu ? parentSubmenu.dataset.mhSubmenuList : parentSubmenu;
   },

   menuError(message, die) {
      console.error(message);
      console.trace();
      if (die) return;
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