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
        this.handleNavigation()
      })

    const catId = new URLSearchParams(window.location.search).get('catId')
    const page = new URLSearchParams(window.location.search).get('page')
    const limit = new URLSearchParams(window.location.search).get('limit')

    fetch(`http://localhost:3000/catalog?catId=${catId}&page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'accept-language': this.currentLang,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
      })
  }

  handleNavigation() {
    const categories = document.querySelector('#cat-list').getElementsByTagName('li')
    const categoriesArray = Array.from(categories)
    categoriesArray.pop()

    categoriesArray.forEach((category) => {
      category.addEventListener('click', () => {
        const classValue = category.classList

        window.location.href = `?catId=${classValue}&page=${1}&limit=${28}`
      })
    })
  }
}

new Catalog().onInit()
