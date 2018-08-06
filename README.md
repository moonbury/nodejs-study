#### This project is the result of my learning of NodeJs, the final product is the web service backend under the ux folder.

To started, download the data from [www.gutenberg.org](http://www.gutenberg.org/cache/epub/feeds/rdf-files.tar.bz2). Extract it and use the esclu to add selected data to elasticsearch. b4 is the web service and b4-app is the web UI. First, start the b4 webservice and it will serve in 60702 port. Then start the b4-app that serve on 60800 port.

Book webservice API
* retrieve the api version
```
/api/version
```

* retrieve the bundles
```
/api/bundles
```

* query a book
```
/api/search/books/:field/:query
```

* find a suggested book
```
/api/suggest/:field/:query
```
* retrieve the book bundles
```
/api/bundle
```

* Create a book bundle
```
/api/bundle/:id
```

* Query a book bundle
```
/api/bundle/:id/name/:name
```

* Add a book to a bundle (POST method)
```
/api/bundle/:id/book/:pgid
```
* Remove a book from a bundle (DELETE method)
```
/api/bundle/:id/book/:pgid
```

* Remove a bundle (DELETE method)
```
/api/bundle/:id
```
