import { setFooter, setHeader, setNav } from '../main.js'
class Index {
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

  handleNavigation() {
    const categories = document.querySelector('#cat-list').getElementsByTagName('li')
    const categoriesArray = Array.from(categories)
    categoriesArray.pop()

    categoriesArray.forEach((category) => {
      category.addEventListener('click', () => {
        const classValue = category.classList

        window.location.href = `./catalog/catalog.html?id=${classValue}`
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
