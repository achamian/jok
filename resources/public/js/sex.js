// Generated by CoffeeScript 1.3.3
(function() {
  var Files, Uploader,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Uploader = (function() {

    function Uploader(settings) {
      this.settings = settings;
    }

    Uploader.prototype.send = function(file, $element) {
      var data, event, xhr, _i, _len, _ref;
      xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status < 300) {
            return $element.trigger('ajax:success', [xhr, xhr.responseText]);
          } else {
            return $element.trigger('ajax:error', xhr);
          }
        }
      };
      if (xhr.upload != null) {
        _ref = ["abort", "error", "load", "loadstart", "progress"];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          event = _ref[_i];
          xhr.upload.addEventListener(event, function(p) {
            return $element.trigger("upload:" + event, [xhr, p]);
          }, false);
        }
      }
      xhr.open(this.settings.method, this.settings.url);
      data = new FormData();
      data.append("file", file);
      return xhr.send(data);
    };

    return Uploader;

  })();

  window.Uploader = Uploader;

  Files = (function() {

    function Files() {
      this.render = __bind(this.render, this);
      this.loggedIn = $('.logged-in').length;
      this.validFiles = $('body').attr('data-accept');
      this.notification = new FileNotification('#notifications', '#file-notification');
      this.uploader = new Uploader({
        method: 'POST',
        url: '/library/upload'
      });
      document.addEventListener("dragenter", this.stopActions, false);
      document.addEventListener("dragexit", this.stopActions, false);
      document.addEventListener("dragover", this.stopActions, false);
      document.addEventListener("drop", this.stopActions, false);
      document.addEventListener("drop", this.render, false);
    }

    Files.prototype.isAcceptable = function(type) {
      return new RegExp(this.validFiles, 'gi').test(type);
    };

    Files.prototype.render = function(evt) {
      var $element, file, _i, _len, _ref, _results;
      _ref = evt.dataTransfer.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        $element = this.notification.render({
          name: file.name,
          size: this.sizeInMb(file.size)
        });
        if (this.isAcceptable(file.type)) {
          _results.push(this.uploader.send(file, $element));
        } else {
          _results.push($element.trigger('ajax:error', ["file type is invalid"]));
        }
      }
      return _results;
    };

    Files.prototype.sizeInMb = function(size) {
      return Math.round(parseInt(size) / 1048576);
    };

    Files.prototype.stopActions = function(evt) {
      evt.stopPropagation();
      return evt.preventDefault();
    };

    return Files;

  })();

  $(function() {
    return new Files;
  });

}).call(this);
