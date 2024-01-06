import { expect, type Locator, type Page } from '@playwright/test';

export class APIUtils{
    readonly apiContexte
    readonly loginPayload

    // constructor 
    constructor(apiContexte, loginPayload ){
        this.apiContexte=apiContexte;
        this.loginPayload=loginPayload;
    }

    // getToken methode
    async getToken(apiContexte, loginPayload){     
    const responseLogin = await apiContexte.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
    data: loginPayload
     })
     expect(responseLogin.ok()).toBeTruthy();
    const loginResponseJson= await responseLogin.json();
    const token = await loginResponseJson.token
    console.log(token)
    return(token)
    }
    // create order
    async createOrder(orderPayload){
        let response = {};
        // response.token = await this.getToken()
        const orderResponse = await this.apiContexte.post('https://rahulshettyacademy.com/api/order/create-order',
      {
       data: orderPayload, 
       headers:{
        'Autorization': this.getToken,
        'Content-Type': 'application/json'
      },
     } )
const orderResponseJson = await orderResponse.json();
console.log(orderResponseJson)
const orderIdJson = await orderResponseJson.orders[0]
// response.orderIdJson=orderIdJson;
// return response

    }

}