const itemsHtml = document.querySelector("#items");
let products = [];
const getProducts = () => {
  // Récupération de l'ensemble des produits via l'API, stockés dans le tableau products
  fetch("http://localhost:3000/api/products")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      products = data;
      displayProducts();
    });
};

const displayProducts = () => {
  // Affichage de chaque produit du tableau products via de l'html injecté dans le DOM
  products.forEach((product) => {
    itemsHtml.innerHTML += `<a href="front/html/product.html?id=${product._id}">
<article>
  <img src="${product.imageUrl}" alt="${product.altTxt}">
  <h3 class="productName">${product.name}</h3>
  <p class="productDescription">${product.description}</p>
</article>
</a>`;
  });
};

getProducts();
