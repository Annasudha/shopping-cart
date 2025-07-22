"use-strict";

const addToBtn = document.querySelectorAll(".btn");
const cartContainer = document.querySelector(".cart-container");
const count = document.querySelector(".count");
const totalAmount = document.querySelector(".total-amount");
const hideAndShow = document.querySelector(".hide-show");
const confirmBtn = document.querySelector(".confirm-btn");
const modal = document.querySelector(".modal");
const orderConfirm = document.querySelector(".order-confirm");
const overlay = document.querySelector(".overlay");
const startNewOrder = document.querySelector(".start-new");
const shippingCart = document.querySelector(".shipping-cart");
const cartItems = [];

const addItem = function (e) {
  const newButton = e.target;
  //selecting the grandparent of target element
  const item = newButton.parentElement.parentElement;
  const btnChange = newButton.nextElementSibling;
  console.log(btnChange);
  let quantity = 0;

  //const border = item.querySelector(".image");
  //By getElementsByClassName we can select all elements with the same class and its a HTML live collection which means it updates the DOM when changes occurs
  const border = item.getElementsByClassName("image")[0];
  console.log(border);
  const pictures = border.getAttribute("src");
  console.log(pictures);
  const price = item.getElementsByClassName("price")[0].innerText;
  const productName = item.getElementsByClassName("product-name")[0].innerText;
  const productId = item.getElementsByClassName("product-name")[0].dataset.id;
  const btnDownIcon = btnChange.querySelector(".btn-down-icon");
  const btnInIcon = btnChange.querySelector(".btn-in-icon");
  const itemQuantity = btnChange.querySelector(".quan");
  console.log(quantity);

  if (e.target.style.display !== "none") {
    e.target.style.display = "none";
    btnChange.style.display = "flex";
  } else {
    e.target.style.display = "block";
    btnChange.style.display = "none";
  }
  if (shippingCart.classList.contains("hidden")) {
    border.classList.remove("active");
  } else {
    border.classList.add("active");
  }

  const shippingItem = cartItems.find((item) => item.id === productId);

  console.log(shippingItem);
  if (shippingItem) {
    // console.log(shippingItem.quantity);
    shippingItem.quantity += 1;
    //console.log(shippingItem.quantity);
  } else {
    cartItems.push({
      name: productName,
      price: Number(price),
      quantity: 0,
      id: productId,
      picture: pictures,
    });
  }

  updateCartDisplay();

  const increaseQuantity = function () {
    //console.log(quantity);

    const shippingItem = cartItems.find((item) => item.id === productId);
    console.log(shippingItem);

    if (shippingItem) {
      shippingItem.quantity = quantity + 1;
      quantity += 1;
      itemQuantity.innerText = quantity;

      updateCartDisplay();
    }

    //console.log(cartItems);
  };
  const decreaseQuantity = function () {
    const shippingItem = cartItems.find((item) => item.id === productId);

    if (quantity > 0 && shippingItem) {
      shippingItem.quantity = quantity - 1;
      quantity -= 1;
      //console.log(quantity);
      itemQuantity.innerText = quantity;

      updateCartDisplay();
    }
  };

  btnInIcon.addEventListener("click", increaseQuantity);

  btnDownIcon.addEventListener("click", decreaseQuantity);
};

//Function to calculate order total//
//using reduce method//
const totalPrice = function (array) {
  return array.reduce((acc, item) => {
    return (acc += item.price * item.quantity);
  }, 0);
};
//using map method//
/*const totalPrice = function (array) {
  let cartAmount = 0;
  array.map((item) => (cartAmount += item.price * item.quantity));
  return cartAmount;
};*/

//using for of Loop//
/* const totalPrice = function () {
      let cartAmount = 0;
      for (const item of cartItems) {
        cartAmount += item.price * item.quantity;
      }
      return cartAmount;
    };*/

//Function to calculate total count//
//using reduce method
const totalCount = function (array) {
  return array.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);
};

//using map method//
/*const totalCount = function () {
      let cartCount = 0;
      cartItems.map((item) => (cartCount += item.quantity));
      return cartCount;
    };
*/

