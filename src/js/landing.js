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
                    toggleProjects.init(JSON.parse(request.response).projects);
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

    var toggleProjectBase = document.getElementById('work');

    var toggleProjects = {

        elements: {
            current: toggleProjectBase.getElementsByClassName('current')[0],
        },

        index: 0,

        data: [],

        transitioning: false,

        init: function(remoteData) {
            this.data = remoteData;
            this.assign();
        },

        assign: function() {
            var leftIndex = this.index - 1 > -1 ? this.index - 1 : this.data.length - 1;
            var rightIndex = this.index + 1 < this.data.length ? this.index + 1 : 0;
            var elements = [toggleProjectBase.getElementsByClassName('leftPreview')[0], toggleProjectBase.getElementsByClassName('rightPreview')[0]];
            var imgBase = './dist/img/';

            for (var i = 0; i < elements.length; i++) {
                var project;
                if (i === 0) {
                    project = this.data[leftIndex];
                } else {
                    project = this.data[rightIndex];
                }
                elements[i].getElementsByClassName('desktop')[0].src = imgBase + project.desktopImage;
                elements[i].getElementsByClassName('mobile')[0].src = imgBase + project.mobileImage;
                var link = elements[i].getElementsByClassName('addressLink')[0];
                link.innerHTML = project.title;
                link.title = project.title;
                if (project.siteLink) {
                    link.href = project.title;
                } else {
                    link.href = project.moreInfo;
                }
            }
        },

        move: function(direction) {
            if (this.transitioning) {
                return false;
            }
            this.transitioning = true;

            toggleProjectBase.className += 'transition move' + direction;

            if (direction === 'left') {
                if (this.index - 1 > -1) {
                    this.index--;
                } else {
                    this.index = this.data.length - 1;
                }
                newCurrent = toggleProjectBase.getElementsByClassName('rightPreview')[0];
            } else {
                if (this.index + 1 < this.data.length) {
                    this.index++;
                } else {
                    this.index = 0;
                }
                newCurrent = toggleProjectBase.getElementsByClassName('leftPreview')[0];
            }
            var currentItem = this.data[this.index];
            var current = toggleProjectBase.getElementsByClassName('current')[0];
            var newCurrent;


            window.setTimeout(function() {

                document.getElementById('projectDescription').innerHTML = currentItem.description;

                var linkButton = document.getElementById('projectLinkButton');
                var infoButton = document.getElementById('projectMoreInfo');
                if (currentItem.siteLink) {
                    linkButton.style.display = "inline-block";
                    linkButton.href = currentItem.siteLink;
                    linkButton.title = currentItem.title;
                } else {
                    linkButton.style.display = "none";
                }
                infoButton.href = currentItem.moreInfo;
                infoButton.title = currentItem.title;
                newCurrent.className = "browser current";
                if (direction === 'left') {
                    current.className = "browser rightPreview";
                } else {
                    current.className = "browser leftPreview";
                }
                toggleProjects.assign();
                toggleProjectBase.className = '';
                toggleProjects.transitioning = false;
            }, 600);


        },

    };

    document.getElementById('previousProject').addEventListener('click', function(e) {
        var evt = e || window.event;
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
        toggleProjects.move('left');
        return false;
    }, false);
    document.getElementById('nextProject').addEventListener('click', function(e) {
        var evt = e || window.event;
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
        toggleProjects.move('right');
        return false;
    }, false);

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
