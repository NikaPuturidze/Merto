import '../main.js'
class Index {
  currentLang = window.localStorage.getItem('lang') || 'en'

  onInit() {
    fetch('.topics.json') // Will be added actual endpoint in future
      .then((response) => response.json())
      .then((data) => {
        const currentLang = data[this.currentLang]
        this.setHeader(currentLang)
        this.setNav(currentLang)
      })

    fetch('.mega-menu.json') // Will be added actual endpoint in future
      .then((response) => response.json())
      .then((data) => {
        const currentLang = data[this.currentLang]
        this.carousel(currentLang)
      })
  }

  setHeader(data) {
    const header = document.querySelector('header')
    const ul = document.createElement('ul')

    data.languages.languages.forEach((language) => {
      const li = document.createElement('li')
      li.classList.add(`dropdown-${language.language.toLowerCase()}`)

      li.innerHTML = `
        <img src="${language.flagUrl}"/>
        <span>${language.language}</span>
      `
      ul.appendChild(li)
    })

    header.innerHTML = `
      <div class="logo">
        <img src="https://merto-be87.kxcdn.com/merto/wp-content/uploads/2024/09/logo-electronic.png" />
      </div>
      <div class="header-center">
        <input type="text" placeholder="${data.searchPlaceholder}" />
        <div class="search-button">
          <i class="fi fi-rr-search"></i>
        </div>
      </div>
      <div class="header-right">
        <div class="container">
          <div class="header-language">
            <img src="${data.languages.flagUrl}" />
            <span>${data.languages.language}</span>
            <i class="fa-solid fa-chevron-down"></i>
            <div class="language-dropdown-container">
              <div class="language-dropdown">
                  ${ul.outerHTML}
              </div>
            </div>
          </div>
        </div>
        <div class="header-account">
          <i class="fi fi-rr-circle-user"></i>
            <span>${data.account}</span>
        </div>
        <div class="header-favourite">
          <i class="fi fi-rr-heart"></i>
          <div class="counter"><span>1</span></div>
        </div>
        <div class="header-cart">
          <i class="fi fi-rr-shopping-cart"></i>
          <div class="counter"><span>1</span></div>
        </div>
      </div>
    `

    data.languages.languages.forEach((language) => {
      document.querySelector(`.dropdown-${language.language.toLowerCase()}`).addEventListener('click', () => {
        window.localStorage.setItem('lang', language.id)
        location.reload()
      })
    })
  }

  setNav(data) {
    const nav = document.querySelector('#cat-list')
    data.categories.forEach((category) => {
      nav.innerHTML += `
        <li>
          <img src="${category.imageUrl}" />
          <span>${category.name}</span>
        </li>
      `
    })

    nav.innerHTML += `
    <li>
      <span>${data.recentlyViewed}</span>
      <i class="fa-solid fa-chevron-down"></i>
    </li>
  `
  }

  carousel(data) {
    const carouselContainer = document.querySelector('.carousel-container')
    const step = document.querySelector('.step')
    const images = data.carousel
    let currentTranslate = 0
    let currentImage = 0

    images.forEach((item) => {
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

    images.forEach(() => {
      step.innerHTML += `
        <div class="circle"></div>
      `
    })

    const circles = document.querySelectorAll('.circle')
    circles[0].style.backgroundColor = '#fff'

    setInterval(() => {
      currentTranslate += carouselContainer.scrollWidth / images.length
      carouselContainer.style.transform = `translate(${-currentTranslate}px)`
      currentImage++

      if (currentImage === images.length) {
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
