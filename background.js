chrome.browserAction.onClicked.addListener(function (activeTab) {
  var newURL =
    'https://drip.crowdfunding.coffee/landingpage.php?utm_source=plugin'
  chrome.tabs.create({ url: newURL })
})
