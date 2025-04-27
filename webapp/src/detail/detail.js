import { setFooter, setHeader, setNav } from '../main.js'
class Detail {
  currentLang = window.localStorage.getItem('lang') || 'en'

  onInit() {
    fetch('http://localhost:3000/topics', {
      method: 'GET',
      headers: {
        'accept-language': this.currentLang,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setHeader(data.header)
        setNav(data.header)
        setFooter(data.footer)
        this.handleNavigation()
      })

    fetch('http://localhost:3000/mega-menu', {
      method: 'GET',
      headers: {
        'accept-language': this.currentLang,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.carousel(data.carousel)
      })
  }
}

new Detail().onInit()
