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

  var bLazy = new Blazy({
    offset: 100
  });
  // *************** //

  var timer;
  var aboutMeElement = document.getElementById('aboutMe');

  // ** function to type the about me section, passed to init on panel 2 init ** //
  var typeAboutMe = function() {

    var aboutMeArray = ["I'm always learning.", "I like bold and clever design.", "I like a challenge.", "I like thinking before doing.", "I take pride in what I do.", "I'm always learning."],
      aboutMeIndex = 0,
      currentArray = String(aboutMeArray[aboutMeIndex]).split('');
    var putAboutMe = function() {
      console.log(currentArray);
      aboutMeElement.innerHTML += currentArray.shift();
      if (currentArray.length > 0) {
        timer = window.setTimeout(putAboutMe, 80);
        return false;
      } else if (aboutMeIndex >= aboutMeArray.length - 1) {
        return false;
      } else {
        timer = window.setTimeout(clearAboutMe, 2000);
        return false;
      }
      return false;
    };
    var clearAboutMe = function() {
      var description = aboutMeElement.innerHTML;
        aboutMeElement.innerHTML = description.substring(0, description.length - 1);
      if (description.length > 0) {
        timer = window.setTimeout(clearAboutMe, 70);
        return false;
      } else {
        aboutMeIndex++;
        if (aboutMeIndex >= aboutMeArray.length) {
          return false;
        } else {
          currentArray = String(aboutMeArray[aboutMeIndex]).split('');
          return putAboutMe();
        }
      }
    };

    timer = window.setTimeout(clearAboutMe, 700);

  };

  // function to stop the about me ticker running
  var stopAboutMe = function() {
    try {
      window.clearTimeout(timer);
    } catch (err) {}
    aboutMeElement.innerHTML = "I'm always learning.";
    return false;
  };

  // function to load projects from json, called at reaching third panel
  var loadProjects = function() {
    var request = new XMLHttpRequest(),
      url = './dist/json/projects.json?t=' + String(Math.random()).substr(5);
    if (!request) {
      console.error('Cannot make ajax request.');
      return false;
    }
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          landingPage.projects = JSON.parse(request.response).projects;
          landingPage.jsonLoaded();
        } else {
          console.error('Unable to receive ajax request.');
        }
      }
    };
    request.open('GET', url);
    request.send();
  };


  // ** Panel class ** //
  var Panel = function(order, elementID, focus, initFn, exitFn) {
    this.order = order;
    this.active = focus || false;
    this.called = false;
    this.element = document.getElementById(elementID);
    this.initFn = initFn;
    this.exitFn = exitFn;
  };
  Panel.prototype.init = function() {
    this.active = true;
    if (!this.called) {
      this.element.className += ' active';
      this.called = true;
      if (typeof this.initFn === 'function') {
        (this.initFn)();
      }
    }
    return false;
  };
  Panel.prototype.exit = function() {
    if (typeof this.exitFn === 'function') {
      (this.exitFn)();
    }
    this.active = false;
    return false;
  };

  // ** define panels ** //
  var start = new Panel(0, 'first');
  var skills = new Panel(1, 'second', false, typeAboutMe, stopAboutMe);
  var work = new Panel(2, 'third', false, loadProjects);
  var aboutMe = new Panel(3, 'fourth');

  // ** Global object ** //
  var landingPage = {

    doc: document.documentElement,

    element: document.getElementsByTagName('body')[0],

    scrollPosition: 0,

    panels: [start, skills, work, aboutMe],

    projects: [],

    currentProject: 0,

    activePanel: 0,

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

    gentleScrollers: {

      elements: document.getElementsByClassName('gentleScroll'),

      scroll: function(e) {
        var evt = e || window.event;
        if (evt.preventDefault) {
          evt.preventDefault();
        } else {
          evt.returnValue = false;
        }
        var scrollTo = this.href.substr(this.href.indexOf('#'));
        smoothScroll.animateScroll(scrollTo);
      }


    },

    toggleSkills: {

      elements: document.getElementsByClassName('skillsHeader'),

      toggle: function(e) {
        var evt = e || window.event;
        if (evt.preventDefault) {
          evt.preventDefault();
        } else {
          evt.returnValue = false;
        }
        var className = this.parentNode.parentNode.className;
        if (className === "skillsGroup expand") {
          for (var l = 0; l < landingPage.toggleSkills.elements.length; l++) {
            landingPage.toggleSkills.elements[l].parentNode.parentNode.className = 'skillsGroup';
          }
        } else {
          for (var m = 0; m < landingPage.toggleSkills.elements.length; m++) {
            landingPage.toggleSkills.elements[m].parentNode.parentNode.className = 'skillsGroup';
          }
          this.parentNode.parentNode.className = "skillsGroup expand";
        }
        return false;

      }

    },

    projectsToggle: {

      elements: {

        desktopImg: document.getElementById('desktopImage'),

        mobileImg: document.getElementById('mobileImage'),

        addressBar: document.getElementById('addressBar'),

        projectLinkButton: document.getElementById('projectLinkButton'),

        projectDescription: document.getElementById('projectDescription'),

        projectMoreInfo: document.getElementById('projectMoreInfo'),

        toggleNext: document.getElementById('nextProject'),

        togglePrevious: document.getElementById('previousProject')

      },

      toggle: function(back) {
        this.panels[2].element.className += ' transition';
        if (back) {
          this.currentProject--;
        } else {
          this.currentProject++;
        }
        if (this.currentProject === (this.projects.length)) {
          this.currentProject = 0;
        }
        if (this.currentProject === -1) {
          this.currentProject = this.projects.length - 1;
        }
        var that = this;
        window.setTimeout(function() {
          var newProject = that.projects[that.currentProject];
          desktopImage.setAttribute('data-src', 'dist/img/' + newProject.desktopImage);
          desktopImage.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
          desktopImage.className = "b-lazy desktop";
          mobileImage.setAttribute('data-src', 'dist/img/' + newProject.mobileImage);
          mobileImage.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
          mobileImage.className = "b-lazy mobile";
          bLazy.revalidate();
          if (newProject.siteLink) {
            that.projectsToggle.elements.addressBar.href = newProject.siteLink;
            that.projectsToggle.elements.addressBar.innerHTML = newProject.siteLink;
            that.projectsToggle.elements.projectLinkButton.href = newProject.siteLink;
            that.projectsToggle.elements.projectLinkButton.title = newProject.title;
            that.projectsToggle.elements.projectLinkButton.className = 'linkLikeAButton';
          } else {
            that.projectsToggle.elements.addressBar.href = '#';
            that.projectsToggle.elements.addressBar.innerHTML = newProject.title;
            that.projectsToggle.elements.projectLinkButton.className = 'linkLikeAButton hidden';
          }
          that.projectsToggle.elements.addressBar.title = newProject.title;
          that.projectsToggle.elements.projectDescription.innerHTML = newProject.description;
          that.projectsToggle.elements.projectMoreInfo.href = newProject.moreInfo;
          that.projectsToggle.elements.projectMoreInfo.title = newProject.title;
          that.panels[2].element.className = that.panels[2].element.className.replace(' transition', '');
          return false;
        }, 500);

      },


    },

    init: function() {

      this.element.className = '';

      var that = this;

      setTimeout(function() {
        that.panels[0].init();
        that.menu.opener.active();
      }, 2500);

      for (var i = 0; i < this.menu.triggerElements.length; i++) {
        this.menu.triggerElements[i].onclick = (this.menu.toggle.bind(this));
      }

      for (var j = 0; j < this.gentleScrollers.elements.length; j++) {
        this.gentleScrollers.elements[j].onclick = this.gentleScrollers.scroll;
      }

      for (var k = 0; k < this.toggleSkills.elements.length; k++) {
        this.toggleSkills.elements[k].onclick = this.toggleSkills.toggle;
      }

    },

    scroll: debounce(function() {

      var bodyHeight = this.doc.clientHeight;

      this.scrollPosition = (window.pageYOffset || this.doc.scrollTop) - (this.doc.clientTop || 0);

      if ((this.scrollPosition > (2 * bodyHeight) + (bodyHeight / 2))) {
        return this.updateActive(3);
      } else if (this.scrollPosition > (bodyHeight + (bodyHeight / 2))) {
        return this.updateActive(2);
      } else if (this.scrollPosition > (bodyHeight / 2)) {
        return this.updateActive(1);
      } else if (this.scrollPosition < (bodyHeight / 2)) {
        return this.updateActive(0, true);
      }

    }, 20),

    resize: debounce(function() {

      bLazy.revalidate();

    }, 200),

    jsonLoaded: function() {

      this.panels[2].element.className += ' loaded';
      var that = this;
      this.projectsToggle.elements.togglePrevious.onclick = function(e) {
        var evt = e || window.event;
        if (evt.preventDefault) {
          evt.preventDefault();
        } else {
          evt.returnValue = false;
        }
        that.projectsToggle.toggle.apply(that, [true]);
        return false;
      };
      this.projectsToggle.elements.toggleNext.onclick = function(e) {
        var evt = e || window.event;
        if (evt.preventDefault) {
          evt.preventDefault();
        } else {
          evt.returnValue = false;
        }
        that.projectsToggle.toggle.apply(that);
        return false;
      };

      return false;

    },

    updateActive: function(panel, defer) {

      if (this.activePanel === panel) {
        return false;
      }
      if (!defer) {
        this.panels[panel].init();
      }
      this.activePanel = panel;
      for (var i = 1; i < this.panels.length; i++) {
        if (i !== panel) {
          this.panels[i].exit();
        }
      }
      return false;

    }

  };

  // //assign window level listeners
  window.addEventListener('scroll', function() {
    landingPage.scroll();
  }, false);
  //
  window.addEventListener('load', function() {
    landingPage.init();
  }, false);

  window.addEventListener('resize', function() {
    landingPage.resize();
  }, false);

})();
