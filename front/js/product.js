const id = new URLSearchParams(window.location.search).get("id");
const itemImageHtml = document.querySelector(".item__img");
const itemTitleHtml = document.querySelector("#title");
const itemPriceHtml = document.querySelector("#price");
const itemDescHtml = document.querySelector("#description");
const itemColorHtml = document.querySelector("#colors");
const btnAddToCart = document.querySelector("#addToCart");
const itemQuantityHtml = document.querySelector("#quantity");
let urlProduct = "http://localhost:3000/api/products/" + id;
let product = [];
const getProduct = () => {
  // Récupération via l'API du produit sur lequel l'utilisateur a cliqué grâce à son id, et stockage des données dans le tableau product
  fetch(urlProduct)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      product = data;
      displayProduct();
    });
};

const displayProduct = () => {
  // Affichage des détails du produit via de l'html injecté dans le DOM
  itemImageHtml.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  itemTitleHtml.innerHTML = `${product.name}`;
  itemPriceHtml.innerHTML = `${product.price}`;
  itemDescHtml.innerHTML = `${product.description}`;
  product.colors.forEach((color) => {
    itemColorHtml.innerHTML += `<option value=${color}>${color}</option>`;
  });
};

getProduct();

btnAddToCart.addEventListener("click", () => {
  addProductToCart();
});

const addProductToCart = () => {
  // Ajout du produit au panier en prenant en compte la quantité et couleur choisies. Ajout si la quantité est supérieure à 0
  // Modification de la quantité uniquement sans ajouter de ligne si l'id et la couleur sont similaires.

  let item = {};
  item.id = id;
  item.quantity = parseInt(itemQuantityHtml.value); // Comme je le récupère de l'input en string, alors je le parse directement
  item.color = itemColorHtml.value;

  if (item.quantity > 0) {
    let cartJson = {
      id: item.id,
      quantity: item.quantity,
      color: item.color,
      name: product.name,
      imageUrl: product.imageUrl,
      altTxt: product.altTxt,
    };
    // Récupération du panier dans le local storage (sous forme de chaînes de caractère) et parse en un objet json
    let cartLinea = JSON.parse(localStorage.getItem("cart"));
    // Vérification si l'objet créé dans la page actuelle est présent dans le local storage : si oui modification de la valeur de quantité en ajoutant la quantité saisie par l'utilisateur
    // A la quantité existante, si non alors ajout de l'objet fabriqué dans la page à l'objet issu du local storage
    if (cartLinea !== null) {
      let finded = false;
      // Boucle for qui parcourt les objets issus du local storage : finded = true si trouve l'objet : augmente la quantité du produit et arrête la boucle avec break.
      // Si à la fin de la boucle l'objet cartlinea n'est pas trouvé, alors ajout de l'objet cartjson dans l'objet cartlinea
      for (let i = 0; i < cartLinea.length; i++) {
        let product = cartLinea[i];
        if (cartJson.id === product.id && cartJson.color === product.color) {
          product.quantity += cartJson.quantity;
          finded = true;
          break;
        }
      }
      if (finded === false) {
        cartLinea.push(cartJson);
      }
      localStorage.setItem("cart", JSON.stringify(cartLinea));
    } else {
      localStorage.setItem("cart", JSON.stringify([cartJson]));
    }
  }
};
