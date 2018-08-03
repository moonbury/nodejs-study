import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import * as templates from './templates.ts';

// Page Setup
document.body.innerHTML = templates.main();

const mainElement = document.body.querySelector('.b4-main');
const alertsElement = document.body.querySelector('.b4-alerts');

/*
mainElement.innerHTML = templates.welcome();
alertsElement.innerHTML = templates.alert({
  type: 'info',
  message: 'Handlebars is working!',
});
*/
/* get all the bundles */
const getBundles = async() => {
  console.log("in getBundles");

  const esRes = await fetch('/es/b4/bundle/_search?size=1000');
  const esResBody = await esRes.json();
  console.log(esResBody);
  return esResBody.hits.hits.map(hit=> ({
    id: hit._id,
    name: hit._source.name,
  }));
};

const listBundles = bundles => {
  mainElement.innerHTML = templates.listBundles({bundles});
};


const showView = async () => {
  console.log('in showview. hash:', window.location.hash);
  const [view, ...params] = window.location.hash.split('/');

  switch (view) {
    case '#welcome':
      mainElement.innerHTML = templates.welcome();
      break;
    case '#list-bundles':
      const bundles = await getBundles();
      console.log("bundle:",bundles);
      listBundles(bundles);
      break;
    default:
      throw Error(`Unrecognized view: ${view}`);
  }
};

window.addEventListener('hashchange', showView);
showView().catch(err => window.location.hash = '#welcome');
