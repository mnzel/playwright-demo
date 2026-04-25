import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';

export class ProductListPage extends BasePage {
  readonly searchInput: Locator;
  readonly sortSelect: Locator;
  readonly resultCount: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId('search-input');
    this.sortSelect = page.getByTestId('sort-select');
    this.resultCount = page.getByTestId('result-count');
  }

  async search(text: string) {
    const initialText = await this.resultCount.innerText();
    await this.searchInput.fill(text);
    // The search is debounced by 400ms, so we wait for the text to change or a timeout
    try {
      await this.page.waitForFunction(
        (initial) => {
          const el = document.querySelector('[data-testid="result-count"]');
          return el && el.textContent !== initial;
        },
        initialText,
        { timeout: 2000 }
      );
    } catch (e) {
      // If it doesn't change, maybe the result count is the same, which is fine for short tests
    }
  }

  async sortBy(value: 'featured' | 'price-asc' | 'price-desc' | 'name-asc') {
    await this.sortSelect.selectOption(value);
  }

  async filterByCategory(categorySlug: string) {
    await this.page.getByTestId(`category-chip-${categorySlug}`).click();
  }

  async getProductCard(slug: string) {
    return this.page.getByTestId(`product-card-${slug}`);
  }

  async goToProductDetail(slug: string) {
    const card = await this.getProductCard(slug);
    // Click the name link specifically (second link in the card)
    await card.locator('a').nth(1).click();
  }

  async addProductToCart(slug: string) {
    const card = await this.getProductCard(slug);
    // Use click() on the Add to cart button within the card
    await card.getByTestId('add-btn').click();
  }
}
