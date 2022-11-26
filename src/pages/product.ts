interface IProductList {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
}
export const product = (
  rootEl: HTMLElement | null,
  prdtList: IProductList,
  props: (postId: string) => void
) => {
  const prdtEl = document.createElement("div");
  prdtEl.innerHTML = `
      <li class="Product">
            <img src="${prdtList.imageUrl}"/>
            <div class="Product__info">
              <div>${prdtList.name}</div>
              <div>${(+prdtList.price).toLocaleString("ko-KR")}원~</div>
            </div>
          </li>
    `;

  prdtEl.addEventListener("click", () => {
    props("" + prdtList.id);
  });

  rootEl!.appendChild(prdtEl);
};
