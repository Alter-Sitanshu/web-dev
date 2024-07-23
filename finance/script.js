let transaction = JSON.parse(localStorage.getItem('transaction')) || [];
let balance = JSON.parse(localStorage.getItem('balance')) || 0;
let totalExpense = JSON.parse(localStorage.getItem('expense')) || 0;
let totalEarning = JSON.parse(localStorage.getItem('income')) || 0;
let MonthlyExpense = JSON.parse(localStorage.getItem('m-expense')) || 0;
let MonthlyEarning = JSON.parse(localStorage.getItem('m-income')) || 0;
let growthPercentage = JSON.parse(localStorage.getItem('growth')) || 0;
let expense_data = JSON.parse(localStorage.getItem('exp')) || [0,0,0,0,0,0,0,0,0,0,0,0];
let income_data = JSON.parse(localStorage.getItem('inc')) || [0,0,0,0,0,0,0,0,0,0,0,0];
let month_selected = new Date().getMonth();
let prevBalance = JSON.parse(localStorage.getItem('prev')) || 0;

//Add updating the growth ratio every month end and the graphs
const monthlyUpdate = () => {
    const curDate = new Date();
    if(curDate.getDate() == 1 && curDate.getHours() == 1){
        MonthlyEarning = 0;
        MonthlyExpense = 0;
        localStorage.setItem('m-income', JSON.stringify(MonthlyEarning));
        localStorage.setItem('m-expense', JSON.stringify(MonthlyExpense));
        localStorage.removeItem('transaction');
        list_transaction.innerHTML = '';
        if(prevBalance){
            growthPercentage = Math.round(((balance-prevBalance)/prevBalance)/100);
            localStorage.setItem('growth', JSON.stringify(growthPercentage));
        };
        prevBalance = balance;
        localStorage.setItem('prev', JSON.stringify(prevBalance));
    }
}
// Handling the loading of charts and Graphs
const loadTransaction = (transaction) => {
    return new Promise((resolve, reject) => {
        const list_transaction = document.getElementById('transaction-history');
        list_transaction.innerHTML = '';
        for(objects of transaction){
            let class_name;
            if(objects['type'] == 'Expense'){
                class_name = 'transaction-name';
            }else{
                class_name = 'income-name';
            };
            list_transaction.innerHTML += `
                <div class="transaction-element">
                    <h3 id="${class_name}">${objects['event']}</h3>
                    <h3 id="transaction-amount">&#8377;${objects['amount']}</h3>
                </div>
            `;
        }
        monthlyUpdate(list_transaction);
        const percentElement = document.getElementById('percentage');
        if(growthPercentage < 0){
            percentElement.classList.add('down');
            percentElement.innerHTML = `${growthPercentage}&#37;`;
        }else{
            percentElement.classList.remove('down');
            percentElement.classList.add('up');
            percentElement.innerHTML = `+${growthPercentage}&#37;`;
        }
        resolve(true);
    })
};

const Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let pieChart = null;
let lineChart = null;
const loadChart = () => {
    return new Promise((resolve, reject) => {
        if (pieChart) {
            try {
                pieChart.destroy();
            } catch (error) {
                console.error("Error destroying pieChart:", error);
                reject(error);
            }
        }

        if (lineChart) {
            try {
                lineChart.destroy();
            } catch (error) {
                console.error("Error destroying lineChart:", error);
                reject(error);
            }
        }
        const chart = document.getElementById('pie-chart').getContext('2d');
        const chart_labels = ['Expense','Income'];
        const data = {
            labels: chart_labels,
            datasets: [{
                label:'Finances',
                data: [totalExpense, totalEarning],
                backgroundColor: [
                    'rgba(255,0,0)',
                    '#66ff00',
                ],
                borderColor: [
                    'rgba(255,0,0)',
                    '#66ff00',
                ],
                borderWidth: 1
            }]
        };

        const config = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        enabled: true,
                    },
                    title:{
                        display:true,
                        text:`Expenses v/s Income`
                    }
                },
                radius:'70%',
                maintainAspectRatio:false,
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10
                    },
                    margin: {
                        left:0,
                        right:0,
                        top:0,
                        bottom:0
                    }
                }
            },
        };

        pieChart = new Chart(chart, config);

        const line_data = {
            labels: Months,
            datasets: [{
                label:'Expense',
                data: expense_data,
                borderColor: [
                    'rgba(255,0,0)',
                ],
                borderWidth: 1,
                tension:0.1,
                order:1
            },{
                type:'line',
                label:'Income',
                data: income_data,
                borderColor: [
                    '#66ff00',
                ],
                borderWidth: 1,
                tension:0.1,
                order:2
            }
        ],
        };
        const line_config = {
            type: 'line',
            data: line_data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        enabled: true,
                    },
                    title:{
                        display:true,
                        text:`Expenses v/s Income`
                    }
                }
            }
        }

        lineChart = new Chart(document.getElementById('line-chart').getContext('2d'), line_config);
        resolve(true);
    });
}

