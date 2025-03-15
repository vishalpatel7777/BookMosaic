export function initializeRating(box) {
  const stars = box.querySelectorAll(".star");
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const value = star.dataset.value;
      stars.forEach((s, index) => {
        if (index < value) s.classList.add("filled");
        else s.classList.remove("filled");
      });
      console.log(`You rated this book ${value} stars.`);
    });
  });
}

export function addNewNotification() {
  const notificationWrapper = document.querySelector(".notification-wrapper");

  const firstBox = document.querySelector(".notification-box");
  const newBox = firstBox.cloneNode(true);

  const newId = `notification-box-${Date.now()}`;
  newBox.id = newId;

  const newImg = newBox.querySelector(".book-notification");
  newImg.src = "/Assets/cover pages/hunting adeline.jpeg";

  const newText = newBox.querySelector(".notification-text");

  newText.textContent = `You just Purchased a New Book!`;

  const stars = newBox.querySelectorAll(".star");
  stars.forEach((star) => star.classList.remove("filled"));

  notificationWrapper.appendChild(newBox);

  initializeRating(newBox);

  notificationWrapper.scrollTop = notificationWrapper.scrollHeight;
}

export function initializeFirstNotification() {
  const firstNotificationBox = document.querySelector(".notification-box");
  if (firstNotificationBox) {
    initializeRating(firstNotificationBox);
  }

  const addNotificationButton = document.querySelector(
    "#add-notification-button"
  );
  if (addNotificationButton) {
    addNotificationButton.addEventListener("click", addNewNotification);
  }
}
