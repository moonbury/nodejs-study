import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import * as templates from './templates.ts';

// Page Setup
document.body.innerHTML = templates.main();

const mainElement = document.body.querySelector('.b4-main');
const alertsElement = document.body.querySelector('.b4-alerts');

const showAlert = (message, type = 'danger') => {
  const html = templates.alert({ type, message });
  alertsElement.insertAdjacentHTML('beforeend', html);
};

/*
mainElement.innerHTML = templates.welcome();
alertsElement.innerHTML = templates.alert({
  type: 'info',
  message: 'Handlebars is working!',
});
*/

  /* delete a bundle */
  const deleteBundle = async (bundleId) => {
    try {
      //delete bundles

      const bundles = await getBundles();

      const url = `/api/bundle/${encodeURIComponent(bundleId)}`;
      console.log(url);
      const res = await fetch(url, { method: 'DELETE' });
      const resBody = await res.json();

      bundles.splice(bundleId, 1);
      listBundles(bundles);
      showAlert('Bundle deleted','success');

    } catch(err) {
      showAlert(err);
    }
  };

/* add a bundle */
const addBundle = async (name) => {
  try {
    const bundles = await getBundles();

    const url = `/api/bundle?name=${encodeURIComponent(name)}`;
    const res = await fetch(url, { method: 'POST' });
    const resBody = await res.json();

    bundles.push({ id: resBody._id, name });
    listBundles(bundles);

    showAlert(`Bundle ${name} created!`, 'success');

  } catch (err) {
    showAlert(err);
  }
}

/* get all the bundles */
const getBundles = async () => {
  console.log("in getBundles");

  const esRes = await fetch('/es/b4/bundle/_search?size=1000');
  const esResBody = await esRes.json();
  console.log(esResBody);
  return esResBody.hits.hits.map(hit => ({
    id: hit._id,
    name: hit._source.name,
  }));
};

const listBundles = bundles => {

  mainElement.innerHTML = templates.addBundleForm() + templates.listBundles({ bundles });

  const form = mainElement.querySelector('form');
  form.addEventListener('submit', event => {
    event.preventDefault();

    const name = form.querySelector('input').value;
    addBundle(name);
  });


  const deleteButtons = mainElement.querySelectorAll('button.delete');
  for (let i = 0; i < deleteButtons.length; i++) {
    const deleteButton = deleteButtons[i];
    deleteButton.addEventListener('click', event => {
      deleteBundle(deleteButton.getAttribute('data-bundle-id'));
    });
  }
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
      console.log("bundle:", bundles);
      listBundles(bundles);
      break;
    default:
      throw Error(`Unrecognized view: ${view}`);
  }
};

window.addEventListener('hashchange', showView);
showView().catch(err => window.location.hash = '#welcome');
