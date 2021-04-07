
const paraId = document.querySelector('#getId').innerText.trim();
const buttonSend = document.querySelector('#btn-send');
const verified = document.querySelector('#verified');
const notVerified = document.querySelector('#notVerified');

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"_id": paraId});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

console.log(paraId);

buttonSend.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.setAttribute('disabled','disabled');
    getParams(`/users/verification`, requestOptions)
        .then((data) => {
            e.target.removeAttribute('disabled');
            verified.removeAttribute('style','display: none');
            notVerified.setAttribute('style','display: none');
        })
        .catch((err) => {
            e.target.removeAttribute('disabled');
            console.log(err);
            notVerified.removeAttribute('style','display: none');
            verified.setAttribute('style','display: none');
        })
})

const getParams = async(resource,head) => {
    const response = await fetch(resource,head);
    if(response.status !== 200){
        throw new Error("Not a right value");
    }
    const data = await response.json();
    return data;
}