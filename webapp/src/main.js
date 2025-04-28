import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

export const firebaseConfig = {
  apiKey: 'AIzaSyBYUXBirzEFVEUKDq9qcUZ4ZjAllQoKsHU',
  authDomain: 'merto-step.firebaseapp.com',
  projectId: 'merto-step',
  storageBucket: 'merto-step.firebasestorage.app',
  messagingSenderId: '863511781452',
  appId: '1:863511781452:web:a214050441fdfc937854e9',
}

export const API_KEY = 'AIzaSyBYUXBirzEFVEUKDq9qcUZ4ZjAllQoKsHU'

export const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

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
    <div class="burger" id="burgerBar">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>

    <div class="burgerMenu" id="burgerMenu">
      <div class="head">
    <div class="burger active" id="burgerBarClose">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
      <img src="https://merto-be87.kxcdn.com/merto/wp-content/uploads/2024/09/logo-electronic.png" alt="" />
      </div>
    <div class="body">
      <div class="home">
       <a href="/">Home</a>
      </div>
      <div class="caregories">
        <div class="header" id="openCatMenu">
          <p>Categories</p>
          <span>+</span>
        </div>
        <div class="content" id="categoriesMenu">
          <div class="close" id="goBack">
            <span><i class="fa-solid fa-chevron-left"></i></span>
            <p>Categories</p>
          </div>
          <a href="/catalog/catalog.html?catId=855">
            <div class="category">
              <img src="https://merto-be87.kxcdn.com/merto/wp-content/uploads/2024/09/electronic-icon-1-1-40x40.png" alt="" />
              <p>Smartphone & Tablets</p>
            </div>
          </a>
          <a href="/catalog/catalog.html?catId=717">
            <div class="category">
              <img src="https://merto-be87.kxcdn.com/merto/wp-content/uploads/2024/09/electronic-icon-2-1-40x40.png" alt="" />
              <p>Laptops</p>
            </div>
          </a>
        </div>
      </div>
      <div class="account" id="accountToggle">
        <i class="fi fi-rr-circle-user"></i>
        <p id="userDisplayName"></p>
      </div>
    </div>
    </div>
    
    <div class="burgerMenuOverlay" id="burgerBarClose"></div>

    <div class="logo">
      <a href="/">
        <img src="${header.logoUrl}" />
      </a>
    </div>

    <div class="header-right">
      <div class="container">


      <div class="header-account">
          <i class="fi fi-rr-circle-user"></i>
          <span>${window.localStorage.getItem('idToken') ? window.localStorage.getItem('userDisplayName') : header.account}</span>
      </div>
    </div>
  `

  //   header.languages.languages.forEach((language) => {
  //     document.querySelector(`.dropdown-${language.language.toLowerCase()}`).addEventListener('click', () => {
  //       window.localStorage.setItem('lang', language.id)
  //       location.reload()
  //     })
  //   })
  //   <div class="header-language">
  //   <img src="${header.languages.flagUrl}" />
  //   <span>${header.languages.language}</span>
  //   <i class="fa-solid fa-chevron-down"></i>
  //   <div class="language-dropdown-container">
  //     <div class="language-dropdown">
  //         ${ul.outerHTML}
  //     </div>
  //   </div>
  // </div>

  let burgerBar = document.getElementById('burgerBar')
  let burgerMenu = document.getElementById('burgerMenu')
  let burgerBarClose = document.getElementById('burgerBarClose')
  let burgerMenuOverlay = document.querySelector('.burgerMenuOverlay')
  let categoriesMenu = document.getElementById('categoriesMenu')
  let openCatMenu = document.getElementById('openCatMenu')
  let goBack = document.getElementById('goBack')

  let userDisplayName = document.getElementById('userDisplayName')

  let userData = localStorage.getItem('userDisplayName')
  userDisplayName.innerText = userData ? userData : 'Account'

  let accountToggle = document.getElementById('accountToggle')

  accountToggle.addEventListener('click', () => {
    const accessToken = window.localStorage.getItem('idToken')

    if (!accessToken) {
      login.style.display = 'flex'
      burgerBar.classList.toggle('active')
      burgerMenu.classList.toggle('active')
      burgerMenuOverlay.classList.toggle('active')
      categoriesMenu.classList.remove('active')
    } else {
      window.location.href = `/profile/profile.html`
      burgerBar.classList.toggle('active')
      burgerMenu.classList.toggle('active')
      burgerMenuOverlay.classList.toggle('active')
      categoriesMenu.classList.remove('active')
    }
  })

  burgerBar.addEventListener('click', () => {
    burgerBar.classList.toggle('active')
    burgerMenu.classList.toggle('active')
    burgerMenuOverlay.classList.toggle('active')
  })

  burgerBarClose.addEventListener('click', () => {
    burgerBar.classList.toggle('active')
    burgerMenu.classList.toggle('active')
    burgerMenuOverlay.classList.toggle('active')
  })

  burgerMenuOverlay.addEventListener('click', () => {
    burgerBar.classList.toggle('active')
    burgerMenu.classList.toggle('active')
    burgerMenuOverlay.classList.toggle('active')
    categoriesMenu.classList.remove('active')
  })

  openCatMenu.addEventListener('click', () => {
    categoriesMenu.classList.add('active')
  })

  goBack.addEventListener('click', () => {
    categoriesMenu.classList.remove('active')
  })

  let account = document.querySelector('.header-account')
  let login = document.querySelector('.portal')
  let loginContent = document.querySelector('.login-popup-content')
  let createAccount = document.querySelector('.create-account-wrapper')
  let formContent = document.querySelector('.form-login')
  let formContentReg = document.querySelector('.form-reg')
  let formBottom = document.querySelector('.form-btm')
  let formTitle = document.querySelector('.form-title')

  login.addEventListener('click', (event) => {
    if (!loginContent.contains(event.target)) {
      login.style.display = 'none'
    }
  })

  createAccount.addEventListener('click', () => {
    const isLoginVisible = formContent.style.display !== 'none'

    if (isLoginVisible) {
      formTitle.textContent = 'Registration'
      formContent.style.display = 'none'
      formContentReg.style.display = 'flex'
      formBottom.textContent = 'Dont have account yet? Register'
    } else {
      formTitle.textContent = 'Login'
      formContent.style.display = 'flex'
      formContentReg.style.display = 'none'
      formBottom.textContent = 'Already have an account?'
    }
  })

  account.addEventListener('click', (e) => {
    const accessToken = window.localStorage.getItem('idToken')

    if (!accessToken) {
      login.style.display = 'flex'
    } else {
      window.location.href = `/profile/profile.html`
    }
  })

  loginContent.addEventListener('click', (event) => {
    event.stopPropagation()
  })

  const loginSubmitButtons = document.querySelectorAll('.login-submitt')

  document.querySelector('.login-forget-password').addEventListener('click', (event) => {
    event.preventDefault()

    const emailField = document.querySelector('#user_login')

    if (!emailField.checkValidity()) {
      emailField.reportValidity()
    } else {
      const email = emailField.value.trim()
      sendPasswordResetEmail(email)
    }
  })

  loginSubmitButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault()

      const isRegistering = formContent.style.display === 'none'
      const form = button.closest('form')
      if (!form.checkValidity()) {
        form.reportValidity()
        return
      }

      let email, password, username

      if (isRegistering) {
        email = document.querySelector('#user_register').value.trim()
        password = document.querySelector('#user_pass_register').value.trim()
        username = document.querySelector('#user_displayname').value.trim()
      } else {
        email = document.querySelector('#user_login').value.trim()
        password = document.querySelector('#user_pass').value.trim()
      }

      if (!validateEmail(email) || !validatePassword(password)) {
        return
      }

      if (isRegistering) {
        registerUser(email, password, username || '123')
      } else {
        loginUser(email, password)
      }
    })
  })
}

function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailPattern.test(email)
}

function validatePassword(password) {
  return password.length >= 6
}

function registerUser(email, password, displayName) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`

  const payload = {
    email,
    password,
    returnSecureToken: true,
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        document.querySelector('.portal').style.display = 'none'
        alert(data.error.message)
      } else {
        window.localStorage.setItem('idToken', data.idToken)
        window.localStorage.setItem('userDisplayName', displayName)
        window.localStorage.setItem('refreshToken', data.refreshToken)
        window.localStorage.setItem('userEmail', data.email)
        const loginTime = new Date().toLocaleString()
        window.localStorage.setItem('loginTime', loginTime)

        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
              if (user) {
                window.localStorage.setItem('uid', user.uid)

                if (displayName) {
                  updateUserDisplayName(data.idToken, displayName)
                    .then(() => {
                      unsubscribe()
                      window.location.href = '/profile/profile.html'
                    })
                    .catch((err) => {
                      console.error('Failed to update displayName:', err)
                      unsubscribe()
                      window.location.href = '/profile/profile.html'
                    })
                } else {
                  unsubscribe()
                  window.location.href = '/profile/profile.html'
                }
              }
            })
          })
          .catch((error) => {
            console.error('Error during Firebase sign-in:', error)
          })
      }
    })
    .catch((error) => {
      console.log('Network error:', error)
    })
}

