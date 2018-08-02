### README

This is the nodejs project for building a bookstore web service.
The datastore is elasticsearch.

The API calls are

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
