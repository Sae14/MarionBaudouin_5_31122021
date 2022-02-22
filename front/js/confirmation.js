const idReturned = new URLSearchParams(window.location.search).get("id");
const orderIdHtml = document.querySelector("#orderId");

const orderDisplay = () => {
  // Affichage de l'id de commande récupérée dans l'url de la page
  orderIdHtml.innerHTML = idReturned;
};

orderDisplay();

localStorage.clear();
