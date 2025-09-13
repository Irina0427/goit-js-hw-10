import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const delay = Number(data.get("delay"));
  const state = data.get("state");

  if (!Number.isFinite(delay) || delay < 0) {
    iziToast.error({
      title: "Error",
      message: "Please enter a non-negative delay.",
      position: "topRight",
    });
    return;
  }
  submitBtn.disabled = true;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      state === "fulfilled" ? resolve(delay) : reject(delay);
    }, delay);
  });

  promise
    .then((ms) => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${ms}ms`,
        position: "topRight",
      });
    })
    .catch((ms) => {
      iziToast.error({
        message: `❌ Rejected promise in ${ms}ms`,
        position: "topRight",
      });
    })
    .finally(() => {
      submitBtn.disabled = false;
      form.reset();
    });
});
