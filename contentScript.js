const encryptor = new JSEncrypt()
const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDRsKBPCJKacuVPx1h07Svrh8BH
9xCeYtXsDq6JMWm3yAA49LGka5NeVEHFyGplSPvjBB2+MwPnD3FwO6wHcczdALyE
PthaqZBftzKHpPTr9cDm2+jsD6mzfJsnzSxeddHk+OD3ZEOOGBsomUHKT5Te3dhz
TDyGaQAwaW7ypUPi4QIDAQAB`

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
    { id: 9, name: 'camp-fire' },
  ]
  return platforms.find((platform) => {
    return url.indexOf(platform.name) > 0
  })
}

function getProjectId(platform, tabURL) {
  const projectId = {
    zeczec: () => {
      const projectId = window.location.pathname.replace("/projects/",'').split('/')[0]
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
      const projectId = window.location.pathname.replace("/projects/",'').split('/')[0]
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
    },
  }

  return projectId[platform.name]()
}

function getAppendedDomSelector(platform) {
  const appendedDomSelector = {
    zeczec: () => {
      return 'body > div.container.lg\\:my-8'
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
      return '#main-screen > div > div:nth-child(1) > div:nth-child(3)'
    },
    wadiz: () => {
      return '#container > div.reward-body-wrap'
    },
    'camp-fire': () => {
      return 'body > div.projects-show.layouts-projects.layouts1.wrapper > header > section > section.headline.layouts-float.row.inner.clearfix'
    },
  }
  return appendedDomSelector[platform.name]()
}

async function displayChart() {
  const iframe = document.createElement('IFRAME')
  const baseURL = `https://drip-plugin.crowdfunding.coffee`
  encryptor.setPublicKey(publicKey)

  let encryptedURL = encryptor.encrypt(
    `platform/${platform.id}/projects/${projectId}`
  )
  encryptedURL = encryptedURL.replace(/\//gi, '_')
  const composedURL = `${baseURL}/${encryptedURL}`

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
    const newLink = document.createElement('A')
    newLink.href =
      'https://chrome.google.com/webstore/detail/drip/ncgkmddibppebiomiicdfehogjkdegdk'
    newLink.target = '_blank'

    const image = document.createElement('IMG')
    image.setAttribute(
      'src',
      `https://img.shields.io/badge/DRIP-%E7%9B%AE%E5%89%8D%E6%B2%92%E6%9C%89%E6%AD%A4%E5%B0%88%E6%A1%88%E8%B3%87%E6%96%99-FF48CC?style=for-the-badge&link=https://chrome.google.com/webstore/detail/drip/ncgkmddibppebiomiicdfehogjkdegdk&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAADV0lEQVRIS73VbYhUVRzH8e85987cmVl3tWANW83cSKm2NCPF7YVKVBAVmilKb2IzJCQsS6oX0mQlaA8+vJAKWpaKtTCQKTSDyAe0lhIfKFgs6IVrbpu6u/YwO3sfzon/7J3aQt07azRwOC/uPfM5v///3HsV/8NPVWvY1uZW1fJlSzXrqkJse9NmqFtFKfUp/f4itfqrgSRYYsQWrpuPye6hlE3j5wyh85B69Iud/y3yycSjhLUzKOXAz0GQOcuphkkq31YaCUqUxBbGr8Gp2chgdgiQOcpB6LXSPfMxlc+bS0EjIrYwrRbsYSI9ldCDQKDM0Bzm+nDSU9WK7WcvD2lvWkLK2Y5xNJELgQehIBkIBXTfVqvbV4wasXvnuZzyT6LsBIwC60KYHkJkFlAS9RevUa980HUx6JLlsm/duQBP78REYDUYB0wKQhmSSIak0U+qtdu2jA5584HNYFchW5HWWkFciFIQSZJKqkyHeuHVOaNDti7rgnDiX4sDA5Ek8kDJCYvTBJ6vXlrvVY3YdY/cTo3TUf7XtAfjG6CuHrT0w0Lvb3D6DPwegclAUW9Qm9Y+dyHooj2xL6/8CIdF5VLNmA3aBSvN10Nli6R0DnzzLZS0lPA79cYzN1eHrHv2R2w0hem3gufFgCAynLg/GgIFHZ1y4no5b25SbSt//jd0wST2qXwjY/RR6mrquGEamMoDrUGiGemLDEnnQudP0F0s4TNXvbP864TIhlmk2M+E+gzXNoC18bq4XAKUj3QMneyDH3otkXOfant4dzLkia2z0Go/DVdmmHJ1jMShpVxlRHoivdDQ9St832cx7r3q/Qf3JENatjWSTR/hitxYmiaDkSQVRHY/rGSCdZ6Bbr9IYJvVh/cfT4TITbbl3UM4NDP7ekg5f5er/HoZVjZJc6ALAucE9vwtascSPzmy8L3p1GYP4qkxzJwM6coRlh3EPfEtHOuBfkoMmKVq912Fqo5wOc2ywtPo1GtYAzfWw1VjIZIrGs4NwPFzEMhrxubVx3NfrPqJryywCz57HO08j2USWoHnwiAwqEHpXzBsVLvueH3Ur/rhC+3d+9aQdhej040EUQ8BO9Tnc/IjfXrl+ohfxn9Atx1OYYrjOD1QVD33/JEEkHv+BJW1SCnSMw1IAAAAAElFTkSuQmCC`
    )

    newLink.prepend(image)
    if (platform.id === 7 || platform.id === 8) {
      document.querySelector(appendedDomSelector).prepend(newLink)
    } else {
      document.querySelector(appendedDomSelector).append(newLink)
    }
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
  window.checkAppendedDomElementExistObserver = new MutationObserver(function (
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
    subtree: true,
  })
}

function checkWindowLocationHrefChange() {
  let oldHref = document.location.href
  const checkWindowLocationHrefObserver = new MutationObserver(function (
    mutations
  ) {
    mutations.forEach(function (mutation) {
      if (oldHref !== document.location.href) {
        oldHref = document.location.href
        // console.log('Window location change')

        checkAppendedDomElementExistObserver.observe(document.body, {
          childList: true,
          subtree: true,
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
    subtree: true,
  })
}
