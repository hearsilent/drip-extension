chrome.browserAction.onClicked.addListener(function(activeTab) {
  // var newURL = 'https://drip.crowdfunding.coffee/'
  var newURL =
    'https://chrome.google.com/webstore/detail/drip/ncgkmddibppebiomiicdfehogjkdegdk'
  chrome.tabs.create({ url: newURL })
})
