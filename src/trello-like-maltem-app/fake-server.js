/**
 * @file: fake server
 * @author: lmartini
 * @date: 07/07/18
 */

const /** string */ mainUrl = 'http://localhost:3000/';
const /** string */ columnUrl = `${mainUrl}columns`;
const /** string */ cardUrl = `${mainUrl}cards`;

const request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(obj.body);
    });
};

export { columnUrl, cardUrl, request}