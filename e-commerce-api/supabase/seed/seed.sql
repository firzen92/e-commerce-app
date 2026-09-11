-- Seed data ported from the Angular app's mock JSON:
--   e-commerce-app/src/app/data/mock/categories.mock.json
--   e-commerce-app/src/app/data/mock/products.mock.json
-- Safe to re-run: upserts by slug.

insert into categories (slug, name, description, image_url)
values
  ('furniture', 'Furniture', 'Timeless pieces for modern living', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80'),
  ('lighting', 'Lighting', 'Illuminate every space with intention', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'),
  ('decor', 'Decor', 'Small details, big impact', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'),
  ('textiles', 'Textiles', 'Soft finishes for every room', 'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=800&q=80')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url;

insert into products (
  slug, name, description, price_amount, price_currency, compare_at_price_amount,
  category_id, images, rating_average, rating_count, in_stock, quantity,
  tags, is_featured, is_new, created_at
)
values
  (
    'aria-lounge-chair', 'Aria Lounge Chair',
    'A sculptural lounge chair with a solid oak frame and bouclé upholstery, designed for effortless comfort.',
    649, 'USD', 799,
    (select id from categories where slug = 'furniture'),
    '[{"url": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80", "alt": "Aria Lounge Chair in a sunlit living room"}]'::jsonb,
    4.8, 214, true, 18,
    array['bestseller', 'living-room'], true, false, '2025-11-02T00:00:00.000Z'
  ),
  (
    'linden-oak-dining-table', 'Linden Oak Dining Table',
    'Handcrafted from solid white oak, this dining table brings warmth and clean lines to any gathering.',
    1249, 'USD', null,
    (select id from categories where slug = 'furniture'),
    '[{"url": "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80", "alt": "Linden Oak Dining Table set for dinner"}]'::jsonb,
    4.9, 132, true, 6,
    array['dining-room'], true, true, '2026-06-14T00:00:00.000Z'
  ),
  (
    'nova-pendant-light', 'Nova Pendant Light',
    'A hand-blown glass pendant that casts a warm, diffused glow — the centerpiece your kitchen island deserves.',
    289, 'USD', null,
    (select id from categories where slug = 'lighting'),
    '[{"url": "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1200&q=80", "alt": "Nova Pendant Light hanging above a kitchen island"}]'::jsonb,
    4.6, 98, true, 32,
    array['lighting', 'kitchen'], true, false, '2025-09-20T00:00:00.000Z'
  ),
  (
    'haven-sofa', 'Haven 3-Seater Sofa',
    'Deep seating, down-blend cushions, and a family-friendly performance fabric built for everyday life.',
    1899, 'USD', 2199,
    (select id from categories where slug = 'furniture'),
    '[{"url": "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=80", "alt": "Haven 3-Seater Sofa in a bright living room"}]'::jsonb,
    4.7, 356, true, 11,
    array['bestseller', 'living-room'], true, false, '2025-08-05T00:00:00.000Z'
  ),
  (
    'terra-table-lamp', 'Terra Ceramic Table Lamp',
    'A matte stoneware base paired with a linen shade, bringing quiet texture to any side table.',
    129, 'USD', null,
    (select id from categories where slug = 'lighting'),
    '[{"url": "https://images.unsplash.com/photo-1543198126-cae9dee3fa9e?w=1200&q=80", "alt": "Terra Ceramic Table Lamp on a wooden nightstand"}]'::jsonb,
    4.5, 61, true, 45,
    array['bedroom'], false, true, '2026-07-01T00:00:00.000Z'
  ),
  (
    'arc-floor-lamp', 'Arc Floor Lamp',
    'A brushed brass arc lamp that curves gracefully over your favorite reading chair.',
    349, 'USD', null,
    (select id from categories where slug = 'lighting'),
    '[{"url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&q=80", "alt": "Arc Floor Lamp beside a reading chair"}]'::jsonb,
    4.4, 44, false, null,
    array['living-room'], false, false, '2025-05-11T00:00:00.000Z'
  ),
  (
    'moss-ceramic-vase-set', 'Moss Ceramic Vase Set',
    'A trio of hand-thrown vases in varying heights, finished with a soft matte glaze.',
    89, 'USD', null,
    (select id from categories where slug = 'decor'),
    '[{"url": "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1200&q=80", "alt": "Moss Ceramic Vase Set on a console table"}]'::jsonb,
    4.9, 187, true, 60,
    array['bestseller', 'decor'], true, false, '2025-10-18T00:00:00.000Z'
  ),
  (
    'wander-wall-mirror', 'Wander Arched Wall Mirror',
    'An arched silhouette in a slim walnut frame, designed to open up any entryway or bedroom wall.',
    219, 'USD', null,
    (select id from categories where slug = 'decor'),
    '[{"url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80", "alt": "Wander Arched Wall Mirror in an entryway"}]'::jsonb,
    4.7, 73, true, 24,
    array['decor'], false, true, '2026-06-30T00:00:00.000Z'
  ),
  (
    'drift-throw-blanket', 'Drift Chunky Knit Throw',
    'An oversized chunky-knit throw in undyed merino wool — cozy texture for the couch or bed.',
    119, 'USD', null,
    (select id from categories where slug = 'textiles'),
    '[{"url": "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=1200&q=80", "alt": "Drift Chunky Knit Throw folded on a sofa"}]'::jsonb,
    4.6, 152, true, 38,
    array['textiles', 'bestseller'], true, false, '2025-12-09T00:00:00.000Z'
  ),
  (
    'solace-linen-duvet', 'Solace Stonewashed Linen Duvet',
    'Breathable European flax linen, stonewashed for a lived-in softness from the very first night.',
    259, 'USD', null,
    (select id from categories where slug = 'textiles'),
    '[{"url": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80", "alt": "Solace Stonewashed Linen Duvet on a made bed"}]'::jsonb,
    4.8, 96, true, 21,
    array['bedroom'], false, false, '2025-07-22T00:00:00.000Z'
  ),
  (
    'kindle-taper-candle-trio', 'Kindle Taper Candle Trio',
    'Unscented beeswax tapers in three earthy tones, hand-dipped in small batches.',
    42, 'USD', null,
    (select id from categories where slug = 'decor'),
    '[{"url": "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b9?w=1200&q=80", "alt": "Kindle Taper Candle Trio on a dining table"}]'::jsonb,
    4.3, 29, true, 80,
    array['decor'], false, true, '2026-07-15T00:00:00.000Z'
  ),
  (
    'birch-bookshelf', 'Birch Ladder Bookshelf',
    'A leaning ladder bookshelf in solid birch, offering five tiers of display and storage.',
    379, 'USD', null,
    (select id from categories where slug = 'furniture'),
    '[{"url": "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200&q=80", "alt": "Birch Ladder Bookshelf styled with books and plants"}]'::jsonb,
    4.5, 58, true, 14,
    array['living-room'], false, false, '2025-04-03T00:00:00.000Z'
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_amount = excluded.price_amount,
  price_currency = excluded.price_currency,
  compare_at_price_amount = excluded.compare_at_price_amount,
  category_id = excluded.category_id,
  images = excluded.images,
  rating_average = excluded.rating_average,
  rating_count = excluded.rating_count,
  in_stock = excluded.in_stock,
  quantity = excluded.quantity,
  tags = excluded.tags,
  is_featured = excluded.is_featured,
  is_new = excluded.is_new;
