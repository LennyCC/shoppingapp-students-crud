// API Url
const url = 'http://ec2-35-181-5-201.eu-west-3.compute.amazonaws.com:8080'
const idTeam = 'armadillos' // CHANGEME



//Product Constructor
class Product {
  constructor(title, price, year, id) {
    this.title = title;
    this.price = price;
    this.year = year;
    this.id = id;
  }
}

//UI Constructor
class UI {
  //Product template
  static addProduct(product) {
    const productList = document.getElementById("product-list");
    const element = document.createElement("div");
    element.innerHTML = `
      <div class="card text-center mb-4" data-id="${product.id}">
      <div class="card-body">
      <h5><strong>${product.title}</strong></h5>
      <strong>Price</strong>: ${product.price}€
      <strong>Year</strong>: ${product.year}
      <a href="#" onclick="UI.deleteProduct(event)" class="dlt btn btn-danger ml-5" name="delete">Delete</a>
      </div>
      </div>
      `;
    productList.appendChild(element);
  }

  static resetForm() {
    document.getElementById("product-form").reset();
  }

  static deleteProduct(event) {
    console.log("event", event)
    let product = event.target.closest("div.card.text-center.mb-4")
    product.remove();
    console.log(event.target.closest("div.card.text-center.mb-4").getAttribute('data-id'))
    UI.showMessage("Product removed successfully", "danger");
    UI.deleteById(event.target.closest("div.card.text-center.mb-4").getAttribute('data-id'));
    console.log(event.target)
  }

  static showMessage(message, cssClass) {
    const msg = document.createElement("div");
    msg.className = `alert alert-${cssClass} mt-2 text-center`;
    msg.appendChild(document.createTextNode(message));

    //Show in the DOM
    const container = document.querySelector(".container");
    const app = document.querySelector("#app");

    //Insert message in the UI
    container.insertBefore(msg, app);

    //Remove after 2 seconds
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 2000);
  }

  static retreiveAllProductsFromServer() {
    try{
    fetch(`http://ec2-35-181-5-201.eu-west-3.compute.amazonaws.com:8080/list-products/armadillos`, {
      method: 'GET', // So, we can specify HTTP Methods here. Uh, interesting.
      headers: { 'Content-Type': 'application/json' }, // Type of data to retrieve. 
      mode: 'cors', // What is CORS?? https://developer.mozilla.org/es/docs/Web/HTTP/CORS 
    })
    .then(response => response.json())
    .then(data => 
    data.forEach(product => {
      if (product.year <= 2021) {
        UI.addProduct(product);
      }
    console.log(product.id)
    })
    );
    }catch(error){
      console.log(`aquí los errores`, error)
    }
  } 

  static postProduct(product) {
    fetch("http://ec2-35-181-5-201.eu-west-3.compute.amazonaws.com:8080/add-product/armadillos", {
      
    // Adding method type
    method: "POST",
      
    // Adding body or contents to send
    body: JSON.stringify(product),
      
    // Adding headers to the request 
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
  }).then(response => response.json())
    .then (res => console.log(res))
  }
  static deleteById(id){
    fetch(`http://ec2-35-181-5-201.eu-west-3.compute.amazonaws.com:8080/delete-product/armadillos/${id}`, {
    method: "GET",
    body: null,
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })

  }
}
UI.retreiveAllProductsFromServer()

//DOM Events
document.getElementById("product-form").addEventListener("submit",  e => {
  const title = document.getElementById("product-name").value
  price = document.getElementById("product-price").value
  year = document.getElementById("product-year").value




  //Save product
  
  const product = new Product(title, price, year);
  UI.postProduct(product);
  UI.addProduct(product);
  UI.resetForm();
  UI.showMessage("Product added successfully", "success");

  e.preventDefault();
});