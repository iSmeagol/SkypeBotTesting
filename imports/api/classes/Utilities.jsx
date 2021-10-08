class Utilities {

  setupHandler(instance, target, cursor, transform) {
      let handle = cursor.observe({
          added: (doc) => {
              let id = doc._id;
              doc = transform(doc);
              doc.max = cursor.count();
              instance.added(target, id, doc);
          },
          changed: (doc) => {
              let id = doc._id;
              doc = transform(doc);
              doc.max = cursor.count();
              instance.changed(target, id, doc);
          },
          removed: (doc) => {
              instance.removed(target, doc._id);
          }
      });
      instance.onStop(() => {
          handle.stop();
      });
  }

  checkEmailFormat(string) {
      if (string) {
          let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
          return re.test(string);
      }
      return string;
  }

  checkURLFormat(str) {
      return /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i.test(str);
  }

  reverseObject(object) {
      let newObject = [];
      let keys = [];
      for (let key in object) {
          keys.push(key);
      }
      for (let i = keys.length - 1; i >= 0; i--) {

          let value = object[keys[i]];
          newObject.push(value);
      }

      return newObject;
  }

  affixResponse(instance, statusCode, headers, body) {
      if (instance) {
          instance.statusCode = statusCode;
          for (var head in headers) {
              instance.setHeader(head, headers[head]);
          }
          instance.write(body)
          instance.end();
      }
  }

  isNum(param) {
      let isnum = /^\d+$/.test(param);
      if (isnum)
          return true
      else
          return false
  }

  notifyClient(Notify, subject, message, options = {}, callback) {
      function notifyClick() {
          window.open(options.onClick, '_blank');
      }

      if (options.onClick)
          options.notifyClick = notifyClick;
      if (Notification.permission === "granted") {
          let myNotification = new Notify(subject, { body: message, ...options });
          myNotification.show();
          setTimeout(myNotification.close.bind(myNotification), 10000);
      } else if (Notification.permission !== 'denied') {
          Notification.requestPermission(function (permission) {
              if (permission === "granted") {
                  let myNotification = new Notify(subject, { body: message, ...options });
                  myNotification.show();
                  setTimeout(myNotification.close.bind(myNotification), 10000);
              }
          });
      }
      if (callback)
          callback();
  }

  duration(secs) {
      var x = moment.utc(secs * 1000);
      var dayNum = x.format('D') - 1;
      return ('0' + dayNum).slice(-2) + x.format(':HH:mm:ss');
  }

  formatDate(date) {
      return moment(date).format('MMMM DD, YYYY hh:mm A');
  }
  trunc(text, max) {
      return text.substr(0, max - 1) + (text.length > max ? '...' : '');
  }
  bytesToSize(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0) return '0 Byte';
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }
}
export default Util = new Utilities();