// Handling the Popup Form to add the Events of spending
const handlingSubmit = () => {
    const submitElement = document.getElementById('submit');
    const cancelElement = document.getElementById('cancel');
    submitElement.addEventListener('click', async (event) => {
        event.preventDefault();
        const event_name = document.getElementById('event').value;
        const amount_inp = document.getElementById('amount').value;
        const type_ = document.getElementById('radio').value;
        transaction.push({
            event:`${event_name}`,
            amount:`${amount_inp}`,
            type:`${type_}`
        });
        localStorage.setItem('transaction', JSON.stringify(transaction));
        if(type_ == "Expense"){
            totalExpense += Number.parseInt(amount_inp);
            MonthlyExpense += Number.parseInt(amount_inp);
            balance -= Number.parseInt(amount_inp);
            expense_data[month_selected] = MonthlyExpense;
        }else{
            totalEarning += Number.parseInt(amount_inp);
            MonthlyEarning += Number.parseInt(amount_inp);
            balance += Number.parseInt(amount_inp);
            income_data[month_selected] = MonthlyEarning;
        };
        
        localStorage.setItem('balance', JSON.stringify(balance));
        let wait1 = await loadBalance(balance);
        let wait2 = await loadTransaction(transaction);
        let date = new Date();
        localStorage.setItem('m-income', JSON.stringify(MonthlyEarning));
        localStorage.setItem('m-expense', JSON.stringify(MonthlyExpense));
        localStorage.setItem('income', JSON.stringify(totalEarning));
        localStorage.setItem('expense', JSON.stringify(totalExpense));
        localStorage.setItem('exp', JSON.stringify(expense_data));
        localStorage.setItem('inc', JSON.stringify(income_data));
        let wait3 = await loadChart();
        const popupElement = document.getElementById('popup');
        popupElement.innerHTML = '';
        popupElement.style.opacity = 0;
    });
    cancelElement.addEventListener('click', (event) => {
        event.preventDefault();
        const popupElement = document.getElementById('popup');
        popupElement.innerHTML = '';
        popupElement.style.opacity = 0;
    });
};

// Handling the modification of the transaction list card
const add_element = document.getElementById('add-item');
const handlingAdd = () => {
        const popupElement = document.getElementById('popup');
        popupElement.innerHTML = `
            <h1>Enter Details</h1>
            <form action="/">
                <label for="event">Event</label>
                <input type="text" id="event" name="event" required>
                <label for="amount">Amount</label>
                <input type="number" name="amount" id="amount" required>
                <select name="radio" id="radio">
                    <option value="Expense" selected>Expense</option>
                    <option value="Income">Income</option>
                </select>
                <div id="form-buttons">
                    <button id="submit" class="submit-button" type="submit">Submit</button>
                    <button id="cancel" type="button">Cancel</button>
                </div>
            </form>
        `;
        popupElement.style.opacity = 1;
        handlingSubmit();
};
add_element.addEventListener('click', handlingAdd);
const clearElement = document.getElementById('delete-item');
clearElement.addEventListener('click', () => {
    localStorage.removeItem('transaction');
    loadTransaction([]);
})

