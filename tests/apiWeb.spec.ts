import { test, expect,request} from '@playwright/test';
import { APIUtils } from './utils/APIUtils';

const loginPayload = {userEmail: "anshika@gmail.com", userPassword: "Iamking@000"}
let token;
let orderIdJson;
let response;
const orderPayload={orders:[{country:"India",productOrderedId: "6581ca399fd99c85e8ee7f45"}]}

test.beforeAll(async () => {
const apiContexte = await request.newContext()
const apiUtil = new APIUtils(apiContexte, loginPayload)
response = await apiUtil.createOrder(orderPayload)
// login API
const responseLogin = await apiContexte.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
  data: loginPayload
})
expect(responseLogin.ok()).toBeTruthy();
const loginResponseJson= await responseLogin.json();
const token = await loginResponseJson.token
console.log(token)
const orderResponse = await apiContexte.post('https://rahulshettyacademy.com/api/order/create-order',
{
    data: orderPayload, 
    headers:{
        'Autorization': token,
        'Content-Type': 'application/json'
    },
} )
const orderResponseJson = await orderResponse.json();
console.log(orderResponseJson)
orderIdJson = orderResponseJson.orders[0]

})


// create order
test('Case Create Order', async({page})=>{
    await page.addInitScript(value =>{
        window.localStorage.setItem('token', value)
    }, response.token);
    
    const products = page.locator(".card-body")
      const producName='ZARA COAT 3';
      const email="anshika@gmail.com"
      await page.locator("#userEmail").fill("anshika@gmail.com")
      await page.locator("#userPassword").type("Iamking@000")
      await page.locator("[value='Login']").click()
      await page.waitForLoadState('networkidle')
    //   const title = await page.locator(".card-body b").allTextContents()
    //   console.log(title)
      const count = await products.count()
      for (let i=0; i<count; ++i ){
         if (await products.nth(i).locator("b").textContent()===producName){
              //add Cart
              console.log(producName)
              await products.nth(i).locator("text = Add To Cart").click();
              break;
         }
      }
      await page.locator("[routerlink*='cart']").click();
      await page.locator("div li").first().waitFor();
      const bool = page.locator("h3:has-text('ZARA COAT 3')").isVisible();
      expect(bool).toBeTruthy();
      await page.locator("text= Checkout").click();
      await page.locator("[placeholder*='Country']").pressSequentially("Tun")
      const dropdown = await page.locator(".ta-results")
      await dropdown.waitFor();
      const optionCount= await dropdown.locator("button").count();
      for(let i=0; i<optionCount; ++i )
      {
        const text= await dropdown.locator("button").nth(i).textContent();
        if (text ===" Tunisia"){
            await dropdown.locator("button").nth(i).click();
            break;
        }
      }
      await expect (page.locator(".user__name [type='text']").first()).toHaveText(email);
      await page.locator(".action__submit").click();
      await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order.")

    })
    // place the order
    test('Place the order', async({page})=>{
    await page.addInitScript(value =>{
            window.localStorage.setItem('token', value)
        }, response.token);
      const orderId= page.locator(".em-spacer-1 .ng-star-inserted").textContent();
      console.log(orderId)
      await page.goto("https://rahulshettyacademy.com/client");
      await page.locator("button[routerlink*='myorders']").click();
      await page.locator("tbody").waitFor();
      const row = await page.locator("tbody tr")
      for(let i = 0 ; i<await row.count(); ++i){
            const rowOrderID= await row.nth(i).locator("th").textContent()
            if (response.orderId.includes(rowOrderID)){
                  await row.nth(i).locator(".btn btn-primary").first().click();
                  break;
            }
      }
      const orderIdDetails = await page.locator(".col-text").textContent();
      console.log(orderIdDetails)
      await page.pause()
    //   expect(orderId.includes(orderIdDetails)).toBeTruthy()
      })