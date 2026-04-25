Test Name: Cart and Checkout    

Test Purpose: This test ensures user can add items to the cart and checkout.

Steps:
1. login to the application using the steps in the register-login.md file
2. Ensure / page loads upon login
3. Visit /products and search for Cashmere Cardigan, ensure it displays the result
4. Click on it and ensure it reaches /products/cashmere-cardigan
5. User is able to see different sizes available for that product and click on it
6. Ensure user is able to add multiple items by clicking on the + and click on Add to Cart  button (data-testid="add-to-cart"). 
7. User is able to see a mini at the top and data-testid="cart-badge" shows count of 1 or as expected
8. After the count badge increases, visit /cart and ensure the items are visible in cart
9. User should be able to see the price and total amount updated
10. User is able to click data-testid="cart-checkout"
11. It reaches the /checkout page and fill in the forms with data.
12. After filling in the data, click on data-testid="place-order"

Other conditions:
