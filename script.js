'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [
    200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 120, -300, 1500,
  ],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-08-01T10:51:36.790Z',
    '2021-07-06T23:36:17.929Z',
    '2021-07-23T06:23:21.790Z',
    '2021-07-28T17:55:12.790Z',
    '2021-07-29T13:08:03.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2021-07-28T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnLogout = document.querySelector('.login__logout');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//// METHODS
//Helper methods

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return `Today`;
  else if (daysPassed === 1) return `Yesterday`;
  else if (daysPassed <= 7) return `Few days ago`;
  else if (daysPassed > 31) {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // const hour = `${date.getHours()}`.padStart(2, 0);
    // const minutes = `${date.getMinutes()}`.padStart(2, 0);
    // return `${day}/${month}/${year}, ${hour}:${minutes}`;
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat(locale, options).format(date);
  } else return `${daysPassed} days ago`;
  // return `${day}/${month}/${year}, ${hour}:${minutes}:${seconds}`;
  // return `${calcDaysPassed} days ago`;
};

// FORMATTING Metchod for any value, locale and currency
const formattedMov = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//Display methods
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // Sort method
  const movsSort = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movsSort.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type.toUpperCase()}</div>
            <div class="movements__date">${displayDate}  </div>
            <div class="movements__value">${formattedMov(
              mov,
              acc.locale,
              acc.currency
            )} </div>
          </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Calculate and Display balance
const calcDisplayBallance = function (acc) {
  // accs.forEach((acc, i) => {
  // acc.ballance = acc.movements.reduce((acc, curr) => acc + curr);
  // });
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = formattedMov(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

//Calculate and Display summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formattedMov(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formattedMov(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  // My way - a lot shorter
  const interests = acc.movements
    .filter(mov => mov > 0)
    .reduce(
      (acc, mov) =>
        mov > currentAccount.interestRate * 100
          ? acc + (mov * currentAccount.interestRate) / 100
          : acc,
      0
    )
    .toFixed(2);
  labelSumInterest.textContent = formattedMov(
    interests,
    acc.locale,
    acc.currency
  );
  // Jonas way for reduce
  // const interests = acc.movements
  //   .filter(mov => mov > 0)
  //   .map(deposit => (deposit * currentAccount.interestRate) / 100)
  //   .filter((int, i, arr) => {
  //     // console.log(arr);
  //     return int >= 1;
  //   })
  //   .reduce((acc, mov, i, arr) => {
  //     // console.log(arr);
  //     return acc + mov;
  //   }, 0);
  // labelSumInterest.textContent = interests.toFixed(2) + '€';
};
//// METHODS
// Utility/complementary methods

//Computing usernames using map/ and others array methods
const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// Method returns account we look for using obj.userName value
const findAccount = function (value) {
  return accounts.find(acc => acc.userName === value);
};

// Method reseting summary, balance and few more
const resetAfterLogout = function () {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Log in to get started`;
  currentAccount = '';
  containerMovements.innerHTML = '';
  btnLogout.classList.add('hide');
  labelBalance.textContent = `0000 €`;
  labelSumIn.textContent = '0000€';
  labelSumOut.textContent = `0000€`;
  labelSumInterest.textContent = '0000€';
};

// Disable / enable login boxDecorationBreak:
function loginBtnState(btn) {
  if (btn === 'disable') btnLoan.disabled = 'true';
  else if (btn === 'enabled') btnLoan.disabled = 'true';
}

//////////////////////////////////////
//LOGIN APPLICATION
///////////////////////////////////////////////////////////////
/// DISPLAYING REAL APP

// 'let currentAccount' stores current account
let currentAccount, timer;

// DISPLAY ALL VALUES ON SCREEN - summary, movements, balance
const updateUI = function (currAcc) {
  //Display movements
  displayMovements(currAcc);
  //Display ballance
  calcDisplayBallance(currAcc);
  //Display Summary
  calcDisplaySummary(currAcc);
};

// Logout timer function
const startLogOutTimer = function () {
  const tick = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minutes}:${seconds}`;

    // When 0 sec, stop timer and log out thee user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    //Decrease 1s
    time--;
  };
  //Set time to 10 mins
  let time = 200;

  //Call timer every second
  tick();
  const timer = setInterval(tick, 1000);
  //In each call, print the remaining time to UI
  return timer;
};

