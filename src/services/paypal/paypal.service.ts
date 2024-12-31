import { Injectable } from '@angular/core';
declare var paypal: any;
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  constructor(private http: HttpClient) { }

  loadPayPalScript(): Promise<any> {
    return new Promise((resolve) => {
      if (document.getElementById('paypal-sdk')) {
        resolve(true);
      } else {
        const script = document.createElement('script');
        script.id = 'paypal-sdk';
        script.src = 'https://www.paypal.com/sdk/js?client-id=AaWMEpguUh31bqNO3CEGSY2UqDtzqfGwb_plBBdOOrKGcItqrCazXM50_PZj9INd86dvMMbogU1WqZh6';
        script.async = true;
        script.onload = () => resolve(true);
        document.body.appendChild(script);
      }
    });
  }
  private PAYPAL_API_URL = 'https://api.paypal.com/v2/checkout/orders/';
  private accessToken = 'YOUR_ACCESS_TOKEN';
  checkTransactionStatus(referenceId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken}`,
    });

    return this.http.get(`${this.PAYPAL_API_URL}${referenceId}`, { headers });
  }
  renderPayPalButton(containerId: string, amount: number, onSuccess: Function) {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({          
          purchase_units: [{
            reference_id: "custom_order_12345",
            amount: {
              currency_code: 'USD',
              value: amount.toString()
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          console.log('Transaction completed by ' + details.payer.name.given_name);
          onSuccess(details);
        });
      },
      onError: (err: any) => {
        console.error('PayPal transaction error', err);
      }
    }).render(`#${containerId}`);
  }
  private apiUrl = 'https://v6.exchangerate-api.com/v6/';
  private accessKey = 'c02d93f4adca838e9ee6a5b8';
  getExchangeRate(): Observable<any> {
    const url = `${this.apiUrl}${this.accessKey}/latest/USD`;
    return this.http.get(url);
  }
}
