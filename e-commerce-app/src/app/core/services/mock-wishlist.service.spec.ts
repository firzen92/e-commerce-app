import { MockWishlistService } from './mock-wishlist.service';

describe('MockWishlistService', () => {
  let service: MockWishlistService;

  beforeEach(() => {
    service = new MockWishlistService();
  });

  it('starts empty', () => {
    expect(service.items()).toEqual([]);
  });

  it('adds a known product to the wishlist', async () => {
    await new Promise((resolve) => service.add('prod-1').subscribe(resolve));

    const items = service.items();
    expect(items?.map((item) => item.product.id)).toEqual(['prod-1']);
  });

  it('does not add the same product twice', async () => {
    await new Promise((resolve) => service.add('prod-1').subscribe(resolve));
    await new Promise((resolve) => service.add('prod-1').subscribe(resolve));

    expect(service.items()?.length).toBe(1);
  });

  it('ignores an unknown product id', async () => {
    await new Promise((resolve) => service.add('does-not-exist').subscribe(resolve));

    expect(service.items()).toEqual([]);
  });

  it('removes a product from the wishlist', async () => {
    await new Promise((resolve) => service.add('prod-1').subscribe(resolve));
    await new Promise((resolve) => service.remove('prod-1').subscribe(resolve));

    expect(service.items()).toEqual([]);
  });
});
