import { module, test } from 'qunit';
import { visit, click, triggerKeyEvent, typeIn, currentURL, waitUntil, find } from '@ember/test-helpers';

import fireBaseFixture from 'juice-core/tests/fixtures/firebase-default';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import {
  initAcceptanceTest
} from 'juice-core/tests/helpers/acceptance-helpers';

module('Acceptance | Productions | Show', function(hooks) {
  initAcceptanceTest(hooks, fireBaseFixture);
  setupMirage(hooks);

  hooks.beforeEach(async () => {
    await visit('/a/productions/production-id');
  });

  test('shows production information correctly', async function (assert) {
    assert.dom('[data-test-line-item-row] [data-test-label]').includesText('Tasty Salad');
    assert.dom('[data-test-edge-quantity] input').hasValue('10');
  });

  test('be able to view a product in details', async function (assert) {
    await click('[data-test-make-tab] [data-test-label]');

    assert.equal(currentURL(), '/a/products/product-id1');
  });

  test('be able to add item for adjusting', async function (assert) {
    // Open Adjusting tab
    await click('[data-test-tab-title="1"]');

    assert.dom('[data-test-node-children] [data-test-line-item-row]').exists({count: 1});

    await typeIn('[data-test-search-input]', 'Sa');
    await triggerKeyEvent('[data-test-search-input]', 'keydown', 13) // enter

    assert.dom('[data-test-node-children] [data-test-line-item-row]').exists({count: 2});
  });

  test('be able to view an ingredient or a recipe in details', async function (assert) {
    // Open Adjusting tab
    await click('[data-test-tab-title="1"]');
    await click('[data-test-node-children] [data-test-label]')

    assert.equal(currentURL(), '/a/recipes/recipe-id1');
  });

  test('be able to delete an adjusting', async function (assert) {
    // Open Adjusting tab
    await click('[data-test-tab-title="1"]');

    assert.dom('[data-test-node-children] [data-test-line-item-row]').exists({count: 1});

    await click('[data-test-node-children] [data-test-select]');
    await click('[data-test-node-children] [data-test-delete-button]');

    await waitUntil(() => !find('[data-test-node-children] [data-test-line-item-row]'));

    assert.dom('[data-test-node-children] [data-test-line-item-row]').exists({count: 0});
  });

  test('be able to print', async function (assert) {
    assert.expect(1);

    this.server.post('https://allDocsEndpoint.com/generate-all', function(schema)  {
      let body = JSON.parse(this.request.requestBody);
      // const attributes = this.normalizedRequestAttrs();
      // const expectedAttributes = {
      //   email: 'example@email.com',
      //   password: 'secretpassword'
      // };

      // assert.deepEqual(attributes, expectedAttributes);

      console.log(body);
      // debugger;
      // return schema.users.create(attributes);
    });

    await click('[data-test-print-button]');
  });
});
