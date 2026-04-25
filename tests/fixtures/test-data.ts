export const PRODUCT = {
  slug: 'cashmere-cardigan',
  name: 'Cashmere Cardigan',
  size: 'M',
  sizes: ['XS', 'S', 'M', 'L'],
};

export const WHITE_TEE = {
  slug: 'classic-white-tee-mens',
  size: 'M',
};

export const OUT_OF_STOCK = {
  slug: 'selvedge-denim-jeans',
};

export const SHIPPING = {
  name: 'Jane Doe',
  address: '1 Test Street',
  city: 'London',
  zip: 'EC1A 1BB',
  country: 'United Kingdom',
};

export const PAYMENT = {
  name: 'Jane Doe',
  number: '4242 4242 4242 4242',
  expiry: '12/30',
  cvc: '123',
};

export const TEST_USER = {
  name: 'Jane Tester',
  password: 'SecurePass99!',
};

export const uniqueEmail = () => `user_${Date.now()}@test.example`;
