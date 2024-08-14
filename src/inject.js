(() => {
  const ignoredPages = {
    settings: true,
    payments: true,
    inventory: true,
    messages: true,
    subscriptions: true,
    friends: true,
    directory: true,
    videos: true,
    prime: true,
  };

  let errors = {};

  // return channel name if it should contain a chat or undefined
  function matchChannelName(url) {
    if (!url) return undefined;

    const match = url.match(
      /^https?:\/\/(?:www\.)?twitch\.tv\/(\w+)\/?(?:\?.*)?$/
    );

    let channelName;
    if (match && ((channelName = match[1]), !ignoredPages[channelName])) {
      return channelName;
    }

    return undefined;
  }

  // logging function
  function log(obj) {
    console.log('Chatterino: ', obj);
  }

  // install events
  function installChatterino() {
    if (!matchChannelName(window.location.href))
      chrome.runtime.sendMessage({ type: 'detach' });
  }

  function updateErrors() {
    if (!errorDiv) return;

    if (errors.sendMessage) {
      log('Connection to the Chatterino extension lost! Please reload the page.');
    }
  }

  log('hello there in the dev tools 👋');

  try {
    chrome.runtime.sendMessage({ type: 'get-settings' }, settings_ => {
      installChatterino();
    });
  } catch {
    errors.sendMessage = true;
    updateErrors();
  }

  let path = location.pathname;
  setInterval(() => {
    if (location.pathname != path) {
      path = location.pathname;

      log('path changed');

      installedObjects = {};
      installChatterino();
      if (matchChannelName(window.location.href)) {
        chrome.runtime.sendMessage({ type: 'location-updated' });
      }
    }
  }, 1000);
})();