// Handling dates card
const WeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
const dateSetter = () => {
    return new Promise((resolve, reject) => {
        const date = new Date();
        let curYear = date.getFullYear();
        let curDay = WeekDays[date.getDay()];
        let curMonth = Months[date.getMonth()];
        let curdate = date.getDate();
        const dateElement = document.getElementById('date-select');
        const monthElement = document.getElementById('month-select');
        const yearElement = document.getElementById('year-select');
        dateElement.innerHTML = '';
        dateElement.innerHTML = '';
        yearElement.innerHTML = '';
        for(let intdate = 1; intdate<=31; intdate++){
            if(intdate == curdate){
                dateElement.innerHTML += `
                <option value=${intdate} selected>${intdate}</option>
            `;
            }
            else{dateElement.innerHTML += `
                <option value=${intdate}>${intdate}</option>
            `;};
        }
        for(let month of Months){
            if(month == curMonth){
                monthElement.innerHTML += `
                <option value="${month}" selected>${month}</option>
            `;
            }
            else{monthElement.innerHTML += `
                <option value="${month}">${month}</option>
            `;};
        }
        for(let intyear = curYear-50; intyear<curYear+50; intyear++){
            if(intyear == curYear){
                yearElement.innerHTML += `
                <option value=${intyear} selected>${intyear}</option>
            `;
            }
            else{yearElement.innerHTML += `
                <option value=${intyear}>${intyear}</option>
            `;};
        }
        document.getElementById('year').innerHTML = `${curMonth} / ${curYear}`;
        document.getElementById('date').innerHTML = `${curdate}`;
        document.getElementById('day').innerHTML = `${curDay}`;
        resolve(true);
    })
}
// Hnadling the Chnage of the Calender Card
const editDate = () => {
    const date_selected = document.getElementById('date-select').value;
    month_selected = Months.indexOf(document.getElementById('month-select').value);
    const year_selected = document.getElementById('year-select').value;
    const day_selected = WeekDays[new Date(`${year_selected}-${month_selected+1}-${date_selected}`).getDay()];
    console.log(day_selected);
    MonthlyEarning = income_data[month_selected];
    MonthlyExpense = expense_data[month_selected];
    document.getElementById('year').innerHTML = `${Months[month_selected]} / ${year_selected}`;
    document.getElementById('date').innerHTML = `${date_selected}`;
    document.getElementById('day').innerHTML = `${day_selected}`;
}
const loadBalance = (balance) => {
    return new Promise((resolve, reject) => {
        document.getElementById('balance').innerHTML = `&#8377;${balance}`;
        resolve(true);
    })
};

// running all the promises
Promise.all([loadTransaction(transaction), loadChart(), dateSetter(), loadBalance(balance)]);

const balance_updateElement = document.getElementById('update-balance');
const handleUpdate = () => {
    const submitElement = document.getElementById('submit');
    const cancelElement = document.getElementById('cancel');
    submitElement.addEventListener('click', async (event) => {
        event.preventDefault();
        const amount_inp = document.getElementById('amount').value;
        balance = Number.parseInt(amount_inp);
        localStorage.setItem('balance', JSON.stringify(balance));
        let wait1 = await loadBalance(balance);
        const popupElement = document.getElementById('popup');
        popupElement.innerHTML = '';
        popupElement.style.opacity = 0;
    });
    cancelElement.addEventListener('click', (event) => {
        event.preventDefault();
        const popupElement = document.getElementById('popup');
        popupElement.innerHTML = '';
        popupElement.style.opacity = 0;
    });
};
const BalanceUpdate = () => {
    const popupElement = document.getElementById('popup');
    popupElement.innerHTML = `
        <h1>Enter Details</h1>
        <form action="/">
            <label for="event" name="event">Balance</label>
            <input type="number" name="amount" id="amount" required>
            <div id="form-buttons">
                <button id="submit" class="submit-button" type="submit">Submit</button>
                <button id="cancel" type="button">Cancel</button>
            </div>
        </form>
    `;
    popupElement.style.opacity = 1;
    handleUpdate();
};
balance_updateElement.addEventListener('click', BalanceUpdate);


document.getElementById('reset').addEventListener('click', ()=>{
    localStorage.clear();
    location.reload();
})