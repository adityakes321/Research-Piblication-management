const search = document.getElementById('search-doi');
console.log(search)

const fetchCitation = async (doi) => {
    const URL = (window.location.hostname);
    const data = await fetch(`http://${URL}:3000/citation-data?doi=${doi}`)
    const json = await data.json()
    return json
}
search.addEventListener('click', function(e) {
    e.preventDefault();
    const URL = (window.location.hostname);
    const doi = document.getElementById('doi-input').value;
    console.log(`http://${URL}:3000/citation-data?doi=${doi}`)
    // const data = fetchCitation(doi)
    fetch(`http://${URL}:3000/citation-data?doi=${doi}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        const title_of_paper = document.getElementById('title-of-paper');
        title_of_paper.value = data[0].title;
    }
    )
})