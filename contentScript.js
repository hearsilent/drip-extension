const tabURL = window.location.href
const { id: platformId, name: platformName } = getPlatform(tabURL)
const { projectId, appendedDomSelector } = getProjectInfo(platformName, tabURL)

console.log(platformId, platformName, projectId, appendedDomSelector)
displayChart({ platformId, projectId }, appendedDomSelector)

function getPlatform(url) {
  const platforms = [
    { id: 1, name: 'kickstarter' },
    { id: 2, name: 'indiegogo' },
    { id: 3, name: 'zeczec' },
    { id: 4, name: 'flyingv' },
    { id: 5, name: 'makuake' },
    { id: 6, name: 'greenfunding' }
  ]
  return platforms.find(platform => {
    return url.indexOf(platform.name) > 0
  })
}

function getProjectInfo(platformName, tabURL) {
  const projectId = {
    zeczec: () => {
      const projectId = tabURL.substring(
        tabURL.lastIndexOf('/') + 1,
        tabURL.indexOf('?') !== -1 ? tabURL.indexOf('?') : 999
      )
      return projectId
    },
    indiegogo: () => {
      const url = document.head.querySelector('[property="og:url"][content]').content
      const projectId = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?') !== -1 ? url.indexOf('?') : 999)
      return projectId
    },
    kickstarter: () => {
      const url = document.head.querySelector('[property="al:ios:url"][content]').content
      const projectId = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?') !== -1 ? url.indexOf('?') : 999)
      return projectId
    },
    flyingv: () => {
      const projectId = tabURL.substring(
        tabURL.lastIndexOf('/') + 1,
        tabURL.indexOf('?') !== -1 ? tabURL.indexOf('?') : 999
      )
      return projectId
    },
    makuake: () => {
      const url = document.head.querySelector('[name="twitter:image"][content]').content
      const projectId = url.substring(url.indexOf('/project/') + 9, url.indexOf('/main'))
      return projectId
    },
    greenfunding: () => {
      const projectId = tabURL.substring(
        tabURL.indexOf('/projects/') + 10,
        tabURL.indexOf('?') !== -1 ? tabURL.indexOf('?') : 999
      )
      return projectId
    }
  }

  const appendedDomSelector = {
    zeczec: () => {
      return 'body > div.container.mv4-l.mt3-l'
    },
    indiegogo: () => {
      return '#main'
    },
    kickstarter: () => {
      return '#react-project-header'
    },
    flyingv: () => {
      return 'body > div.wrapper > section > section.projectContentUpper > div > div.row.uppercontent'
    },
    makuake: () => {
      return 'body > div.grayBase > div.heroBtmBase'
    },
    greenfunding: () => {
      return 'body > div.l-main > div.project_header'
    }
  }

  return {
    projectId: projectId[platformName](),
    appendedDomSelector: appendedDomSelector[platformName]()
  }
}

function displayChart({ platformId, projectId }, appendedDomSelector) {
  const iframe = document.createElement('IFRAME')
  // const baseURL = `https://drip.zectrack.today`
  const baseURL = 'http://localhost:3000'
  iframe.setAttribute('src', `${baseURL}/platform/${platformId}/projects/${projectId}`)
  iframe.setAttribute('scrolling', 'no')
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('allowTransparency', 'true')
  iframe.setAttribute(
    'style',
    'height: 480px; width: 100%; position: relative; margin: 0px auto; display: inline-block;'
  )
  document.querySelector(appendedDomSelector).append(iframe)
}
