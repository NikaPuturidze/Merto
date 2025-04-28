import { setFooter, setHeader, setNav } from '../main.js'
class Index {
  currentLang = window.localStorage.getItem('lang') || 'en'
  productsMobileSection
  productsLaptopSection

  onInit() {
    fetch('https://merto-step-production.up.railway.app/topics', {
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

    fetch('https://merto-step-production.up.railway.app/mega-menu', {
      method: 'GET',
      headers: {
        'accept-language': this.currentLang,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.carousel(data.carousel)
      })

    fetch('https://merto-step-production.up.railway.app/catalog?catId=855&amount=7', {
      headers: { 'accept-language': this.currentLang },
    })
      .then((r) => r.json())
      .then((data) => {
        this.productsMobileSection = data.items
        this.setMobileProducts()
      })
    fetch('https://merto-step-production.up.railway.app/catalog?catId=717&amount=7', {
      headers: { 'accept-language': this.currentLang },
    })
      .then((r) => r.json())
      .then((data) => {
        this.productsLaptopSection = data.items
        this.setLaptopProducts()
      })
  }

  setMobileProducts() {
    let productsMobile = document.getElementById('productsMobile')
    let productsLaptop = document.getElementById('productsLaptop')

    productsMobile.innerHTML = ''
    this.productsMobileSection.forEach((item) => {
      productsMobile.innerHTML += `
      <div class="product-item" data-id="${item.id}">
            <div class="side-bar">
                <div class="search"><i class="fa-solid fa-magnifying-glass"></i></div>
                <div class="cart"><i class="fa-solid fa-cart-shopping"></i></div>
            </div>
            <div class="image">

                <img src="${item.imageUrl}" />
            </div>
            <div class="desc">
            <div class="name">
                <h5>${item.name}</h5>
            </div>
            <div class="prices">
                <h4 class="price">${item.price}₾</h4>
                ${item.previousPrice ? `<h4 class="previous-price">${item.previousPrice}₾</h4>` : ''}
            </div>
        </div>
      `
    })

    let allProductItems = document.querySelectorAll('.product-item')

    allProductItems.forEach((productDiv) => {
      productDiv.addEventListener('click', (event) => {
        event.stopPropagation()
        const productId = productDiv.dataset.id
        if (productId) {
          window.location.href = `../detail/detail.html?productId=${productId}`
        }
      })
    })
  }
  setLaptopProducts() {
    let productsLaptops = document.getElementById('productsLaptops')

    productsLaptops.innerHTML = ''
    this.productsLaptopSection.forEach((item) => {
      productsLaptops.innerHTML += `
      <div class="product-item" data-id="${item.id}">
            <div class="side-bar">
                <div class="search"><i class="fa-solid fa-magnifying-glass"></i></div>
                <div class="cart"><i class="fa-solid fa-cart-shopping"></i></div>
            </div>
            <div class="image">

                <img src="${item.imageUrl}" />
            </div>
            <div class="desc">
            <div class="name">
                <h5>${item.name}</h5>
            </div>
            <div class="prices">
                <h4 class="price">${item.price}₾</h4>
                ${item.previousPrice ? `<h4 class="previous-price">${item.previousPrice}₾</h4>` : ''}
            </div>
        </div>
      `
    })

    let allProductItems = document.querySelectorAll('.product-item')

    allProductItems.forEach((productDiv) => {
      productDiv.addEventListener('click', (event) => {
        event.stopPropagation()
        const productId = productDiv.dataset.id
        if (productId) {
          window.location.href = `../detail/detail.html?productId=${productId}`
        }
      })
    })
  }

  handleNavigation() {
    const categories = document.querySelector('#cat-list').getElementsByTagName('li')
    const categoriesArray = Array.from(categories)
    categoriesArray.pop()

    categoriesArray.forEach((category) => {
      category.addEventListener('click', () => {
        const classValue = category.classList
        window.location.href = `./catalog/catalog.html?catId=${classValue}&page=${1}`
      })
    })
  }

  carousel(data) {
    const carouselContainer = document.querySelector('.carousel-container')
    const step = document.querySelector('.step')
    let currentTranslate = 0
    let currentImage = 0

    data.forEach((item) => {
      carouselContainer.innerHTML += `
        <div class="item">
          <div class="text-content">
            <h5>${item.topic}</h5>
            <h2>${item.name}</h2>
            <h3>${item.description ?? ''}</h3>
            <button>${item.shopNow}</button>
          </div>
          <img src="${item.imageUrl}" />
        </div>
      `
    })

    data.forEach(() => {
      step.innerHTML += `
        <div class="circle"></div>
      `
    })

    const circles = document.querySelectorAll('.circle')
    circles[0].style.backgroundColor = '#fff'

    setInterval(() => {
      currentTranslate += carouselContainer.scrollWidth / data.length
      carouselContainer.style.transform = `translate(${-currentTranslate}px)`
      currentImage++

      if (currentImage === data.length) {
        currentImage = 0
        currentTranslate = 0
        carouselContainer.style.transform = `translate(0px)`
      }

      circles.forEach((circle, index) => {
        circle.style.backgroundColor = currentImage === index ? '#fff' : 'transparent'
      })
    }, 4000)
  }
}

new Index().onInit()
