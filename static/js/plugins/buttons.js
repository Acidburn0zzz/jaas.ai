/*
Copyright (c) 2016, なつき
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
(function() {
  var ButtonAnchor, ButtonFrame, ButtonFrameContent, CONFIG_ANCHOR_CLASS, CONFIG_API, CONFIG_ICON_CLASS, CONFIG_ICON_DEFAULT, CONFIG_URL, CONFIG_UUID, Deferred, Element, EventTarget, Frame, Hash, NumberHelper, ObjectHelper, QueryString, document, window,
    slice = [].slice,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window = this;

  document = window.document;

  CONFIG_API = "https://api.github.com";

  CONFIG_ANCHOR_CLASS = "github-button";

  CONFIG_ICON_CLASS = "octicon";

  CONFIG_ICON_DEFAULT = CONFIG_ICON_CLASS + "-mark-github";

  CONFIG_URL = "https://buttons.github.io/";

  CONFIG_UUID = "faa75404-3b97-5585-b449-4bc51338fbd1";

  ObjectHelper = (function() {
    function ObjectHelper() {}

    ObjectHelper.deepProperty = function(obj, path) {
      var key, key_path, match;
      if (path == null) {
        return obj;
      }
      key_path = path.split(/\.|(?=\[\d+\])/);
      while (key_path.length && (obj != null)) {
        key = key_path.shift();
        if (match = key.match(/^\[(\d+)\]$/)) {
          key = +match[1];
        }
        obj = obj[key];
      }
      return obj;
    };

    return ObjectHelper;

  })();

  NumberHelper = (function() {
    function NumberHelper() {}

    NumberHelper.numberWithDelimiter = function(number) {
      return ("" + number).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return NumberHelper;

  })();

  QueryString = (function() {
    function QueryString() {}

    QueryString.stringify = function(obj) {
      var key, results, value;
      results = [];
      for (key in obj) {
        value = obj[key];
        results.push((encodeURIComponent(key)) + "=" + (value != null ? encodeURIComponent(value) : ""));
      }
      return results.join("&");
    };

    QueryString.parse = function(str) {
      var j, key, len, obj, pair, ref, ref1, value;
      obj = {};
      ref = str.split("&");
      for (j = 0, len = ref.length; j < len; j++) {
        pair = ref[j];
        if (!(pair !== "")) {
          continue;
        }
        ref1 = pair.split("="), key = ref1[0], value = 2 <= ref1.length ? slice.call(ref1, 1) : [];
        if (key !== "") {
          obj[decodeURIComponent(key)] = decodeURIComponent(value.join("="));
        }
      }
      return obj;
    };

    return QueryString;

  })();

  Hash = (function() {
    function Hash() {}

    Hash.encode = function(data) {
      return "#" + QueryString.stringify(data);
    };

    Hash.decode = function(data) {
      if (data == null) {
        data = document.location.hash;
      }
      return (QueryString.parse(data.replace(/^#/, ""))) || {};
    };

    return Hash;

  })();

  EventTarget = (function() {
    var addEventListener, removeEventListener;

    function EventTarget($) {
      this.$ = $;
    }

    EventTarget.prototype.on = function() {
      var callback, eventName, events, func, j, k, len;
      events = 2 <= arguments.length ? slice.call(arguments, 0, j = arguments.length - 1) : (j = 0, []), func = arguments[j++];
      callback = (function(_this) {
        return function(event) {
          return func.call(_this, event || window.event);
        };
      })(this);
      for (k = 0, len = events.length; k < len; k++) {
        eventName = events[k];
        addEventListener(this.$, eventName, callback);
      }
    };

    EventTarget.prototype.once = function() {
      var callback, eventName, events, func, j, k, len;
      events = 2 <= arguments.length ? slice.call(arguments, 0, j = arguments.length - 1) : (j = 0, []), func = arguments[j++];
      callback = (function(_this) {
        return function(event) {
          var eventName, k, len;
          for (k = 0, len = events.length; k < len; k++) {
            eventName = events[k];
            removeEventListener(_this.$, eventName, callback);
          }
          return func.call(_this, event || window.event);
        };
      })(this);
      for (k = 0, len = events.length; k < len; k++) {
        eventName = events[k];
        addEventListener(this.$, eventName, callback);
      }
    };

    addEventListener = function(element, event, func) {
      if (element.addEventListener) {
        element.addEventListener("" + event, func);
      } else {
        element.attachEvent("on" + event, func);
      }
    };

    removeEventListener = function(element, event, func) {
      if (element.removeEventListener) {
        element.removeEventListener("" + event, func);
      } else {
        element.detachEvent("on" + event, func);
      }
    };

    return EventTarget;

  })();

  Element = (function(superClass) {
    extend(Element, superClass);

    function Element(element, callback) {
      this.$ = element && element.nodeType === 1 ? element : document.createElement(element);
      if (callback) {
        callback.call(this, this.$);
      }
    }

    return Element;

  })(EventTarget);

  Frame = (function(superClass) {
    var devicePixelRatio, roundPixel;

    extend(Frame, superClass);

    function Frame(callback) {
      Frame.__super__.constructor.call(this, "iframe", function(iframe) {
        var key, ref, value;
        ref = {
          allowtransparency: true,
          scrolling: "no",
          frameBorder: 0
        };
        for (key in ref) {
          value = ref[key];
          iframe.setAttribute(key, value);
        }
        iframe.style.cssText = "width: 1px; height: 0; border: none";
        iframe.src = "javascript:0";
        if (callback) {
          callback.call(this, iframe);
        }
      });
    }

    Frame.prototype.html = function(html) {
      var contentDocument;
      try {
        contentDocument = this.$.contentWindow.document;
        contentDocument.open().write(html);
        contentDocument.close();
      } catch (error) {}
    };

    Frame.prototype.load = function(src) {
      this.$.src = src;
    };

    Frame.prototype.size = function() {
      var body, boundingClientRect, contentDocument, height, html, width;
      try {
        contentDocument = this.$.contentWindow.document;
        html = contentDocument.documentElement;
        body = contentDocument.body;
        width = html.scrollWidth;
        height = html.scrollHeight;
        if (body.getBoundingClientRect) {
          body.style.display = "inline-block";
          boundingClientRect = body.getBoundingClientRect();
          width = Math.max(width, roundPixel(boundingClientRect.width || boundingClientRect.right - boundingClientRect.left));
          height = Math.max(height, roundPixel(boundingClientRect.height || boundingClientRect.bottom - boundingClientRect.top));
          body.style.display = "";
        }
        return {
          width: width + "px",
          height: height + "px"
        };
      } catch (error) {}
    };

    Frame.prototype.resize = function(arg) {
      var height, ref, width;
      ref = arg != null ? arg : this.size() || {}, width = ref.width, height = ref.height;
      if (width) {
        this.$.style.width = width;
      }
      if (height) {
        this.$.style.height = height;
      }
    };

    devicePixelRatio = window.devicePixelRatio || 1;

    roundPixel = function(px) {
      return (devicePixelRatio > 1 ? Math.ceil(Math.round(px * devicePixelRatio) / devicePixelRatio * 2) / 2 : Math.ceil(px)) || 0;
    };

    return Frame;

  })(Element);

  ButtonAnchor = (function() {
    function ButtonAnchor() {}

    ButtonAnchor.parse = function(element) {
      var attribute, j, len, options, ref;
      options = {
        "href": element.href,
        "text": element.getAttribute("data-text") || element.textContent || element.innerText || ""
      };
      ref = ["data-count-api", "data-count-href", "data-count-aria-label", "data-style", "data-icon", "aria-label"];
      for (j = 0, len = ref.length; j < len; j++) {
        attribute = ref[j];
        options[attribute] = element.getAttribute(attribute) || "";
      }
      return options;
    };

    return ButtonAnchor;

  })();

  ButtonFrame = (function(superClass) {
    extend(ButtonFrame, superClass);

    function ButtonFrame(hash, beforeload, callback) {
      var reload;
      ButtonFrame.__super__.constructor.call(this, beforeload);
      reload = (function(_this) {
        return function() {
          var size;
          reload = null;
          size = _this.size();
          _this.$.parentNode.removeChild(_this.$);
          _this.once("load", function() {
            this.resize(size);
          });
          _this.load(CONFIG_URL + "buttons.html" + hash);
          if (callback) {
            callback.call(_this, _this.$);
          }
        };
      })(this);
      this.once("load", function() {
        var jsonp_callback;
        if (jsonp_callback = this.$.contentWindow.callback) {
          new Element(jsonp_callback.script, function(script) {
            this.on("load", "error", function() {
              if (reload) {
                reload();
              }
            });
            if (script.readyState) {
              this.on("readystatechange", function() {
                if (!/i/.test(script.readyState) && reload) {
                  reload();
                }
              });
            }
          });
        } else {
          reload();
        }
      });
      this.html("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>" + CONFIG_UUID + "</title><link rel=\"stylesheet\" href=\"" + CONFIG_URL + "assets/css/buttons.css\"><script>document.location.hash = \"" + hash + "\";</script></head><body><script src=\"" + CONFIG_URL + "buttons.js\"></script></body></html>");
    }

    return ButtonFrame;

  })(Frame);

  ButtonFrameContent = (function() {
    var Anchor;

    function ButtonFrameContent(options) {
      if (options) {
        document.body.className = options["data-style"] || "";
        new Anchor(options.href, null, function(a) {
          var aria_label;
          a.className = "button";
          if (aria_label = options["aria-label"]) {
            a.setAttribute("aria-label", aria_label);
          }
          new Element("i", function(i) {
            i.className = CONFIG_ICON_CLASS + " " + (options["data-icon"] || CONFIG_ICON_DEFAULT);
            i.setAttribute("aria-hidden", "true");
            a.appendChild(i);
          });
          a.appendChild(document.createTextNode(" "));
          new Element("span", function(span) {
            if (options.text) {
              span.appendChild(document.createTextNode(options.text));
            }
            a.appendChild(span);
          });
          document.body.appendChild(a);
        });
        (function() {
          var api;
          if (api = options["data-count-api"]) {
            new Anchor(options["data-count-href"] || options.href, options.href, function(a) {
              a.className = "count";
              new Element("b", function(b) {
                a.appendChild(b);
              });
              new Element("i", function(i) {
                a.appendChild(i);
              });
              new Element("span", function(span) {
                new Element("script", function(script) {
                  var head;
                  script.async = true;
                  script.src = CONFIG_API + (function() {
                    var path, query;
                    path = api.replace(/^(?!\/)/, "/").split("#")[0];
                    query = QueryString.parse(path.split("?").slice(1).join("?"));
                    query.callback = "callback";
                    return (path.split("?")[0]) + "?" + (QueryString.stringify(query));
                  })();
                  window.callback = function(json) {
                    var aria_label, data;
                    window.callback = null;
                    if (json.meta.status === 200) {
                      data = ObjectHelper.deepProperty(json.data, api.split("#").slice(1).join("#"));
                      if ("[object Number]" === {}.toString.call(data)) {
                        data = NumberHelper.numberWithDelimiter(data);
                      }
                      span.appendChild(document.createTextNode(data));
                      a.appendChild(span);
                      if (aria_label = options["data-count-aria-label"]) {
                        a.setAttribute("aria-label", aria_label.replace("#", data));
                      }
                      document.body.appendChild(a);
                    }
                  };
                  window.callback.script = script;
                  this.on("error", function() {
                    window.callback = null;
                  });
                  if (script.readyState) {
                    this.on("readystatechange", function() {
                      if (script.readyState === "loaded" && script.children && script.readyState === "loading") {
                        window.callback = null;
                      }
                    });
                  }
                  head = document.getElementsByTagName("head")[0];
                  if ("[object Opera]" === {}.toString.call(window.opera)) {
                    new EventTarget(document).on("DOMContentLoaded", function() {
                      head.appendChild(script);
                    });
                  } else {
                    head.appendChild(script);
                  }
                });
              });
            });
          }
        })();
      }
    }

    Anchor = (function(superClass) {
      var base, javascript, r_archive, r_hostname;

      extend(Anchor, superClass);

      function Anchor(urlString, baseURLstring, callback) {
        Anchor.__super__.constructor.call(this, "a", function(a) {
          if (base) {
            if ((a.href = baseURLstring) && a.protocol !== javascript) {
              try {
                a.href = new URL(urlString, baseURLstring).href;
              } catch (error) {
                base.href = baseURLstring;
                a.href = urlString;
                new Element("div", function(div) {
                  div.innerHTML = a.outerHTML;
                  a.href = div.lastChild.href;
                  div = null;
                });
                base.href = document.location.href;
                base.removeAttribute("href");
              }
            } else {
              a.href = urlString;
            }
            if (r_archive.test(a.href)) {
              a.target = "_top";
            }
            if (a.protocol === javascript || !r_hostname.test("." + a.hostname)) {
              a.href = "#";
              a.target = "_self";
            }
          }
          callback(a);
        });
      }

      base = document.getElementsByTagName("base")[0];

      javascript = "javascript:";

      r_hostname = /\.github\.com$/;

      r_archive = /^https?:\/\/((gist\.)?github\.com\/[^\/]+\/[^\/]+\/archive\/|github\.com\/[^\/]+\/[^\/]+\/releases\/download\/|codeload\.github\.com\/)/;

      return Anchor;

    })(Element);

    return ButtonFrameContent;

  })();

  Deferred = (function() {
    function Deferred(func) {
      var callback;
      if (/m/.test(document.readyState) || (!/g/.test(document.readyState) && !document.documentElement.doScroll)) {
        window.setTimeout(func);
      } else {
        if (document.addEventListener) {
          new EventTarget(document).once("DOMContentLoaded", func);
        } else {
          callback = function() {
            if (/m/.test(document.readyState)) {
              document.detachEvent("onreadystatechange", callback);
              if (func) {
                func();
              }
            }
          };
          document.attachEvent("onreadystatechange", callback);
        }
      }
    }

    return Deferred;

  })();

  if (document.title === CONFIG_UUID) {
    new ButtonFrameContent(Hash.decode());
  } else {
    new Deferred(function() {
      var a, anchor, anchors, fn, j, len;
      if (document.querySelectorAll) {
        anchors = document.querySelectorAll("a." + CONFIG_ANCHOR_CLASS);
      } else {
        anchors = (function() {
          var j, len, ref, results1;
          ref = document.getElementsByTagName("a");
          results1 = [];
          for (j = 0, len = ref.length; j < len; j++) {
            a = ref[j];
            if (~(" " + a.className + " ").replace(/[ \t\n\f\r]+/g, " ").indexOf(" " + CONFIG_ANCHOR_CLASS + " ")) {
              results1.push(a);
            }
          }
          return results1;
        })();
      }
      fn = function(a) {
        new ButtonFrame(Hash.encode(ButtonAnchor.parse(a)), function(iframe) {
          document.body.appendChild(iframe);
        }, function(iframe) {
          a.parentNode.replaceChild(iframe, a);
        });
      };
      for (j = 0, len = anchors.length; j < len; j++) {
        anchor = anchors[j];
        fn(anchor);
      }
    });
  }

}).call(this);
