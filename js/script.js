const inputNumber = document.getElementById('input');
const outputResult = document.getElementById('output');
const calculateFiboButton = document.getElementById('calculateFiboBtn');
const biggerThanText = document.getElementById('bigger-than');
const results = document.getElementById('results');
const historyLoader = document.getElementById('history-loader');
const formulaCheckbox = document.getElementById('checkbox');
const dropdownNumbersAscending = document.getElementById('dropdown-number-asc');
const dropdownNumbersDescending = document.getElementById('dropdown-number-desc');
const dropdownDateAscending = document.getElementById('dropdown-date-asc');
const dropdownDateDescending = document.getElementById('dropdown-date-desc');

let organizingOrder = 'date-desc';

const fibonacciCalculation = (n) => {

    let numberOne = 0;
    let numberTwo = 1;
    let numberResult = n;

    for(i = 2; i <= n; i++) {

        numberResult = numberOne + numberTwo;
        numberOne = numberTwo;
        numberTwo = numberResult;
        
    };

    return numberResult;

};

function calculateFibonacciFromServer() {

    fetch(`http://localhost:5050/fibonacci/${inputNumber.value}`)

    .then(async (response) => {

        if(!response.ok) {
            const text = await response.text();
            throw text;
        }

        return response.json();
   
    })

    .then((data) => {
        displayFibonacciResult();
        outputResult.innerHTML = data.result;
    })

    .catch((error) => {
        error42Life();
        outputResult.innerHTML = `Server Error: ${error}`;
    })

};

function fetchHistoryResultsFromServer() {

    fetch(`http://localhost:5050/getFibonacciResults`)

    .then((response) => {

        if(!response.ok) {
            return response.text()
            .then(text => {
                {throw text};
            });
        }

        else {
            return response.json();
        };

    })

    .then((data) => {

        historyLoader.classList.remove('loader-big');

        if (organizingOrder == 'num-asc') {
            let arrayOrganizedByNumbersAsc = (organizeResultsFromFetchByNumberAsc(data['results']));
            displayResultsInDOM(arrayOrganizedByNumbersAsc);
        } else if (organizingOrder == 'num-desc') {
            let arrayOrganizedByNumbersDesc = organizeResultsFromFetchByNumberDesc(data['results']);
            displayResultsInDOM(arrayOrganizedByNumbersDesc);
        } else if (organizingOrder == 'date-asc') {
            let arrayOrganizedByDateAsc = organizeResultsFromFetchByDateAsc(data['results']);
            displayResultsInDOM(arrayOrganizedByDateAsc);
        } else if (organizingOrder == 'date-desc') {
            let arrayOrganizedByDateDesc = (organizeResultsFromFetchByDateDesc(data['results']));
            displayResultsInDOM(arrayOrganizedByDateDesc);    
        }
    })

    .catch((error) => {
    
        historyLoader.classList.remove('loader-big');
        results.innerHTML = `Server Error: ${error}`;
    
    })

};

function organizeResultsFromFetchByNumberAsc(fetchValue) {
    fetchValue.sort((a, b) => a.number - b.number);
    return fetchValue;
};
function organizeResultsFromFetchByNumberDesc(fetchValue) {
    fetchValue.sort((a, b) => b.number - a.number);
    return fetchValue;
};
function organizeResultsFromFetchByDateAsc(fetchValue) {
    fetchValue.sort((a, b) => a.createdDate - b.createdDate);
    return fetchValue;
};
function organizeResultsFromFetchByDateDesc(fetchValue) {
    fetchValue.sort((a, b) => b.createdDate - a.createdDate);
    return fetchValue;
};

function displayResultsInDOM(array) {

    for (i = 0; i < array.length; i++) {

        createTextDiv(array);

        createLineDiv();

    }

}

function createTextDiv(array) {

    const newDiv = document.createElement('div');

    newDiv.id = array[i]._id;

    let currentResult = newDiv;

    currentResult.innerHTML = `The Fibonacci Of <strong>${array[i].number}</strong> is <strong>${array[i].result}</strong>. Calculated at: ${new Date(array[i].createdDate)}`;

    results.appendChild(currentResult);

}

function createLineDiv() {

    const newDiv = document.createElement('div');

    let newLine = newDiv;

    newLine.classList.add('middle-line');

    results.appendChild(newLine);

}

function error42Life() {
    outputResult.classList.remove('loader');
    outputResult.classList.add('error-42-life');
};

function load() {
    outputResult.classList.remove('output', 'error-42-life');
    outputResult.classList.add('loader');
};

function displayFibonacciResult() {
    outputResult.classList.remove('loader');
    outputResult.classList.add('output');
}

const biggerThan50 = () => {

    if (inputNumber.value > 50) {
        biggerThanText.classList.add('bigger-than-50');
        biggerThanText.innerHTML = "Can't be larger than 50";
        return true;
    } else {
        return false;
    }

};

function prepareViewport() {

    outputResult.innerHTML="";
    biggerThanText.classList.remove('bigger-than-50');
    biggerThanText.innerHTML = "&nbsp";
    results.innerHTML = ''

}

function main() {

    prepareViewport();

    if(inputNumber.value === '') {return};

    if (biggerThan50() === true) {return};

    load();

    if (formulaCheckbox.checked) {

        historyLoader.classList.add('loader-big')
        calculateFibonacciFromServer();
        fetchHistoryResultsFromServer();

    } else {

        if (inputNumber.value < 0) {
            displayFibonacciResult();
            return;
        };

        displayFibonacciResult();
        outputResult.innerHTML = fibonacciCalculation(inputNumber.value);

    };

}

calculateFiboButton.addEventListener('click', main);
inputNumber.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        main();
    };
});
dropdownNumbersAscending.addEventListener('click', () => {
    organizingOrder = 'num-asc';
    main();
});
dropdownNumbersDescending.addEventListener('click', () => {
    organizingOrder = 'num-desc';
    main();
});
dropdownDateAscending.addEventListener('click', () => {
    organizingOrder = 'date-asc';
    main();
});
dropdownDateDescending.addEventListener('click', () => {
    organizingOrder = 'date-desc';
    main();
});