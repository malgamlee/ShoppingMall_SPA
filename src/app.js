import { productList } from "./pages/productList.js";
import { productDetail } from "./pages/productDetail.js";
import { shoppingCart } from "./pages/shoppingCart.js";

export const app = (rootEl) => {
  rootEl.innerHTML = `
    <div>
      <div id="page"></div>
    </div>
  `;
  if (!localStorage.getItem("products_cart"))
    localStorage.setItem("products_cart", "[]");
  const pageEl = document.getElementById("page");

  const handleProductClick = (postId) => {
    window.history.pushState(null, "", `/products/${postId}`);
    app(rootEl);
  };

  const handleOrderClick = (productOptions) => {
    productOptions = productOptions.map((el) => {
      delete el.price;
      return el;
    });
    if (
      productOptions.length === 0 &&
      localStorage.getItem("products_cart") === "[]"
    ) {
      alert("장바구니가 비어 있습니다.");
      window.history.pushState(null, "", "/");
      app(rootEl);
      return;
    }

    // 장바구니가 아예 비어있을 때
    if (localStorage.getItem("products_cart") === "[]") {
      localStorage.setItem("products_cart", JSON.stringify(productOptions));
    } else {
      let temp = [...JSON.parse(localStorage.getItem("products_cart"))];
      localStorage.setItem(
        "products_cart",
        JSON.stringify([...temp, ...productOptions])
      );
    }
    window.history.pushState(null, "", "/carts");
    app(rootEl);
  };

  const handleCartOrderClick = () => {
    alert("주문되었습니다.");
    localStorage.removeItem("products_cart");
    window.history.pushState(null, "", `/`);
    app(rootEl);
  };

  const { pathname } = location;

  if (pathname === "/") {
    productList(pageEl, { handleProductClick });
  } else if (pathname.indexOf("/products/") === 0) {
    const [, , productId] = pathname.split("/");
    productDetail(pageEl, { id: +productId, handleOrderClick });
  } else if (pathname === "/carts") {
    shoppingCart(pageEl, { handleCartOrderClick });
  }
};
