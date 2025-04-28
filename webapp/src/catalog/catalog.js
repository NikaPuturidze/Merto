import { setFooter, setHeader, setNav } from '../main.js'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { firebaseConfig } from '../main.js'
import { getAuth } from 'firebase/auth'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

class Catalog {
  currentLang = window.localStorage.getItem('lang') || 'en'
  catId
  items = []
  undfilteredItems = []
  currentSortTitle = ''
  categoryName = ''
  sortArray = []

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

        this.catId = new URLSearchParams(window.location.search).get('catId')

        this.fetchCatalog(this.catId)
        this.fetchFilter(this.catId)

        this.handleNavigation()
        this.initPriceRangeFilter()
        this.initSearchFilter()
      })
  }

  initPriceRangeFilter() {
    const slider = document.getElementById('price-range')
    const display = document.getElementById('price-value')
    const MAX_PRICE = Number(slider.max)

    display.textContent = slider.value

    slider.addEventListener('input', () => {
      const minPrice = Number(slider.value)
      display.textContent = minPrice
      this.filterItemsByPrice(minPrice, MAX_PRICE)
    })
  }

  initSearchFilter() {
    const input = document.getElementById('search-input')
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase()
      const filtered = this.undfilteredItems.filter((item) => item.name.toLowerCase().includes(q))
      this.items = filtered
      this.setCatalog(filtered)
    })
  }

  filterItemsByPrice(minPrice, maxPrice) {
    const filtered = this.undfilteredItems.filter((item) => item.price >= minPrice && item.price <= maxPrice)
    this.items = filtered
    this.setCatalog(filtered)
  }

  fetchCatalog(catId) {
    document.querySelector('.loader').style.display = 'flex'
    fetch(`https://merto-step-production.up.railway.app/catalog?catId=${catId}&amount=30`, {
      headers: { 'accept-language': this.currentLang },
    })
      .then((r) => r.json())
      .then((data) => {
        this.undfilteredItems = data.items
        this.items = [...this.undfilteredItems]
        this.setCatalog(this.items)
        document.querySelector('.loader').style.display = 'none'
      })
  }

  fetchFilter(catId) {
    fetch(`https://merto-step-production.up.railway.app/filter?catId=${catId}&amount=30`, {
      headers: { 'accept-language': this.currentLang },
    })
      .then((r) => r.json())
      .then((data) => {
        const convertedData = Object.values(data)
        this.setFilter(convertedData)
        this.categoryName = data.categoryName
        this.sortArray = data.sort
        this.currentSortTitle = data.sort[0]
      })
  }

  sortCatalog(sortBy) {
    this.currentSort = sortBy
    this.applySort()
    this.setCatalog(this.items)
  }

  applySort() {
    if (this.currentSort === 'price-low-high') {
      this.items.sort((a, b) => a.price - b.price)
    } else if (this.currentSort === 'price-high-low') {
      this.items.sort((a, b) => b.price - a.price)
    }
  }

  handleNavigation() {
    const categories = document.querySelector('#cat-list').getElementsByTagName('li')
    const categoriesArray = Array.from(categories)
    categoriesArray.pop()

    categoriesArray.forEach((category) => {
      category.addEventListener('click', () => {
        const classValue = category.classList
        window.location.href = `?catId=${classValue}`
      })
    })
  }

  setCatalog(catalog) {
    const products = document.querySelector('.products')
    const sort = document.querySelector('.sort')
    const topRow = document.querySelector('.top-row')
    products.innerHTML = ''

    topRow.innerHTML = `
        <i class="fa-solid fa-chevron-left back"></i>
        <h3 class="category-name">${this.categoryName}</h3>
    `

    const chevron = document.querySelector('.back')
    chevron.addEventListener('click', () => {
      window.location.href = '/'
    })

    sort.innerHTML = `
      <div class="sortby">
        <div class="methods">
          <div class="methods-cont">
            <h4 data-sort="default">${this.sortArray[0]}</h4>
            <h4 data-sort="price-low-high">${this.sortArray[1]}</h4>
            <h4 data-sort="price-high-low">${this.sortArray[2]}</h4>
          </div>
        </div>
        <div class="cont">
          <h4 class="chsnSort">${this.currentSortTitle}</h4>
          <i class="fa-solid fa-chevron-down"></i>
        </div>
      </div>
    `

    if (catalog.length === 0) {
      products.innerHTML = `<p class="no-products">Nothing found</p>`
      return
    }

    catalog.forEach((item) => {
      let bestDiv = ''
      if (item.previousPrice) {
        bestDiv = `
            <div class="best">
                <h4 class="best-price">HOT</h4>
            </div>
        `
      }

      products.innerHTML += `
        <div class="product-item" data-id="${item.id}">
            <div class="side-bar">
                <div class="search"><i class="fa-solid fa-magnifying-glass"></i></div>
                <div class="cart"><i class="fa-solid fa-cart-shopping"></i></div>
            </div>
            <div class="image">
                ${bestDiv}
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

    const search = document.querySelectorAll('.search')
    const cart = document.querySelectorAll('.cart')

    search.forEach((searchItem) => {
      searchItem.addEventListener('click', (event) => {
        event.stopPropagation()

        const productItem = searchItem.closest('.product-item')
        const productId = productItem ? productItem.dataset.id : null

        if (productId) {
          window.location.href = `../detail/detail.html?productId=${productId}`
        }
      })
    })

    cart.forEach((cartItem) => {
      cartItem.addEventListener('click', (event) => {
        event.stopPropagation()

        const productItem = cartItem.closest('.product-item')
        const productId = productItem.dataset.id
        const matchedItem = this.items.find((item) => item.id == productId)

        if (window.localStorage.getItem('idToken')) {
          if (matchedItem) {
            const itemPrice = matchedItem.price
            console.log(matchedItem)
            setCartData(window.localStorage.getItem('uid'), [
              {
                productId: productId,
                quantity: 1,
                price: itemPrice,
              },
            ])
            alert('Added to cart')
          }
        } else {
          alert('In order to use cart, Proceed to login')
        }
      })
    })
  }

  setFilter(filters) {
    const aside = document.querySelector('.filters')

    filters.forEach((e) => {
      const filterWrapperDiv = document.createElement('div')
      filterWrapperDiv.classList.add('filter-wrapper')

      const headerDiv = document.createElement('div')
      headerDiv.classList.add('filter-header')

      const h4 = document.createElement('h4')
      h4.classList.add('filter-name')

      h4.textContent = e.name

      headerDiv.appendChild(h4)
      filterWrapperDiv.appendChild(headerDiv)

      if (e.values && e.values.length > 0) {
        const valuesDiv = document.createElement('div')
        valuesDiv.classList.add('filter-values')

        if (e.id === 2) {
          const valueDiv = document.createElement('div')
          valueDiv.classList.add('value-c')

          e.values.forEach((value) => {
            const colorDiv = document.createElement('div')
            colorDiv.classList.add('color-value')

            const colorSwatch = document.createElement('div')
            colorSwatch.classList.add('color-swatch')
            colorSwatch.style.backgroundColor = value.hex

            const colorName = document.createElement('h5')
            colorName.textContent = value.name

            const checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.name = `${e.name}-${value.name}`
            checkbox.classList.add('filter-check')
            checkbox.value = value.name
            checkbox.dataset.filterGroup = e.name

            colorDiv.appendChild(colorSwatch)
            colorDiv.appendChild(colorName)
            colorDiv.appendChild(checkbox)
            valueDiv.appendChild(colorDiv)
          })

          valuesDiv.appendChild(valueDiv)
        } else {
          e.values.forEach((value) => {
            const valueDiv = document.createElement('div')
            valueDiv.classList.add('value')

            const checkbox = document.createElement('input')

            checkbox.type = 'checkbox'
            checkbox.name = e.name
            checkbox.classList.add('filter-check')
            checkbox.value = value
            checkbox.dataset.filterGroup = e.name

            const h5 = document.createElement('h5')
            h5.textContent = value

            valueDiv.appendChild(checkbox)
            valueDiv.appendChild(h5)
            valuesDiv.appendChild(valueDiv)
          })
        }

        filterWrapperDiv.appendChild(valuesDiv)
      }

      aside.appendChild(filterWrapperDiv)
    })

    document.querySelectorAll('.filter-check').forEach((cb) => {
      cb.addEventListener('change', () => {
        const checked = Array.from(document.querySelectorAll('.filter-check:checked'))
        const groups = checked.reduce((acc, cb) => {
          const group = cb.dataset.filterGroup
          if (!acc[group]) acc[group] = []
          acc[group].push(cb.value)
          return acc
        }, {})

        let filtered = [...this.undfilteredItems]

        Object.entries(groups).forEach(([group, vals]) => {
          if (!vals.length) return

          filtered = filtered.filter((item) => {
            switch (group) {
              case 'Color':
                return item.specificationGroup?.some((g) => g.specifications?.some((spec) => vals.includes(spec.specificationMeaning)))

              case 'Brands':
                return vals.includes(item.subCategoryName)

              case 'RAM':
                return item.mainSpecification?.some((spec) => vals.includes(spec.specificationMeaning))

              case 'Memory':
                return item.specificationGroup?.some((g) => g.specifications?.some((spec) => vals.includes(spec.specificationMeaning)))

              case 'Refresh rate':
                return item.specificationGroup?.some((g) => g.specifications?.some((spec) => vals.includes(spec.specificationMeaning)))

              case 'Screen size':
                return item.specificationGroup?.some((g) => g.specifications?.some((spec) => vals.includes(spec.specificationMeaning)))

              default:
                return true
            }
          })
        })

        if (checked.length === 0) {
          filtered = [...this.undfilteredItems]
        }

        this.items = filtered
        this.setCatalog(filtered)
      })
    })
  }
}

new Catalog().onInit()

const setCartData = async (userId, items) => {
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
