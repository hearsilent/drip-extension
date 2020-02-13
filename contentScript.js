const tabURL = window.location.href
const platform = getPlatform(tabURL)
const { projectId, appendedDomSelector } = getProjectInfo(platform, tabURL)

console.log(platform, projectId, appendedDomSelector)
displayChart(projectId, appendedDomSelector)

function getPlatform(url) {
  const platforms = ['zeczec', 'indiegogo', 'kickstarter']
  return platforms.find(platform => url.indexOf(platform) > 0)
}

function getProjectInfo(platform, tabURL) {
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
      const projectId = url.substring(
        url.lastIndexOf('/') + 1,
        url.indexOf('?') !== -1 ? url.indexOf('?') : 999
      )
      return projectId
    },
    kickstarter: () => {
      const url = document.head.querySelector('[property="al:ios:url"][content]').content
      const projectId = url.substring(
        url.lastIndexOf('/') + 1,
        url.indexOf('?') !== -1 ? url.indexOf('?') : 999
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
    }
  }

  return {
    projectId: projectId[platform](),
    appendedDomSelector: appendedDomSelector[platform]()
  }
}

function displayChart(projectId, appendedDomSelector) {
  var iframe = document.createElement('IFRAME')
  iframe.setAttribute('src', `https://drip-coffee-nodejs.herokuapp.com/projects/${projectId}`)
  iframe.setAttribute('scrolling', 'no')
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute(
    'style',
    'height: 400px; width: 100%; position: relative; margin: 0px auto; display: inline-block;'
  )
  document.querySelector(appendedDomSelector).append(iframe)
}
