import { setFooter, setHeader, setNav } from '../main.js'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { firebaseConfig } from '../main.js'

import { initializeApp } from 'firebase/app'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

class Detail {
  constructor() {
    this.quantityCounter = document.getElementById('quantity')
    this.quantity = 1
    this.updatequantityCounter()

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

    this.productId = new URLSearchParams(window.location.search).get('productId')
    if (this.productId) {
      fetch(`https://merto-step-production.up.railway.app/details?productId=${this.productId}`, {
        method: 'GET',
        headers: {
          'accept-language': this.currentLang,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.productDetails = data
          this.setDetails()
          document.querySelector('.addToCart').addEventListener('click', () => {
            if (window.localStorage.getItem('idToken')) {
              setCartData(window.localStorage.getItem('uid'), [
                {
                  productId: this.productDetails.id,
                  quantity: 1,
                  price: this.productDetails.price,
                },
              ])
              alert('Added to cart')
            } else {
              alert('In order to use cart, Proceed to login')
            }
          })
        })
    } else {
      window.location.href = '/'
    }
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

  loadProductByColor(productId) {
    console.log(productId)

    window.location.href = `/detail/detail.html?productId=${productId}`
  }

  loadProductByMemory(productId) {
    console.log(productId)
    window.location.href = `/detail/detail.html?productId=${productId}`
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
      const thumb = document.createElement('img')
      thumb.src = img
      thumb.alt = `Thumbnail ${index + 1}`
      thumb.classList.add('thumbnail')

      if (index === 0) {
        thumb.classList.add('active')
      }

      thumbnails.appendChild(thumb)

      thumb.addEventListener('click', () => {
        mainImg.innerHTML = `<img src="${img}" alt="Main Image" />`

        const allThumbnails = document.querySelectorAll('.thumbnail')
        allThumbnails.forEach((thumb) => thumb.classList.remove('active'))

        thumb.classList.add('active')
      })
    })

    const storageQuantity = document.getElementById('storageQuantity')
    storageQuantity.innerHTML = `<p>${this.productDetails.storageQuantity > 0 ? 'In Stock' : 'Out Of Stock'}</p>`
    if (this.productDetails.storageQuantity > 0) {
      storageQuantity.classList.add('inStock')
    } else {
      storageQuantity.classList.add('outOfStock')
    }

    const colors = document.getElementById('colors')
    const colorName = document.getElementById('colorName')
    const memories = document.getElementById('memories')
    const memoryName = document.getElementById('memoryName')

    if (this.productDetails.keySpecification.length <= 0) {
      document.querySelector('.productColors').style.display = 'none'
      document.querySelector('.productMemory').style.display = 'none'
    }
    this.productDetails.keySpecification.forEach((key) => {
      if (key.isColor) {
        colorName.innerHTML = `
        ${key.specificationName}: <span>${key.specificationMeaning}</span>
        `
        key.specificationMeaningsList.forEach((color) => {
          colors.innerHTML += `
        <div class="color ${color.isSelected ? 'active' : ''}" data-product-id="${color.productId}" style="cursor: pointer;">
          <div class="colorType" style="background-color: ${color.value};"></div>
        </div>
      `
        })

        document.querySelectorAll('.color').forEach((colorDiv) => {
          colorDiv.addEventListener('click', () => {
            const productId = colorDiv.getAttribute('data-product-id')
            this.loadProductByColor(productId)
            document.querySelectorAll('.color').forEach((div) => div.classList.remove('active'))
            colorDiv.classList.add('active')
          })
        })
      } else {
        memoryName.innerHTML = `
        ${key.specificationName}: <span>${key.specificationMeaning}</span>
        `
        key.specificationMeaningsList.forEach((memory) => {
          memories.innerHTML += `
        <div class="memory ${memory.isSelected ? 'active' : ''}" data-product-id="${memory.productId}" style="cursor: pointer;">
          <p>${memory.value}</p>
        </div>
      `
        })

        document.querySelectorAll('.memory').forEach((memoryDiv) => {
          memoryDiv.addEventListener('click', () => {
            const productId = memoryDiv.getAttribute('data-product-id')
            this.loadProductByMemory(productId)
            document.querySelectorAll('.memory').forEach((div) => div.classList.remove('active'))
            memoryDiv.classList.add('active')
          })
        })
      }
    })

    const barCode = document.getElementById('barCode')
    barCode.innerText = this.productDetails.barCode

    const categoryName = document.getElementById('categoryName')
    categoryName.innerText = this.productDetails.categoryName

    const specificationsMenu = document.getElementById('specificationsMenu')
    this.productDetails.mainSpecification.forEach((spec) => {
      specificationsMenu.innerHTML += `
                <div class="spec">
                  <p>${spec.specificationName}:</p>
                  <span>${spec.specificationMeaning}</span>
                </div>
      `
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

async function setCartData(userId, items) {
  try {
    const cartRef = doc(db, 'carts', userId)
    const cartSnap = await getDoc(cartRef)

    let currentItems = []

    if (!cartSnap.exists()) {
      currentItems = []
    } else {
      const cartData = cartSnap.data()
      if (cartData && cartData.items) {
        currentItems = cartData.items
      }
    }

    items.forEach((item) => {
      const existingItem = currentItems.find((cartItem) => cartItem.productId === item.productId)

      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        currentItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })
      }
    })

    const payload = {
      items: currentItems,
    }

    await setDoc(cartRef, payload, { merge: true })
  } catch (error) {
    console.error('Error:', error)
  }
}
