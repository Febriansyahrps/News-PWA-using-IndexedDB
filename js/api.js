const base_url = "https://reader-api.dicoding.dev/";

//blok kode akan dipanggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log(`Error : ${response.status}`)
        //method reject akan membuat catch blok terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        //mengubah suatu objek menjadi promise agar bisa di then-kan
        return Promise.resolve(response)
    }
}

//blok untuk memparsing json menjadi array JS
function json(response){
    return response.json()
}

//blok untuk menghandle kesalahan di block catch
function error(error){
    //param error berasal dari promise.reject()
    console.log(`Error : ${error}`);
}

//blok kode untuk melakukan request data json
function getArticles() {

    //menyimpan Offline cache
    if ('caches' in window){
        caches.match(`${base_url}articles`).then(function(response) {
            if (response) {
                response.json()
                .then(function(data) {
                    //menyusun kompone card artikel secara dinamis
                    let articlesHTML = "";
                    data.result.forEach(function(article) {
                        articlesHTML +=  `
                            <div class="card">
                                <a href="./article.html?id=${article.id}">
                                    <div class="card-image waves-effect waves-block waves-light">
                                        <img src="${article.thumbnail}" />
                                    </div>
                                </a>
                                <div class="card-content">
                                    <span class="card-title truncate">${article.title}</span>
                                    <p>${article.description}</p>
                                </div>
                            </div>
            
                        `;
                    });
                    //sisipkan komponen card kedalam elemen dg id #content
                    document.getElementById("articles").innerHTML = articlesHTML;
                })
            }
        })
    }

    fetch(`${base_url}articles`)
    .then(status)
    .then(json)

    //objek/array JS dari response.json() masuk lewat data
    .then(function(data) {

        //menyusun kompone card artikel secara dinamis
        let articlesHTML = "";
        data.result.forEach(function(article) {
            articlesHTML +=  `
                <div class="card">
                    <a href="./article.html?id=${article.id}">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img src="${article.thumbnail}" />
                        </div>
                    </a>
                    <div class="card-content">
                        <span class="card-title truncate">${article.title}</span>
                        <p>${article.description}</p>
                    </div>
                </div>

            `;
        });

        //sisipkan komponen card kedalam elemen dg id #content
        document.getElementById("articles").innerHTML = articlesHTML;
    })
    .catch(error)
}

function getArticleById() {
    return new Promise(function(resolve, reject) { 
        //ambil nilai query param
        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get("id");

        //menyimpan Offline cache
        if('caches' in window) {
            caches.match(`${base_url}article/${idParam}`)
            .then(function(response) {
                if (response) {
                    response.json()
                    .then(function(data) {
                        const articleHTML = `
                        <div class="card">
                            <div class="card-image waves-effect waves-block waves-light">
                                <img src="${data.result.cover}" />
                            </div>
                            <div class="card-content">
                                <span class="card-title">${data.result.post_title}</span>
                                ${snarkdown(data.result.post_content)}
                            </div>
                        </div>
                    `;
                    //sisipkan komponen card kedalam elemen dengan id #content
                    document.getElementById("body-content").innerHTML = articleHTML

                    //kirim objek data hasil parsing json agar disimpan di indexed db
                    resolve(data)
                    });
                }
            });
        }

        fetch(`${base_url}article/${idParam}`)
        .then(status)
        .then(json)
        .then(function(data) {
            //objek JS dari response.json() masuk lewat variable data
            console.log(data);
            //menyusun komponen card secara dinamis
            const articleHTML = `
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${data.result.cover}" />
                    </div>
                    <div class="card-content">
                        <span class="card-title">${data.result.post_title}</span>
                        ${snarkdown(data.result.post_content)}
                    </div>
                </div>
            `;
            //sisipkan komponen card kedalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = articleHTML

            //kirim objek data hasil parsing json agar disimpan di indexed db
            resolve(data)
        })
    });
}

function getSavedArticles() {
    getAll().then(function(articles) {
        console.log(articles);
        //menyusun komponen secara dinamis
        let articlesHTML = "";
        articles.forEach(function(article) {
            const description = article.post_content.substring(0,100);
            articlesHTML += `
                <div class="card">
                    <a href="./article.html?id=${article.ID}&saved=true">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img src="${article.cover}" />
                        </div>
                    </a>
                    <div class="card-content">
                        <span class="card-title truncate">${article.post_title}</span>
                        <p>${description}</p>
                    </div>
                </div>
            `;
        })
        //sisipkan komponen card kedalam elemen dengan id #body-content
        document.getElementById("body-content").innerHTML = articlesHTML
    })
}

function getSavedArticleById() {    
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");

    getById(idParam)
    .then(function(article) {
        let articleHTML = "";
        articleHTML = `
            <div class="card">
                <div class="card-image waves-effect waves-block waves-light">
                    <img src="${article.cover}" />
                </div>
                <div class="card-content">
                    <span class="card-title">${article.post_title}</span>
                    ${snarkdown(article.post_content)}
                </div>
            </div>
        `;

        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = articleHTML;
    })
}   