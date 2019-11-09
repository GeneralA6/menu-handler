const menuHandler = {
   menus: [],
   actions: [], // a temporary storage for keys of occuring actions. 
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
            isOpen: false,
            isPinned: false,
            openDelay: 0,
            closeDelay: 0,
            openOnHover: false,
            transitionDelay: null,
            transitionDuration: null,
            menuFunc: self.menuFunc,
            pin: false,
            mobile: {
               breakpoint: '667px',
               isMobile: false,
               open: null,
               close: null,
               pin: false,
               enterFocus: null,
               exitFocus: null,
            },
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

         if (key == 'elements') continue;

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
            case 'openOnHover':
               menu[key] = !!options[key] || false; // convert to boolean
               break;

            default:
               if (key in menu && key != 'isOpen' && key != 'isPinned' && key != 'activeOpen' && key != 'activeClose') {
                  menu[key] = options[key];
               }
               break;
         }
      }
   },

   initMenuMobileElements(menu, elements) {
      const self = this;

      for (key in elements) {
         el = document.querySelector(elements[key]);
         if (!el) {
            self.menuError(`[menuHandler] [menu:${menu.name}] Error: could not find element with ${elements[key]} selector`);
         }
         menu.mobile[key] = el;
      }
   },

   initMenuMobileOptions(menu, options) {
      const self = this;

      for (key in options) {

         if (key == 'elements') continue;

         switch ( key ) {
            case 'breakpoint':
               if (!options[key].includes('px')) {
                  options[key] += 'px';
               }
               menu.mobile[key] = options[key];
               break;

            case 'pin':
               menu.mobile[key] = !!options[key] || false; // convert to boolean
               break;

            default:
               if (key in menu.mobile && key != 'isMobile') {
                  menu.mobile[key] = options[key];
               }
               break;
         }
      }

      menu.mobile.isMobile = window.matchMedia(`(max-width: ${menu.mobile.breakpoint})`).matches;
      window.addEventListener('resize', self.debounce(() => {
         
         menu.mobile.isMobile = window.matchMedia(`(max-width: ${menu.mobile.breakpoint})`).matches;
      }, 20));
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

      if (menu.mobile.isMobile) {

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

      if (menu.mobile.isMobile) {

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

      if (menu.mobile.isMobile && menu.mobile.enterFocus) {
            menu.activeEnterFocus = menu.mobile.enterFocus;
      }
   },
   
   setActiveExitFocus(menu) {
      const self = this;

      menu.activeExitFocus = menu.exitFocus;

      if (menu.mobile.isMobile && menu.mobile.exitFocus) {
         menu.activeExitFocus = menu.mobile.exitFocus;
      }
   },  

   initSubmenuOptions(menu, options) {
      for (key in options) {

         switch (key) {
            case 'on':
                  for (event in options.on) {
                     if (event in menu.submenuOptions.on && typeof options.on[event] === 'function') {
                        menu.submenuOptions.on[event] = options.on[event];
                     }
                  }
               break;

            case 'isEnabled':
            case 'openOnHover':
               menu.submenuOptions[key] = !!options[key] || false; // convert to boolean
               break;

            default:
                  if (key in menu.submenuOptions) {
                     menu.submenuOptions[key] = options[key];
                  }
               break;
         }
      }
   },

   initMenuEvents(menu, events) {

      for (event in events) {
         if (event in menu.on && typeof events[event] === 'function') {
            menu.on[event] = events[event];
         }
      }
   },

   initMenuPinCheck(menu) {
      const self = this;

      self.toggleMenuPinned(menu);
      window.addEventListener('resize', self.debounce(() => {
         
         self.toggleMenuPinned(menu);
      }, 20));
   },

   toggleMenuPinned(menu) {
      const self = this;

      menu.isPinned = false;

      if (menu.mobile.isMobile) {
         menu.isPinned = menu.mobile.pin;
      } else {
         menu.isPinned = menu.pin;
      }

      if (menu.isOpen && menu.isPinned) {
         self.closeMenu(menu);
      }

      if (!menu.isOpen) {
         if (menu.isPinned) {

            menu.container.classList.add('mh-pinned');
            menu.innerContainer.classList.remove('mh-hidden');
            menu.innerContainer.setAttribute('aria-hidden', false)
            menu.innerContainer.setAttribute('aria-expanded', true);
         } else {
            
            menu.innerContainer.classList.add('mh-hidden');
            menu.container.classList.remove('mh-pinned');
            menu.innerContainer.setAttribute('aria-hidden', true)
            menu.innerContainer.setAttribute('aria-expanded', false);
         }

         self.loopSubmenus(menu, self.closeSubmenu); // close all submenus
      }
   },

   initMenu(menu) {
      const self = this;

      if (menu.on.beforeInit) menu.on.beforeInit(menu);

      self.initMenuPinCheck(menu);
         
      self.setActiveElements(menu);
      window.addEventListener('resize', self.debounce(() => {
         
         self.setActiveElements(menu);
      }, 20));

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
            isOpen: false,
            transitionDelay: null,
            transitionDuration: null,
         }

         submenu.list = menu.innerContainer.querySelector(`[data-mh-submenu-list="${submenu.name}"]`);
         if (!submenu.list) {
            self.menuError(`[menuHandler] [menu:${menu.name}] Error: submenu, ${submenu.name} not found`);
         }

         submenu.container = menu.innerContainer.querySelector(`[data-mh-submenu-container="${submenu.name}"]`);

         submenu.parent = self.getSubmenuParent(submenu.list);

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

      self.toggleMenuPinned(menu);

      ['enterFocus', 'exitFocus'].forEach((key) => {

         if (menu[key] && menu[key].tabIndex == -1) {
            menu[key].tabIndex = 0;
         }
      });

      ['enterFocus', 'exitFocus'].forEach((key) => {
        
         if (menu.mobile[key] && menu.mobile[key].tabIndex == -1) {
            menu.mobile[key].tabIndex = 0;
         }
      });
   },

   initSubmenuAccessibility(submenu) {
      if (!submenu.list.classList.contains('mh-hidden')) submenu.list.classList.add('mh-hidden');
      if (!submenu.list.getAttribute('aria-hidden')) submenu.list.setAttribute('aria-hidden', true);
      if (!submenu.list.getAttribute('aria-expanded')) submenu.list.setAttribute('aria-expanded', false);
   },

   initMenuWindowEvents() {
      const self = this;

      window.addEventListener('keydown', self.onInteraction.bind(self));
      window.addEventListener('click', self.onInteraction.bind(self));

      window.addEventListener('scroll', self.debounce(() => { // preventBodyScroll listener.
         document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
      }), 20);
   },

   setMenuToggleEvents(menu, add, remove) {
      const self = this;

      if (add) add.addEventListener('click', menu.toggleMenu);
      if (remove) remove.removeEventListener('click', menu.toggleMenu);

      if (menu.openOnHover && add && add == menu.activeOpen) {

         add.addEventListener('mouseenter', menu.toggleMenu);
         if (remove) remove.removeEventListener('mouseenter', menu.toggleMenu);
      }
   },

   initSubmenuToggleEvents(menu, submenu) {
      const self = this;

      const submenuToggle = e => self.toggleSubmenu(menu, submenu, e);

      submenu.toggle.addEventListener('click', submenuToggle);

      if (menu.submenuOptions.openOnHover) {
         submenu.toggle.addEventListener('mouseenter', submenuToggle);
      }
   },

   toggleMenu(menu, e) {
      const self = this;

      if (e) e.preventDefault();

      if (!menu.isOpen && menu.isPinned) return;

      if (e && e.type == 'mouseenter') {
         if (menu.isOpen) return; // prevent closing an open menu by hovering over a toggle open button.
         if (menu.mobile.isMobile) return; // prevent open on hover if isMobile.
      }

      if (self.actions.indexOf(menu.name) !== -1) return; // don't allow, another action of this menu while action is running.

      self.actions.push(menu.name);

      const transitionTimeCombined = menu.transitionDelay + menu.transitionDuration; // combined time in seconds.

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
                  setTimeout(() => menu.on.afterOpen(menu, e), transitionTimeCombined * 1000); // fire after menu's container transition ends
               }
            }, menu.openDelay);

         } else {
            setTimeout(() => {
               if (menu.on.beforeClose) menu.on.beforeClose(menu, e); // before close

               menu.menuFunc(menu, e);

               self.loopSubmenus(menu, self.closeSubmenu); // close all submenus

               if (menu.on.afterClose) { // after close
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

      if (e && e.type == 'mouseenter') {
         if (submenu.isOpen) return; // prevent closing an open submenu by hovering over a toggle open button.
         if (menu.mobile.isMobile) return; // prevent open on hover if isMobile.
      }

      const transitionTimeCombined = submenu.transitionDelay + submenu.transitionDuration; // combined time in seconds.
      const parentSubmenu = menu.submenus[submenu.parent] || null;
      const options = menu.submenuOptions

      if ((menu.isOpen || menu.isPinned) && !submenu.isOpen && (!parentSubmenu || parentSubmenu.isOpen)) { // if parentSubmenu is null ,then it's the top parent and just behave normally.

         if (!parentSubmenu) {
            
            for (key in menu.submenus) { // close all other submenus recursively,before opening this one
               if (key != submenu.name && !menu.submenus[key].parent && menu.submenus[key].isOpen) {
                  self.toggleSubmenu(menu, menu.submenus[key]);
               }
            }
         }
         
         submenu.toggle.classList.add('mh-open');
         
      } else { // if parent is closed ,then close this submenu
         
         submenu.toggle.classList.remove('mh-open');
      }

      submenu.isOpen = submenu.toggle.classList.contains('mh-open');

      if (submenu.isOpen) {

         if (options.on.beforeOpen) options.on.beforeOpen(menu, submenu, e); // before open.

         options.menuFunc(menu, submenu, e);

         if (options.on.afterOpen) { // after open.
            setTimeout(() => options.on.afterOpen(menu, submenu, e), transitionTimeCombined * 1000); // fire after submenu's container transition ends.
         }
      } else {

         if (options.on.beforeClose) options.on.beforeClose(menu, submenu, e); // before close.

         options.menuFunc(menu, submenu, e);

         submenu.children.forEach(child => self.toggleSubmenu(menu, menu.submenus[child])); // close child submenu

         if (options.on.afterClose) { // after close.
            setTimeout(() => options.on.afterClose(menu, submenu, e), transitionTimeCombined * 1000); // fire after submenu's container transition ends.
         }
      }
   },

   menuFunc(menu, e) {

      if (menu.isOpen) {

         menu.container.setAttribute('aria-expanded', true);
         menu.container.setAttribute('aria-hidden', false);
         menu.innerContainer.classList.remove('mh-hidden');
         menu.activeEnterFocus.focus();
      } else {

         menu.container.setAttribute('aria-expanded', false);
         menu.container.setAttribute('aria-hidden', true);
         menu.innerContainer.classList.add('mh-hidden');

      }
   },

   submenuFunc(menu, submenu, e) {

      if (submenu.toggle.classList.contains('mh-open')) {

         submenu.list.classList.remove('mh-hidden');
         submenu.list.setAttribute('aria-hidden', false);

         if (submenu.container) {
            submenu.container.classList.add('mh-open');
            submenu.container.setAttribute('aria-expanded', true);
         } else {
            submenu.list.classList.add('mh-open');
            submenu.list.setAttribute('aria-expanded', true);
         }

      } else {

         submenu.list.classList.add('mh-hidden');
         submenu.list.setAttribute('aria-hidden', true);

         if (submenu.container) {
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
         func.call(self, menu, menu.submenus[key]);
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

      if (menu.isPinned) { // close submenus on blur when menu is pinned
         
         let isAnotherOpenSubmenu = true;
         for (key in menu.submenus) {
            
            if (menu.submenus[key].isOpen && (menu.submenus[key].toggle == e.target || menu.submenus[key].toggle.contains(e.target))) {
               isAnotherOpenSubmenu = false;
            }
         }

         if (isAnotherOpenSubmenu) {
            self.loopSubmenus(menu, self.closeSubmenu);
         }
      }

      // this part is a not efficient. think of a better way.
      if (menu.isOpen && !menu.isPinned && e.target && menu.container.contains(e.target)) { // close submenus on blur inside of an open menu

         let isFocusable = false;
         const menuFocusables = menu.innerContainer.querySelectorAll('[tabindex]:not([tabindex="-1"]), button, a, input:not([type="hidden"]) ,select, textarea');

         menuFocusables.forEach((el, i) => {
   
            if (el == e.target || el.contains(e.target)) {
               isFocusable = true;
               return;
            }
         });
         
         if (!isFocusable) {
            self.loopSubmenus(menu, self.closeSubmenu);
         }
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

   /*
   * a very early way of handling menu states. maybe rewrite in the future or remove completely if is not neccessery.
   * NOTE: don't remove unless you really understand all the code it is intergrated in.
   * checks for menu name, if any present, than a menu related action is running. 
   * prevents conflicts of several actions running at the same time.
   */
   checkIsBusy() { 
      const self = this;
      let isRunning = false;

      self.menus.forEach(menu => {
         if (self.actions.includes(menu.name)) {
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
      
      if ((e.type === 'click' || e.type === 'keydown' && e.keyCode == 9) && self.actions.indexOf('clicktab') === -1 && !isBusy) {
      
         self.actions.push('clicktab');
         setTimeout(() => {
            self.loopMenus(self.closeOnBlur, e);
            self.actions.splice(self.actions.indexOf('clicktab'), 1);
         });

      } else if (e.type === 'keydown' && e.keyCode == 27 && self.actions.indexOf('escape') === -1 && !isBusy) {

         self.actions.push('escape');

         setTimeout(() => {
            self.loopMenus(self.closeOnEscPress, e);
            self.actions.splice(self.actions.indexOf('escape'), 1);
         });
      }
   },

   calcTransition(obj) { // calc menu or submenu transition duration.

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