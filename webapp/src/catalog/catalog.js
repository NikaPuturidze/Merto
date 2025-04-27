import { setFooter, setHeader, setNav } from '../main.js'

class Catalog {
  currentLang = window.localStorage.getItem('lang') || 'en'
  catId
  items = []
  undfilteredItems = []
  currentSortTitle = ''
  categoryName = ''
  sortArray = []

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

    this.catId = new URLSearchParams(window.location.search).get('catId')

    this.fetchCatalog(this.catId)
    this.fetchFilter(this.catId)
  }

  fetchCatalog(catId) {
    document.querySelector('.loader').style.display = 'flex'
    fetch(`http://localhost:3000/catalog?catId=${catId}`, {
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
    fetch(`http://localhost:3000/filter?catId=${catId}`, {
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

    document.querySelectorAll('.methods-cont h4').forEach((el) => {
      el.addEventListener('click', (e) => {
        const sortKey = e.target.dataset.sort
        this.currentSortTitle = e.target.textContent
        document.querySelector('.chsnSort').textContent = this.currentSortTitle

        if (sortKey === 'default') {
          this.currentSort = null
          this.fetchCatalog(this.catId)
        } else {
          this.sortCatalog(sortKey)
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

              case 'Brand':
                return vals.includes(item.subCategoryName)

              case 'RAM':
                return item.mainSpecification?.some((spec) => vals.includes(spec.specificationMeaning))

              case 'Memory':
                return item.specificationGroup?.some((g) => g.specifications?.some((spec) => vals.includes(spec.specificationMeaning)))

              case 'Refresh rate':
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
