/**
 * Shiny JavaScript SDK
 * 
 * @author: Eridanus Sora <sora@sound.moe>
 */
let crypto = require('crypto');
let request = require('request');

class Shiny{
    /**
     * @param API_KEY
     * @param API_SECRET_KEY
     * @param API_HOST
     */
    constructor(API_KEY, API_SECRET_KEY, API_HOST = 'https://shiny.kotori.moe'){
        this.API_KEY = API_KEY;
        this.API_SECRET_KEY = API_SECRET_KEY;
        this.API_HOST = API_HOST;
    }

    static sha1(text){
        let sha1 = crypto.createHash('sha1');
        sha1.update(text);
        return sha1.digest('hex');
    }

    /**
     * 添加项目
     * @param spiderName
     * @param level
     * @param data
     * @param hash
     * @returns {Promise}
     */
    add(spiderName, level , data, hash = undefined){
        let event_string = JSON.stringify(data);
        let event = {
            "spiderName": spiderName,
            "level": parseInt(level),
            "data": event_string
        };
        if (hash){
            event.hash = hash.toString();
        }
        else{
            let md5 = crypto.createHash('md5');
            md5.update(this.API_KEY + this.API_SECRET_KEY + event_string);
            event.hash = md5.digest('hex');
        }

        // 开始签名
        let payload = {
            "api_key": this.API_KEY,
            "sign": Shiny.sha1(this.API_KEY + this.API_SECRET_KEY + JSON.stringify(event)),
            "event": JSON.stringify(event)
        };

        return new Promise((resolve, reject) => {
            request.post({
                url: this.API_HOST + '/Data/add',
                form: payload
            }, (error, httpResponse, body)=>{
                if (error || httpResponse.statusCode !== 200){
                    reject(httpResponse.statusCode);
                }
                else{
                    resolve(body);
                }
            })
        })
    }

    /**
     * 获取最新项目
     * @returns {Promise}
     */
    recent(){
        return new Promise((resolve, reject)=>{
            request(this.API_HOST + '/Data/recent', (error, response, body)=>{
                if (response.statusCode === 200){
                    var list = JSON.parse(body).data;
                    resolve(list);
                }
                else{
                    reject(response);
                }
            })
        })
    }
    
    /**
     * 获得爬虫任务
     */
    getJobs(){
        return new Promise((resolve, reject) => {
            request(`${this.API_HOST}/Spider/jobs?api_key=${this.API_KEY}&sign=${Shiny.sha1(this.API_KEY + this.API_SECRET_KEY)}`, (err, response, body) => {
                if (response.statusCode === 200){
                    var list = JSON.parse(body).data;
                    resolve(list);
                }
                else{
                    reject(response);
                }
            })
        })
    }
}

module.exports = Shiny;