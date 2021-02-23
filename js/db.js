const dbPromised = idb.open("news-reader", 1, function(upgradeDb) {
    const articleObjectStore = upgradeDb.createObjectStore("articles",{keyPath: "ID"});
    articleObjectStore.createIndex("post_title", "post_title", {unique : false});
});

function saveForLater(article) {
    dbPromised
    .then(function(db) {
        const tx = db.transaction("articles", "readwrite");
        const store = tx.objectStore("articles");
        console.log(article);
        store.add(article.result);
        return tx.complete;
    })
    .then(function() {
      console.log("Artikel berhasil di simpan.");
    });
}

function getAll(){
    return new Promise(function(resolve, reject) {
        dbPromised
        .then(function(db) {
            const tx = db.transaction("articles", "readonly");
            const store = tx.objectStore("articles");
            return store.getAll()
        })
        .then(function(articles) {
            resolve(articles);
        })
    })
}

function getById(id) {
    return new Promise(function(resolve, reject) {
        dbPromised
        .then(function(db) {
            const tx = db.transaction("articles", "readonly");
            const store = tx.objectStore("articles");
            return store.get(id);
        })
        .then(function(article) {
            resolve(article)
        })
    })
}