const updateCartDisplay = function () {
  cartContainer.innerHTML = "";
  hideAndShow.style.visibility = "visible";

  cartItems.forEach((item) => {
    const cartElement = document.createElement("div");

    cartElement.innerHTML = `<div class="cart-ele">
      <div class="item-name">
          <div>${item.name} </div>
      </div>
    
    <div class="price-name">
     <p class="times">${item.quantity}x</p>
     <p class="item-price">@ $${item.price}</p>
     <span>$${item.price * item.quantity}</span>
     </div>
     <button id= "${item.id}" class="close-btn">X</button>
    
    </div>
   `;

    cartContainer.appendChild(cartElement);

    totalAmount.innerText = `$${totalPrice(cartItems)}`;
    count.innerText = `Your cart (${totalCount(cartItems)})`;

    const closeBtn = document.querySelectorAll(".close-btn");

    const removeItem = function (e) {
      if (e.target && e.target.classList.contains("close-btn")) {
        e.target.parentElement.innerHTML = "";

        const targetId = e.target.id;
        //console.log(targetId);
        const index = cartItems.findIndex((item) => item.id === targetId); //findindex returns the index number which satisfies the given condition

        if (index > -1) {
          cartItems.splice(index, 1); //It removes one element at the given index ,if indexis 2 it removes one element from the array which is at index 2.

          //console.log(removedItem);
          console.log(cartItems);
        }
        if (cartItems.length === 0) {
          hideAndShow.style.visibility = "hidden";
        }

        count.innerText = `Your cart (${totalCount(cartItems)})`;
        totalAmount.innerText = `$${totalPrice(cartItems)}`;

        //after deleting the item from cart to bring back the original form of addtobtn
        //since addToBtn is the nodelist all elements will be indexed and starts with index 0 and all id's starts with 1 so inorder to represent as per index targetId is subtracted by 1
        addToBtn[targetId - 1].style.display = "block";
        addToBtn[targetId - 1].nextElementSibling.style.display = "none";
        addToBtn[targetId - 1].previousElementSibling.classList.remove(
          "active"
        );

        //To make quantity to be zero after deleting item from cart
        const parent = addToBtn[targetId - 1].nextElementSibling;
        const children = parent.children;
        // console.log(children);
        const numChildren = children.length;

        if (numChildren > 0) {
          // Odd number of children: one middle child
          const middleIndex = Math.floor(numChildren / 2);
          const middleChild = children[middleIndex];
          console.log(middleChild);

          middleChild.innerText = "0";
        }
      }
    };
    closeBtn.forEach((btn) => btn.addEventListener("click", removeItem));

    localStorage.setItem("storedCartItems", JSON.stringify(cartItems));
  });
};

const confirmorder = function () {
  let storedItems = JSON.parse(localStorage.getItem("storedCartItems")) || [];

  storedItems.forEach((item) => {
    const orderDetails = document.createElement("div");
    if (`${item.quantity}` != 0) {
      orderDetails.innerHTML = `<div class="order-details-confirm"> 
   <div class="img-confirm"> <img src="${item.picture}"/></div>
    <div class=name-quan >
   
        <div class="item-name-confirm">${item.name} </div>
        <div class="quan-price-align">
        <p class="times">${item.quantity}x</p>
         <p class="item-price-confirm">@ $${item.price}</p>
         </div>
    </div>
  
  
   <div class="total-confirm">$${item.price * item.quantity}</div>
  
   </div>
    
    `;
      orderConfirm.appendChild(orderDetails);
    }
  });

  const orderConTotal = `${totalPrice(storedItems)}`;
  console.log(orderConTotal);

  const totalOrderConfirm = document.createElement("div");
  totalOrderConfirm.innerHTML = `<div class="total-order-confirm">

  <p class="order-total">Order Total</p>
    <p class="total-amount">$${orderConTotal}</p>
   
    </div>`;
  orderConfirm.appendChild(totalOrderConfirm);
};

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  confirmorder();
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");

  location.reload();
};
confirmBtn.addEventListener("click", openModal);
startNewOrder.addEventListener("click", closeModal);
addToBtn.forEach((btn) => btn.addEventListener("click", addItem));
