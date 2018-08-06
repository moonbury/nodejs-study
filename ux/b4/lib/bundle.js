/**
 * API endpoints for working with books.
 */

'use strict';

const rp = require('request-promise');

module.exports = (app, es) => {
  const url = `http://${es.host}:${es.port}/${es.bundles_index}/bundle`;

  // create a book bundle
  //BUNDLE_ID=QsBP6mQB0VyTVcrpMzWZ
  //curl -s -X POST localhost:60702/api/bundle?name=lipman | jq '.'
  //lipman BUNDLE_ID=DD-J72QB9AeqzBnNpQIJ
  //use post method.
  app.post('/api/bundle', (req, res) => {
    console.log('create a book bundle..');
    const bundle = {
      name: req.query.name || '',
      books: [],
    }

    rp.post({
        url,
        body: bundle,
        json: true
      })
      .then(esResBody =>
        res.status(201).json(esResBody))
      .catch(({
        error
      }) => res.status(error.status || 502).json(error));
  });

  /* get the bundles detail
  ie. curl -s  localhost:60702/api/bundle/DD-J72QB9AeqzBnNpQIJ | jq '.'
  es call url is   curl -s  localhost:9200/b4/bundle/DD-J72QB9AeqzBnNpQIJ | jq '.'
  */
  app.get('/api/bundle/:id', async (req, res) => {
    console.log('show bundle detail..');

    const options = {
      url: `${url}/${req.params.id}`,
      json: true,
    };

    //console.log(options);
    try {
      const esResBody = await rp(options);
      res.status(200).json(esResBody);
    } catch (esResErr) {
      res.status(esRes.Err.statusCode || 502).json(esResErr.error);
    }
  });


  /* set/update the name of a bundle */
  //ie. curl -s  -X PUT localhost:60702/api/bundle/DD-J72QB9AeqzBnNpQIJ/name/fool | jq '.'
  app.put('/api/bundle/:id/name/:name', async (req, res) => {
    console.log('update the bundle name...');

    const bundleUrl = `${url}/${req.params.id}`;

    try {
      const bundle = (await rp({
        url: bundleUrl,
        json: true
      }))._source;

      bundle.name = req.params.name;

      const esResBody = await rp.put({
        url: bundleUrl,
        body: bundle,
        json: true
      });
      res.status(200).json(esResBody);

    } catch (esResErr) {
      res.status(esResErr.statusCode || 502).json(esResErr.error);
    }
  });

  /* add a book into the bundle */
  // we need to find the book first in the book index and get the id.
  app.put('/api/bundle/:id/book/:pgid', async (req, res) => {
    console.log('add a book into bundle.');
    const bundleUrl = `${url}/${req.params.id}`;

    const bookUrl =
        `http://${es.host}:${es.port}` +
        `/${es.books_index}/book/${req.params.pgid}`;

    //console.log(bundleUrl, bookUrl);
    try {
      const [bundleRes, bookRes] = await Promise.all([
        rp({url: bundleUrl, json: true}),
        rp({url: bookUrl, json: true}),
      ]);

      const {_source: bundle, _version: version} = bundleRes;
      const {_source: book} = bookRes;


      const idx = bundle.books.findIndex(book => book.id === req.params.pgid);
      console.log('book id:'+idx);
      if (idx === -1) {
        bundle.books.push({
          id: req.params.pgid,
          title: book.title,
        });
      }

      const esResBody = await rp.put({
        url: bundleUrl,
        qs: { version },
        body: bundle,
        json: true,
      });
      res.status(200).json(esResBody);


    } catch (esResErr) {
      res.status(esResErr.statusCode || 502).json(esResErr.error);
    }
  });

  /* remove a book from a bundle */
  // curl -X DELETE http://<host>:<port>/api/bundle/<id>/book/<pgid>
  // curl -s -X DELETE localhost:60702/api/bundle/MoKG82QB0MYChrajVlKT/book/pg132 | jq '.'
  app.delete('/api/bundle/:id/book/:pgid', async (req, res) => {
    console.log('delete a book from bundle.');
    const bundleUrl = `${url}/${req.params.id}`;

    const bookUrl =
        `http://${es.host}:${es.port}` +
        `/${es.books_index}/book/${req.params.pgid}`;

    //console.log(bundleUrl, bookUrl);
    try {
      const [bundleRes, bookRes] = await Promise.all([
        rp({url: bundleUrl, json: true}),
        rp({url: bookUrl, json: true}),
      ]);

      const {_source: bundle, _version: version} = bundleRes;
      const {_source: book} = bookRes;


      const idx = bundle.books.findIndex(book => book.id === req.params.pgid);
      console.log('book id:'+idx);
      if (idx === -1) {
        throw {
          statusCode: 409,
          error: {
            reason: 'Bundle does not contain that book.',
          }
        };
      }
      bundle.books.splice(idx, 1);

      const esResBody = await rp.put({
        url: bundleUrl,
        qs: { version },
        body: bundle,
        json: true,
      });
      res.status(200).json(esResBody);

    } catch (esResErr) {
      res.status(esResErr.statusCode || 502).json(esResErr.error);
    }
  });

  /* delete a bundle */
  // curl -s -X DELETE localhost:60702/api/bundle/MoKG82QB0MYChrajVlKT | jq '.'
  app.delete('/api/bundle/:id', (req, res) => {
    console.log('delete a bundle..');
    const options = {
      url: `${url}/${req.params.id}`,
      json: true,
    };

    try {
      const esResBody =  rp.delete(options);
      res.status(200).json(esResBody);
    } catch (esResErr) {
      res.status(esRes.Err.statusCode || 502).json(esResErr.error);
    }
  });
};
