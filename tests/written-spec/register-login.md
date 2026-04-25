Test Name: Register and login

Test Purpose: This test ensures user can register and login to the application.

Steps:
1. visit /register
2. Create an account with fullname (data-testid=register-name), email (data-testid=register-email) and password (data-testid=register-passwo    rd), password confirmation (data-testid=register-confirm)
3. Click on the register button (data-testid=register-submit)
4. The username and password are saved in local storage of browser.
5. visit / and click on account menu (data-testid=account-menu) and click on data-testid="account-menu-logout"
6. Click again on the Account menu, and click on data-testid="account-menu-login" , use the username and password saved in local storage to login


Other conditions:
- write test for negative cases as well (invalid login and password)