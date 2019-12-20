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
window.onload = function () {
  var tbody = document.getElementsByTagName("tbody")[0];
  for (let i = 0; i < carProducts.length; i++) {
    var newTr = document.createElement("tr");
    var newTdSelect = document.createElement("td");
    var newTdName = document.createElement("td");
    var newTdPrice = document.createElement("td");
    var newTdCount = document.createElement("td");
    var newTdTotalPrice = document.createElement("td");
    newTdSelect.className = 'selectColumn';
    newTdPrice.className = 'priceColumn';
    newTdCount.className = 'countColumn';
    newTdTotalPrice.className = "totalPriceColumn";
    newTdSelect.innerHTML = '<input type="checkbox" name="select-single-stationery">';
    newTdName.innerHTML = carProducts[i]["name"];
    newTdPrice.innerHTML = carProducts[i]["price"];
    newTdCount.innerHTML = '<button name="minus-btn">-</button>' +
      '<span>' + carProducts[i]["count"] + '</span>' +
      '<button name="plus-btn">+</button>';
    newTdTotalPrice.innerHTML = carProducts[i]["price"] * carProducts[i]["count"];
    newTr.appendChild(newTdSelect);
    newTr.appendChild(newTdName);
    newTr.appendChild(newTdPrice);
    newTr.appendChild(newTdCount);
    newTr.appendChild(newTdTotalPrice);
    tbody.appendChild(newTr);
  }
  //选中/取消选中单个文具&全选/取消全选所有文具
  var myTable = document.getElementsByTagName("table")[0];
  myTable.addEventListener("click", clickCheckbox, false);
  var staCount = 0;//全局变量，统计文具总数
  var allStaPrice = 0;//全局变量，统计文具总价
  function clickCheckbox(Eve) {
    var currentCheckbox = Eve.target || window.event.srcElement;
    var isChecked = currentCheckbox.checked;
    //当选中某个文具时，最后一行共计数量和价格会发生变化；同理取消选中会发生相反变化；
    if (currentCheckbox.name === "select-single-stationery") {
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
      writeLastRow(staCount, allStaPrice);//修改最后一行共计数量&价格
      //当全选中时，所有行文具的都被选中，且最后一行共计数量和价格会发生变化；同理取消选中会发生相反变化；
    } else if (currentCheckbox.name === "select-all-stationery") {
      var selectColumn = myTable.getElementsByClassName("selectColumn");
      var totalPriceColumn = myTable.getElementsByClassName("totalPriceColumn");
      var countColumn = myTable.getElementsByTagName("span");
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
      writeLastRow(staCount, allStaPrice);//修改最后一行共计数量&价格
    }
  }
  //为加减按钮添加时间监听
  myTable.addEventListener("click", addOrDecreaseStationery, false);
  function addOrDecreaseStationery(Eve) {
    var currentBtn = Eve.target || window.event.srcElement;
    if (currentBtn.name === "minus-btn") {
      decreaseStationery(currentBtn);
    }
    else if (currentBtn.name === "plus-btn") {
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
    var priceTd = currentTr.getElementsByClassName("priceColumn")[0];
    var priceTdNum = parseFloat(priceTd.innerHTML);
    totalPriceTd.innerHTML = countTdNum * priceTdNum;
    //本行商品个数为0时删除本行商品
    if (countTdNum === 0) {
      tbody.removeChild(countTd.parentNode);
    }
    //当本行的文具被选中时，才能改写表尾总价和总数
    if (isChecked) {
      staCount = staCount - 1;
      allStaPrice = allStaPrice - priceTdNum;
      writeLastRow(staCount, allStaPrice);
    }
  }
  //加按钮
  function increaseStationery(currentBtn) {
    var countTd = currentBtn.parentNode;
    var currentTr = countTd.parentNode;
    var countTdNum = parseInt(countTd.children[1].innerHTML) + 1;
    countTd.children[1].innerHTML = countTdNum;
    var totalPriceTd = currentTr.lastElementChild;
    var priceTd = currentTr.getElementsByClassName("priceColumn")[0];
    var priceTdNum = parseFloat(priceTd.innerHTML);
    totalPriceTd.innerHTML = countTdNum * priceTdNum;
    //当本行的文具被选中时，才能改写表尾总价和总数
    if (currentTr.getElementsByTagName("input")[0].checked) {
      staCount = staCount + 1;
      allStaPrice = allStaPrice + priceTdNum;
      writeLastRow(staCount, allStaPrice);
    }
  }
  //用来更新最后一行“共计数量和价格”的内容
  function writeLastRow(staCount, allStaPrice) {
    var totalPayment = document.getElementById("totalPayment");
    var content = "共计" + staCount + "件商品，" + allStaPrice + " ￥";
    totalPayment.innerHTML = content;
  }
}