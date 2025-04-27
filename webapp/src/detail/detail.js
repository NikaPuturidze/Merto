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
  productDetails

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
        // this.handleNavigation()
      })
    this.productId = new URLSearchParams(window.location.search).get('productId')
    fetch('http://localhost:3000/details?productId=44004', {
      method: 'GET',
      headers: {
        'accept-language': this.currentLang,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.productDetails = data
        this.setDetails()
        console.log(this.productDetails)
      })
  }

  setDetails() {
    const subCategoryName = document.getElementById('subCategoryName')
    subCategoryName.innerText = this.productDetails.subCategoryName

    const name = document.getElementById('name')
    name.innerText = this.productDetails.name

    const price = document.getElementById('price')
    const previousPrice = document.getElementById('previousPrice')
    if (this.productDetails.previousPrice == null) {
      price.classList.add('new')
      price.innerHTML = `<p>${this.productDetails.price}₾</p>`
    } else {
      price.classList.add('new')
      price.innerHTML = `<p>${this.productDetails.price}₾</p>`

      previousPrice.classList.add('old')
      previousPrice.innerHTML = `<p>${this.productDetails.previousPrice}₾</p>`
    }

    const mainImg = document.getElementById('mainImg')
    mainImg.innerHTML = ` <img src="${this.productDetails.images[0]}" alt="" />`

    const thumbnails = document.getElementById('thumbnails')
    this.productDetails.images.forEach((img, index) => {
      thumbnails.innerHTML += ` <img src="${img}" alt="" id="thumbImg"/>`
      const thumbImg = document.getElementById('thumbImg')
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
