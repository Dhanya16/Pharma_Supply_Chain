const one = document.querySelector(".one");
const two = document.querySelector(".two");
const three = document.querySelector(".three");
const four = document.querySelector(".four");
const five = document.querySelector(".five");
const six = document.querySelector(".six");
const seven = document.querySelector(".seven");
const eight = document.querySelector(".eight");
one.classList.add("active");
one.onclick = function() {
    one.classList.add("active");
    two.classList.remove("active");
    three.classList.remove("active");
    four.classList.remove("active");
    five.classList.remove("active");
    six.classList.remove("active");
    seven.classList.remove("active");
    eight.classList.remove("active");
}

two.onclick = function() {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.remove("active");
    four.classList.remove("active");
    five.classList.remove("active");
    six.classList.remove("active");
    seven.classList.remove("active");
    eight.classList.remove("active");

}
three.onclick = function() {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.remove("active");
    five.classList.remove("active");
    six.classList.remove("active");
    seven.classList.remove("active");
    eight.classList.remove("active");
}
four.onclick = function() {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
    five.classList.remove("active");
    six.classList.remove("active");
    seven.classList.remove("active");
    eight.classList.remove("active");
}
five.onclick = function() {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
    five.classList.add("active");
    six.classList.remove("active");
    seven.classList.remove("active");
    eight.classList.remove("active");
    nine.classList.remove("active");
    ten.classList.remove("active");
}
six.onclick= function(){
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
    five.classList.add("active");
    six.classList.add("active");
    seven.classList.remove("active");
    eight.classList.remove("active");
}
seven.onclick= function(){
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
    five.classList.add("active");
    six.classList.add("active");
    seven.classList.add("active");
    eight.classList.remove("active");
}
eight.onclick= function(){
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
    five.classList.add("active");
    six.classList.add("active");
    seven.classList.add("active");
    eight.classList.add("active");
}

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const queryParams = {};
    for (const [key, value] of params.entries()) {
        queryParams[key] = value;
    }
    return queryParams;
}

function populateDrugDetails(drugDetails) {
    document.querySelector('#card .card_details span').innerText = drugDetails.batchNumber || 'N/A';
    document.querySelector('#card .card_details p:nth-child(2) span').innerText = drugDetails.name || 'N/A';
    document.querySelector('#card .card_details p:nth-child(3) span').innerText = drugDetails.category || 'N/A';
    document.querySelector('#card .card_details p:nth-child(4) span').innerText = drugDetails.manufacturer || 'N/A';
    document.querySelector('#card .card_details p:nth-child(5) span').innerText = drugDetails.manufacturingDate || 'N/A';
    document.querySelector('#card .card_details p:nth-child(6) span').innerText = drugDetails.expiryDate || 'N/A';
    document.querySelector('#card .card_details p:nth-child(7) span').innerText = drugDetails.quantity || 'N/A';
    document.querySelector('#card .card_details p:nth-child(8) span').innerText = drugDetails.storageConditions || 'N/A';
}

const drugDetails = getQueryParams();

populateDrugDetails(drugDetails);
