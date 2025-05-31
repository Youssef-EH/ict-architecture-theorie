const express = require('express')
const fs = require('fs')
const path = require('path')
const { marked } = require('marked')

const app = express()
const port = 8000

app.set('view engine', 'ejs')
app.set('views', __dirname) // 👈 dit is de fix

app.use('/afbeeldingen/:image', (req, res, next) => {
  let les = 'theorieles 1'

  // Haal actieve theorieles uit de Referer header
  const referer = req.get('Referer')
  if (referer) {
    const match = referer.match(/[?&]les=([^&]+)/)
    if (match) {
      les = decodeURIComponent(match[1])
    }
  }

  const imagePath = path.join(__dirname, les, 'afbeeldingen', req.params.image)

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) return res.status(404).send('Afbeelding niet gevonden')
    res.sendFile(imagePath)
  })
})

// Statische bestanden
app.use(express.static('.'))
app.use('/reveal.js', express.static(__dirname + '/node_modules/reveal.js'))

// Hoofdrendering
app.get('/', (req, res) => {
  const folderName = req.query.les || 'theorieles 1'
  const filePath = path.join(__dirname, folderName, 'index.md')

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Fout bij het laden van de markdown.')
    }

    const slides = data.split(/^---$/m).map((section) => {
      const cleaned = section.replace(
        /^note:\s*([\s\S]*)/m,
        (_, notes) =>
          `<aside class="notes">\n${marked.parse(notes.trim())}</aside>`
      )
      return marked.parse(cleaned)
    })

    // Zoek alle theorieles folders
    const lesFolders = fs.readdirSync(__dirname).filter((name) => {
      return (
        fs.statSync(path.join(__dirname, name)).isDirectory() &&
        name.startsWith('theorieles')
      )
    })

    lesFolders.sort((a, b) => {
      const getNumber = (str) => parseInt(str.match(/\d+/)?.[0] || 0, 10)
      return getNumber(a) - getNumber(b)
    })

    res.render('index', { slides, folderName, lesFolders })
  })
})

app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`)
})