///////////////////////////////////////////
//EVENT HANDLERS

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
// btnLogout.classList.remove('hide');

// Experimenting with API
// let now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   weekday: 'long',
// };
// labelDate.textContent = new Intl.DateTimeFormat('pl-PL', options).format();

// LOG IN - when 'btnLogin' clicked
let now = new Date();
const logIn = function (e) {
  e.preventDefault();
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
  //Find and update currentAccount
  currentAccount = findAccount(inputLoginUsername.value);
  // console.log(currentAccount);

  //If currentAcc is undefined or null nothing will happened
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Creating current date and time
    setInterval(() => {
      // const day = `${now.getDate()}`.padStart(0);
      // const month = `${now.getMonth()}`.padStart(2, 0);
      // const year = now.getFullYear();
      // const hour = `${now.getHours()}`.padStart(2, 0);
      // const minutes = `${now.getMinutes()}`.padStart(2, 0);
      // const seconds = `${now.getSeconds()}`.padStart(2, 0);
      // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}:${seconds}`;
      // let now = new Date();

      const options = {
        second: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        // weekday: 'short',
        // short, narrow, long, numeric
      };

      // const locale = navigator.language;
      // console.log(locale);

      // Time ISO API
      //'en-GB' można zamienić na const locale= navigator.language albo currentAccount.locale
      const formattedDate = new Intl.DateTimeFormat(
        currentAccount.locale,
        options
      ).format();
      (labelDate.textContent = formattedDate),
        // ;
        // (now = new Date())
        1000;
    });

    //Reset login details - clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
    btnLogout.classList.remove('hide');
    loginBtnState('disabled');
  }
};
btnLogin.addEventListener('click', logIn);

/// TRANSFER MONEY FROM USER TO RECIPIENT - when 'btnTransfer' clicked
const transferAction = function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferRecipient = findAccount(inputTransferTo.value);

  //Clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  if (
    amount > 0 &&
    transferRecipient.owner &&
    currentAccount.balance >= amount &&
    transferRecipient !== currentAccount
  ) {
    // Doing the transfer
    transferRecipient.movements.push(amount);
    currentAccount.movements.push(-amount);

    // Adding transfer date to current/recipient movementsDates array
    currentAccount.movementsDates.push(now.toISOString());
    transferRecipient.movementsDates.push(now.toISOString());
  }

  //Display page values
  updateUI(currentAccount);
  clearInterval(timer);
  timer = startLogOutTimer();
};
btnTransfer.addEventListener('click', transferAction);

// LOAN REQUEST when 'btnLoan' clicked
const loanRequest = function (e) {
  e.preventDefault();

  //Clear input fields
  inputLoanAmount.blur();

  // Loan amount
  const amount = Number(inputLoanAmount.value);
  //Condition
  const condition = currentAccount.movements.some(
    mov => mov >= amount / 10 // mov*0.1
  );

  if (amount > 0 && condition) {
    setTimeout(function () {
      // Adding loan amount to current account array
      currentAccount.movements.push(amount);

      // Adding loan date to current movementsDates array
      currentAccount.movementsDates.push(now.toISOString());

      //Display page values
      updateUI(currentAccount);
    }, 2500);
  } else {
    console.log('F...ck off');
  }

  //Set input value to empty
  inputLoanAmount.value = '';

  //Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
};
btnLoan.addEventListener('click', loanRequest);

// LOG OUT - when 'btnLogout' clicked
const logout = function (e) {
  e.preventDefault();

  // if (currentAccount?.userName) {
  // Method reseting summary, balance and few more
  resetAfterLogout();
  loginBtnState('enabled');
  // }
};
// btnLogout.addEventListener('click', logout);

// CLOSE ACCOUNT - when 'btnClose' clicked
const closeAccount = function (e) {
  e.preventDefault();
  if (
    // currentAccount?.userName &&
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(acc => acc === currentAccount);
    // Delete account
    accounts.splice(index, 1);
    // Method reseting summary, balance and few more
    resetAfterLogout();
    loginBtnState('enabled');
  }
  inputCloseUsername.value = inputClosePin.value = '';
};
btnClose.addEventListener('click', closeAccount);

// SORT BUTTON CLICKED
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount, sorted);

  //Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

///////////////////////////////////////
// Converting and Checking Numbers
// console.log(23 === 23.0);

