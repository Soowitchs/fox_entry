import { PriceHistory } from './price-history.entity';
import { Product } from './product.entity';

describe('PriceHistory Entity', () => {
  it('should create an instance with all properties', () => {
    const product = new Product();
    product.id = 1;
    product.name = 'Test Product';
    product.price = 100;
    product.stock = 10;

    const priceHistory = new PriceHistory();
    priceHistory.id = 1;
    priceHistory.product = product;
    priceHistory.oldPrice = 90;
    priceHistory.newPrice = 100;
    priceHistory.changedAt = new Date('2024-01-01T00:00:00Z');

    expect(priceHistory.id).toBe(1);
    expect(priceHistory.product).toBe(product);
    expect(priceHistory.oldPrice).toBe(90);
    expect(priceHistory.newPrice).toBe(100);
    expect(priceHistory.changedAt).toEqual(new Date('2024-01-01T00:00:00Z'));
  });
});
