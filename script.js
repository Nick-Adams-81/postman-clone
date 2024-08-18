import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios"

const form = document.querySelector('[data-form]')

form.addEventListener('submit', e => {
    e.preventDefault()
    axios({
        url: document.querySelector('[data-url]').value,
        method: document.querySelector('[data-method]').value,
        params: keyValuePairsToObjects(queryParamsContainer),
        headers: keyValuePairsToObjects(requestParamsContainer),
    }).then(response => {
        console.log(response)
    })
})
const  queryParamsContainer = document.querySelector('[data-query-params]')
const requestParamsContainer = document.querySelector('[data-request-headers]')

queryParamsContainer.append(createKeyValuePair())
requestParamsContainer.append(createKeyValuePair())

document.querySelector('[data-add-query-param-btn]').addEventListener('click', () => {
    queryParamsContainer.append(createKeyValuePair())
})

document.querySelector('[data-add-request-header-btn]').addEventListener('click', () => {
    requestParamsContainer.append(createKeyValuePair())
})

function keyValuePairsToObjects(container) {
    const pairs = container.querySelectorAll('[data-key-value-pair]')
    return [...pairs].reduce((data, pair) => {
        const key = pair.querySelector('[data-key]').value
        const value = pair.querySelector('[data-value]').value

        if(key === '') return data
        return { ...data, [key]: value }
    }, {})
}
function createKeyValuePair() {
    const element = document.querySelector('[data-key-value-template]').content.cloneNode(true)
    element.querySelector('[data-remove-btn]').addEventListener('click', (e) => {
        e.target.closest('[data-key-value-pair]').remove()
    })
    return element
}