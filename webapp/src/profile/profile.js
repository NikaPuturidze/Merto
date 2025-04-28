import { setFooter, setHeader, setNav } from '../main.js'
import { API_KEY } from '../main.js'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { firebaseConfig } from '../main.js'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

class Profile {
  currentLang = window.localStorage.getItem('lang') || 'en'
  holder

  onInit() {
    if (!localStorage.getItem('idToken')) {
      return (window.location.href = '/')
    }

    getTotalProductQuantity(localStorage.getItem('uid'))

    fetch('https://merto-step-production.up.railway.app/topics', {
      headers: { 'accept-language': this.currentLang },
    })
      .then((r) => r.json())
      .then((data) => {
        setHeader(data.header)
        setNav(data.header)
        setFooter(data.footer)
        this.handleNavigation()
        this.getUserInfo()
        this.loadCartProducts()
      })
      .catch((err) => console.error('Topics load error:', err))

    setTimeout(() => {
      const uid = window.localStorage.getItem('uid')
      const buyBtn = document.querySelector('.buy')
      if (buyBtn && uid) {
        getCartData(uid)
          .then((cartItems) => {
            buyBtn.addEventListener('click', async () => {
              if (!cartItems.length) {
                alert('Cart is empty')
                return
              }
              await this.clearCartData(uid)
              alert('Thanks for buying, but it’s SCAM')
              window.location.reload()
            })
          })
          .catch((err) => {
            console.error('Error checking cart before buy:', err)
            buyBtn.addEventListener('click', () => alert('Oops, can’t check your cart right now.'))
          })
      }
    }, 500)
  }

  async clearCartData(userId) {
    const cartRef = doc(db, 'carts', userId)
    try {
      await setDoc(cartRef, { items: [] }, { merge: true })
      console.log('Cart cleared successfully')
    } catch (err) {
      console.error('Error clearing cart:', err)
    }
  }

  renderProducts(products) {
    const productsContainer = document.querySelector('.cart-product')

    if (!products.length) {
      productsContainer.innerHTML = '<p>No products in cart.</p>'
      return
    }

    productsContainer.innerHTML = ''

    products.forEach((product) => {
      const productDiv = document.createElement('div')
      productDiv.classList.add('product-item')

      productDiv.innerHTML = `
          <img src="${product.imageUrl}" />
          <div class="cart-info">
            <h4>${product.name}</h4>
            <h5>${product.price}</h5>
          </div>
        `

      productsContainer.appendChild(productDiv)
    })
  }

  renderProducts(products) {
    const container = document.querySelector('.cart-product')
    container.innerHTML = ''

    products.forEach((prod) => {
      const div = document.createElement('div')
      div.classList.add('product-item')
      div.innerHTML = `
        <img src="${prod.imageUrl}" />
        <div class="cart-info">
          <h4>${prod.name}</h4>
          <p>Quantity: ${prod.quantity}</p>
          <h5>${prod.price}₾</h5>
        </div>
        `
      container.appendChild(div)
    })
  }

  loadCartProducts() {
    const uid = window.localStorage.getItem('uid')
    if (!uid) return

    getCartData(uid)
      .then((cartItems) => {
        if (!cartItems.length) {
          document.querySelector('.cart-product').innerHTML = '<p>No items in cart.</p>'
          return
        }
        return Promise.all(
          cartItems.map((item) =>
            fetch(`https://merto-step-production.up.railway.app/details?productId=${item.productId}`, {
              headers: { 'accept-language': this.currentLang },
            })
              .then((res) => {
                if (!res.ok) throw new Error('Network error')
                return res.json()
              })
              .then((detail) => ({
                productId: item.productId,
                name: detail.name,
                price: detail.price || item.price,
                imageUrl: detail.imageUrl,
                quantity: item.quantity,
              }))
          )
        )
      })
      .then((products) => {
        if (products) this.renderProducts(products)
      })
      .catch((err) => console.error('Error loading cart products:', err))
  }

  getUserInfo() {
    let profile = document.querySelector('.section-profile-container')

    profile.innerHTML = `
        <div class="left">
          <img src="https://bootdey.com/img/Content/avatar/avatar7.png" />
          <h4 class="name">${window.localStorage.getItem('userDisplayName')}</h4>
          <h4 class="age">19 Years</h4>
          <button class="logout">Log Out</button>
          <button class="buy">Buy</button>
        </div>
    
        <div class="right">
          <div class="profile-container">
            <div class="info">
              <div class="name-field field">
                <h4 class="value">Name:</h4>
                <h4 class="full">${window.localStorage.getItem('userDisplayName')}</h4>
              </div>
              <div class="email-field field">
                <h4 class="value">Email:</h4>
                <div class="email">${window.localStorage.getItem('userEmail')}</div>
              </div>
              <div class="address-field field">
                <h4 class="value">Address:</h4>
                <div class="address">Tbilisi</div>
              </div>
              <div class="address-field field">
                <h4 class="value">Login Time:</h4>
                <div class="address">${window.localStorage.getItem('loginTime')}</div>
              </div>
              <div class="address-field field">
                <h4 class="value">User ID:</h4>
                <div class="address">${window.localStorage.getItem('uid')}</div>
              </div>
    
              <div class="add">
                <button class="reset-pass-profile">Reset Password</button>
                <button>Cart</button>
              </div>
            </div>
    
            <div class="products">
              <div class="cart-product"></div>
            </div>
          </div>
        </div>
      `

    const logoutBtn = document.querySelector('.logout')
    logoutBtn.addEventListener('click', () => {
      ;['idToken', 'refreshToken', 'userEmail', 'userDisplayName', 'loginTime', 'uid'].forEach((key) => window.localStorage.removeItem(key))

      window.location.href = '/'
    })
  }

  handleNavigation() {
    const categories = document.querySelector('#cat-list').getElementsByTagName('li')
    const categoriesArray = Array.from(categories)
    categoriesArray.pop()

    categoriesArray.forEach((category) => {
      category.addEventListener('click', () => {
        const classValue = category.classList
        window.location.href = `/catalog/catalog.html?catId=${classValue}&page=${1}`
      })
    })
  }

  sendPasswordResetEmail(email) {
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
}

new Profile().onInit()

async function getCartData(userId) {
  try {
    const cartRef = doc(db, 'carts', userId)

    const cartSnap = await getDoc(cartRef)

    if (cartSnap.exists()) {
      const cartData = cartSnap.data()

      if (cartData && cartData.items) {
        return cartData.items
      } else {
        return []
      }
    } else {
      return []
    }
  } catch (error) {
    console.error('Error fetching cart data:', error)
    return []
  }
}

async function getTotalProductQuantity(userId) {
  try {
    const cartRef = doc(db, 'carts', userId)
    const cartSnap = await getDoc(cartRef)

    if (cartSnap.exists()) {
      const cartData = cartSnap.data()

      if (cartData && cartData.items) {
        const totalQuantity = cartData.items.reduce((total, item) => total + item.quantity, 0)
        return totalQuantity
      } else {
        return 0
      }
    } else {
      return 0
    }
  } catch (error) {
    console.error('Error fetching total product quantity:', error)
    return 0
  }
}
