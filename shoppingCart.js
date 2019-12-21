var carProducts = [
  {
    "id": 1,
    "name": "英雄牌 钢笔",
    "count": 1,
    "price": 69,
    "checked": false
  },
  {
    "id": 2,
    "name": "晨光牌 铅字笔",
    "count": 2,
    "price": 5.5,
    "checked": true
  },
  {
    "id": 3,
    "name": "晨光牌 铅笔",
    "count": 1,
    "price": 2,
    "checked": false
  },
  {
    "id": 4,
    "name": "狗熊牌 橡皮擦",
    "count": 1,
    "price": 1,
    "checked": false
  },
  {
    "id": 5,
    "name": "瑞士牌 双肩书包",
    "count": 1,
    "price": 199,
    "checked": true
  },
  {
    "id": 6,
    "name": "晨光牌 作业本",
    "count": 5,
    "price": 2.5,
    "checked": false
  }
]
initShoppingCart();

function initShoppingCart() {
	var tbody = document.getElementsByTagName("tbody")[0];
	for (let i = 0; i < carProducts.length; i++) {
		var productInfo = document.createElement("tr");
		productInfo.innerHTML = `<td class="selectColumn">
      <input type="checkbox" name="select-single-stationery"></td>
  
      <td>${carProducts[i]["name"]}</td>
  
      <td class="price-column">${carProducts[i]["price"]}</td>
  
      <td class="count-column"><button name="minus-btn">-</button> 
      <span class ="count-column-content"> 
      ${carProducts[i]["count"]}
      </span> 
      <button name="plus-btn">+</button>
      </td>
  
      <td class="total-price-column">${carProducts[i]["price"] * carProducts[i]["count"]}</td>`;
		tbody.appendChild(productInfo);
	}
}

//选中/取消选中单个文具&全选/取消全选所有文具
var myTable = document.getElementsByTagName("table")[0];
myTable.addEventListener("click", clickCheckbox, false);
var staCount = 0; //全局变量，统计文具总数
var allStaPrice = 0; //全局变量，统计文具总价
function clickCheckbox(event) {
	var currentCheckbox = event.target || window.event.srcElement;
	var isChecked = currentCheckbox.checked;
	//当选中某个文具时，最后一行共计数量和价格会发生变化；同理取消选中会发生相反变化；
	if ("select-single-stationery" === currentCheckbox.name) {
		var currentTr = currentCheckbox.parentNode.parentNode;
		var totalPriceTd = currentTr.lastElementChild;
		var totalPriceTdNum = parseFloat(totalPriceTd.innerHTML);
		var countTdNum = parseInt(currentTr.querySelector("span").innerHTML);
		if (isChecked) {
			staCount = staCount + countTdNum;
			allStaPrice = allStaPrice + totalPriceTdNum;
		} else {
			staCount = staCount - countTdNum;
			allStaPrice = allStaPrice - totalPriceTdNum;
		}
		updateNeedToPayAndTotalCount(staCount, allStaPrice); //修改最后一行共计数量&价格
		//当全选中时，所有行文具的都被选中，且最后一行共计数量和价格会发生变化；同理取消选中会发生相反变化；
	} else if ("select-all-stationery" === currentCheckbox.name) {
		var selectColumn = myTable.getElementsByClassName("selectColumn");
		var totalPriceColumn = myTable.getElementsByClassName("total-price-column");
		var countColumn = myTable.getElementsByClassName("count-column-content");
		staCount = 0;
		allStaPrice = 0;
		if (isChecked) {
			for (let j = 0; j < totalPriceColumn.length; j++) {
				selectColumn[j].children[0].checked = true;
				allStaPrice = allStaPrice + parseFloat(totalPriceColumn[j].innerHTML);
				staCount = staCount + parseInt(countColumn[j].innerHTML);
			}
		} else {
			for (let j = 0; j < selectColumn.length; j++) {
				selectColumn[j].children[0].checked = false;
			}
		}
		updateNeedToPayAndTotalCount(staCount, allStaPrice); //修改最后一行共计数量&价格
	}
}
//为加减按钮添加时间监听
myTable.addEventListener("click", addOrDecreaseStationery, false);
function addOrDecreaseStationery(event) {
	var currentBtn = event.target || window.event.srcElement;
	if ("minus-btn" === currentBtn.name) {
		decreaseStationery(currentBtn);
	} else if ("plus-btn" === currentBtn.name) {
		increaseStationery(currentBtn);
	}
}
//减按钮
function decreaseStationery(currentBtn) {
	var countTd = currentBtn.parentNode;
	var currentTr = countTd.parentNode;
  var isChecked = currentTr.getElementsByTagName("input")[0].checked;
	var countTdNum = parseInt(countTd.children[1].innerHTML) - 1;
	countTd.children[1].innerHTML = countTdNum;
	var totalPriceTd = currentTr.lastElementChild;
	var priceTd = currentTr.getElementsByClassName("price-column")[0];
	var priceTdNum = parseFloat(priceTd.innerHTML);
	totalPriceTd.innerHTML = countTdNum * priceTdNum;
	//本行商品个数为0时删除本行商品
	if (0 === countTdNum) {
		tbody.removeChild(countTd.parentNode);
	}
	//当本行的文具被选中时，才能改写表尾总价和总数
	if (isChecked) {
		staCount = staCount - 1;
		allStaPrice = allStaPrice - priceTdNum;
		updateNeedToPayAndTotalCount(staCount, allStaPrice);
	}
}
//加按钮
function increaseStationery(currentBtn) {
	var countTd = currentBtn.parentNode;
	var currentTr = countTd.parentNode;
	var countTdNum = parseInt(countTd.children[1].innerHTML) + 1;
	countTd.children[1].innerHTML = countTdNum;
	var totalPriceTd = currentTr.lastElementChild;
	var priceTd = currentTr.getElementsByClassName("price-column")[0];
	var priceTdNum = parseFloat(priceTd.innerHTML);
	totalPriceTd.innerHTML = countTdNum * priceTdNum;
	//当本行的文具被选中时，才能改写表尾总价和总数
	if (currentTr.getElementsByTagName("input")[0].checked) {
		staCount = staCount + 1;
		allStaPrice = allStaPrice + priceTdNum;
		updateNeedToPayAndTotalCount(staCount, allStaPrice);
	}
}
//用来更新最后一行“共计数量和价格”的内容
function updateNeedToPayAndTotalCount(staCount, allStaPrice) {
	var totalCount = document.getElementsByClassName("total-count")[0];
	var needToPay = document.getElementsByClassName("need-to-pay")[0];
	totalCount.innerHTML = staCount;
	needToPay.innerHTML = allStaPrice;
}

//加一个全局计算的函数
//用字符串模板的方式加新内容
//rowindex
//forEach加新内容
//js里面加css类名还是要用css命名规范
//Continous Delivery
