import {request} from 'https'
import { IncomingMessage } from 'http';

export class HttpService{
    constructor(){

    }
    private getBase64Encoded(val:string){
        return btoa(val);
    }
    getTwitterBearerToken(apiKey:string, apiKeySecret:string):Promise<any>{
        return new Promise((resolve,reject)=>{
            // form data
            var postData = JSON.stringify({
                grant_type: "client_credentials"
            });
            // var postData = "grant_type=client_credentials";
            var bearerTokencredentials=this.getBase64Encoded(apiKey+":"+apiKeySecret);
            var options:any = {
                host:'api.twitter.com',
                path:'/oauth2/token',
                port: 443,
                method: 'POST',
                headers: {
                    'Authorization': 'Basic '+bearerTokencredentials,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Content-Length': 29,
                    'Accept-Encoding': 'gzip',
                }
            }; 
            const req = request(options, function (response) {
                if (response.statusCode == 200) {
                    let data = '';
                    response.on('data', chunk => {
                        data += chunk
                    })
                    response.on('end', () => {
                        try {
                            let dataObj= JSON.parse(data);                        
                            resolve(dataObj);
                        }
                        catch (err) {
                            resolve(data);
                        }
                    })
                }
                else {
                    reject(response.statusCode)
                }
            }).on('error', (e:any) => {
                reject(e);
            });
    
            req.write(postData);
            req.end();
        });
    }
    get(url:string, bearerToken?:string):Promise<any>{
        return new Promise((resolve, reject)=>{
            var options:any = {           
                method: 'GET'
            };
            if(bearerToken){
                options["headers"] = {
                    'Authorization': 'Bearer '+bearerToken
                }
            }           
            const req = request(url,options, (response:IncomingMessage) => {
                if (response.statusCode == 200) {
                    let data = '';
                    response.on('data', chunk => {
                        data += chunk
                    })
                    response.on('end', () => {
                        try {
                            resolve(JSON.parse(data));
                        }
                        catch (err) {
                            resolve(data);
                        }
                    })
                }
                else {
                    reject(response.statusCode)
                }
            }).on('error', (e) => {
                reject(e)
            });
            req.end();
        });        
    }
    post(url:string, requestData:any, bearerToken?:string){
        return new Promise((resolve,reject)=>{
            var postData = JSON.stringify(requestData);
            var options:any = {
                port: 443,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': postData.length
                }
            };
            if(bearerToken){
                options["headers"] = {
                    'Authorization': 'Bearer '+bearerToken
                }
            } 
            const req = request(url, options, function (response) {
                if (response.statusCode == 200) {
                    let data = '';
                    response.on('data', chunk => {
                        data += chunk
                    })
                    response.on('end', () => {
                        try {
                            let dataObj= JSON.parse(data);                        
                            resolve(dataObj);
                        }
                        catch (err) {
                            resolve(data);
                        }
                    })
                }
                else {
                    reject(response.statusCode)
                }
            }).on('error', (e:any) => {
                reject(e);
            });
    
            req.write(postData);
            req.end();
        })
    }
}