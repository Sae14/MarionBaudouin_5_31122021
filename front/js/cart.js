const cartItemsHtml = document.querySelector("#cart__items");
const cartTotalQuantityHtml = document.querySelector("#totalQuantity");
const cartTotalPriceHtml = document.querySelector("#totalPrice");
let cartList = JSON.parse(localStorage.getItem("cart"));
let productList = [];
let deleteItemHtml;
let quantityItemHtml;
const form = document.querySelector("form");
const inputsFormHtml = document.querySelectorAll(
  'input[type="text"], input[type="email"]'
);
let firstName, lastName, address, city, email;
let products = [];
let contact = {};
let orderIdReturned;

const getSensitiveDataFromAPI = () => {
  // Récupération du prix via l'API sans le stocker via localstorage
  Promise.all(
    cartList.map((product) => {
      return new Promise((resolve) => {
        let urlProduct = "http://localhost:3000/api/products/" + product.id;
        fetch(urlProduct)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            product.price = data.price;
            productList.push(product);
            resolve();
          });
      });
    })
  ).then(() => {
    displayCart();
  });
};

const displayCart = () => {
  // Affichage de chaque produit du panier
  cartItemsHtml.innerHTML = "";
  let cartTotalQuantity = 0;
  let cartTotalPrice = 0;
  productList.forEach((product) => {
    cartItemsHtml.innerHTML += `<article class="cart__item" data-id="${
      product.id
    }" data-color="${product.color}">
    <div class="cart__item__img">
    <img src="${product.imageUrl}" alt="${product.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${product.name}</h2>
        <p>${product.color}</p>
        <p>${product.price * product.quantity} € ( ${product.price} €/u )</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
            product.quantity
          }">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`;
    cartTotalQuantity += product.quantity; // Somme de l'ensemble des produits
    cartTotalPrice += product.price * product.quantity; // Ajout de chaque prix de produit multiplié par sa quantité au prix total
  });
  cartTotalQuantityHtml.innerHTML = cartTotalQuantity;
  cartTotalPriceHtml.innerHTML = cartTotalPrice;
  deleteItemHtml = document.querySelectorAll(".deleteItem");
  quantityItemHtml = document.querySelectorAll(".itemQuantity");
  addListener();
};

const deleteProduct = (e) => {
  // Supprime un produit du productList en sélectionnant son container le plus proche et en prenant en compte son id ainsi que sa couleur
  // Puis appel de la fonction de mise à jour du localStorage
  let articleHtml = e.target.closest("article");
  let idToDelete = articleHtml.dataset.id;
  let colorToDelete = articleHtml.dataset.color;
  // Filtre du productList pour ne garder que les produits qui n'ont pas l'id et la couleur correspondants au produit que l'on veut supprimer
  productList = productList.filter(
    (el) => el.id !== idToDelete || el.color !== colorToDelete
  );
  updateLocalStorage();
};

const changeProductQuantity = (e) => {
  // Modifie la quantité d'un produit en sélectionnant son container le plus proche et en prenant en compte son id ainsi que sa couleur
  // Ou le supprime si la quantité est mise à 0 par l'utilisateur
  let articleHtml = e.target.closest("article");
  let idToChange = articleHtml.dataset.id;
  let colorToChange = articleHtml.dataset.color;
  let productToChange = productList.find(
    (el) => el.id == idToChange && el.color == colorToChange
  );
  if (e.target.value > 0) {
    productToChange.quantity = parseInt(e.target.value);
    updateLocalStorage();
  } else {
    deleteProduct(e);
  }
};

const addListener = () => {
  // Ajoute un évènement listener à tous les boutons supprimer et inputs de quantités du panier
  deleteItemHtml.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      deleteProduct(e);
    });
  });
  quantityItemHtml.forEach((input) => {
    input.addEventListener("change", (e) => {
      changeProductQuantity(e);
    });
  });
};

const updateLocalStorage = () => {
  // Met à jour le LocalStorage avec suppression de la clé cart si le contenu est vide
  let cartLinea = [];
  productList.forEach((product) => {
    let cartJson = {
      id: product.id,
      quantity: product.quantity,
      color: product.color,
      name: product.name,
      imageUrl: product.imageUrl,
      altTxt: product.altTxt,
    };
    cartLinea.push(cartJson);
  });
  if (cartLinea.length !== 0) {
    localStorage.setItem("cart", JSON.stringify(cartLinea));
  } else {
    localStorage.removeItem("cart");
  }

  displayCart();
};

getSensitiveDataFromAPI();

