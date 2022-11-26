import { product } from "./product";

interface IProductList {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
}

export const productList = (
  rootEl: HTMLElement | null,
  props: (postId: string) => void
) => {
  rootEl!.innerHTML = `
    <div class="ProductListPage">
        <h1>상품목록</h1>
        <ul id="ProductList">
        </ul>
      </div> 
  `;

  const prdtListEl = document.getElementById("ProductList");
  // fetch("http://localhost:3000/productsList")
  fetch("https://my-json-server.typicode.com/malgamlee/test_myJsonServer/db")
    .then((response) => response.json())
    .then((result) => {
      prdtListEl!.innerHTML = "";
      result.productsList.forEach((p: IProductList) => {
        product(prdtListEl, p, props);
      });
    });
};
