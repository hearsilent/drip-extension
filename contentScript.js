checkWindowLocationHrefChange()
// Global variable
let tabURL = window.location.href
let platform = getPlatform(tabURL)
let projectId = getProjectId(platform, tabURL)
let appendedDomSelector = getAppendedDomSelector(platform)

checkAppendedDomElementExistAndDispalyChart()

function getPlatform(url) {
  const platforms = [
    { id: 1, name: 'kickstarter' },
    { id: 2, name: 'indiegogo' },
    { id: 3, name: 'zeczec' },
    { id: 4, name: 'flyingv' },
    { id: 5, name: 'makuake' },
    { id: 6, name: 'greenfunding' },
    { id: 7, name: 'hahow' },
    { id: 8, name: 'wadiz' },
    { id: 9, name: 'camp-fire' }
  ]
  return platforms.find(platform => {
    return url.indexOf(platform.name) > 0
  })
}

function getProjectId(platform, tabURL) {
  const projectId = {
    zeczec: () => {
      const projectId = tabURL.substring(
        tabURL.lastIndexOf('/') + 1,
        tabURL.indexOf('?') >= 0 ? tabURL.indexOf('?') : 999
      )
      return projectId
    },
    indiegogo: () => {
      const url = document.head.querySelector('[property="og:url"][content]')
        .content
      const projectId = url.substring(
        url.lastIndexOf('/') + 1,
        url.indexOf('?') >= 0 ? url.indexOf('?') : 999
      )
      return projectId
    },
    kickstarter: () => {
      const url = document.head.querySelector(
        '[property="al:ios:url"][content]'
      ).content
      const projectId = url.substring(
        url.lastIndexOf('/') + 1,
        url.indexOf('?') >= 0 ? url.indexOf('?') : 999
      )
      return projectId
    },
    flyingv: () => {
      const projectId = tabURL.substring(
        tabURL.lastIndexOf('/') + 1,
        tabURL.indexOf('?') >= 0 ? tabURL.indexOf('?') : 999
      )
      return projectId
    },
    makuake: () => {
      const url = document.head.querySelector('[name="twitter:image"][content]')
        .content
      const projectId = url.substring(
        url.indexOf('/project/') + 9,
        url.indexOf('/main')
      )
      return projectId
    },
    greenfunding: () => {
      const projectId = tabURL.substring(
        tabURL.indexOf('/projects/') + 10,
        tabURL.indexOf('?') >= 0 ? tabURL.indexOf('?') : 999
      )
      return projectId
    },
    hahow: () => {
      const projectId = tabURL.substring(
        tabURL.indexOf('/courses/') + 9,
        tabURL.indexOf('?') >= 0 ? tabURL.indexOf('?') : 999
      )
      return projectId
    },
    wadiz: () => {
      const projectId = tabURL.substring(
        tabURL.indexOf('/detail/') + 8,
        tabURL.indexOf('?') >= 0 ? tabURL.indexOf('?') : 999
      )
      return projectId
    },
    'camp-fire': () => {
      const projectId = tabURL.substring(
        tabURL.indexOf('/view/') + 6,
        tabURL.indexOf('?') >= 0 ? tabURL.indexOf('?') : 999
      )
      return projectId
    }
  }

  return projectId[platform.name]()
}

function getAppendedDomSelector(platform) {
  const appendedDomSelector = {
    zeczec: () => {
      return 'body > div.container.mv4-l.mt3-l'
    },
    indiegogo: () => {
      return '#main'
    },
    kickstarter: () => {
      return '#react-project-header > div'
    },
    flyingv: () => {
      return 'body > div.wrapper > section > section.projectContentUpper > div > div.row.uppercontent'
    },
    makuake: () => {
      return 'body > div.grayBase > div.heroBtmBase'
    },
    greenfunding: () => {
      return 'body > div.l-main > div.project_header'
    },
    hahow: () => {
      return '#main-screen > div > div:nth-child(1) > div:nth-child(4)'
    },
    wadiz: () => {
      return '#container > div.reward-body-wrap'
    },
    'camp-fire': () => {
      return 'body > div.projects-show.layouts-projects.layouts1.wrapper > header > section > section.headline.layouts-float.row.inner.clearfix'
    }
  }
  return appendedDomSelector[platform.name]()
}

async function displayChart() {
  const iframe = document.createElement('IFRAME')
  const baseURL = `https://drip.zectrack.today`
  const composedURL = `${baseURL}/platform/${platform.id}/projects/${projectId}`

  if (await isProjectDataExist(composedURL)) {
    iframe.setAttribute('src', composedURL)
    iframe.setAttribute('scrolling', 'no')
    iframe.setAttribute('frameborder', '0')
    iframe.setAttribute('allowTransparency', 'true')
    iframe.setAttribute(
      'style',
      'height: 520px; width: 100%; position: relative; margin: 0px auto; display: inline-block; background-color: transparent;'
    )
    if (platform.id === 7 || platform.id === 8) {
      document.querySelector(appendedDomSelector).prepend(iframe)
    } else {
      document.querySelector(appendedDomSelector).append(iframe)
    }
  } else {
    console.log('Drip has no data for this project.')
  }
}

async function isProjectDataExist(url) {
  try {
    const response = await fetch(url)
    if (response.status !== 200) {
      return false
    }
    return true
  } catch (err) {
    console.log('fetch failed', err)
    return false
  }
}

function checkAppendedDomElementExistAndDispalyChart() {
  window.checkAppendedDomElementExistObserver = new MutationObserver(function(
    mutations,
    me
  ) {
    // `mutations` is an array of mutations that occurred
    // `me` is the MutationObserver instance
    const targetElement = document.querySelector(appendedDomSelector)
    if (targetElement) {
      // console.log('find targetElement')
      displayChart()
      me.disconnect() // stop observing
      return
    }
  })

  // start observing
  checkAppendedDomElementExistObserver.observe(document.body, {
    childList: true,
    subtree: true
  })
}

function checkWindowLocationHrefChange() {
  let oldHref = document.location.href
  const checkWindowLocationHrefObserver = new MutationObserver(function(
    mutations
  ) {
    mutations.forEach(function(mutation) {
      if (oldHref != document.location.href) {
        oldHref = document.location.href
        // console.log('Window location change')

        checkAppendedDomElementExistObserver.observe(document.body, {
          childList: true,
          subtree: true
        })

        tabURL = window.location.href
        platform = getPlatform(tabURL)
        projectId = getProjectId(platform, tabURL)
        appendedDomSelector = getAppendedDomSelector(platform)
      }
    })
  })
  checkWindowLocationHrefObserver.observe(document.body, {
    childList: true,
    subtree: true
  })
}