function loginUser(email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`

  const payload = {
    email,
    password,
    returnSecureToken: true,
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        document.querySelector('.portal').style.display = 'none'
        alert(data.error.message)
      } else {
        window.localStorage.setItem('idToken', data.idToken)
        window.localStorage.setItem('refreshToken', data.refreshToken)

        const userEmail = data.email
        const userDisplayName = data.displayName || 'No name set'
        window.localStorage.setItem('userEmail', userEmail)
        window.localStorage.setItem('userDisplayName', userDisplayName)
        const loginTime = new Date().toLocaleString()
        window.localStorage.setItem('loginTime', loginTime)

        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            onAuthStateChanged(auth, (user) => {
              if (user) {
                window.localStorage.setItem('uid', user.uid)
                window.location.href = `/profile/profile.html`
              }
            })
          })
          .catch((error) => {
            console.error('Error during Firebase sign-in:', error)
          })
      }
    })
}

function sendPasswordResetEmail(email) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`

  const payload = {
    requestType: 'PASSWORD_RESET',
    email: email,
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert('Error: ' + data.error.message)
      } else {
        alert('Password reset email sent! Check your inbox.')
        window.location.reload()
      }
    })
}

async function updateUserDisplayName(idToken, displayName) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`

  const payload = {
    idToken,
    displayName,
    returnSecureToken: true,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await response.json()
  if (data.error) {
    console.error('Error updating display name:', data.error.message)
    return Promise.reject(new Error(data.error.message))
  } else {
    window.localStorage.setItem('userDisplayName', data.displayName)
    return Promise.resolve()
  }
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

{
  /* <div class="header-language">
<img src="${header.languages.flagUrl}" />
<span>${header.languages.language}</span>
<i class="fa-solid fa-chevron-down"></i>
<div class="language-dropdown-container">
  <div class="language-dropdown">
      ${ul.outerHTML}
  </div>
</div>
</div> */
}
