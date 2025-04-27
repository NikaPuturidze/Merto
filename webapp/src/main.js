export function setFont() {
  let currentFont
  let langArray = [
    {
      id: 'en',
      font: 'Poppins, sans-serif',
    },
    {
      id: 'ru',
      font: 'Rubik, sans-serif',
    },
    {
      id: 'ka',
      font: 'FiraGO, sans-serif',
    },
  ]

  langArray.forEach((font) => {
    if (font.id === (window.localStorage.getItem('lang') || 'en')) {
      currentFont = font.font
      return
    }
  })

  document.documentElement.style.setProperty('--font', currentFont)
}

export function setHeader(header) {
  const headerCont = document.querySelector('.header-container')
  const ul = document.createElement('ul')

  header.languages.languages.forEach((language) => {
    const li = document.createElement('li')
    li.classList.add(`dropdown-${language.language.toLowerCase()}`)

    li.innerHTML = `
      <img src="${language.flagUrl}"/>
      <span>${language.language}</span>
    `
    ul.appendChild(li)
  })

  headerCont.innerHTML = `
    <div class="logo">
      <img src="${header.logoUrl}" />
    </div>
    <div class="header-center">
      <input type="text" placeholder="${header.searchPlaceholder}" />
      <div class="search-button">
        <i class="fi fi-rr-search"></i>
      </div>
    </div>
    <div class="header-right">
      <div class="container">
        <div class="header-language">
          <img src="${header.languages.flagUrl}" />
          <span>${header.languages.language}</span>
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
          <span>${header.account}</span>
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

  header.languages.languages.forEach((language) => {
    document.querySelector(`.dropdown-${language.language.toLowerCase()}`).addEventListener('click', () => {
      window.localStorage.setItem('lang', language.id)
      location.reload()
    })
  })
}

export function setFooter(footer) {
  const footerCont = document.querySelector('.footer-container')
  const bottomNav = document.createElement('div')
  bottomNav.classList.add('bottom-nav')

  footer.top.bottomNav.forEach((e) => {
    let ul = document.createElement('ul')
    e.forEach((e) => {
      let li = document.createElement('li')
      li.textContent = e
      ul.appendChild(li)
    })

    bottomNav.appendChild(ul)
  })

  footerCont.innerHTML = `
    <div class="top">
      <div class="info">
        <div class="logo">
          <img src="${footer.top.info.logoUrl}" />
        </div>
        <address>
          <i class="fa-solid fa-location-dot"></i>
          <h4>${footer.top.info.address}</h4>
        </address>
        <div class="mail">
          <i class="fa-solid fa-envelope"></i>
          <a href="mailto:${footer.top.info.mail}">${footer.top.info.mail}</a>
        </div>
        <a href="tel:${footer.top.info.number}">${footer.top.info.number}</a>
      </div>
      ${bottomNav.outerHTML}
      <div class="about">
        <h3>${footer.top.about.title}</h3>
        <form>
          <input type="email" placeholder="email@example.com" required />
          <button type="submit">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </form>
        <div class="brands">
          <i class="fa-brands fa-facebook"></i>
          <i class="fa-brands fa-tiktok"></i>
          <i class="fa-brands fa-instagram"></i>
          <i class="fa-brands fa-twitter"></i>
          <i class="fa-brands fa-reddit"></i>
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="cla">
        <i class="fa-solid fa-phone"></i>
        <div class="cta">
          <h2>${footer.middle[0].cta}</h2>
          <a href="mailto:contact@example.com">${footer.middle[0].referrer}</a>
        </div>
      </div>

      <div class="cla">
        <i class="fa-solid fa-face-smile"></i>
        <div class="cta">
          <h2>${footer.middle[1].cta}</h2>
          <a href="">${footer.middle[1].referrer}</a>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="copyright">${footer.bottom.copyright}</div>
      <div class="payment">
        <img src="https://merto-be87.kxcdn.com/merto/wp-content/uploads/2024/04/payment-icons-1.png" />
      </div>
    </div>
  `
}

export function setNav(nav) {
  const navCont = document.querySelector('#cat-list')
  nav.categories.forEach((category) => {
    navCont.innerHTML += `
      <li class="${category.id}">
        <img src="${category.imageUrl}" />
        <span>${category.name}</span>
      </li>
    `
  })

  navCont.innerHTML += `
  <li>
    <span>${nav.recentlyViewed}</span>
    <i class="fa-solid fa-chevron-down"></i>
  </li>
`
}

setFont()
