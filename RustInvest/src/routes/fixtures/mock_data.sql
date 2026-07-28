TRUNCATE purchases, assets RESTART IDENTITY CASCADE;

INSERT INTO assets (name, unit_value, quantity)
VALUES
  ('Bitcoin', 250000.00, 2.5),
  ('Ethereum', 18000.00, 15.0),
  ('Solana', 450.00, 100.0),
  ('Cardano', 3.20, 5000.0);

INSERT INTO purchases (asset_id, quantity, buy_price, bought_at)
VALUES
  (1, 1.0, 200000.00, '2024-01-15 10:00:00+00'),
  (1, 0.5, 220000.00, '2024-03-20 14:30:00+00'),
  (2, 10.0, 15000.00, '2024-02-10 09:15:00+00'),
  (3, 50.0, 400.00, '2024-04-05 16:45:00+00'),
  (4, 2000.0, 2.80, '2024-05-01 11:00:00+00');