// // Base 10 - 0 to 9. 1/10 = 0.1. 3/10 = 3.3333333
// // Binary base 2 - 0 1
// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3);

// // Conversion
// console.log(Number('23'));
// console.log(+'23');

// // Parsing - parse a number from a string
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('e23', 10));

// console.log(Number.parseInt('  2.5rem  '));
// console.log(Number.parseFloat('  2.5rem  '));

// // console.log(parseFloat('  2.5rem  '));

// // Check if value is NaN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20X'));
// console.log(Number.isNaN(23 / 0));

// // Checking if value is number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20X'));
// console.log(Number.isFinite(23 / 0));

// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23 / 0));

// ///////////////////////////////////////
// // Math and Rounding
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(5, 18, 23, 11, 2));
// console.log(Math.max(5, 18, '23', 11, 2));
// console.log(Math.max(5, 18, '23px', 11, 2));

// console.log(Math.min(5, 18, 23, 11, 2));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// // 0...1 -> 0...(max - min) -> min...max
// // console.log(randomInt(10, 20));

// // Rounding integers
// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(23.3));
// console.log(Math.floor('23.9'));

// console.log(Math.trunc(23.3));

// console.log(Math.trunc(-23.3));
// console.log(Math.floor(-23.3));

// // Rounding decimals
// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log((2.345).toFixed(2));
// console.log(+(2.345).toFixed(2));

// ///////////////////////////////////////
// // The Remainder Operator
// console.log(5 % 2);
// console.log(5 / 2); // 5 = 2 * 2 + 1

// console.log(8 % 3);
// console.log(8 / 3); // 8 = 2 * 3 + 2

// console.log(6 % 2);
// console.log(6 / 2);

// console.log(7 % 2);
// console.log(7 / 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(23));
// console.log(isEven(514));

// //Create date
// const now = new Date();
// console.log(now);

// console.log(new Date('Aug 02 2020 18:05:41'));
// console.log(new Date('Dec 24,2015'));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 19, 15, 23, 5));
// console.log(new Date(2037, 10, 35));

// console.log(new Date(0));
// console.log(new Date(1000000000000));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// //Working with date

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay()); //Day of the week
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2142256980000));
// console.log(new Date(2142253380000));

// console.log(Date.now());
// // setInterval(() => console.log(new Date(Date.now())), 1000);

// future.setFullYear(2040);
// console.log(future);

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

// const comparedDates1 = calcDaysPassed(
//   new Date(2037, 5, 29),
//   new Date(2027, 5, 24, 12, 8)
// );
// console.log(comparedDates1);

// // Internationalizing -
// const num = 3884764.23;

// const opts = {
//   // style: 'unit',
//   // // unit: 'mile-per-hour',
//   // unit: 'celsius',
//   // style: 'percent',
//   style: 'currency',
//   currency: 'EUR',
//   useGrouping: false,
// };
// console.log('US: ', new Intl.NumberFormat('en-US', opts).format(num));
// console.log('Poland: ', new Intl.NumberFormat('pl', opts).format(num));
// console.log('Germany: ', new Intl.NumberFormat('de-de', opts).format(num));
// console.log('France: ', new Intl.NumberFormat('fr-FR', opts).format(num));
// console.log('Spain: ', new Intl.NumberFormat('es-ES', opts).format(num));
// console.log('Russia: ', new Intl.NumberFormat('ru-RU', opts).format(num));
// console.log('Japan: ', new Intl.NumberFormat('ja', opts).format(num));
// console.log('England: ', new Intl.NumberFormat('en-GB', opts).format(num));
// console.log('Portugal: ', new Intl.NumberFormat('pt-PT', opts).format(num));
// console.log(navigator.language, new Intl.NumberFormat('pl', opts).format(num));

//// SET TIMEOUT() METHOD
// const ingredients = ['olives', 'spinach'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) =>
//     console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕🍕🍕`),
//   2000,
//   ...ingredients
// );

// console.log('Waiting 2s');

// // if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// //// SET INTERVAL()
// setInterval(() => {
//   const now = new Date();
//   const seconds = `${now.getSeconds()}`.padStart(2, 0);
//   const minutes = `${now.getMinutes()}`.padStart(2, 0);
//   const hours = `${now.getHours()}`.padStart(2, 0);
//   const nowTime = `${hours}:${minutes}:${seconds}`;
//   console.log(nowTime);
// }, 1000);
