import { useEffect, useState } from 'react'
import { map, concat, trim, pipe, ifElse, isEmpty, pathOr } from 'ramda'
import './App.css'

const WIKIPEDIA_API_URL = concat(
  'https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search='
)

const doNothing = () => {}

function App () {
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState([])

  const handleChange = e => {
    e.preventDefault()
    getInput(e)
  }

  const getInput = pipe(pathOr('', ['target', 'value']), trim, setSearchValue)

  useEffect(() => {
    const ifFetch = ifElse(isEmpty, doNothing, fetchData)
    ifFetch(searchValue)
  }, [searchValue])

  const fetchData = async () => {
    try {
      const data = await fetch(WIKIPEDIA_API_URL(searchValue), {
        method: 'GET'
      })
      const result = await data.json()

      setResults(result[1])
    } catch (err) {
      console.error(err)
    }
  }
  const renderItem = item => <Result key={item} name={item} />

  return (
    <div className='App'>
      <header className='App-header'>
        <h4>Wikipedia search FS Ramda version</h4>
      </header>
      <main>
        <section>
          <input type='text' onChange={handleChange} value={searchValue} />
        </section>
        <section>
          <ul>{map(renderItem, results)}</ul>
        </section>
      </main>
    </div>
  )
}

export default App

const Result = ({ name, link }) => {
  return (
    <li>
      <h4>{name}</h4>
    </li>
  )
}
