class CalorieTracker {
    constructor() {
        this._caloriesLimit = 2000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];

        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }

    // public methods
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._displayNewItem('meal', meal);
        this._renderStats();
    };

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._displayNewItem('workout', workout);
        this._renderStats();
    };

    // private methods
    _displayCaloriesTotal() {
        const caloriesTotalDisplay = document.querySelector('#calories-total');
        caloriesTotalDisplay.textContent = this._totalCalories;
    };

    _displayCaloriesLimit() {
        const caloriesLimitDisplay = document.querySelector('#calories-limit');
        caloriesLimitDisplay.textContent = this._caloriesLimit;
    };

    _displayCaloriesConsumed() {
        const caloriesConsumedDisplay = document.querySelector('#calories-consumed');
        const caloriesConsumed = this._meals.reduce((total, meal) => total + meal.calories, 0);
        caloriesConsumedDisplay.textContent = caloriesConsumed;
    };

    _displayCaloriesBurned() {
        const caloriesBurnedDisplay = document.querySelector('#calories-burned');
        const caloriesBurned = this._workouts.reduce((total, workout) => total + workout.calories, 0);
        caloriesBurnedDisplay.textContent = caloriesBurned;
    };

    _displayCaloriesRemaining() {
        const caloriesRemainingDisplay = document.querySelector('#calories-remaining');
        const caloriesRemaining = this._caloriesLimit - this._totalCalories;
        caloriesRemainingDisplay.textContent = caloriesRemaining;

        const remainingBox = caloriesRemainingDisplay.parentElement.parentElement;
        const caloriesProgressDisplay = document.querySelector('#calorie-progress');

        if (caloriesRemaining <= 0) {
            remainingBox.classList.remove('bg-light');
            remainingBox.classList.add('bg-danger');
            caloriesProgressDisplay.style.backgroundColor = '#dc3545e6';
        } else {
            remainingBox.classList.remove('bg-danger');
            remainingBox.classList.add('bg-light');
            caloriesProgressDisplay.style.backgroundColor = '#599f3d';
        };
    };

    _displayCaloriesProgress() {
        const caloriesProgressDisplay = document.querySelector('#calorie-progress');
        const percentage = (this._totalCalories / this._caloriesLimit) * 100;
        const width = Math.min(percentage, 100);
        caloriesProgressDisplay.style.width = `${width}%`;
    };

    _displayNewItem(type, item) {
        const mealItems = document.querySelector('#meal-items');
        const workoutItems = document.querySelector('#workout-items');

        const newItem = document.createElement('div');
        newItem.classList.add('card', 'my-2');
        newItem.setAttribute('data-id', item.id);

        newItem.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${item.name}</h4>
                    ${type === 'meal' 
                        ? 
                        `<div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
                            ${item.calories}
                        </div>`
                        :
                        `<div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
                            ${item.calories}
                        </div>`
                    }
                        <button class="delete btn btn-danger btn-sm mx-2">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                </div>
            </div>`;

        if(type === 'meal') {
            mealItems.appendChild(newItem);
        } else {
            workoutItems.appendChild(newItem);
        };
    };

    _renderStats() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    };
}

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class App{
    constructor() {
        this._tracker = new CalorieTracker();
        document.querySelector('#meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
        document.querySelector('#workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
    }

    _newItem(type, e) {
        e.preventDefault();

        const name = document.querySelector(`#${type}-name`).value;
        const calories = +document.querySelector(`#${type}-calories`).value;

        if(name == '' || calories == '') {
            alert('Please fill in all fields');
            return;
        };

        if(type === 'meal') {
            const newMeal = new Meal(name, calories);
            this._tracker.addMeal(newMeal);
        } else {
            const newWorkout = new Workout(name, calories);
            this._tracker.addWorkout(newWorkout);
        }
        
        document.querySelector(`#${type}-name`).value = '';
        document.querySelector(`#${type}-calories`).value = '';

        const collapseItem = document.querySelector(`#collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseItem, {
            toggle: true,
        });
    }
}

const newApp = new App();
console.log(newApp);
