import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios"
import prettyBytes from "pretty-bytes"
import seetupEditors from "./setupEditor"

const form = document.querySelector('[data-form]')

// axios.interceptors.request.use(request => {
//     request.customData = request.customData || {}
//     request.customData.startTime = new Date().getTime()
//     return request
// })

// function updateEndTime(resposne) {
//     resposne.customData = resposne.customData || {}
//     resposne.customData.time = new Date().getTime() - response.config.customData.startTime
//     return response
// }

// axios.interceptors.response.use(updateEndTime, e => {
//     return Promise.reject(updateEndTime(e.response))
// })

const { requestEditor, updateResponseEditor } = seetupEditors()
form.addEventListener('submit', e => {
    e.preventDefault()
    axios({
        url: document.querySelector('[data-url]').value,
        method: document.querySelector('[data-method]').value,
        params: keyValuePairsToObjects(queryParamsContainer),
        headers: keyValuePairsToObjects(requestParamsContainer),
    })
    .catch(error => error.response)
    .then(response => {
        document.querySelector('[data-response-section]').classList.remove('d-none')
        updateResponseDetails(response)
        updateResponseEditor(response.data)
        updateresponseHeaders(response.headers)
        console.log(response)
    })
})

function updateResponseDetails(response) {
    document.querySelector('[data-status]').textContent = response.status
    // document.querySelector('[data-time]').textContent = response.customData.time
    document.querySelector('[data-size]').textContent = prettyBytes(
        JSON.stringify(response.data).length + JSON.stringify(response.headers).length
    )
}
function updateresponseHeaders(headers) {
    responseHeadersContainer.innerHTML = ''
    Object.entries(headers).forEach(([key, value]) => {
        const keyElement = document.createElement('div')
        const valueElement = document.createElement('div')
        keyElement.textContent = key
        responseHeadersContainer.append(keyElement)
        valueElement.textContent = value
        responseHeadersContainer.append(valueElement)

    })
}
const  queryParamsContainer = document.querySelector('[data-query-params]')
const requestParamsContainer = document.querySelector('[data-request-headers]')
const responseHeadersContainer = document.querySelector('[data-response-headers]')

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