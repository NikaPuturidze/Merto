import { setFooter, setHeader, setNav } from '../main.js'

class Catalog {
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
      })
  }
}

new Catalog().onInit()
