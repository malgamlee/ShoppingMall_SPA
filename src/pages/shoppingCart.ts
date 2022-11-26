export const shoppingCart = (
  rootEl: HTMLElement | null,
  props: any,
  app: (rootEl: HTMLElement | null) => void
) => {
  if (localStorage.getItem("products_cart") === "[]") {
    alert("장바구니가 비어 있습니다.");
    window.history.pushState(null, "", "/");
    app(rootEl);
    return;
  }

  let cartTotalPrice = 0;
  const updatePrice = (price: number) => {
    (
      document.getElementsByClassName("Cart__totalPrice")[0] as HTMLElement
    ).innerText = `총 상품가격 ${price.toLocaleString("ko-KR")}원`;
  };
  const products = JSON.parse(localStorage.getItem("products_cart")!);
  products.map((prdt: any) => {
    fetch(
      `https://my-json-server.typicode.com/malgamlee/ShoppingMall_SPA/products/${prdt.productId}`
    )
      // fetch(`http://localhost:3000/products/${prdt.productId}`)
      .then((response) => response.json())
      .then((result) => {
        let cartUl = document.getElementById("Cart__List");
        let cartItem = document.createElement("li");
        cartItem.classList.add("Cart__item");
        let option = result.productOptions.filter(
          (el: any) => +el.id === +prdt.optionId
        );
        cartItem.innerHTML = `<img
        src="${result.imageUrl}"
      />
      <div class="Cart__itemDesription">
        <div>${result.name} ${option[0].name} ${prdt.quantity}개</div>
        <div>${(
          (+result.price + +option[0].price) *
          +prdt.quantity
        ).toLocaleString("ko-KR")}원 </div>
      </div>`;
        cartUl!.append(cartItem);
        cartTotalPrice += (+result.price + +option[0].price) * +prdt.quantity;
        updatePrice(cartTotalPrice);
      });
  });
  rootEl!.innerHTML = `
  <div class="CartPage">
  <h1>장바구니</h1>
  <div class="Cart">
    <ul id="Cart__List">
    </ul>
    <div class="Cart__totalPrice">총 상품가격 0원</div>
    <button class="OrderButton">주문하기</button>
  </div>
</div>
  `;
  document
    .getElementsByClassName("OrderButton")[0]
    .addEventListener("click", () => {
      props.handleCartOrderClick();
    });
};
