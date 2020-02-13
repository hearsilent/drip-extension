chrome.browserAction.onClicked.addListener(function(activeTab) {
  var newURL = 'https://drip.crowdfunding.coffee/'
  chrome.tabs.create({ url: newURL })
})
