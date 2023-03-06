'use strict'


// ======================================== caching the DOM:
const form = document.querySelector('.form')
const formInput = document.querySelector('.form__input')
// const btnSearch = document.querySelector('.form__btn')
const resultsContainer = document.querySelector('.results__items')
const resultsEl = document.querySelector('.results')

let allCountries

const euMembers = ['Belgium','France','Germany','Italy','Luxembourg','Netherlands','Denmark','Ireland','United Kingdom','Greece','Portugal','Spain','Austria','Finland','Sweden','Cyprus','Czech Republic','Estonia','Hungary','Latvia','Lithuania','Malta','Poland','Slovakia','Slovenia','Bulgaria','Romania','Croatia']




// ======================================== event listeners:
form.addEventListener('submit', onSubmit)
formInput.addEventListener('input', onTyping)
// btnSearch.addEventListener('click', onSearch)




// ======================================== functions:
function showIt(el) { el.classList.remove('hidden') }
function hideIt(el) { el.classList.add('hidden') }
function removeIt(el) { el.remove() }


function init() {
    formInput.value = ''
}
init()


function getAllCountries() {
    const request = new XMLHttpRequest()       
    request.open('GET', 'https://restcountries.com/v3.1/all') 
    request.send()    
    request.addEventListener('load', callbackFnWhenDataComes)  
    function callbackFnWhenDataComes() {
        allCountries = JSON.parse(this.responseText)
        if (!allCountries) { console.log(`fetching countries' info: unsuccessful 🚫`); return }
        console.log(`fetching countries' info: successful ✅`)
    }
}
getAllCountries()


function onSubmit(e) {
    e.preventDefault()
}


function onSearch(e) {
    e.preventDefault()
}


function onTyping() {
    if (formInput.value.length < 2) {
        hideIt(resultsEl)
        document.querySelectorAll('.result').forEach(x => removeIt(x))
        return
    }
    showIt(resultsEl)
    document.querySelectorAll('.result').forEach(x => removeIt(x))
    getCountryInfo(formInput.value)
}


// ======================================================================================================================
// get all info by typing a country's name:
function getCountryInfo(countryName) {
    const countryNameCorrected = countryName[0].toUpperCase() + countryName.slice(1)
    const resultEl = allCountries.filter(x => JSON.stringify(x.name).includes(countryNameCorrected))
    if (resultEl.length === 0) {
        document.querySelector('.results__title span').innerHTML = `nothing found. 🙁 <br><br> Wakanda, Eastasia, and Gondor aren't real, y'know...`
        document.querySelector('.results__title span').style.fontSize = '20px'
        return
    }

    resultEl.forEach(item => {

    const elementHtml = `
    <div class="result">
                <div class="result__box">
                    <div class="result__flag">
                        <img data-id="flag" src="${item.flags.png}" alt="">
                    </div>
                    <div class="result__iso-code">
                        <span class="result__key">ISO code:</span> 
                        <span data-id="iso">${item.ccn3}</span>
                    </div>
                    <div class="result__3-letter-code">
                        <span class="result__key">3-Letter code:</span> 
                        <span data-id="three-letter">${item.cca3}</span>
                    </div>
                    <div class="result__2-letter-code">
                        <span class="result__key">2-Letter code:</span> 
                        <span data-id="two-letter">${item.cca2}</span>
                    </div>
                </div>
                <div class="result__main">
                    <div class="result__name">
                        <span class="result__key">Name:</span> 
                        <span data-id="name">common: ${item.name.common};<br>&nbsp; official: ${item.name.official}</span>
                    </div>
                    <div class="result__native-name">
                        <span class="result__key">Native name:</span> 
                        <span data-id="native-name">common: ${Object.values(item.name.nativeName)[0].common};<br>&nbsp; official: ${Object.values(item.name.nativeName)[0].official}</span>
                    </div>
                    <div class="result__currency">
                        <span class="result__key">Currency:</span> 
                        <span data-id="currency">${Object.entries(item.currencies)[0][1].name} (${Object.entries(item.currencies)[0][0]})</span>
                    </div>
                    <div class="result__langs-spoken">
                        <span class="result__key">Languages spoken:</span> 
                        <span data-id="langs-spoken">${Object.values(item.languages).toString().split(',').join(', ')}</span>
                    </div>
                    <div class="result__un-member">
                        <span class="result__key">UN Member:</span> 
                        <span data-id="un-member">${item.unMember === true ? 'yes' : 'no'}</span>
                    </div>
                    <div class="result__eu-member">
                        <span class="result__key">EU Member:</span> 
                        <span data-id="eu-member">${euMembers.includes(item.name.common) || euMembers.includes(item.name.official) ? 'yes' : 'no'}</span>
                    </div>
                    
                </div>
                <div class="result__translations">
                        <span class="result__key">Translations to other languages:</span> 
                        <span class="result__translations-btn">Show</span> 
                        <span class="result__translations-box hidden">
                            
                        </span>
                    </div>
            </div>`

            resultsContainer.insertAdjacentHTML('beforeend', elementHtml)
            

            for (let i = 0; i<Object.keys(item.translations).length; i++) {
                const translation = `
                <span class="result__translation">
                    <span class="result__translation-key">${Object.keys(item.translations)[i]}:&nbsp;</span>    
                    <span class="result__translation-value">${JSON.stringify(Object.values(item.translations)[i]).slice(2,-2).replaceAll('"', '')}</span>    
                </span>  `
                document.querySelectorAll('.result__translations-box').forEach(x => {
                    x.insertAdjacentHTML('beforeend', translation)
                })
            }
            deleteSpareTranslations()
            
            document.querySelector('.results__title span').style.fontSize = '30px'
            document.querySelector('.results__title span').innerHTML = ''
            document.querySelector('.results__title span').textContent = document.querySelectorAll('.result').length

            document.querySelectorAll('.result__translations-btn').forEach(x => {
                x.addEventListener('click', showTranslations)
            })

        })

}
// ======================================================================================================================



function showTranslations(e) {
    const item = e.target.closest('.result')
    item.querySelector('.result__translations-box').classList.toggle('hidden')
    if (item.querySelector('.result__translations-box').classList.contains('hidden')) {
        item.querySelector('.result__translations-btn').textContent = 'Show'
    } else item.querySelector('.result__translations-btn').textContent = 'Hide'
}




function deleteSpareTranslations() {
    document.querySelectorAll('.result__translations-box').forEach(x => {
        x.querySelectorAll('.result__translation').forEach((el,i,a) => {
            if(i > 24) removeIt(el)
        })
    })
}