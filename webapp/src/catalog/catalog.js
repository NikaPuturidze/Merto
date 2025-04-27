import { setFooter, setHeader, setNav } from '../main.js'

class Catalog {
  currentLang = window.localStorage.getItem('lang') || 'en'
  currentPage = 1
  limit = 24
  catId
  page
  items = []
  currentSortTitle = 'Default'

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

    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('page', 1)
    urlParams.set('limit', this.limit)
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`)

    this.catId = new URLSearchParams(window.location.search).get('catId')
    this.page = +(new URLSearchParams(window.location.search).get('page') || this.currentPage)

    this.fetchCatalog(this.catId, this.page, this.limit)
  }

  fetchCatalog(catId, page, limit) {
    fetch(`http://localhost:3000/catalog?catId=${catId}&page=${page}&limit=${limit}`, {
      headers: { 'accept-language': this.currentLang },
    })
      .then((r) => r.json())
      .then((data) => {
        if (page > 1) {
          this.items = this.items.concat(data.items)
        } else {
          this.items = data.items
        }

        if (this.currentSort) this.applySort()

        this.setCatalog(this.items)
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
        window.location.href = `?catId=${classValue}&page=1&limit=${this.limit}`
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
        <h3 class="category-name">მობილური ტელეფონები</h3>
    `

    const chevron = document.querySelector('.back')
    chevron.addEventListener('click', () => {
      window.location.href = '/'
    })

    sort.innerHTML = `
        <div class="sortby">
        <div class="methods">
            <div class="methods-cont">
            <h4>Default</h4>
            <h4>Sort by price: low to high</h4>
            <h4>Sort by price: high to low</h4>
            </div>
        </div>
        <h3>Sort:</h3>
        <div class="cont">
            <h4 class="chsnSort">${this.currentSortTitle}</h4>
            <i class="fa-solid fa-chevron-down"></i>
        </div>
        </div>
    `

    const contTitle = document.querySelector('.chsnSort')
    console.log(contTitle.textContent)

    document.querySelectorAll('.methods-cont h4').forEach((el) => {
      el.addEventListener('click', (e) => {
        const txt = e.target.textContent
        this.currentSortTitle = txt

        const contTitle = document.querySelector('.chsnSort')
        contTitle.textContent = txt

        if (txt.includes('low to high')) {
          this.sortCatalog('price-low-high')
        } else if (txt.includes('high to low')) {
          this.sortCatalog('price-high-low')
        } else if (txt.includes('Default')) {
          this.currentSort = null
          this.fetchCatalog(this.catId, 1, this.limit)
        }
      })
    })

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
        <div class="product-item">
            <div class="side-bar">
                <div class="wish"><i class="fa-regular fa-heart"></i></div>
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

    let showMoreButton = document.querySelector('.show-more')
    if (!showMoreButton) {
      products.innerHTML += `<button class="show-more">Show More</button>`
      showMoreButton = document.querySelector('.show-more')
    }

    showMoreButton.onclick = () => {
      this.currentPage += 1

      const urlParams = new URLSearchParams(window.location.search)
      urlParams.set('page', this.currentPage)
      urlParams.set('limit', this.limit)
      window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`)

      this.fetchCatalog(this.catId, this.currentPage, this.limit)
    }
  }
}

new Catalog().onInit()
