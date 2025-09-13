
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;

let userSelectedDate = null;
let timerId = null;


flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    if (!picked) return;

    if (picked <= new Date()) {
      userSelectedDate = null;
      refs.startBtn.disabled = true;
      iziToast.error({
        title: 'Invalid date',
        message: 'Please choose a date in the future',
        position: 'topCenter',
      });
      return;
    }

    userSelectedDate = picked;
    refs.startBtn.disabled = false;
  },
});


refs.startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  refs.startBtn.disabled = true;
  refs.input.disabled = true;


  tick();

  timerId = setInterval(tick, 1000);
});

function tick() {
  const diff = userSelectedDate - new Date();

  if (diff <= 0) {
    clearInterval(timerId);
    setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    refs.input.disabled = false;     
    refs.startBtn.disabled = true;   
    return;
  }

  setTime(convertMs(diff));
}

function setTime({ days, hours, minutes, seconds }) {
  refs.days.textContent = String(days).padStart(2, '0');
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

