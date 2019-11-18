const menuHandler = {
   menus: [],
   actions: {}, // a temporary storage for keys of occuring actions. 
   // it is to make sure only one action is occuring at a time and only for one menu.
   // several menus can't be active at a time.
   init(_menus) {
      const self = this;

      if (!Array.isArray(_menus) || !_menus.length) {
         self.menuError('[menuHandler] [general] Initialization requires an array of menus to be passed as an argument. see documentation');
      }

      _menus.forEach(function (_menu) {
         const menuTemplate = {
            name: null,
            open: null,
            close: null,
            enterFocus: null,
            exitFocus: null,
            activeOpen: null,
            activeClose: null,
            activeEnterFocus: null,
            activeExitFocus: null,
            container: null,
            innerContainer: null,
            loop: false,
            isOpen: false, // run time
            isPinned: false, // run time
            isMobile: false, // run time
            openDelay: 0,
            closeDelay: 0,
            debounce: 20,
            openOnMouseEnter: false,
            transitionDelay: 0, // run time
            transitionDuration: 0, // run time
            menuFunc: self.menuFunc,
            pin: false,
            preventBodyScroll: true,
            mobile: {
               breakpoint: '667px',
               open: null,
               close: null,
               pin: false,
               enterFocus: null,
               exitFocus: null,
               preventBodyScroll: true,
            },
            on: {
               beforeInit: null,
               afterInit: null,
               beforeOpen: null,
               afterOpen: null,
               beforeClose: null,
               afterClose: null,
               beforePinOpen: null,
               afterPinOpen: null,
               beforePinClose: null,
               afterPinClose: null,
            },
            submenuOptions: {
               isEnabled: false,
               menuFunc: self.submenuFunc,
               openOnMouseEnter: false,
               closeOnBlur: true,
               closeDelay: 0,
               closeSubmenusOnOpen: true,
               mobile: {
                  closeOnBlur: true,
                  closeDelay: 0,
                  closeSubmenusOnOpen: true,
               },
               on: {
                  beforeOpen: null,
                  afterOpen: null,
                  beforeClose: null,
                  afterClose: null,
               }
            },
            actions: {},
            submenus: {},
         };

         if (!_menu.name) {
            menuTemplate.name = Math.random().toString(36).substr(2); // create a random menu name from a random number converted to base 36.
         } else {
            menuTemplate.name = _menu.name;
         }

         if (!_menu.elements) {
            self.menuError(`[menuHandler] [menu:${menuTemplate.name}] Error: menu elements object is missing`);
         }
         self.initMenuElements(menuTemplate, _menu.elements);

         if (_menu.mobile && _menu.mobile.elements) {
            self.initMenuMobileElements(menuTemplate, _menu.mobile.elements);
         }

         self.initMenuOptions(menuTemplate, _menu);

         // !important: in order to find the event and remove it by removeEventListener, 
         // we need to pass a reference to the function and bind it to the menuHandler object
         menuTemplate.toggleMenu = self.toggleMenu.bind(self, menuTemplate);

         if (self.checkRequiredElement(menuTemplate)) {
            self.menus.push(menuTemplate);
         }
      });

      if (!self.menus.length) {
         self.menuError(`[menuHandler] [general] Error: no menus initialized`);
      }

      self.initMenus();
   },

   initMenuElements(menu, elements) {
      const self = this;

      for (key in elements) {
         el = document.querySelector(elements[key]);
         if (!el) {
            self.menuError(`[menuHandler] [menu:${menu.name}] Error: could not find element with ${elements[key]} selector`);
         }
         menu[key] = el;
      }

      if (!menu.enterFocus && menu.innerContainer) {
         const menuFocusables = menu.innerContainer.querySelectorAll('[tabindex]:not([tabindex="-1"]), button, a, input:not([type="hidden"]) ,select, textarea');
         menu.enterFocus = menuFocusables[0];
      }

      if (!menu.close) menu.close = menu.open;
      if (!menu.exitFocus) menu.exitFocus = menu.open;
   },

   initMenuOptions(menu, options) {
      const self = this;

      for (key in options) {

         if (key === 'elements' || key === 'name') continue; // already been handled

         switch ( key ) {
            case 'on':
               self.initMenuEvents(menu, options.on); 
               break;
 
            case 'submenuOptions':
               self.initSubmenuOptions(menu, options[key]);
               break;

            case 'mobile':
               self.initMenuMobileOptions(menu, options[key]);
               break;

            case 'pin':
            case 'loop':
            case 'preventBodyScroll':
            case 'openOnMouseEnter':
            case 'closeOnMouseLeave':
               menu[key] = !!options[key] || false; // convert to boolean
               break;

            case 'openDelay':
            case 'closeDelay':
            case 'debounce':
               menu[key] = parseInt(options[key]);
               break;

            case 'menuFunc':
               if (options[key] === 'function') {
                  menu[key] = options[key];
               }
               break;

            default:
               self.menuError(`[menuHandler] [menu:${menu.name}] Error: ${key}:${options[key]} cannot be initialized in menu object`);
               break;

         }
      }
   },

   initMenuMobileElements(menu, elements) {
      const self = this;

      for (key in elements) {
         el = document.querySelector(elements[key]);
         if (!el) {
            self.menuError(`[menuHandler] [menu:${menu.name}] Error: could not find element with ${elements[key]} selector in the DOM tree`);
         }
         menu.mobile[key] = el;
      }
   },

   initMenuMobileOptions(menu, options) {
      const self = this;

      for (key in options) {

         if (key === 'elements') continue; // already been handled

         switch ( key ) {
            case 'breakpoint': 
               if (!options[key].includes('px')) {
                  options[key] += 'px';
               }
               menu.mobile[key] = options[key];
               break;

            case 'pin':
            case 'preventBodyScroll':
               menu.mobile[key] = !!options[key] || false; // convert to boolean
               break;
         
            default:
               self.menuError(`[menuHandler] [menu:${menu.name}] Error: ${key}:${options[key]} cannot be initialized in menu.mobile`);
               break;
         }
      }

      menu.isMobile = window.matchMedia(`(max-width: ${menu.mobile.breakpoint})`).matches;
      window.addEventListener('resize', self.debounce(() => {
         
         menu.isMobile = window.matchMedia(`(max-width: ${menu.mobile.breakpoint})`).matches;
      }, menu.debounce));
   },

   setActiveElements(menu) {
      const self = this;

      self.setActiveOpen(menu);
      self.setActiveClose(menu);
      self.setActiveEnterFocus(menu);
      self.setActiveExitFocus(menu);
   },

   setActiveOpen(menu) {
      const self = this;

      menu.activeOpen = menu.open;

      if (menu.isMobile) {

         if (menu.mobile.open) {

            menu.activeOpen = menu.mobile.open;
            self.setMenuToggleEvents(menu, menu.mobile.open, menu.open);
         } else {
            
            self.setMenuToggleEvents(menu, menu.open);
         }
      } else {

         self.setMenuToggleEvents(menu, menu.open, menu.mobile.open);
      }
   },

   setActiveClose(menu) {
      const self = this;

      menu.activeClose = menu.close;

      if (menu.isMobile) {

         if (menu.mobile.close) {

            menu.activeClose = menu.mobile.close;
            self.setMenuToggleEvents(menu, menu.mobile.close, menu.close);
         } else {
            
            self.setMenuToggleEvents(menu, menu.close);
         }
      } else {

         self.setMenuToggleEvents(menu, menu.close, menu.mobile.close);
      }
   },

   setActiveEnterFocus(menu) {
      const self = this;

      menu.activeEnterFocus = menu.enterFocus;

      if (menu.isMobile && menu.mobile.enterFocus) {
            menu.activeEnterFocus = menu.mobile.enterFocus;
      }
   },
   
   setActiveExitFocus(menu) {
      const self = this;

      menu.activeExitFocus = menu.exitFocus;

      if (menu.isMobile && menu.mobile.exitFocus) {
         menu.activeExitFocus = menu.mobile.exitFocus;
      }
   },  

   initSubmenuOptions(menu, options) {
      const self = this;

      options['isEnabled'] = true; // remove the need to init submenus with isEnabled key.

      for (key in options) {
         switch (key) {
            case 'on':
                  for (event in options.on) {
                     if (event in menu.submenuOptions.on && typeof options.on[event] === 'function') {
                        menu.submenuOptions.on[event] = options.on[event];
                     }
                  }
               break;

            case 'mobile':
               self.initSubmenuMobileOptions(menu, options[key]);
               break;

            case 'isEnabled':
            case 'closeSubmenusOnOpen':
            case 'closeOnBlur':
            case 'openOnMouseEnter':
            case 'closeOnMouseLeave':
               menu.submenuOptions[key] = !!options[key] || false; // convert to boolean
               break;

            case 'menuFunc':
               if (options[key] === 'function') {
                  menu.submenuOptions[key] = options[key];
               }
               break;

            case 'closeDelay':
                  menu.submenuOptions[key] = parseInt(options[key]);
               break;

            default: 
                  self.menuError(`[menuHandler] [menu:${menu.name}] Error: ${key}:${options[key]} cannot be initialized in menu.submenuOptions`);
               break;
         }
      }
   },

   initSubmenuMobileOptions(menu, options) {
      const self = this;

      for (key in options) {

         switch ( key ) {
            case 'closeSubmenusOnOpen':
            case 'closeOnBlur':
               menu.submenuOptions.mobile[key] = !!options[key] || false; // convert to boolean
               break;

            case 'closeDelay':
                  menu.submenuOptions.mobile[key] = parseInt(options[key]);
               break;

            default:
                  self.menuError(`[menuHandler] [menu:${menu.name}] Error: ${key}:${options[key]} cannot be initialized in menu.submenuOptions.mobile`);
               break;
         }
      }
   },

   initMenuEvents(menu, events) {

      for (event in events) {
         if (event in menu.on && typeof events[event] === 'function') {

            menu.on[event] = events[event];
         } else {

            self.menuError(`[menuHandler] [menu:${menu.name}] Error: ${event}:${events[event]} cannot be initialized in menu.on`);
         }
      }
   },

   initMenuPinCheck(menu) {
      const self = this;

      self.toggleMenuPinned(menu);
      window.addEventListener('resize', self.debounce(() => {
         
         self.toggleMenuPinned(menu);
      }, menu.debounce));
   },

   toggleMenuPinned(menu) {
      const self = this;

      const wasPinned = menu.isPinned;

      menu.isPinned = false;

      if (menu.isMobile) {
         menu.isPinned = menu.mobile.pin;
      } else {
         menu.isPinned = menu.pin;
      }

      if (menu.isOpen && menu.isPinned) {
         self.closeMenu(menu);
      }

      if (menu.isOpen) return;

      if (menu.isPinned) {

         menu.transitionTimeCombined = menu.transitionDelay + menu.transitionDuration; // combined time in seconds.

         if (menu.on.beforePinOpen && !wasPinned) menu.on.beforePinOpen(menu); // before pin open

         menu.container.classList.add('mh-pinned');
         menu.container.setAttribute('aria-hidden', false);

         menu.innerContainer.classList.remove('mh-hidden');

         menu.open.classList.add('mh-hidden');
         if (menu.mobile.open) menu.mobile.open.classList.add('mh-hidden');
         
         if (menu.close) menu.close.classList.add('mh-hidden');
         if (menu.mobile.close) menu.mobile.close.classList.add('mh-hidden');

         if (menu.on.afterPinOpen && !wasPinned) { // after pin open
            setTimeout(() => menu.on.afterPinOpen(menu), menu.transitionTimeCombined * 1000); // fire after menu's container transition ends
         }

      } else {
         
         if (menu.on.beforePinClose && wasPinned) menu.on.beforePinClose(menu); // before pin close

         menu.container.classList.remove('mh-pinned');
         menu.container.setAttribute('aria-hidden', true);

         menu.innerContainer.classList.add('mh-hidden');

         menu.open.classList.remove('mh-hidden');
         if (menu.mobile.open) menu.mobile.open.classList.remove('mh-hidden');

         if (menu.close) menu.close.classList.remove('mh-hidden');
         if (menu.mobile.close) menu.mobile.close.classList.remove('mh-hidden');

         if (menu.on.afterPinClose && wasPinned) { // after pin close
            setTimeout(() => menu.on.afterPinClose(menu), menu.transitionTimeCombined * 1000); // fire after menu's container transition ends
         }
      }

      self.loopSubmenus(menu, self.closeSubmenu); // close all submenus
   },

   initMenu(menu) {
      const self = this;

      if (menu.on.beforeInit) menu.on.beforeInit(menu);

      self.initMenuPinCheck(menu);
         
      self.setActiveElements(menu);
      window.addEventListener('resize', self.debounce(() => {
         
         self.setActiveElements(menu);
      }, menu.debounce));

      self.initMenuAccessibility(menu);

      if (menu.submenuOptions.isEnabled) {
         self.initSubmenus(menu);
      }

      if (menu.on.afterInit) menu.on.afterInit(menu);
   },

   initMenus() {
      const self = this;

      self.menus.forEach(menu => {

         self.initMenu(menu);
      });

      self.initMenuWindowEvents();
   },

   initSubmenus(menu) {
      const self = this;

      const submenuToggles = menu.innerContainer.querySelectorAll('[data-mh-submenu-toggle]'); // important: the NodeList is ordered, the order is parent -> children -> next parent.

      if (!submenuToggles.length) {
         self.menuError(`[menuHandler] [menu:${menu.name}] Error: submenu toggles not found, consider disabling submenu, if submenu functionality is not being used`);
      }

      submenuToggles.forEach(toggle => {

         const submenu = {
            name: toggle.dataset.mhSubmenuToggle,
            toggle: toggle,
            list: null,
            container: null,
            parent: null,
            children: [],
            isOpen: false, // run time
            openOnMouseEnter: menu.submenuOptions.openOnMouseEnter,
            closeOnMouseLeave: menu.submenuOptions.closeOnMouseLeave,
            transitionDelay: 0, // run time
            transitionDuration: 0, // run time
            closeDelay: menu.submenuOptions.closeDelay,
            closeSubmenusOnOpen: menu.submenuOptions.closeSubmenusOnOpen,
            mobile: {
               closeSubmenusOnOpen: menu.submenuOptions.mobile.closeSubmenusOnOpen,
               closeDelay: menu.submenuOptions.mobile.closeDelay,
            },
            actions: {
               mouseleave: {
                  status: false,
                  timeout: null,
               }
            },
         }

         submenu.list = menu.innerContainer.querySelector(`[data-mh-submenu-list="${submenu.name}"]`);
         if (!submenu.list) {
            self.menuError(`[menuHandler] [menu:${menu.name}] Error: submenu, ${submenu.name} not found`);
         }

         submenu.container = menu.innerContainer.querySelector(`[data-mh-submenu-container="${submenu.name}"]`);

         submenu.parent = self.getSubmenuParent(submenu.list);

         if (submenu.openOnMouseEnter && submenu.toggle.dataset.mhMouseenterDisabled) {
            submenu.openOnMouseEnter = false;
         }

         if (submenu.closeOnMouseLeave && submenu.toggle.dataset.mhMouseleaveDisabled) {
            submenu.closeOnMouseLeave = false;
         }

         self.initSubmenuAccessibility(submenu);
         self.initSubmenuToggleEvents(menu, submenu);
         self.calcTransition(submenu);

         if (!submenu.toggle.getAttribute('title')) submenu.toggle.setAttribute('title', 'opens sub menu');
         
         if (submenu.parent) {
            menu.submenus[submenu.parent].children.push(submenu.name); // important: there always be a menu.submenus[submenu.parent] ,becuase the NodeList is ordered.
         }

         menu.submenus[submenu.name] = submenu;
      });
   },

   initMenuAccessibility(menu) {
      const self = this;
      const svgs = menu.innerContainer.querySelectorAll('svg');
      const images = menu.innerContainer.querySelectorAll('img');

      svgs.forEach(el => {
         if (!el.getAttribute('aria-label')) {
            if (!el.getAttribute('role')) el.setAttribute('role', 'presentation');
         }
      });

      images.forEach(el => {
         if (!el.getAttribute('alt')) {
            if (!el.getAttribute('role')) el.setAttribute('role', 'presentation');
         }
      });

      if (!menu.container.id || !menu.container.id.length) {
         menu.container.id = `mh-menu-${menu.name}`;
      }

      if (!menu.open.getAttribute('aria-controls') || !menu.open.getAttribute('aria-controls').length) {
         menu.open.setAttribute('aria-controls', menu.container.id);
      }

      if (menu.mobile.open && (!menu.mobile.open.getAttribute('aria-controls') || !menu.mobile.open.getAttribute('aria-controls').length)){
         menu.mobile.open.setAttribute('aria-controls', menu.container.id);
      } 

      ['enterFocus', 'exitFocus'].forEach((key) => {

         if (menu[key] && menu[key].tabIndex === -1) {
            menu[key].tabIndex = 0;
         }
      });

      ['enterFocus', 'exitFocus'].forEach((key) => {
        
         if (menu.mobile[key] && menu.mobile[key].tabIndex === -1) {
            menu.mobile[key].tabIndex = 0;
         }
      });
   },

   initSubmenuAccessibility(submenu) { 
      
      if (!submenu.list.classList.contains('mh-hidden')) submenu.list.classList.add('mh-hidden');
      if (!submenu.list.getAttribute('aria-hidden')) submenu.list.setAttribute('aria-hidden', true);
      if (!submenu.list.id || !submenu.list.id.length) submenu.list.id = `mh-submenu-${submenu.name}`;
      if (!submenu.toggle.getAttribute('aria-expanded')) submenu.toggle.setAttribute('aria-expanded', false);
      if (!submenu.toggle.getAttribute('aria-controls')) submenu.toggle.setAttribute('aria-controls', submenu.list.id);
   },

   initMenuWindowEvents() {
      const self = this;

      window.addEventListener('keydown', self.onInteraction.bind(self));
      window.addEventListener('click', self.onInteraction.bind(self));
      window.addEventListener('scroll', self.debounce(() => { // preventBodyScroll listener.
         document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
      }), 100);
   },

   setMenuToggleEvents(menu, add, remove) {

      if (add) add.addEventListener('click', menu.toggleMenu);
      if (remove) remove.removeEventListener('click', menu.toggleMenu);

      if (menu.openOnMouseEnter && add && add === menu.activeOpen) {

         add.addEventListener('mouseenter', menu.toggleMenu);
         if (remove) remove.removeEventListener('mouseenter', menu.toggleMenu);
      }
   },

   initSubmenuToggleEvents(menu, submenu) {
      const self = this;

      const submenuToggle = e => self.toggleSubmenu(menu, submenu, e);

      submenu.toggle.addEventListener('click', submenuToggle);

      if (submenu.openOnMouseEnter) {
         submenu.toggle.addEventListener('mouseenter', submenuToggle);
      }

      if (submenu.closeOnMouseLeave) {

         if (submenu.container) {
            submenu.container.addEventListener('mouseenter', submenuToggle);
            submenu.container.addEventListener('mouseleave', submenuToggle);
         } else {
            submenu.list.addEventListener('mouseenter', submenuToggle);
            submenu.list.addEventListener('mouseleave', submenuToggle);
         }
         submenu.toggle.addEventListener('mouseleave', submenuToggle);
      }
   },

   
   submenuMouseEnter(menu, submenu, e) {
      const self = this;

      if (e && e.type === 'mouseenter') {

         if (submenu.actions.mouseleave.timeout) {

            clearTimeout(submenu.actions.mouseleave.timeout);
            submenu.actions.mouseleave.timeout = null;
         };
         
         if (submenu.isOpen) return false; // prevent closing an open submenu.
         if (menu.isMobile) return false; // prevent open on mouseenter if isMobile.
      }
      return true;
   },

   submenuMouseLeave(menu, submenu, e) {
      const self = this;

      if (e && e.type === 'mouseleave') { 

         if (!submenu.isOpen) return false; // prevent opening a closed submenu.
         if (menu.isMobile) return false; // prevent open on mouseleave if isMobile.

         submenu.actions.mouseleave.timeout = setTimeout(() => {

            clearTimeout(submenu.actions.mouseleave.timeout);
            submenu.actions.mouseleave.timeout = null;
            
            self.closeSubmenu(menu, submenu);
         }, submenu.closeDelay);
      }

      if (submenu.actions.mouseleave.timeout) return false; 
      return true;
   },

   toggleMenu(menu, e) {
      const self = this;

      if (e) e.preventDefault();

      if (menu.isPinned) return;

      if (e && e.type === 'mouseenter') {
         if (menu.isOpen) return; // prevent closing an open menu on mouseenter a toggle open button.
         if (menu.isMobile) return; // prevent open on mouseenter if isMobile.
      }

      if (menu.name in self.actions) return; // don't allow, another action of this menu while action is running.

      self.actions[menu.name] = 1;

      menu.transitionTimeCombined = menu.transitionDelay + menu.transitionDuration; // combined time in seconds.

      setTimeout(() => {

         if (!menu.container.classList.contains('mh-open')) {
            self.loopMenus(self.closeOnBlur, e);
         }

         document.body.classList.toggle(`mh-${menu.name}-open`);
         menu.container.classList.toggle('mh-open');
         menu.isOpen = menu.container.classList.contains('mh-open');

         if (menu.isOpen) {
            setTimeout(() => {
               if (menu.on.beforeOpen) menu.on.beforeOpen(menu, e); // before open

               menu.menuFunc(menu, e);

               if (menu.on.afterOpen) { // after open
                  setTimeout(() => menu.on.afterOpen(menu, e), menu.transitionTimeCombined * 1000); // fire after menu's container transition ends
               }
            }, menu.openDelay);

         } else {
            setTimeout(() => {
               if (menu.on.beforeClose) menu.on.beforeClose(menu, e); // before close

               menu.menuFunc(menu, e);

               self.loopSubmenus(menu, self.closeSubmenu); // close all submenus

               if (menu.on.afterClose) { // after close
                  setTimeout(() => menu.on.afterClose(menu, e), menu.transitionTimeCombined * 1000); // fire after menu's container transition ends
               }
            }, menu.closeDelay);
         }

         delete self.actions[menu.name];

         if (!menu.isMobile && menu.preventBodyScroll || menu.isMobile && menu.mobile.preventBodyScroll) {
            self.preventBodyScroll();
         }
      });
   },

   toggleSubmenu(menu, submenu, e) {
      const self = this;

      if (!self.submenuMouseEnter(menu, submenu, e)) return;
      if (!self.submenuMouseLeave(menu, submenu, e)) return;

      const options = menu.submenuOptions
      const parentSubmenu = menu.submenus[submenu.parent] || null;

      if ((menu.isOpen || menu.isPinned) && !submenu.isOpen && (!parentSubmenu || parentSubmenu.isOpen)) { // if parentSubmenu is null ,then it's the top parent and just behave normally.

         if (!parentSubmenu && submenu.closeSubmenusOnOpen) { 
            self.loopSubmenus(menu, self.closeOtherSubmenu);
         }
         
         submenu.toggle.classList.add('mh-open');
         
      } else { // if parent is closed ,then close this submenu
         
         submenu.toggle.classList.remove('mh-open');
      }
      
      submenu.isOpen = submenu.toggle.classList.contains('mh-open');

      submenu.transitionTimeCombined = submenu.transitionDelay + submenu.transitionDuration; // combined time in seconds.

      if (submenu.isOpen) {

         if (options.on.beforeOpen) options.on.beforeOpen(menu, submenu, e); // before open.

         options.menuFunc(menu, submenu, e);

         if (options.on.afterOpen) { // after open.
            setTimeout(() => options.on.afterOpen(menu, submenu, e), submenu.transitionTimeCombined * 1000); // fire after submenu's container transition ends.
         }
      } else {

         setTimeout(() => {

            if (options.on.beforeClose) options.on.beforeClose(menu, submenu, e); // before close.

            options.menuFunc(menu, submenu, e); 

            submenu.children.forEach(child => self.toggleSubmenu(menu, menu.submenus[child])); // close child submenu

            if (options.on.afterClose) { // after close.
               setTimeout(() => options.on.afterClose(menu, submenu, e), submenu.transitionTimeCombined * 1000); // fire after submenu's container transition ends.
            }

         }, !menu.isMobile ? (submenu.closeOnMouseLeave && submenu.closeDelay ? 0 : submenu.closeDelay) : submenu.mobile.closeDelay); // if closeOnMouseLeave is true, than don't add close delay as it is being used in the closeOnMouseLeave code.
      }
   },

   menuFunc(menu, e) { 

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
   },

   submenuFunc(menu, submenu, e) {

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
   },

   checkRequiredElement(menu) {
      const self = this;
      const requiredElements = ['open', 'container', 'innerContainer'];
      let status = true;

      requiredElements.forEach(el => {
         if (!menu[el]) {
            self.menuError(`[menuHandler] [menu:${menu.name}] Error: required ${el} element is missing`);
            status = false;
         }
      });

      if (menu.loop === true && !menu.close) { // other edge cases
         self.menuError(`[menuHandler] [menu:${menu.name}] Error: in order to use loop option elements.close is required`);
         status = false;
      }

      return status;
   },

   loopMenus(func, e) {
      const self = this;

      self.menus.forEach(function (menu) {
         func.call(self, menu, e);
      });
   },

   loopSubmenus(menu, func) {
      const self = this;

      for (key in menu.submenus) {
         func.call(self, menu, menu.submenus[key], key);
      }
   },

   closeOnEscPress(menu, e) {
      const self = this;

      if (menu.isOpen && !menu.isPinned) { // close menu

         self.closeMenu(menu);
      } else if (menu.isPinned) { // close all submenus of the menu

         self.loopSubmenus(menu, self.closeSubmenu);
      }
   },

   closeOnBlur(menu, e) {
      const self = this;

      if (menu.isOpen && !menu.isPinned && e.target && e.target != menu.activeOpen && !menu.container.contains(e.target) && !menu.activeOpen.contains(e.target)) {

         self.closeMenuOnBlur(menu, e);
      } else { // close all submenus of a menu
         
         self.closeSubmenuOnBlur(menu, e);
      }
   },

   closeMenuOnBlur(menu, e) {
      const self = this;

      if (menu.loop === true && e.type !== 'click' && e.type !== 'mouseenter' && menu.activeEnterFocus) { // loop inside menu

         menu.activeEnterFocus.focus();
      } else { // close menu       
         
         self.closeMenu(menu);
      }
   },

   closeSubmenuOnBlur(menu, e) {
      const self = this;
         
      let isAnotherOpenSubmenu = true;
      for (key in menu.submenus) {
         
         if (menu.submenus[key].isOpen && (menu.submenus[key].toggle === e.target || menu.submenus[key].toggle.contains(e.target) || menu.submenus[key].list === e.target || menu.submenus[key].list.contains(e.target))) {
            isAnotherOpenSubmenu = false;
         }
      }
   
      if (isAnotherOpenSubmenu && (!menu.isMobile && menu.submenuOptions.closeOnBlur || menu.isMobile && menu.submenuOptions.mobile.closeOnBlur)) {
         self.loopSubmenus(menu, self.closeSubmenu);
      }

   },

   closeMenu(menu) { // close menu.
      const self = this;

      if (!menu.activeClose) {
         menu.menuFunc(menu);

      } else {
         menu.activeClose.click();
         menu.activeExitFocus.focus();
      }
   },

   closeSubmenu(menu, submenu) {
      const self = this;

      if (submenu.isOpen) {
         self.toggleSubmenu(menu, submenu);
      }
   },

   closeOtherSubmenu(menu, submenu, ignoreSubmenu) {
      const self = this;

      if (submenu.name != ignoreSubmenu.name && !submenu.parent) {

         if (submenu.actions.mouseleave.timeout) {

            clearTimeout(submenu.actions.mouseleave.timeout);
            submenu.actions.mouseleave.timeout = null;
         }

         self.closeSubmenu(menu, submenu);
      }
   },

   /*
   * prevent conflicts between different actions of diffeent menus. i.e:
   * make sure to let a menu to finish it's action befoe another can procceed.
   * 
   * maybe rewrite the core of action handling in the future ,so we can drop this.
   */
   checkIsBusy() { 
      const self = this;
      let isRunning = false;

      self.menus.forEach(menu => {
         if (menu.name in self.actions) {
            isRunning = true;
         }
      });

      return isRunning;
   },

   preventBodyScroll() { // prevents scrolling of the body while a menu is open.
      const body = document.body;
      const self = this;
      let isOpen = false;

      self.menus.forEach(menu => {
         if (menu.isOpen) isOpen = true;
      });

      if (isOpen && !body.classList.contains('prevent-body-scroll')) {

         const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
         body.style.left = '0';
         body.style.right = '0';
         body.style.width = '100%';
         body.style.position = 'fixed';
         body.style.top = `-${scrollY}`;
         body.classList.add('prevent-body-scroll');

      } else if (body.classList.contains('prevent-body-scroll')) {

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
      
      if ((e.type === 'click' || e.type === 'keydown' && e.keyCode === 9) && !isBusy) {
      
         setTimeout(() => {
            self.loopMenus(self.closeOnBlur, e);
         });

      } else if (e.type === 'keydown' && e.keyCode === 27 && !isBusy) {

         setTimeout(() => {
            self.loopMenus(self.closeOnEscPress, e);
         });
      }
   },

   calcTransition(obj) { // calc menu or submenu transition duration.

      // TODO: check how it works and implement for both menu and submenu

      if (obj.container) {
         obj.transitionDelay = parseFloat(getComputedStyle(obj.container).transitionDelay);
         obj.transitionDuration = parseFloat(getComputedStyle(obj.container).transitionDuration);

      } else {
         obj.transitionDelay = parseFloat(getComputedStyle(obj.list).transitionDelay);
         obj.transitionDuration = parseFloat(getComputedStyle(obj.list).transitionDuration);
      }
   },

   getSubmenuParent(el) {
      const parentSubmenu = el.parentElement.closest(`[data-mh-submenu-list]`); // important: start from parent to exclude itself

      return parentSubmenu ? parentSubmenu.dataset.mhSubmenuList : parentSubmenu;
   },

   menuError(message) {
      console.error(message);
      console.trace();
   },

   debounce(func, wait, immediate) {
      var timeout;
      return function () {
         var context = this,
            args = arguments;
         var later = function () {
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