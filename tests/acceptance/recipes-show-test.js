import { module, test } from 'qunit';
import { visit, click, triggerKeyEvent, typeIn, currentURL, waitFor } from '@ember/test-helpers';

import fireBaseFixture from 'juice-core/tests/fixtures/firebase-default';

import {
  initAcceptanceTest
} from 'juice-core/tests/helpers/acceptance-helpers';

module('Acceptance | Recipes | Show', function(hooks) {
  initAcceptanceTest(hooks, fireBaseFixture);

  hooks.beforeEach(async () => {
    await visit('/a/recipes/recipe-id1');
  });

  test('displays recipe information correctly', async function(assert) {
    assert.dom('[data-test-node-name]').hasValue('Salty Sauce');
    assert.dom('[data-test-line-item-row] [data-test-label]').hasText('Salt');
    assert.dom('[data-test-edge-quantity] input').hasValue('12');
  });

  test('be able to add recipes or ingredients', async function (assert) {
    assert.dom('[data-test-node-children] [data-test-line-item-row]').exists({count: 1});

    await typeIn('[data-test-search-input]', 'Sa');
    await triggerKeyEvent('[data-test-search-input]', 'keydown', 13) // enter

    assert.dom('[data-test-node-children] [data-test-line-item-row]').exists({count: 2});
  });

  test('be able to delete recipes or ingredients', async function (assert) {
    assert.dom('[data-test-node-children] [data-test-line-item-row]').exists({count: 1});

    await click('[data-test-select]');
    await click('[data-test-delete-button]');

    assert.dom('[data-test-node-children] [data-test-line-item-row]').exists({count: 0});
  });

  test('be able to delete the current recipe', async function (assert) {
    await click('[data-test-delete-node-button]');
    await click('[data-test-dialog-button]');

    assert.equal(currentURL(), '/a/recipes');
  });

  test('be able to view an ingredient or a recipe in details', async function (assert) {
    await click('[data-test-node-children] [data-test-label]')

    assert.equal(currentURL(), '/a/ingredients/ingredient-id1');
  });

  test('be able to create an ingredient or a recipe when searching if not exist', async function (assert) {
    assert.dom('[data-test-node-children] [data-test-line-item-row]').exists({count: 1});

    await typeIn('[data-test-search-input]', 'Not existing');

    await waitFor('[data-test-search-create]');
    await triggerKeyEvent('[data-test-search-input]', 'keydown', 13) // enter

    await click('[data-test-dialog-button]');

    assert.dom('[data-test-node-children] [data-test-line-item-row]').exists({count: 2});
  });
});
