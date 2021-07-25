# EduSoft

**EduSoft Package** can help you get information from [https://edusoftweb.hcmiu.edu.vn](https://edusoftweb.hcmiu.edu.vn/) easily.

## Installation
### NPM
    npm install edusoft
### Yarn
    yarn add edusoft

## Usage
You need to provide credentials before using any feature that requires authentication.
```js
const edu = require("edusoft");

edu.config({
    username: "<Student ID>",
    password: "<Passwod>",
});
```
### News
Crawl all the news from [https://edusoftweb.hcmiu.edu.vn/default.aspx?page=danhsachthongtin&type=0](https://edusoftweb.hcmiu.edu.vn/default.aspx?page=danhsachthongtin&type=0).
```js
const news = await edu.getNews();
```
### Schedule of current week
Not support for specific week yet.
```js
const schedule = await edu.getSchedule();
```
### Midterm schedule
```js
const midtermSchedule = await edu.getMidtermSchedule();
```
### Final schedule
```js
const finalSchedule = await edu.getFinalSchedule();
```
### Tuition
Information about your tuition.
```js
const tuition = await edu.getTution();
```
### Transcript
Get transcript base on year and semester.
Parameters:
- Year: required
- Semester:  default: `1`
```js
const transcript = await edu.getTranscript(<Year>, <Semester>);
```
### Register subjects
Register subjects base on a list of subject IDs ([How to get ID](https://youtu.be/nPnCHI7AVZg)).  
ID of a subject looks like this: `PT002IU01    |PT002IU|Physical Training 2|01|3|3|01/01/0001|0|0|0| |0|ITIT19CS31`.
```js
await edu.register([<Subject_ID_1>, <Subject_ID_2>], true);
```
