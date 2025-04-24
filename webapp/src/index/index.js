class Index {
  currentLang = window.localStorage.getItem('lang') || 'en'

  onInit() {
    fetch('topics.json') // Will be added actual endpoint in future
      .then((response) => response.json())
      .then((data) => {
        const currentLang = data[this.currentLang]
        this.setHeader(currentLang)
        this.setNav(currentLang)
        this.setFont(currentLang)
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

  setFont(data) {
    document.documentElement.style.setProperty('--font', data.languages.languageFont)
  }
}

const index = new Index()
index.onInit()
