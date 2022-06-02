export interface IPostMessage {
  addMessageListener: (a: Window, cb: EventListenerOrEventListenerObject) => void;
  removeMessageListener: (a: Document, cb: EventListenerOrEventListenerObject) => void;
  supportsObjects: () => boolean;
  parseMessage: (a: any) => any | null;
  createIframeEventListener: (a: Window, cb: EventListenerOrEventListenerObject) => void;
}

export const PostMessage: IPostMessage = {
  addMessageListener: (a: Window, cb: EventListenerOrEventListenerObject) => {
    /** TODO */
    try {
      a.document.addEventListener.call(a, 'message', cb, true);
    } catch (err) {
      console.debug('addEventListener failed, using iframe addEventListener: ' + err);
      PostMessage.createIframeEventListener(a, cb);
    }
  },

  removeMessageListener: (a: Document, cb: EventListenerOrEventListenerObject) => {
    a.removeEventListener('message', cb);
  },

  supportsObjects: () => {
    /** TODO */
    return true;
  },
  parseMessage: (message: any) => {
    if (typeof message === 'string') {
      return JSON.parse(message);
    } else if (typeof message === 'object') {
      return message;
    }
    return null;
  },
  createIframeEventListener: (a: Window, cb: EventListenerOrEventListenerObject) => {
    const frame = document.createElement('iframe');
    frame.src = 'about:blank';
    document.head.appendChild(frame);
    frame.contentWindow && frame.contentWindow.addEventListener.call(a, 'message', cb, false);
    document.head.removeChild(frame);
  }
};
