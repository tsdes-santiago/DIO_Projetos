CREATE TABLE IF NOT EXISTS purchases (
  id            BIGSERIAL PRIMARY KEY NOT NULL,
  asset_id      BIGINT NOT NULL REFERENCES assets(id),
  quantity      DOUBLE PRECISION NOT NULL,
  buy_price     DOUBLE PRECISION NOT NULL,
  bought_at     TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_purchases_asset_id ON purchases(asset_id);
CREATE INDEX IF NOT EXISTS idx_purchases_bought_at ON purchases(bought_at);
