/*
 * Scrollface - A basic jQuery slideshow

 * Copyright (c) 2012 Kyle Truscott
 *
 * http://keighl.github.com/scrollface
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function ($) {

  // ----------------------------------

  "use strict";

  var methods = {

    init : function (options) {

      return $(this).each(function () {

        var $this  = $(this),
        data       = $(this).data('scrollface'),
        settings   = {
          pager              : null,
          pager_builder      : methods.pager_builder,
          next               : null,
          prev               : null,
          active_pager_class : 'active',
          speed              : 300,
          easing             : 'linear',
          auto               : true,
          interval           : 2000,
          before             : methods.before,
          after              : methods.after,
          transition         : "horizontal"
        };

        if (!data) {

          if (options) {
            $.extend(settings, options);
          }

          settings.slides    = $(this).children();
          settings.count     = settings.slides.size();
          settings.height    = $(this).height();
          settings.width     = $(this).width();
          settings.index     = 0;
          settings.is_moving = false;
          settings.timer     = null;

          /*
          * Drop the init if there are zero or 1 slides
          */

          if (settings.slides.length <= 1) {
            return false;
          }

          /*
          * Force absolute position on wrapper element
          */

          $(this).css({ position : 'absolute' });

          /*
          * Force absolute position on slide elements
          * Place first in view - others off screen
          */

          $(settings.slides).each(function (i, e) {

            $(e).css({
              position : 'absolute',
              left     : (i === 0) ? 0 : settings.width * 100, // really push this off screen
              top      : 0,
              display  : (i === 0) ? 'block' : 'none'
            });

            /*
            * Setup pager
            */

            var anchor = null;

            if ($(settings.pager).size()) {

              if (typeof settings.pager_builder === "function") {

                /*
                * Send a message to the callback (plugin or user defined)
                * -> the pager object
                * -> the slide index
                * -> the slide object
                * User must return an achor object
                */

                anchor = settings.pager_builder.call($this, settings.pager, i, e);

                if (i === 0) {
                  $(anchor).addClass(settings.active_pager_class);
                }

                $(anchor).bind('click.scrollface', function () {
                  methods.interrupt.call($this);
                  methods.step_to.call($this, i);
                  return false;
                });

              }

            }

          });

          /*
          * Setup up next bindings
          */

          if ($(settings.next).size()) {

            $(settings.next).bind('click.scrollface', function (e) {
              methods.interrupt.call($this);
              methods.next.call($this);
            });

          }

          /*
          * Setup up prev bindings
          */

          if ($(settings.prev).size()) {

            $(settings.prev).bind('click.scrollface', function (e) {
              methods.interrupt.call($this);
              methods.prev.call($this);
            });

          }

          /*
          * Store all this stuff as data
          */

          $(this).data('scrollface', settings);

          /*
          * Setup auto interval
          */

          if (settings.auto) {
            methods.start.call($this);
          }

        }

      });

    },

    // --------------------------------

    destroy : function () {

      return $(this).each(function () {

        var data = $(this).data('scrollface');

        if (data) {

          /*
          * Unbind prev / next events
          */

          if ($(data.next).size()) {
            $(data.next).unbind('click.scrollface');
          }

          if ($(data.prev).size()) {
            $(data.prev).unbind('click.scrollface');
          }

          /*
          * Remove the settings object
          */

          $(this).data('scrollface', null);

        } else {

          return false;

        }

      });

    },

    // --------------------------------

    /*
    * Move to a given slide index
    * index -> slide index
    * options = {
      speed : ...
      easing : ...
      direction : ...
      transition : ...
    }
    */

    step_to: function (index, user_options) {

      return $(this).each(function () {

        var data = $(this).data('scrollface');

        if (!data) {
          return false;
        }

        /*
        * Exit if
        * -> the slide is in moving
        * -> the index is the current slide
        * -> the index does not exist
        */

        if (!data.is_moving && index !== data.index && index <= (data.count - 1) && index >= 0) {

          data.is_moving = true;

          /*
          * Set default transition_options, and merge with user supplied ones
          */

          var options = {
            speed      : data.speed,
            easing     : data.easing,
            direction  : null,
            transition : data.transition
          };

          if (user_options) {
            $.extend(options, user_options);
          }

          /*
          * Set direction if none was supplied
          * Usually need when users click pageer anchors
          */

          if (!options.direction) {
            if (index > data.index) {
              options.direction = "advance";
            }
            if (index < data.index) {
              options.direction = "retreat";
            }
          }

          /*
          * Update the pager, if it's there
          */

          if ($(data.pager).size()) {
            $('a', data.pager).removeClass(data.active_pager_class);
            $('a', data.pager).eq(index).addClass(data.active_pager_class);
          }

          /*
          * Run the BEFORE callback
          * include both id and idx
          * id is deprecated
          */

          if (typeof data.before === "function") {

            var old_slide = {
              id    : data.index,
              idx   : data.index,
              slide : $(data.slides[data.index])
            },
            new_slide = {
              id    : index,
              idx   : index,
              slide : $(data.slides[index])
            };

            data.before.call(this, old_slide, new_slide);

          }

          /*
          * Run the transition (user defined or preassigned)
          */

          transitions[options.transition].call(this, index, options);

        }

      });

    },

    // -------------------------------

    next: function (user_options) {

      return $(this).each(function () {

        var data = $(this).data('scrollface');

        if (!data) {
          return false;
        }

        var index = (data.index === data.count - 1) ? 0 : data.index + 1;

        /*
        * Set default transition_options, and merge with user supplied ones
        * Only one here that is required to be passed on to step_to is DIRECTION
        * step_two will do another merge for the other attributes later on
        */

        var options = {
          direction  : "advance"
        };

        if (user_options) {
          $.extend(options, user_options);
        }

        methods.step_to.call(this, index, options);

      });

    },

    // -------------------------------

    prev: function (user_options) {

      return $(this).each(function () {

        var data = $(this).data('scrollface');

        if (!data) {
          return false;
        }

        var index = (data.index === 0) ? data.count - 1 : data.index - 1;

        /*
        * Set default transition_options, and merge with user supplied ones
        * Only one here that is required to be passed on to step_to is DIRECTION
        * step_two will do another merge for the other attributes later on
        */

        var options = {
          direction  : "retreat"
        };

        if (user_options) {
          $.extend(options, user_options);
        }

        methods.step_to.call(this, index, options);

      });

    },

    // -------------------------------

    start: function () {

      return $(this).each(function () {

        var data = $(this).data('scrollface');

        if (!data) {
          return false;
        }

        var $this = this;

        /*
        * Only start the timer if one isn't currently moving
        */

        if (!data.timer) {

          data.timer = setInterval(function () {
            methods.next.call($this);
          }, data.interval);

        }

      });

    },

    // -------------------------------

    stop: function () {

      return $(this).each(function () {

        var data = $(this).data('scrollface');

        if (!data) {
          return false;
        }

        if (data.timer) {

          clearInterval(data.timer);
          data.timer = null;

        }

      });

    },

    //---------------------------------

    interrupt: function (time) {

      return $(this).each(function () {

        var data = $(this).data('scrollface');

        if (!data) {
          return false;
        }

        var $this = $(this),
        period    = 0;

        /*
        * Stop the timer, and wait a period of time before restarting it.
        * Period defaults to the timer interval
        */

        if (data.timer) {

          if (typeof time !== "number") {
            period = data.interval;
          } else {
            period = time;
          }

          methods.stop.call(this);

          setTimeout(function resume_timer () {
            methods.start.call($this);
          }, period);

        }

      });

    },

    //---------------------------------

    pager_builder: function (pager, index, slide) {

      var anchor = $(document.createElement('a'))
        .html(index + 1)
        .appendTo($(pager));

      return anchor;

    },

    //---------------------------------

    /*
    old_slide = {
      idx : #,
      slide : $() object
    }
    new_slide = {
      idx : #,
      slide : $() object
    }
    */

    before: function (old_slide, new_slide) {
      return true;
    },

    //---------------------------------

    /*
    old_slide = {
      idx : #,
      slide : $() object
    }
    new_slide = {
      idx : #,
      slide : $() object
    }
    */

    after: function (old_slide, new_slide) {
      return true;
    }

  };

  // ----------------------------------

  var transitions = {

    horizontal: function (index, options) {

      var data = $(this).data('scrollface');

      if (!data) {
        return false;
      }

      /*
      * Calculate current position of current slide and container
      */

      var curr_container_pos = parseInt($(this).css('left'), 10) || 0,
      curr_slide             = $(data.slides[data.index]),
      curr_slide_left_pos    = parseInt($(curr_slide).css('left'), 10) || 0,
      curr_slide_top_pos     = parseInt($(curr_slide).css('top'), 10) || 0;

      /*
      * Calculate the position for the next slide
      * Place the next slide either to the right or left of the current slide
      */

      var next_slide_left_pos = (options.direction === "advance")
        ? curr_slide_left_pos + data.width
        : curr_slide_left_pos - data.width;

      var next_slide = $(data.slides[index])
        .css({
          left : next_slide_left_pos,
          top  : curr_slide_top_pos
        }).show();

      /*
      * Calculate the new wrapper position
      */

      var new_container_pos = (options.direction === "advance")
          ? curr_container_pos - data.width
          : curr_container_pos + data.width;

      /*
      * Animate the slides wrapper
      */

      $(this).stop().animate({
        left : new_container_pos
      }, options.speed, options.easing, function () {


        /*
        * Run the BEFORE callback
        * include both id and idx
        * id is deprecated
        */

        if (typeof data.after === "function") {

          var old_slide = {
            id    : data.index,
            idx   : data.index,
            slide : $(data.slides[data.index])
          },
          new_slide = {
            id    : index,
            idx   : index,
            slide : $(data.slides[index])
          };

          data.after.call(this, old_slide, new_slide);

        }

        /*
        * Update the slideshow data, and hide the slide we just removed
        */

        $(curr_slide).hide();
        data.index     = index;
        data.is_moving = false;

      });

    },

    vertical: function (index, options) {

      var data = $(this).data('scrollface');

      if (!data) {
        return false;
      }

      /*
      * Calculate current position of current slide and container
      */

      var curr_container_pos = parseInt($(this).css('top'), 10) || 0,
      curr_slide             = $(data.slides[data.index]),
      curr_slide_top_pos     = parseInt($(curr_slide).css('top'), 10) || 0,
      curr_slide_left_pos    = parseInt($(curr_slide).css('left'), 10) || 0;

      /*
      * Calculate the position for the next slide
      * Place the next slide either to the top or bottom of the current slide
      */

      var next_slide_top_pos = (options.direction === "advance")
          ? curr_slide_top_pos + data.height
          : curr_slide_top_pos - data.height;

      var next_slide = $(data.slides[index])
        .css({
          top  : next_slide_top_pos,
          left : curr_slide_left_pos
        }).show();

      /*
      * Calculate the new wrapper position
      */

      var new_container_pos = (options.direction === "advance")
          ? curr_container_pos - data.height
          : curr_container_pos + data.height;

      /*
      * Animate the slides wrapper
      */

      $(this).stop().animate({
        top : new_container_pos
      }, options.speed, options.easing, function () {

        /*
        * Run the BEFORE callback
        * include both id and idx
        * id is deprecated
        */

        if (typeof data.after === "function") {

          var old_slide = {
            id    : data.index,
            idx   : data.index,
            slide : $(data.slides[data.index])
          },
          new_slide = {
            id    : index,
            idx   : index,
            slide : $(data.slides[index])
          };

          data.after.call(this, old_slide, new_slide);

        }

        /*
        * Update the slideshow data, and hide the slide we just removed
        */

        $(curr_slide).hide();
        data.index     = index;
        data.is_moving = false;

      });

    },

    fade: function (index, options) {

      var data = $(this).data('scrollface');

      if (!data) {
        return false;
      }

      /*
      * Current slide
      * Set the z-index: 0
      */

      var curr_slide = $(data.slides[data.index])
        .css({
          zIndex : 0
        });

      var curr_slide_top_pos = parseInt($(curr_slide).css('top'), 10) || 0,
      curr_slide_left_pos    = parseInt($(curr_slide).css('left'), 10) || 0;

      /*
      * Next slide
      * Set the z-index: 1
      */

      var next_slide = $(data.slides[index])
        .css({
          left   : curr_slide_left_pos,
          top    : curr_slide_top_pos,
          zIndex : 1
        });

      /*
      * FadeIn the next slide
      */

      $(next_slide).fadeTo(data.speed, 1.0, function () {

        $(curr_slide).css({ left : data.width, zIndex : 0 }).hide();

        /*
        * Run the BEFORE callback
        * include both id and idx
        * id is deprecated
        */

        if (typeof data.after === "function") {

          var old_slide = {
            id    : data.index,
            idx   : data.index,
            slide : $(data.slides[data.index])
          },
          new_slide = {
            id    : index,
            idx   : index,
            slide : $(data.slides[index])
          };

          data.after.call(this, old_slide, new_slide);

        }

        /*
        * Update the slideshow data, and hide the slide we just removed
        */

        $(curr_slide).hide();
        data.index     = index;
        data.is_moving = false;

      });

    },

    random: function (index, options) {

      var data = $(this).data('scrollface');

      if (!data) {
        return false;
      }

      var available_transitions = ["horizontal", "vertical", "fade"];

      /*
      * Choose a random transition
      */

      var transition = available_transitions[Math.floor(Math.random() * available_transitions.length)];

      transitions[transition].call(this, index, options);

    }

  };

  // ----------------------------------

  $.fn.scrollface = function (method) {

    if (methods[method]) {

      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

    } else if (typeof method === 'object' || !method) {

      return methods.init.apply(this, arguments);

    } else {

      $.error('Method ' +  method + ' does not exist on jQuery.scrollface!');

    }

  };

}(jQuery));