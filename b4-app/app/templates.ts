
import * as Handlebars from '../node_modules/handlebars/dist/handlebars.js';

export const main = Handlebars.compile(`
<div class ="container">
  <h1>B4 - Book Bundler</h1>
  <div class="b4-alerts"></div>
  <div class="b4-main"></div>
  </div>
`);

export const welcome = Handlebars.compile(`<div class="jumbotron">
<h1>Welcome</h1>
<p>B4 is an application for books</p>
</div>
`);

export const alert = Handlebars.compile(`
<div class="alert alert-{{type}} alert-dismissible" role="alert">
  <button class="close" data-dismiss="alert" aria-label="Close">
  <span aria-hidden="true">&times;</span>
  </button>
  <stong>Success!</strong> {{message}}
</div>
`);

export const listBundles = Handlebars.compile(`
<div class="panel panel-default">
<div class="panel-heading">Your Bundles</div>
{{#if bundles.length}}
<table class="table">
  <tr>
    <th>Bundles Name</th>
    <th>Actions</th>
  </tr>
  {{#each bundles}}
  <tr>
    <td>
      <a href="#view-hundle/{{id}}">{{name}}</a>
    </td>
    <td>
      <button class="btn delete" data-bundle-id="{{id}}">Delete</button>
    </td>
  </tr>
  {{/each}}
  </table>
  {{else}}
    <div class="panel-body">
    <p>None yet!</p>
    </div>
    {{/if}}
    </div>
`);
