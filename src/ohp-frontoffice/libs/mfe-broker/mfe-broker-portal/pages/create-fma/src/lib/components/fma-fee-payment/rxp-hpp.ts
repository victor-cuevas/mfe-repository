export const RealexHpp = (function () {
  ('use strict');

  let hppUrl = 'https://pay.realexpayments.com/pay';
  const devUrl = 'https://pay.sandbox.realexpayments.com/pay';
  const prdUrl = 'https://pay.realexpayments.com/pay';

  const randomId: string = Math.random().toString(16).substr(2, 8);

  const setHppUrl = function (isPrd: boolean) {
    hppUrl = isPrd ? prdUrl : devUrl;
  };

  let mobileXSLowerBound = 360;
  const setMobileXSLowerBound = function (lowerBound: any) {
    mobileXSLowerBound = lowerBound;
  };

  const isWindowsMobileOs = /Windows Phone|IEMobile/.test(navigator.userAgent);
  const isAndroidOrIOs = /Android|iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMobileXS = function () {
    return (
      (window.innerWidth > 0 ? window.innerWidth : screen.width) <= mobileXSLowerBound ||
      (window.innerHeight > 0 ? window.innerHeight : screen.height) <= mobileXSLowerBound
    );
  };

  // Display IFrame on WIndows Phone OS mobile devices
  const isMobileIFrame = isWindowsMobileOs;

  // For IOs/Android and small screen devices always open in new tab/window
  const isMobileNewTab = function () {
    return !isWindowsMobileOs && (isAndroidOrIOs || isMobileXS());
  };

  let tabWindow: Window | null;

  let redirectUrl: string;

  const internal = {
    evtMsg: [] as any,
    addEvtMsgListener: function (evtMsgFct: any) {
      this.evtMsg.push({ fct: evtMsgFct, opt: false });
      if (window.addEventListener) {
        window.addEventListener('message', evtMsgFct, false);
      } else {
        (<any>window).attachEvent('message', evtMsgFct);
      }
    },
    removeOldEvtMsgListener: function () {
      if (this.evtMsg.length > 0) {
        const evt = this.evtMsg.pop();
        if ((<any>window).addEventListener) {
          window.removeEventListener('message', evt.fct, evt.opt);
        } else {
          (<any>window).detachEvent('message', evt.fct);
        }
      }
    },
    base64: {
      encode: function (input: string) {
        const keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/' + '=';
        input = escape(input);
        let output = '';
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 0;

        do {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }

          output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
          chr1 = chr2 = chr3 = '';
          enc1 = enc2 = enc3 = enc4 = '';
        } while (i < input.length);

        return output;
      },
      decode: function (input: string) {
        if (typeof input === 'undefined') {
          return input;
        }
        const keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/' + '=';
        let output = '';
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        const base64test = /[^A-Za-z0-9+/=]/g;
        if (base64test.exec(input)) {
          throw new Error(
            'There were invalid base64 characters in the input text.\n' +
              "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
              'Expect errors in decoding.',
          );
        }
        input = input.replace(/[^A-Za-z0-9+/=]/g, '');

        do {
          enc1 = keyStr.indexOf(input.charAt(i++));
          enc2 = keyStr.indexOf(input.charAt(i++));
          enc3 = keyStr.indexOf(input.charAt(i++));
          enc4 = keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
          }

          chr1 = chr2 = chr3 = '';
          enc1 = enc2 = enc3 = enc4 = '';
        } while (i < input.length);

        return unescape(output);
      },
    },
    decodeAnswer: function (answer: string) {
      //internal.decodeAnswer

      let _r;

      try {
        _r = JSON.parse(answer);
      } catch (e) {
        _r = { error: true, message: answer };
      }

      try {
        for (const r in _r) {
          if (_r[r]) {
            _r[r] = internal.base64.decode(_r[r]);
          }
        }
      } catch (e) {
        /** */
      }
      return _r;
    },
    createFormHiddenInput: function (name: string, value: string) {
      const el = document.createElement('input');
      el.setAttribute('type', 'hidden');
      el.setAttribute('name', name);
      el.setAttribute('value', value);
      return el;
    },

    checkDevicesOrientation: function () {
      if (window.orientation === 90 || window.orientation === -90) {
        return true;
      } else {
        return false;
      }
    },

    createOverlay: function () {
      const overlay = document.createElement('div');
      overlay.setAttribute('id', 'rxp-overlay-' + randomId);
      overlay.style.position = 'fixed';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.transition = 'all 0.3s ease-in-out';
      overlay.style.zIndex = '100';

      if (isMobileIFrame) {
        overlay.style.position = 'absolute !important';
        overlay.style.overscrollBehavior = 'touch';
        overlay.style.overflowX = 'hidden';
        overlay.style.overflowY = 'scroll';
      }

      document.body.appendChild(overlay);

      setTimeout(function () {
        overlay.style.background = 'rgba(0, 0, 0, 0.7)';
      }, 1);

      return overlay;
    },

    closeModal: function (closeButton?: any, iFrame?: any, spinner?: any, overlayElement?: any) {
      if (closeButton && closeButton.parentNode) {
        closeButton.parentNode.removeChild(closeButton);
      }

      if (iFrame && iFrame.parentNode) {
        iFrame.parentNode.removeChild(iFrame);
      }

      if (spinner && spinner.parentNode) {
        spinner.parentNode.removeChild(spinner);
      }

      if (!overlayElement) {
        return;
      }

      overlayElement.className = '';
      setTimeout(function () {
        if (overlayElement.parentNode) {
          overlayElement.parentNode.removeChild(overlayElement);
        }
      }, 300);
    },

    createCloseButton: function () {
      if (document.getElementById('rxp-frame-close-' + randomId) !== null) {
        return;
      }

      const closeButton = document.createElement('img');
      closeButton.setAttribute('id', 'rxp-frame-close-' + randomId);
      closeButton.setAttribute(
        'src',
        'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUJFRjU1MEIzMUQ3MTFFNThGQjNERjg2NEZCRjFDOTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUJFRjU1MEMzMUQ3MTFFNThGQjNERjg2NEZCRjFDOTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQkVGNTUwOTMxRDcxMUU1OEZCM0RGODY0RkJGMUM5NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQkVGNTUwQTMxRDcxMUU1OEZCM0RGODY0RkJGMUM5NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlHco5QAAAHpSURBVHjafFRdTsJAEF42JaTKn4glGIg++qgX4AAchHAJkiZcwnAQD8AF4NFHCaC2VgWkIQQsfl/jNJUik8Duzs/XmW9mN7Xb7VRc5vP5zWKxaK5Wq8Zmu72FqobfJG0YQ9M0+/l8/qFQKDzGY1JxENd1288vLy1s786KRZXJZCLber1Wn7MZt4PLarVnWdZ9AmQ8Hncc17UvymVdBMB/MgPQm+cFFcuy6/V6lzqDf57ntWGwYdBIVx0TfkBD6I9M35iRJgfIoAVjBLDZbA4CiJ5+9AdQi/EahibqDTkQx6fRSIHcPwA8Uy9A9Gcc47Xv+w2wzhRDYzqdVihLIbsIiCvP1NNOoX/29FQx3vgOgtt4FyRdCgPRarX4+goB9vkyAMh443cOEsIAAcjncuoI4TXWMAmCIGFhCQLAdZ8jym/cRJ+Y5nC5XCYAhINKpZLgSISZgoqh5iiLQrojAFICVwGS7tCfe5DbZzkP56XS4NVxwvTI/vXVVYIDnqmnnX70ZxzjNS8THHooK5hMpxHQIREA+tEfA9djfHR3MHkdx3Hspe9r3B+VzWaj2RESyR2mlCUE4MoGQDdxiwHURq2t94+PO9bMIYyTyDNLwMoM7g8+BfKeYGniyw2MdfSehF3Qmk1IvCc/AgwAaS86Etp38bUAAAAASUVORK5CYII=',
      );
      closeButton.setAttribute(
        'style',
        'transition: all 0.5s ease-in-out; opacity: 0; float: left; position: absolute; left: 50%; margin-left: 172.5px; z-index: 99999999; top: 190px; cursor:pointer',
      );

      setTimeout(function () {
        closeButton.style.opacity = '1';
      }, 500);

      if (isMobileIFrame) {
        closeButton.style.position = 'absolute';
        closeButton.style.float = 'right';
        closeButton.style.top = '20px';
        closeButton.style.left = 'initial';
        closeButton.style.marginLeft = '0px';
        closeButton.style.right = '20px';
      }

      return closeButton;
    },

    createForm: function (doc?: any, token?: any, ignorePostMessage?: any) {
      const form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', hppUrl);

      let versionSet = false;

      for (const key in token) {
        if (key === 'HPP_VERSION') {
          versionSet = true;
        }
        form.appendChild(internal.createFormHiddenInput(key, token[key]));
      }

      if (versionSet === false) {
        form.appendChild(internal.createFormHiddenInput('HPP_VERSION', '2'));
      }

      if (ignorePostMessage) {
        form.appendChild(internal.createFormHiddenInput('MERCHANT_RESPONSE_URL', redirectUrl));
      } else {
        const parser = internal.getUrlParser(window.location.href);
        const hppOriginParam = parser.protocol + '//' + parser.host;

        form.appendChild(internal.createFormHiddenInput('HPP_POST_RESPONSE', hppOriginParam));
        form.appendChild(internal.createFormHiddenInput('HPP_POST_DIMENSIONS', hppOriginParam));
      }
      return form;
    },

    createSpinner: function () {
      const spinnerOverlay = document.createElement('div');
      spinnerOverlay.setAttribute('id', 'rxp-spinnerOverlay-' + randomId);
      spinnerOverlay.style.position = 'fixed';
      spinnerOverlay.style.width = '100%';
      spinnerOverlay.style.height = '100%';
      spinnerOverlay.style.top = '0';
      spinnerOverlay.style.left = '0';
      spinnerOverlay.style.transition = 'all 0.3s ease-in-out';
      spinnerOverlay.style.zIndex = '110';
      spinnerOverlay.style.background = 'rgba(255,255,255,0.8)';

      if (isMobileIFrame) {
        spinnerOverlay.style.position = 'absolute !important';
        spinnerOverlay.style.overscrollBehavior = 'touch';
        spinnerOverlay.style.overflowX = 'hidden';
        spinnerOverlay.style.overflowY = 'scroll';
      }

      const spinner = document.createElement('div');
      spinner.setAttribute('class', 'loader');
      spinnerOverlay.appendChild(spinner);

      return spinnerOverlay;
    },

    createIFrame: function (overlayElement: any, token: any) {
      //Create the spinner
      const spinner = internal.createSpinner();
      document.body.appendChild(spinner);

      //Create the iframe
      const iFrame = document.createElement('iframe');
      iFrame.setAttribute('name', 'rxp-frame-' + randomId);
      iFrame.setAttribute('id', 'rxp-frame-' + randomId);
      iFrame.setAttribute('height', '562px');
      iFrame.setAttribute('frameBorder', '0');
      iFrame.setAttribute('width', '360px');
      iFrame.setAttribute('seamless', 'seamless');

      iFrame.style.zIndex = '10001';
      iFrame.style.position = 'absolute';
      iFrame.style.transition = 'transform 0.5s ease-in-out';
      iFrame.style.transform = 'scale(0.7)';
      iFrame.style.opacity = '0';

      overlayElement.appendChild(iFrame);

      if (isMobileIFrame) {
        iFrame.style.top = '0px';
        iFrame.style.bottom = '0px';
        iFrame.style.left = '0px';
        iFrame.style.marginLeft = '0px;';
        iFrame.style.width = '100%';
        iFrame.style.height = '100%';
        iFrame.style.minHeight = '100%';
        iFrame.style.webkitTransform = 'translate3d(0,0,0)';
        iFrame.style.transform = 'translate3d(0, 0, 0)';

        const metaTag = document.createElement('meta');
        metaTag.name = 'viewport';
        metaTag.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
        document.getElementsByTagName('head')[0].appendChild(metaTag);
      } else {
        iFrame.style.top = '192.5px';
        iFrame.style.left = '50%';
        iFrame.style.marginLeft = '-180px';
      }

      let closeButton: any;

      iFrame.onload = function () {
        iFrame.style.opacity = '1';
        iFrame.style.transform = 'scale(1)';
        iFrame.style.backgroundColor = '#ffffff';

        if (spinner && spinner.parentNode) {
          spinner.parentNode.removeChild(spinner);
        }

        closeButton = internal.createCloseButton();

        if (overlayElement && closeButton) {
          overlayElement.appendChild(closeButton);
          closeButton.addEventListener(
            'click',
            function () {
              internal.closeModal(closeButton, iFrame, spinner, overlayElement);
            },
            true,
          );
        }
      };

      const form = internal.createForm(document, token);
      if (iFrame.contentWindow?.document.body) {
        iFrame.contentWindow.document.body.appendChild(form);
      } else {
        iFrame.contentWindow?.document.appendChild(form);
      }

      form.submit();

      return {
        spinner: spinner,
        iFrame: iFrame,
        closeButton: closeButton,
      };
    },

    openWindow: function (token: { [x: string]: string } | undefined) {
      //open new window
      const tabWindow = window.open();

      // browsers can prevent a new window from being created
      // e.g. mobile Safari
      if (!tabWindow) {
        return null;
      }

      const doc = tabWindow.document;

      //add meta tag to new window (needed for iOS 8 bug)
      const meta = doc.createElement('meta');
      const name = doc.createAttribute('name');
      name.value = 'viewport';
      meta.setAttributeNode(name);
      const content = doc.createAttribute('content');
      content.value = 'width=device-width';
      meta.setAttributeNode(content);
      doc.head.appendChild(meta);

      //create form, append to new window and submit
      const form = internal.createForm(doc, token);
      doc.body.appendChild(form);
      form.submit();

      return tabWindow;
    },

    getUrlParser: function (url: string) {
      const parser = document.createElement('a');
      parser.href = url;
      return parser;
    },

    getHostnameFromUrl: function (url: string) {
      return internal.getUrlParser(url).hostname;
    },

    isMessageFromHpp: function (origin: string, hppUrl: string) {
      return internal.getHostnameFromUrl(origin) === internal.getHostnameFromUrl(hppUrl);
    },

    receiveMessage: function (e: any) {
      //Check the origin of the response comes from HPP
      if (!internal.isMessageFromHpp(e?.event.origin, hppUrl)) {
        return;
      }
      // check for iframe resize values
      let evtdata;
      if (e.event.data && (evtdata = internal.decodeAnswer(e.event.data)).iframe) {
        if (!isMobileNewTab()) {
          const iframeWidth = evtdata.iframe.width;
          const iframeHeight = evtdata.iframe.height;

          let iFrame;
          let resized = false;

          if (e.embedded) {
            iFrame = e.instance.getIframe();
          } else {
            iFrame = document.getElementById('rxp-frame-' + randomId);
          }
          if (e.instance.events && e.instance.events.onResize) {
            e.instance.events.onResize(evtdata.iframe);
          }

          if (iframeWidth === '390px' && iframeHeight === '440px') {
            iFrame.setAttribute('width', iframeWidth);
            iFrame.setAttribute('height', iframeHeight);
            resized = true;
          }

          iFrame.style.backgroundColor = '#ffffff';

          if (isMobileIFrame) {
            iFrame.style.marginLeft = '0px';
            iFrame.style.WebkitOverflowScrolling = 'touch';
            iFrame.style.overflowX = 'scroll';
            iFrame.style.overflowY = 'scroll';

            if (!e.embedded) {
              const overlay = document.getElementById('rxp-overlay-' + randomId);
              overlay ? (overlay.style.overflowX = 'scroll') : '';
              overlay ? (overlay.style.overflowY = 'scroll') : '';
            }
          } else if (!e.embedded && resized) {
            iFrame.style.marginLeft = (parseInt(iframeWidth.replace('px', ''), 10) / 2) * -1 + 'px';
          }

          if (!e.embedded && resized) {
            // wrap the below in a setTimeout to prevent a timing issue on a
            // cache-miss load
            setTimeout(function () {
              const closeButton = document.getElementById('rxp-frame-close-' + randomId);
              closeButton ? (closeButton.style.marginLeft = parseInt(iframeWidth.replace('px', ''), 10) / 2 - 7 + 'px') : '';
            }, 200);
          }
        }
      } else {
        const _close = function () {
          if (isMobileNewTab() && tabWindow) {
            //Close the new window
            tabWindow.close();
          } else {
            //Close the lightbox
            e.instance.close();
          }
          const overlay = document.getElementById('rxp-overlay-' + randomId);
          if (overlay) {
            overlay.remove();
          }
        };
        const response = e.event.data;
        //allow the script to intercept the answer, instead of redirecting to another page. (which is really a 90s thing)
        if (typeof e.url === 'function') {
          const answer = internal.decodeAnswer(response);
          e.url(answer, _close);
          return;
        }
        _close();
        //Create a form and submit the hpp response to the merchant's response url
        const form = document.createElement('form');
        form.setAttribute('method', 'POST');
        form.setAttribute('action', e.url);
        form.appendChild(internal.createFormHiddenInput('hppResponse', response));
        document.body.appendChild(form);
        form.submit();
      }
    },
  };

  const RxpLightbox = (function () {
    let instance: any;

    function init() {
      let overlayElement;
      let spinner;
      let iFrame;
      let closeButton;
      let token: { [x: string]: string } | undefined;
      let isLandscape = internal.checkDevicesOrientation();

      if (isMobileIFrame) {
        if (window.addEventListener) {
          window.addEventListener(
            'orientationchange',
            function () {
              isLandscape = internal.checkDevicesOrientation();
            },
            false,
          );
        }
      }

      return {
        lightbox: function () {
          if (isMobileNewTab()) {
            tabWindow = internal.openWindow(token);
          } else {
            overlayElement = internal.createOverlay();
            const temp = internal.createIFrame(
              overlayElement as { appendChild?: any; className?: string; parentNode?: { removeChild: (arg0: any) => void } },
              token as { [x: string]: string },
            );
            spinner = temp.spinner;
            iFrame = temp.iFrame;
            closeButton = temp.closeButton;
          }
        },
        setToken: function (hppToken: { [x: string]: string } | undefined) {
          token = hppToken;
        },
      };
    }

    return {
      // Get the Singleton instance if one exists
      // or create one if it doesn't
      getInstance: function (hppToken: any) {
        if (!instance) {
          instance = init();
        }

        //Set the hpp token
        instance.setToken(hppToken);

        return instance;
      },
      init: function (idOfLightboxButton: string, merchantUrl: any, serverSdkJson: any) {
        //Get the lightbox instance (it's a singleton) and set the sdk json
        const lightboxInstance = RxpLightbox.getInstance(serverSdkJson);

        //if you want the form to load on function call, set to autoload
        if (idOfLightboxButton === 'autoload') {
          lightboxInstance.lightbox();
        }
        // Sets the event listener on the PAY button. The click will invoke the lightbox method
        else if (document.getElementById(idOfLightboxButton)?.addEventListener) {
          document.getElementById(idOfLightboxButton)?.addEventListener('click', lightboxInstance.lightbox, true);
        } else {
          document.getElementById(idOfLightboxButton)?.addEventListener('onclick', lightboxInstance.lightbox);
        }
        //avoid multiple message event listener binded to the window object.
        internal.removeOldEvtMsgListener();
        const evtMsgFct = function (event: any) {
          return internal.receiveMessage({ event: event, instance: lightboxInstance, url: merchantUrl, embedded: false });
        };
        internal.evtMsg.push({ fct: evtMsgFct, opt: false });
        internal.addEvtMsgListener(evtMsgFct);
      },
    };
  })();

  const closeModal = () => {
    const overlay = document.getElementById('rxp-overlay-' + randomId);
    overlay?.remove();
  };

  return {
    init: RxpLightbox.init,
    lightbox: {
      init: RxpLightbox.init,
    },
    closeModal,
    setHppUrl: setHppUrl,
    _internal: internal,
  };
})();
