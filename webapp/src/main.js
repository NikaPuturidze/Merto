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
      console.log(window.localStorage.getItem('lang') || 'en', font.id)
      return
    }
  })

  document.documentElement.style.setProperty('--font', currentFont)
}

setFont()
