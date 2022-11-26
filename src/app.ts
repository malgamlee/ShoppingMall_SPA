import { productList } from "./pages/productList";
import { productDetail } from "./pages/productDetail";
import { shoppingCart } from "./pages/shoppingCart";

interface ISelectOption {
  productId: number;
  optionId: number;
  quantity: number;
  price?: number;
}
export const app = (rootEl: HTMLElement | null) => {
  rootEl!.innerHTML = `
    <div>
      <div id="page"></div>
    </div>
  `;
  if (!localStorage.getItem("products_cart"))
    localStorage.setItem("products_cart", "[]");
  const pageEl = document.getElementById("page");

  const handleProductClick = (postId: string) => {
    window.history.pushState(null, "", `/products/${postId}`);
    app(rootEl);
  };

  const handleOrderClick = (productOptions: ISelectOption[]) => {
    productOptions = productOptions.map((el: ISelectOption) => {
      delete el.price;
      return el;
    });

    // 장바구니가 아예 비어있을 때
    if (localStorage.getItem("products_cart") === "[]") {
      localStorage.setItem("products_cart", JSON.stringify(productOptions));
    } else {
      let temp = [...JSON.parse(localStorage.getItem("products_cart")!)];
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
    productList(pageEl, handleProductClick);
  } else if (pathname.indexOf("/products/") === 0) {
    const [, , productId] = pathname.split("/");
    productDetail(pageEl, +productId, handleOrderClick);
  } else if (pathname === "/carts") {
    shoppingCart(pageEl, { handleCartOrderClick }, app);
  }
};
