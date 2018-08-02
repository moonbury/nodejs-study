'use strict';

const request = require('request');
const rp = require('request-promise');

module.exports = (app, es) => {
  const url = `http://${es.host}:${es.port}/${es.books_index}/book/_search`;
  //console.log(url);

  /* search for books matching a particular field */
  /* ie. curl -s localhost:60702/api/search/books/authors/Twain | jq '.' */
  /* id, title, authors, subjects are valid fields */

  app.get('/api/search/books/:field/:query', (req, res) => {
    console.log('handle request for books search...');

    const esReqBody = {
      size: 10,
      query: {
        match: {
          [req.params.field]: req.params.query
        }
      },
    };
    console.log(req.params);
    const options = {
      url,
      json: true,
      body: esReqBody
    };

    request.get(options, (err, esRes, esResBody) => {
      if (err) {
        res.status(502).json({
          error: 'bad_gateway',
          reason: err.code,
        });
      }

      if (esRes.statusCode !== 200) {
        res.status(esREs.statusCode).json(esResBody);
        return;
      }

      res.status(200).json(esResBody.hits.hits.map(({
        _source
      }) => _source));
    });
  });

  /**
  Collect suggested terms for a given field based on a given query.
  example: /api/suggest/authors/lipman
  ie. curl -s localhost:60702/api/suggest/subjects/Europe | jq '.'
  **/
  app.get('/api/suggest/:field/:query', (req, res) => {
    console.log('handle request for books suggestion...');
    const esReqBody = {
      size: 0,
      suggest: {
        suggestions: {
          text: req.params.query,
          term: {
            field: req.params.field,
            suggest_mode: 'always',
          },
        }
      }
    };
    const options = {
      url,
      json: true,
      body: esReqBody
    };


    const promise = new Promise((resolve, reject) => {

      request.get(options, (err, esRes, esResBody) => {
        if (err) {
          reject({
            error: err
          });
          return;
        }

        if (esRes.statusCode != 200) {
          reject({
            error: esResBody
          });
          return;
        }

        resolve(esResBody);
      })
    });

    /* use the request-promise to replace the original promise
    promise
      .then(esResBody =>
        res.status(200).json(esResBody.suggest.suggestions))
      .catch(({
        error
      }) => res.status(error.status || 502).json(error));
    */
    rp({
        url,
        json: true,
        body: esReqBody
      })
      .then(esResBody =>
        res.status(200).json(esResBody.suggest.suggestions))
      .catch(({
        error
      }) => res.status(error.status || 502).json(error));

  });

};