const errorDisplay = (tag, message, valid) => {
  // Affiche un message d'erreur si les conditions de remplissage des champs du formulaire ne sont pas remplies
  const ErrorMsgHtml = document.querySelector("#" + tag + "ErrorMsg");

  if (!valid) {
    ErrorMsgHtml.textContent = message;
  } else {
    ErrorMsgHtml.textContent = "";
  }
};

const firstNameChecker = (value) => {
  // Vérifie les conditions de validation du champ du prénom et personnalisation des messages d'erreur
  if (value.length > 0 && (value.length < 2 || value.length > 20)) {
    errorDisplay("firstName", "Le prénom doit faire entre 2 et 20 caractères.");
    firstName = null;
  } else if (!value.match(/^[a-z-'A-Z]*$/)) {
    errorDisplay(
      "firstName",
      "Le prénom ne doit pas contenir de caractères spéciaux ou numériques."
    );
    firstName = null;
  } else {
    errorDisplay("firstName", "", true);
    firstName = value;
  }
};

const lastNameChecker = (value) => {
  // Vérifie les conditions de validation du champ du nom et personnalisation des messages d'erreur
  if (value.length > 0 && (value.length < 2 || value.length > 20)) {
    errorDisplay("lastName", "Le nom doit faire entre 2 et 20 caractères.");
    lastName = null;
  } else if (!value.match(/^[a-z-'A-Z]*$/)) {
    errorDisplay(
      "lastName",
      "Le nom ne doit pas contenir de caractères spéciaux ou numériques."
    );
    lastName = null;
  } else {
    errorDisplay("lastName", "", true);
    lastName = value;
  }
};

const addressChecker = (value) => {
  // Vérifie les conditions de validation du champ de l'adresse et personnalisation des messages d'erreur
  if (value.length > 0 && (value.length < 10 || value.length > 60)) {
    errorDisplay("address", "L'adresse doit faire entre 10 et 60 caractères.");
    address = null;
  } else if (!value.match(/^[a-zA-Z0-9-']+( [a-zA-Z0-9-']+)*$/)) {
    errorDisplay(
      "address",
      "L'adresse ne doit pas contenir de caractères spéciaux."
    );
    address = null;
  } else {
    errorDisplay("address", "", true);
    address = value;
  }
};

const cityChecker = (value) => {
  // Vérifie les conditions de validation du champ de la ville et personnalisation des messages d'erreur
  if (value.length > 0 && (value.length < 2 || value.length > 30)) {
    errorDisplay("city", "La ville doit faire entre 2 et 30 caractères.");
    city = null;
  } else if (!value.match(/^[a-z-'A-Z]+( [a-zA-Z-']+)*$/)) {
    errorDisplay(
      "city",
      "La ville ne doit pas contenir de caractères spéciaux ou numériques."
    );
    city = null;
  } else {
    errorDisplay("city", "", true);
    city = value;
  }
};

const emailChecker = (value) => {
  // Vérifie les conditions de validation du champ de l'adresse email et personnalisation du message d'erreur
  if (!value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
    errorDisplay("email", "L'adresse email n'est pas valide.");
    email = null;
  } else {
    errorDisplay("email", "", true);
    email = value;
  }
};

inputsFormHtml.forEach((input) => {
  input.addEventListener("input", (e) => {
    switch (e.target.id) {
      case "firstName":
        firstNameChecker(e.target.value);
        break;
      case "lastName":
        lastNameChecker(e.target.value);
        break;
      case "address":
        addressChecker(e.target.value);
        break;
      case "city":
        cityChecker(e.target.value);
        break;
      case "email":
        emailChecker(e.target.value);
        break;
      default:
        null;
    }
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    firstName &&
    lastName &&
    address &&
    city &&
    email &&
    productList.length > 0
  ) {
    contact = {
      firstName,
      lastName,
      address,
      city,
      email,
    };

    products = productList.map((i) => i.id);

    postDatas();

    inputsFormHtml.forEach((input) => (input.value = ""));

    firstName = null;
    lastName = null;
    address = null;
    city = null;
    email = null;
    products = null;

    alert("Votre commande a été validée");
  } else {
    alert(
      "Veuillez remplir correctement les champs du formulaire et remplir votre panier"
    );
  }
});

const postDatas = () => {
  // Envoie l'objet contact et le tableau des id produits à l'API qui retourne l'orderId

  let dataSend = {
    contact,
    products,
  };

  let optionsPost = {
    method: "POST",
    body: JSON.stringify(dataSend),
    headers: { accept: "application/json", "content-type": "application/json" },
  };

  fetch("http://localhost:3000/api/products/order", optionsPost)
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      orderIdReturned = result.orderId;
    })
    .then(() => {
      window.location.href = `./confirmation.html?id=${orderIdReturned}`;
    });
};
