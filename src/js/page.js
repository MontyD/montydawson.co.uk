(function() {
  'use strict';

  // *************** //
  // ** utilities ** //
  // *************** //
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
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

  // ** Global object ** //
  var landingPage = {

    doc: document.documentElement,

    element: document.getElementsByTagName('body')[0],

    scrollPosition: 0,

    sections: document.getElementsByTagName('section'),

    menu: {

      element: document.getElementById('menu'),

      open: false,

      opener: {

        element: document.getElementById('hamburger'),

        active: function() {

          return (this.element.className += ' active');

        },

      },

      triggerElements: document.getElementsByClassName('toggleMenu'),

      toggle: function(e) {

        var evt = e || window.event;
        if (evt.preventDefault) {
          evt.preventDefault();
        } else {
          evt.returnValue = false;
        }
        if (this.menu.open) {
          this.menu.element.className = "";
          this.menu.opener.element.className += " active";
        } else {
          this.menu.element.className = "active";
          this.menu.opener.element.className = this.menu.opener.element.className.replace(' active', '');
        }
        return (this.menu.open = !this.menu.open);

      },

    },

    init: function() {

      this.element.className = '';

      for (var j = 0; j <this.sections.length; j++) {
        this.sections[j].className += ' active';
      }

      for (var i = 0; i < this.menu.triggerElements.length; i++) {
        this.menu.triggerElements[i].onclick = (this.menu.toggle.bind(this));
      }


    },

    scroll: debounce(function() {

      var bodyHeight = this.doc.clientHeight;

      this.scrollPosition = (window.pageYOffset || this.doc.scrollTop) - (this.doc.clientTop || 0);

    }, 20),

  };

  // //assign window level listeners
  window.addEventListener('scroll', function() {
    landingPage.scroll();
  }, false);
  //
  window.addEventListener('load', function() {
    landingPage.init();
  }, false);

})();
