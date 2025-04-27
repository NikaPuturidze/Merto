import { setFooter, setHeader, setNav } from '../main.js'
class Detail {
  constructor() {
    this.quantityCounter = document.getElementById('quantity')
    this.quantity = 1
    this.updatequantityCounter()
    document.getElementById('increaseBtn').addEventListener('click', () => this.increaseQuantity())
    document.getElementById('decreaseBtn').addEventListener('click', () => this.decreaseQuantity())

    this.menuType = 'spec'
    document.getElementById('specifications').addEventListener('click', () => {
      this.menuType = 'spec'
      this.toggleMenu()
    })
    document.getElementById('reviews').addEventListener('click', () => {
      this.menuType = 'rev'
      this.toggleMenu()
    })
    this.toggleMenu()
  }
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

  increaseQuantity() {
    this.quantity++
    this.updatequantityCounter()
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--
      this.updatequantityCounter()
    }
  }

  updatequantityCounter() {
    if (this.quantityCounter) {
      this.quantityCounter.textContent = this.quantity
    }
  }

  toggleMenu() {
    if (this.menuType === 'spec') {
      document.getElementById('specificationsMenu').style.display = 'block'
      document.getElementById('reviewsMenu').style.display = 'none'
      document.getElementById('specifications').classList.add('active')
      document.getElementById('reviews').classList.remove('active')
    } else if (this.menuType === 'rev') {
      document.getElementById('specificationsMenu').style.display = 'none'
      document.getElementById('reviewsMenu').style.display = 'block'
      document.getElementById('reviews').classList.add('active')
      document.getElementById('specifications').classList.remove('active')
    }
  }
}

new Detail().onInit()
